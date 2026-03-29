#!/usr/bin/env python3
"""
RAG Search Function for Tax Q&A Agent

Searches the ChromaDB index of IRS publications and local knowledge base.
Returns relevant chunks with source citations.

Usage:
  python3 search.py "Can I deduct my home office?"
  python3 search.py "RSU cost basis correction" --n 5
"""

import os
import sys
import json
import chromadb

DB_DIR = os.path.join(os.path.dirname(__file__), "data", "embeddings")


def search(query: str, n_results: int = 5, filter_type: str = None) -> list[dict]:
    """
    Search the tax knowledge base.

    Args:
        query: Natural language question
        n_results: Number of results to return
        filter_type: Optional filter by type (irs_publication, irs_page, knowledge_base)

    Returns:
        List of dicts with: text, source, title, url, relevance_score
    """
    client = chromadb.PersistentClient(path=DB_DIR)

    try:
        collection = client.get_collection("irs_publications")
    except Exception:
        return [{
            "text": "RAG database not initialized. Run: python3 ~/Documents/claud_ai/projects/tax-agent/rag/ingest.py",
            "source": "system",
            "title": "Error",
            "url": "",
            "relevance_score": 0,
        }]

    # Build query params
    where_filter = None
    if filter_type:
        where_filter = {"type": filter_type}

    results = collection.query(
        query_texts=[query],
        n_results=n_results,
        where=where_filter,
    )

    output = []
    if results and results["documents"] and results["documents"][0]:
        for i, doc in enumerate(results["documents"][0]):
            metadata = results["metadatas"][0][i] if results["metadatas"] else {}
            distance = results["distances"][0][i] if results["distances"] else 1.0

            output.append({
                "text": doc,
                "source": metadata.get("source", "unknown"),
                "title": metadata.get("title", "Unknown"),
                "url": metadata.get("url", ""),
                "topics": metadata.get("topics", ""),
                "relevance_score": round(1 - distance, 4),  # Convert distance to similarity
            })

    return output


def search_formatted(query: str, n_results: int = 5) -> str:
    """Search and return formatted results for the agent."""
    results = search(query, n_results)

    if not results:
        return "No relevant results found in the tax knowledge base."

    output_parts = [f"## Search Results for: \"{query}\"\n"]

    for i, r in enumerate(results, 1):
        output_parts.append(f"### Result {i} (relevance: {r['relevance_score']:.2%})")
        output_parts.append(f"**Source:** {r['title']}")
        if r["url"]:
            output_parts.append(f"**URL:** {r['url']}")
        output_parts.append(f"**Topics:** {r['topics']}")
        output_parts.append(f"\n{r['text'][:500]}{'...' if len(r['text']) > 500 else ''}\n")
        output_parts.append("---")

    return "\n".join(output_parts)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 search.py <query> [--n <num_results>]")
        sys.exit(1)

    query = sys.argv[1]
    n = 5

    if "--n" in sys.argv:
        idx = sys.argv.index("--n")
        if idx + 1 < len(sys.argv):
            n = int(sys.argv[idx + 1])

    if "--json" in sys.argv:
        results = search(query, n)
        print(json.dumps(results, indent=2))
    else:
        print(search_formatted(query, n))
