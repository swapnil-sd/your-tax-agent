# Architecture

## System Overview

```
User uploads docs to Google Drive
        |
        v
Claude Code: /tax-prepare
        |
        v
+------------------+
| Coordinator      |  Orchestrates workflow, talks to user
+--+--+--+--+--+--+
   |  |  |  |  |  |
   v  v  v  v  v  v
  A1 A2 A3 A4 A5 A6
```

## Agent Roles

| # | Agent | What It Does | Input | Output |
|---|-------|-------------|-------|--------|
| 0 | **Coordinator** | Orchestrates workflow, asks questions, merges results | User commands | Filing guide |
| 1 | **Doc Processor** | Reads PDFs, classifies forms, extracts numbers | PDF files | Structured JSON |
| 2 | **Tax Strategist** | Optimizes filing status, deductions, credits | Extracted data | Strategy recommendation |
| 3 | **RSU Specialist** | Corrects RSU sell-to-cover cost basis | 1099-B + vesting records | Form 8949 entries |
| 4 | **State Expert** | Calculates NY (IT-203) + NJ (NJ-1040) returns | Federal data + W-2 state info | State return data |
| 5 | **Tax Q&A** | Answers any tax question | Natural language question | Cited answer |
| 6 | **Strategy Researcher** | Finds optimization tips from forums | Tax year + profile | Verified strategy DB |

## Knowledge Stack

```
Layer 1: IRS Publications (RAG via ChromaDB)
  "What does the law say?"

Layer 2: Tax Rules KB (tax_rules_2025.md)
  "What rules apply to NY/NJ tech workers?"

Layer 3: Forum Strategies (strategies/)
  "What moves are real people making?"

Layer 4: Real-time Web Search
  "What's the latest on this specific situation?"
```

Each layer verifies against the layer above it.

## Workflow Phases

```
Phase 0: ONBOARD
  Ask user about their situation (marital status, employer, states, etc.)
  Generate personalized document checklist

Phase 1: INGEST (parallel)
  Doc Processor reads all PDFs from Google Drive
  Classifies: W-2, 1099-B, 1099-DIV, 1099-INT, 1098, RSU vesting reports

Phase 2: ANALYZE (parallel)
  Tax Strategist: MFJ vs MFS, itemize vs standard, credits
  RSU Specialist: match 1099-B to vesting records, correct basis
  State Expert: NY + NJ calculations

Phase 3: VALIDATE
  Cross-check with TurboTax MCP estimate
  Flag discrepancies > $500

Phase 4: PRESENT
  Show user: refund/owed, optimizations, savings vs naive approach

Phase 5: GENERATE
  filing_guide.md (markdown)
  filing_guide.json (for dashboard)
  filing_guide.pdf (via Typst)
```

## Data Flow

```
Google Drive PDFs
    |
    v
Doc Processor ---> Structured JSON
    |                    |
    |     +--------------+--------------+
    |     |              |              |
    v     v              v              v
Tax Strategist    RSU Specialist    State Expert
    |              |              |
    +--------------+--------------+
                   |
                   v
            Coordinator (merge)
                   |
         +---------+---------+
         |         |         |
         v         v         v
    .md file   .json file  .pdf file
                   |
                   v
            React Dashboard
```

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Agent framework | Claude Code custom agents |
| Document reading | Claude PDF reading (built-in) |
| Tax estimation | TurboTax MCP (Intuit API) |
| RAG search | ChromaDB + all-MiniLM-L6-v2 |
| PDF generation | Typst |
| Dashboard | Next.js + Tailwind + shadcn/ui + Recharts |
| Document source | Google Drive MCP |
