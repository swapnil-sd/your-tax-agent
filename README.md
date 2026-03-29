# your-tax-agent

AI-powered tax filing for tech workers with RSUs. Multi-agent system built on [Claude Code](https://claude.ai/code) that reads your tax documents, optimizes your return, validates against IRS rules, and generates a step-by-step filing guide with an interactive dashboard.

> **Saved $17K+ on a real NY/NJ tech worker return** by catching RSU double-taxation, optimizing MFJ vs MFS, and claiming missed credits.

## What It Does

```
You upload tax docs to Google Drive
              |
              v
     /tax-prepare in Claude Code
              |
     Phase 0: ONBOARD
       Ask about your situation (married? RSUs? side business?)
       Generate personalized document checklist
              |
     Phase 1: INGEST
       Doc Processor reads all PDFs, classifies & extracts data
              |
     Phase 2: ANALYZE (agents run in parallel)
       +----------+------------+-----------+
       |          |            |           |
       v          v            v           v
     Tax       RSU         State       Tax Q&A
   Strategist Specialist   Expert     (answers questions)
       |          |            |
       +----------+------------+
              |
     Phase 3: REVIEW (compliance gate)
       Reviewer runs 30 IRS validation checks
       Errors? → sent back to responsible agent (max 1 retry)
       Still wrong? → flagged for your review
              |
     Phase 4: OUTPUT
       +----------+----------+----------+
       |          |          |          |
       v          v          v          v
    filing     filing     filing      audit
   guide.md  guide.json guide.pdf  trail.json
       |          |
       v          v
     CPA      React Dashboard
   handoff    (interactive)
```

**Input:** Your tax documents (W-2s, 1099s, 1098s, RSU vesting records) in a Google Drive folder.

**Output:**
- **Markdown filing guide** — field-by-field TurboTax entry instructions, CPA-ready
- **Interactive dashboard** — Next.js app with charts, optimizations list, RSU corrections table
- **PDF report** — formatted via Typst for printing or CPA handoff
- **Audit trail** — every number traced to source document, every decision logged, 30 IRS compliance checks

## How It Works

1. **You run `/tax-prepare`** in Claude Code
2. **Agent onboards you** — asks about marital status, employer, states, side business, dependents
3. **Agent reads your documents** from Google Drive (W-2s, 1099s, 1098s, RSU records)
4. **4 specialized agents analyze in parallel:**
   - Tax Strategist: compares MFJ vs MFS, itemized vs standard, finds credits
   - RSU Specialist: corrects sell-to-cover cost basis (the $3K-15K+ savings)
   - State Expert: calculates NY non-resident + NJ resident returns
   - Tax Q&A: available to answer any question during the process
5. **Reviewer validates everything** — 30 checks against IRS rules, catches errors before you see them
6. **You get a complete filing guide** — enter the values into TurboTax following the step-by-step instructions

## Key Features

| Feature | What It Does | Typical Savings |
|---------|-------------|-----------------|
| **RSU basis correction** | Catches double-taxation on sell-to-cover RSU sales | $3,000 - $15,000+ |
| **MFJ vs MFS comparison** | Calculates exact dollar difference between filing statuses | $2,000 - $8,000 |
| **Itemize vs standard** | Determines which deduction method saves more | $2,000 - $7,000 |
| **Multi-state filing** | NY non-resident (IT-203) + NJ resident (NJ-1040) with credits | Avoids double-taxation |
| **Solar/energy credits** | 30% Residential Clean Energy Credit (Form 5695) | Up to $7,500+ |
| **Schedule C deductions** | Side business expenses (photography, freelance, etc.) | $1,000 - $5,000 |
| **IRS compliance review** | 30 validation checks before you see any numbers | Prevents errors |
| **Audit trail** | Every number traced to source document and agent | Full transparency |

## The RSU Problem (Why This Exists)

When your RSUs vest, your broker reports sold shares with **$0 cost basis** on your 1099-B. Without correction, you pay tax on the same income twice — once through your W-2 paycheck, again through the 1099-B.

```
Without correction:              With correction:
Proceeds:  $14,069               Proceeds:  $14,069
Basis:          $0               Basis:     $14,068
Taxable:   $14,069  <-- WRONG    Taxable:        $1  <-- CORRECT
Tax (32%):  $4,502               Tax (32%):     $0
```

The agent matches your 1099-B sales to vesting records and generates corrected Form 8949 entries automatically. [Full explainer](docs/how-rsu-basis-works.md).

## Supported Scenarios

| Category | Supported |
|----------|-----------|
| Filing status | Single, MFJ, MFS, Head of Household |
| RSU brokers | Fidelity, Schwab, E*Trade, Morgan Stanley |
| States | NY + NJ (extensible — [add your state](docs/adding-a-state.md)) |
| Credits | Solar ITC, energy efficiency, foreign tax, child tax, QBI |
| Deductions | Mortgage, SALT, charitable, medical, Schedule C |
| Tax years | 2025 (updatable — [guide](docs/tax-year-update-guide.md)) |

## Quickstart

### Prerequisites

- [Claude Code](https://claude.ai/code) (CLI, desktop app, or web)
- Python 3.8+
- Node.js 18+ (for dashboard)
- [Typst](https://typst.app/) (optional, for PDF export)
- Google Drive MCP configured in Claude Code

### Setup

```bash
git clone https://github.com/swapnil-sd/your-tax-agent
cd your-tax-agent
chmod +x setup.sh && ./setup.sh
```

This installs: RAG pipeline, dashboard dependencies, agent definitions, and MCP tools.

### Configure

1. Edit `context.md` with your details (the agent also asks during onboarding)
2. Gather your tax documents:
   - W-2(s) for all taxpayers
   - All brokerage 1099s (Fidelity, Robinhood, Betterment, Schwab, etc.)
   - Form 1098(s) — mortgage interest
   - RSU vesting records ([how to get these](docs/how-rsu-basis-works.md#where-to-get-your-vesting-records))
   - Solar/energy invoices (if applicable)

3. Put them somewhere the agent can read:

   **Option A: Google Drive** (if you have the MCP configured)
   - Upload PDFs to a Google Drive folder
   - Share the folder link with the agent

   **Option B: Local folder** (no Google Drive needed)
   - Put all PDFs in a folder, e.g., `~/Documents/tax-docs-2025/`
   - Tell the agent the folder path

### Run

```bash
claude
```

Then say:
```
Use the tax-prepare agent to prepare my 2025 taxes.
My documents are in ~/Documents/tax-docs-2025/
```

Or with Google Drive:
```
Use the tax-prepare agent to prepare my 2025 taxes.
My documents are at: https://drive.google.com/drive/folders/...
```

### View Results

```bash
# Interactive dashboard
cd dashboard && npm run dev
# Open http://localhost:3000

# PDF export (requires Typst)
typst compile output/2025/filing_guide.typ

# Or just read the markdown
cat output/2025/filing_guide.md
```

## Architecture

8 specialized agents + 1 coordinator:

| Agent | Role |
|-------|------|
| **Coordinator** | Onboards user, orchestrates workflow, collects audit logs |
| **Doc Processor** | Reads PDFs, classifies forms (W-2, 1099, 1098), extracts structured data |
| **Tax Strategist** | Compares MFJ vs MFS, itemized vs standard, identifies all credits, calculates federal tax |
| **RSU Specialist** | Matches 1099-B sell-to-cover sales to vesting records, corrects cost basis |
| **State Expert** | Calculates NY non-resident (IT-203) + NJ resident (NJ-1040) returns |
| **Tax Q&A** | Answers any tax question using RAG over IRS publications + web search |
| **Reviewer** | Validates all outputs with 30 IRS compliance checks, sends errors back for correction |
| **Strategy Researcher** | Harvests optimization strategies from tax forums (r/tax, Bogleheads, etc.) |

### Knowledge Stack

```
Layer 1: IRS Publications (RAG via ChromaDB)     — "What does the law say?"
Layer 2: Tax Rules KB (markdown)                  — "What rules apply to tech workers?"
Layer 3: Forum Strategies (crowdsourced)          — "What moves are real people making?"
Layer 4: Real-time Web Search                     — "What's the latest on this?"
```

[Detailed architecture](docs/architecture.md)

### Compliance Review (30 Checks)

The Reviewer agent validates every output before you see it:

| Category | Checks | Examples |
|----------|--------|---------|
| Math consistency | 6 | AGI adds up, refund calculation correct |
| IRS limits & caps | 8 | SALT $10K cap, mortgage $750K limit, capital loss $3K |
| RSU basis | 4 | Sell-to-cover gains near $0, all unreported basis corrected |
| Cross-agent consistency | 5 | All agents agree on AGI, wages, capital gains |
| State returns | 5 | NJ credit valid, NY allocation correct |
| Filing status | 2 | MFJ has spouse data, HoH has dependent |

Errors trigger a retry: the responsible agent gets one chance to fix it. If still wrong, it's flagged for your review.

## Project Structure

```
your-tax-agent/
├── agents/          # 8 Claude Code agent definitions
├── kb/              # Tax rules (federal + NY + NJ) + RSU broker formats
├── rag/             # RAG pipeline (IRS publications + ChromaDB)
├── dashboard/       # Next.js interactive dashboard (10 components)
├── templates/       # Output templates (markdown + Typst)
├── examples/        # Redacted sample output with audit data
├── docs/            # Architecture, RSU explainer, state guide, tax year update
├── config/          # Templates for personal config (context.md, .env)
├── output/          # Generated per run (gitignored)
└── setup.sh         # One-command setup
```

## Dashboard

The web dashboard shows your complete tax analysis:

- **Summary cards** — federal refund, NY refund, NJ owed
- **Optimizations list** — each optimization with dollar savings and risk level
- **Tax breakdown chart** — pie chart of where your tax goes
- **Income table** — all W-2 + investment income sources
- **RSU corrections table** — before/after showing phantom income eliminated
- **Deductions comparison** — itemized vs standard side-by-side
- **Credits card** — solar, foreign tax, QBI with amounts
- **State returns** — NY + NJ side-by-side with calculations
- **Document checklist** — what's uploaded, what's still needed
- **Audit trail** — 30 compliance checks with pass/warn/fail status, agent execution logs

## Extending

- **Add a state:** [docs/adding-a-state.md](docs/adding-a-state.md)
- **Update for new tax year:** [docs/tax-year-update-guide.md](docs/tax-year-update-guide.md)
- **Add RSU broker:** Edit `kb/rsu_brokers.md` with the new report format
- **Expand RAG corpus:** Add IRS publication PDFs to `rag/data/publications/` and re-run `python3 rag/ingest.py`

## Security & Privacy

- **No personal data in the repo** — `context.md` and `output/` are gitignored
- **Credentials never stored** — entered at runtime only
- **All processing is local** — no cloud services except Google Drive for document access
- **RAG uses local ChromaDB** — no external vector database
- **Audit trail stays local** — `audit_trail.json` is in the gitignored output directory

## Known Limitations

- NY + NJ states only (see [adding-a-state.md](docs/adding-a-state.md) for extending)
- Requires Claude Code (not a standalone CLI tool)
- RSU vesting records must be obtained manually from your broker portal
- Tax rules need annual updates ([guide](docs/tax-year-update-guide.md))
- TurboTax DOM selectors (if using experimental MCP) need calibration on first run

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Key areas:
- Add new states
- Add RSU broker formats
- Expand IRS publication corpus
- Improve dashboard visualizations
- Update tax rules for new years

## Disclaimer

This tool is for educational and planning purposes only. It is not a substitute for professional tax advice. Always consult a licensed CPA or tax attorney before filing your return. The authors are not responsible for any errors in tax calculations or filing decisions made using this tool.

## License

MIT
