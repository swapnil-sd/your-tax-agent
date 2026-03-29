# Blockers & Items Needing User Input

## Before First TurboTax MCP Test Run

1. **TurboTax Selectors Need Calibration**
   - All DOM selectors in `mcp/src/browser/selectors.ts` are placeholder estimates
   - They WILL need updating after the first live test against TurboTax
   - Process: run the MCP, see which selectors fail, inspect the DOM, update `selectors.ts`
   - The self-healing system will auto-save discovered selectors to `selector-overrides.json`

2. **TurboTax Credentials**
   - Need email + password for the first test run
   - If 2FA is enabled, user must complete it manually in the browser

3. **TurboTax Account Setup**
   - Need an active TurboTax Online account for 2025 tax year
   - May need to purchase the appropriate TurboTax tier (Premier or Self-Employed for investments + Schedule C)

## RAG Enhancement (Optional)

4. **IRS PDF Publications**
   - Currently only 3 IRS web pages + local KB are indexed (28 chunks)
   - For deeper Q&A, can add the full text of IRS publications (Pub 17, 525, 535, 550, 936, etc.)
   - Process: download PDFs from irs.gov, extract text with `pdftotext`, save as .txt files in `rag/data/publications/`, re-run `python3 rag/ingest.py`
   - Not blocking — the system works without these, just answers are less comprehensive

## No Blockers For

- Multi-agent document processing (fully working)
- RSU basis correction (fully working, tested)
- Tax strategy optimization (fully working, tested)
- State tax calculation NY/NJ (fully working, tested)
- RAG search (working with 28 chunks)
- Filing guide generation (fully working)
