#!/usr/bin/env python3
"""
IRS Publication Ingestion Pipeline

Downloads key IRS publications, chunks them, and creates embeddings
in a local ChromaDB database for the Tax Q&A agent.

Usage: python3 ingest.py [--year 2025]
"""

import os
import re
import sys
import requests
from bs4 import BeautifulSoup
import chromadb
from chromadb.config import Settings

# Configuration
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
PUB_DIR = os.path.join(DATA_DIR, "publications")
DB_DIR = os.path.join(DATA_DIR, "embeddings")
CHUNK_SIZE = 1500  # characters per chunk
CHUNK_OVERLAP = 200

# Key IRS publications for NY/NJ tech workers
IRS_PUBLICATIONS = {
    "pub17": {
        "title": "Your Federal Income Tax (For Individuals)",
        "url": "https://www.irs.gov/pub/irs-pdf/p17.pdf",
        "topics": ["general", "filing", "income", "deductions", "credits"],
    },
    "pub505": {
        "title": "Tax Withholding and Estimated Tax",
        "url": "https://www.irs.gov/pub/irs-pdf/p505.pdf",
        "topics": ["withholding", "estimated tax", "underpayment"],
    },
    "pub525": {
        "title": "Taxable and Nontaxable Income",
        "url": "https://www.irs.gov/pub/irs-pdf/p525.pdf",
        "topics": ["income", "rsu", "stock options", "fringe benefits"],
    },
    "pub527": {
        "title": "Residential Rental Property",
        "url": "https://www.irs.gov/pub/irs-pdf/p527.pdf",
        "topics": ["rental", "depreciation", "passive activity"],
    },
    "pub535": {
        "title": "Business Expenses",
        "url": "https://www.irs.gov/pub/irs-pdf/p535.pdf",
        "topics": ["schedule c", "business", "deductions", "home office"],
    },
    "pub550": {
        "title": "Investment Income and Expenses",
        "url": "https://www.irs.gov/pub/irs-pdf/p550.pdf",
        "topics": ["dividends", "interest", "capital gains", "wash sale"],
    },
    "pub587": {
        "title": "Business Use of Your Home",
        "url": "https://www.irs.gov/pub/irs-pdf/p587.pdf",
        "topics": ["home office", "business use", "simplified method"],
    },
    "pub590a": {
        "title": "Contributions to Individual Retirement Arrangements",
        "url": "https://www.irs.gov/pub/irs-pdf/p590a.pdf",
        "topics": ["ira", "roth ira", "backdoor roth", "contribution limits"],
    },
    "pub936": {
        "title": "Home Mortgage Interest Deduction",
        "url": "https://www.irs.gov/pub/irs-pdf/p936.pdf",
        "topics": ["mortgage", "interest", "points", "refinance", "SALT"],
    },
    "pub970": {
        "title": "Tax Benefits for Education",
        "url": "https://www.irs.gov/pub/irs-pdf/p970.pdf",
        "topics": ["education", "529", "student loan", "tuition"],
    },
    "pub526": {
        "title": "Charitable Contributions",
        "url": "https://www.irs.gov/pub/irs-pdf/p526.pdf",
        "topics": ["charitable", "donations", "appreciated stock", "DAF"],
    },
}

# Additional IRS pages to scrape (HTML, not PDF)
IRS_PAGES = {
    "rsu_reporting": {
        "title": "RSU Tax Reporting Guide",
        "url": "https://www.irs.gov/taxtopics/tc427",
        "topics": ["rsu", "stock compensation", "cost basis"],
    },
    "solar_credit": {
        "title": "Residential Clean Energy Credit",
        "url": "https://www.irs.gov/credits-deductions/residential-clean-energy-credit",
        "topics": ["solar", "energy credit", "form 5695"],
    },
    "salt_deduction": {
        "title": "State and Local Tax Deduction",
        "url": "https://www.irs.gov/taxtopics/tc503",
        "topics": ["SALT", "state tax", "property tax", "deduction cap"],
    },
}


