# {{TAX_YEAR}} Federal Tax Filing Guide
## {{PRIMARY_NAME}} & {{SPOUSE_NAME}} — {{FILING_STATUS}}

**Prepared:** {{DATE}}
**Tax Year:** January 1 - December 31, {{TAX_YEAR}}
**Filing Deadline:** April 15, {{TAX_YEAR_PLUS_1}}
**Expected Federal Refund/Owed:** {{RESULT}}

---

## Executive Summary

{{SUMMARY_TEXT}}

### Key Optimizations Applied

| # | Optimization | Savings |
|---|-------------|---------|
{{OPTIMIZATIONS_TABLE}}

### Comparison: Optimized vs Naive Approach

| | Naive (MFS + Standard) | Optimized |
|---|---|---|
| Filing Status | MFS | {{FILING_STATUS}} |
| Deductions | Standard (${{STANDARD_DEDUCTION}}) | {{DEDUCTION_METHOD}} (${{DEDUCTION_AMOUNT}}) |
| RSU Basis Corrected | No | Yes |
| Credits Claimed | None | {{CREDITS_LIST}} |
| **Result** | **Owe ~${{NAIVE_OWED}}** | **{{RESULT}}** |

---

## Part 1: Income

### W-2 Wages

| Taxpayer | Employer | Wages (Box 1) | Fed Withheld (Box 2) | 401(k) | State Tax |
|----------|----------|--------------|---------------------|--------|-----------|
{{W2_TABLE}}

### Investment Income

| Source | Owner | Ordinary Div | Qualified Div | Interest | Foreign Tax |
|--------|-------|-------------|--------------|----------|-------------|
{{INVESTMENT_TABLE}}

### Capital Gains & Losses (Non-RSU)

| Source | Short-Term | Long-Term | Net |
|--------|-----------|-----------|-----|
{{CAP_GAINS_TABLE}}

### RSU Basis Corrections (Form 8949)

{{RSU_CORRECTIONS_TABLE}}

### Other Income

{{OTHER_INCOME}}

---

## Part 2: Adjustments to Income

| Adjustment | Amount |
|-----------|--------|
{{ADJUSTMENTS_TABLE}}
| **AGI** | **${{AGI}}** |

---

## Part 3: Deductions

### Method: {{DEDUCTION_METHOD}}

{{DEDUCTIONS_DETAIL}}

---

## Part 4: Credits

| Credit | Form | Amount |
|--------|------|--------|
{{CREDITS_TABLE}}

---

## Part 5: Tax Calculation

| Line | Amount |
|------|--------|
| Taxable Income | ${{TAXABLE_INCOME}} |
| Income Tax (brackets) | ${{INCOME_TAX}} |
| Additional Medicare Tax | ${{ADDITIONAL_MEDICARE}} |
| NIIT | ${{NIIT}} |
| Gross Tax | ${{GROSS_TAX}} |
| Total Credits | -${{TOTAL_CREDITS}} |
| **Net Federal Tax** | **${{NET_TAX}}** |
| Total Withholding | ${{TOTAL_WITHHOLDING}} |
| **{{REFUND_OR_OWED}}** | **${{RESULT_AMOUNT}}** |

---

## Part 6: State Returns

### New York (IT-203, Non-Resident)
{{NY_RETURN}}

### New Jersey (NJ-1040, Resident)
{{NJ_RETURN}}

---

## Part 7: TurboTax Entry Guide

{{TURBOTAX_GUIDE}}

---

## Part 8: Document Checklist

{{DOCUMENT_CHECKLIST}}

---

## Part 9: Next Year Planning

{{NEXT_YEAR_PLANNING}}

---

## Audit Trail

See `audit_trail.json` for complete traceability of every number to its source document.

---

*This guide was prepared using actual tax documents and IRS rules. It is intended as a planning tool and does not constitute professional tax advice. Consult with a licensed CPA or tax attorney for final filing decisions.*
