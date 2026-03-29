# Updating for a New Tax Year

Each January, update the system for the new tax year. Here's the checklist.

## What Changes Annually

| Item | Where | What to Update |
|------|-------|---------------|
| Federal tax brackets | `kb/tax_rules_2025.md` | All bracket thresholds (adjust for inflation) |
| Standard deduction | `kb/tax_rules_2025.md` | MFJ, MFS, Single, HoH amounts |
| 401(k) limits | `kb/tax_rules_2025.md` | Employee limit, catch-up amounts |
| IRA/Roth limits | `kb/tax_rules_2025.md` | Contribution limits, phase-out ranges |
| HSA limits | `kb/tax_rules_2025.md` | Self-only and family amounts |
| SS wage base | `kb/tax_rules_2025.md` | Social Security wage ceiling |
| LTCG rate thresholds | `kb/tax_rules_2025.md` | 0%/15%/20% bracket boundaries |
| State brackets | `kb/tax_rules_2025.md` | NY and NJ rate tables |
| Standard mileage rate | `kb/tax_rules_2025.md` | IRS mileage rate for Schedule C |
| Section 179 limit | `kb/tax_rules_2025.md` | Maximum deduction amount |
| Energy credits | `kb/tax_rules_2025.md` | Check if rates/caps changed |
| SALT cap | `kb/tax_rules_2025.md` | Check if $10K cap was modified |

## Step-by-Step

### 1. Create new KB file
```bash
cp kb/tax_rules_2025.md kb/tax_rules_2026.md
```

### 2. Update all numbers
The IRS publishes inflation adjustments in October/November (Revenue Procedure). Check:
- IRS.gov Revenue Procedures
- "Tax inflation adjustments for [year]"

### 3. Update agent references
Search all agent files for the year reference:
```bash
grep -r "2025" agents/
```
Update to the new year where appropriate.

### 4. Re-run RAG ingestion
IRS updates their web pages annually:
```bash
python3 rag/ingest.py
```

### 5. Test with sample data
Run the system with test data to verify calculations match known-good results.

## Where to Find Updated Numbers

| Source | URL |
|--------|-----|
| IRS inflation adjustments | irs.gov (search "revenue procedure inflation") |
| Tax brackets | irs.gov/newsroom |
| Retirement plan limits | irs.gov/retirement-plans |
| Standard mileage | irs.gov/tax-professionals/standard-mileage-rates |
| NY state rates | tax.ny.gov |
| NJ state rates | nj.gov/treasury |