def download_page(url: str) -> str:
    """Download a web page and extract text content."""
    headers = {"User-Agent": "Mozilla/5.0 (tax-research-bot)"}
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Remove scripts, styles, nav elements
        for tag in soup(["script", "style", "nav", "header", "footer"]):
            tag.decompose()

        text = soup.get_text(separator="\n", strip=True)
        # Clean up excessive whitespace
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size

        # Try to break at a paragraph or sentence boundary
        if end < len(text):
            # Look for paragraph break
            para_break = text.rfind("\n\n", start + chunk_size // 2, end)
            if para_break > start:
                end = para_break + 2
            else:
                # Look for sentence break
                sent_break = text.rfind(". ", start + chunk_size // 2, end)
                if sent_break > start:
                    end = sent_break + 2

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap

    return chunks


def ingest():
    """Main ingestion pipeline."""
    os.makedirs(PUB_DIR, exist_ok=True)
    os.makedirs(DB_DIR, exist_ok=True)

    # Initialize ChromaDB
    client = chromadb.PersistentClient(path=DB_DIR)

    # Create or get collection
    try:
        client.delete_collection("irs_publications")
    except Exception:
        pass

    collection = client.create_collection(
        name="irs_publications",
        metadata={"hnsw:space": "cosine"},
    )

    all_chunks = []
    all_ids = []
    all_metadata = []

    # Process HTML pages (these are easy to scrape)
    print("\n=== Downloading IRS Web Pages ===")
    for key, info in IRS_PAGES.items():
        print(f"  Downloading: {info['title']}...")
        text = download_page(info["url"])

        if text:
            filepath = os.path.join(PUB_DIR, f"{key}.txt")
            with open(filepath, "w") as f:
                f.write(text)

            chunks = chunk_text(text)
            print(f"    -> {len(chunks)} chunks")

            for i, chunk in enumerate(chunks):
                all_chunks.append(chunk)
                all_ids.append(f"{key}_chunk_{i}")
                all_metadata.append({
                    "source": key,
                    "title": info["title"],
                    "url": info["url"],
                    "topics": ",".join(info["topics"]),
                    "chunk_index": i,
                    "type": "irs_page",
                })

    # Process local text files if they exist (from manual PDF extraction)
    print("\n=== Processing Local Publication Files ===")
    for key, info in IRS_PUBLICATIONS.items():
        filepath = os.path.join(PUB_DIR, f"{key}.txt")
        if os.path.exists(filepath):
            print(f"  Reading: {filepath}")
            with open(filepath, "r") as f:
                text = f.read()

            chunks = chunk_text(text)
            print(f"    -> {len(chunks)} chunks")

            for i, chunk in enumerate(chunks):
                all_chunks.append(chunk)
                all_ids.append(f"{key}_chunk_{i}")
                all_metadata.append({
                    "source": key,
                    "title": info["title"],
                    "url": info["url"],
                    "topics": ",".join(info["topics"]),
                    "chunk_index": i,
                    "type": "irs_publication",
                })
        else:
            print(f"  Not found (skip): {filepath}")
            print(f"    To add: download PDF from {info['url']}, extract text, save as {filepath}")

    # Also ingest local knowledge base
    print("\n=== Processing Local Knowledge Base ===")
    kb_dir = os.path.join(os.path.dirname(__file__), "..", "kb")
    for kb_file in ["tax_rules_2025.md", "rsu_brokers.md"]:
        filepath = os.path.join(kb_dir, kb_file)
        if os.path.exists(filepath):
            print(f"  Reading: {filepath}")
            with open(filepath, "r") as f:
                text = f.read()

            chunks = chunk_text(text, chunk_size=2000, overlap=300)
            print(f"    -> {len(chunks)} chunks")

            for i, chunk in enumerate(chunks):
                all_chunks.append(chunk)
                all_ids.append(f"kb_{kb_file}_{i}")
                all_metadata.append({
                    "source": kb_file,
                    "title": f"Local KB: {kb_file}",
                    "topics": "tax rules,ny,nj,rsu,brackets",
                    "chunk_index": i,
                    "type": "knowledge_base",
                })

    # Add all to ChromaDB
    if all_chunks:
        print(f"\n=== Indexing {len(all_chunks)} chunks in ChromaDB ===")
        # ChromaDB has a batch size limit, process in batches
        batch_size = 100
        for i in range(0, len(all_chunks), batch_size):
            batch_end = min(i + batch_size, len(all_chunks))
            collection.add(
                documents=all_chunks[i:batch_end],
                ids=all_ids[i:batch_end],
                metadatas=all_metadata[i:batch_end],
            )
            print(f"  Indexed batch {i // batch_size + 1}: chunks {i+1}-{batch_end}")

        print(f"\n=== Done! ===")
        print(f"Total chunks indexed: {len(all_chunks)}")
        print(f"Database location: {DB_DIR}")
    else:
        print("\nNo content to index. Download IRS publications first.")


if __name__ == "__main__":
    ingest()
