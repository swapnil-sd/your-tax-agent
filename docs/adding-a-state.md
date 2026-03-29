# Adding a New State

This guide explains how to add support for states beyond NY and NJ.

## What You Need

1. The state's tax brackets and rates
2. Filing requirements (resident vs non-resident)
3. Key deductions/credits unique to that state
4. Credit-for-taxes-paid-to-other-states rules

## Step 1: Update Tax Rules KB

Edit `kb/tax_rules_2025.md` and add a new section at the bottom:

```markdown
## [STATE NAME] — [Resident/Non-Resident] ([FORM NUMBER])

### Who Files
- [Filing requirements]

### Tax Rates (2025)
| Rate | Taxable Income |
|------|---------------|
| X% | $0 - $Y |
| ...

### Key Rules
- [State-specific deductions]
- [Credit for taxes paid to other states]
- [Any SALT differences from federal]
```

## Step 2: Update the State Tax Expert Agent

Edit `agents/tax-state-expert.md`:

1. Add the new state to the agent's description
2. Add calculation logic for the new state in the Output Format section
3. Include the new state's form number and filing requirements

## Step 3: Update the Coordinator Agent

Edit `agents/tax-prepare.md`:

1. In the onboarding questions, add the new state as an option
2. In Phase 4 (ANALYZE), ensure the State Expert receives the new state's W-2 data

## Step 4: Test

1. Create test W-2 data with the new state
2. Run `/tax-prepare` with a test case
3. Verify the state return calculations against a known-good source

## Currently Supported States

| State | Form | Type | Status |
|-------|------|------|--------|
| NY | IT-203 | Non-resident | Supported |
| NJ | NJ-1040 | Resident | Supported |

## Commonly Requested States

| State | Complexity | Notes |
|-------|-----------|-------|
| CA | High | Progressive rates, no SALT cap, AMT |
| WA | Low | No state income tax |
| TX | Low | No state income tax |
| CT | Medium | Similar to NY for NYC commuters |
| PA | Low | Flat 3.07% rate |
