# RSU Vesting Report Formats by Broker

## Overview

When tech companies grant RSUs, employees typically have a brokerage account where vested shares are deposited. The vesting report format varies by broker. This document describes how to extract cost basis data from each broker's reports.

## The Core Problem

All brokers report RSU sales on Form 1099-B with **$0 cost basis** and **"basis not reported to IRS"**. The taxpayer must determine the correct cost basis from the vesting records.

**Cost basis = Fair Market Value (FMV) per share × number of shares on the vest date**

This amount was already included in the employee's W-2 as ordinary income.

## Common RSU Sale Types

### Sell-to-Cover (Most Common)
- At vesting, employer automatically sells enough shares to cover tax withholding
- Remaining shares deposited into brokerage
- The sold shares appear on 1099-B
- Since sold same day as vest: FMV at vest ≈ sale proceeds → gain ≈ $0

### Manual Sale of Vested Shares
- Employee chooses to sell previously vested shares
- Must identify which vest lot(s) the shares came from
- Cost basis = FMV at the ORIGINAL vest date (not the sale date)
- May result in significant gain or loss depending on price movement

### Same-Day Sale (Sell All)
- All shares sold immediately at vesting
- No shares deposited
- Gain ≈ $0 (same as sell-to-cover)

---

## Fidelity NetBenefits (Amazon, many others)

### Where to Find Vesting Data
1. Log into **netbenefits.fidelity.com**
2. Go to **Stock Plans → Summary**
3. Scroll to **"Your awards"**
4. Or: **Statements / Records → 2025 Year-End Investment Report**

### Report Format: Grant Transaction Details

Found in the Year-End Investment Report (typically pages 6-7):

```
Grant Transaction Details

Transaction    Grant Date  Grant ID  Grant   Transaction  Quantity  Fair Market    Net Share
Date                                 Type    Type                   Value Per Share Proceeds
─────────────────────────────────────────────────────────────────────────────────────────────
02/21/2025    04/01/2024  L5L8      RSU     Distribution  5.00     $219.52        5.00
05/15/2025    12/02/2024  L5L8      RSU     Distribution  7.00     $204.20        7.00
05/21/2025    04/01/2024  L5L8      RSU     Distribution  49.00    $201.64        49.00
```

### Key Fields
- **Transaction Date**: The vest/distribution date (= cost basis date)
- **Quantity**: Total shares vested (includes shares withheld for taxes)
- **Fair Market Value Per Share**: The FMV at vest — THIS IS THE COST BASIS PER SHARE
- **Net Share Proceeds**: Shares remaining after tax withholding (these go to brokerage)

### How to Match to 1099-B
1. Look at 1099-B sale dates
2. Find the matching Transaction Date in the vesting report
3. Cost basis = shares sold × FMV Per Share from vesting report
4. For sell-to-cover: shares sold = (Quantity - Net Share Proceeds)
5. For net shares deposited: shares = Net Share Proceeds

### Important Notes
- Fidelity's 1099-B shows sales under "Short-term transactions for which basis is NOT reported to the IRS"
- The "Net Share Proceeds" column shows shares AFTER tax withholding, NOT dollar proceeds
- Multiple grants may vest on the same date — match by Grant ID if needed

---

## Schwab (Google, Apple, some others)

### Where to Find Vesting Data
1. Log into **schwab.com**
2. Go to **Accounts → Equity Awards** (or **Stock Plan**)
3. Click **"View Details"** on any award
4. Or: **Tax Center → Cost Basis Report**

### Report Format: Equity Award Detail

```
Release Detail

Release Date    Shares Released    Market Price    Market Value    Shares Withheld    Net Shares
─────────────────────────────────────────────────────────────────────────────────────────────────
02/25/2025      100               $175.50         $17,550.00      42                 58
05/25/2025      100               $182.30         $18,230.00      43                 57
```

### Key Fields
- **Release Date**: Vest date (= cost basis date)
- **Market Price**: FMV at vest — THIS IS THE COST BASIS PER SHARE
- **Shares Released**: Total vested
- **Shares Withheld**: Sold for tax withholding (these appear on 1099-B)
- **Net Shares**: Deposited to brokerage

### Schwab-Specific Notes
- Schwab may provide a **"Cost Basis Report"** under Tax Center that already shows corrected basis
- If available, use that report directly — it's the most authoritative source
- Schwab sometimes reports basis on 1099-B for stock plan shares (check if basis IS reported)
- Google RSUs: check for both Alphabet Class A (GOOGL) and Class C (GOOG) shares

---

## E*Trade / Morgan Stanley (Meta, some others)

### Where to Find Vesting Data
1. Log into **us.etrade.com** or **morganstanley.com/atwork**
2. Go to **Stock Plan → My Account → Holdings**
3. Or: **Tax Center → Supplemental Info / Benefit History**

### Report Format: Benefit History

```
Event Type    Date         Shares    Fair Market Value    Shares Sold    Shares Deposited
────────────────────────────────────────────────────────────────────────────────────────
Release       03/15/2025   200       $585.00/sh          85             115
Release       06/15/2025   200       $610.25/sh          88             112
```

### Key Fields
- **Date**: Vest/release date
- **Fair Market Value**: FMV per share at vest — COST BASIS
- **Shares Sold**: Sold for tax withholding (appear on 1099-B)
- **Shares Deposited**: Go to brokerage account

### E*Trade-Specific Notes
- E*Trade's "Stock Plan Transactions" report may be labeled differently after Morgan Stanley merger
- Meta RSUs: may show under "Meta Platforms" or "Facebook" depending on grant date
- E*Trade sometimes provides a "Supplemental Information" document with corrected basis
- Check for "Gain/Loss" report under Tax Center

---

## General Matching Algorithm

For any broker, the matching process is:

```
1. For each 1099-B transaction marked "basis not reported":
   a. Find the sale date
   b. Find the number of shares sold
   c. Look for a vest/release event on the SAME DATE in vesting records
   d. If found (sell-to-cover):
      - Cost basis = shares sold × FMV per share at vest
      - Expected gain ≈ $0 (minor rounding differences)
   e. If NOT found (manual sale):
      - Identify which vest lot the shares came from (FIFO by default)
      - Cost basis = shares sold × FMV per share at ORIGINAL vest date
      - May have significant gain or loss

2. Report on Form 8949:
   - Part I (short-term) or Part II (long-term) based on holding period
   - Check Box B (short-term, basis not reported) or Box E (long-term, basis not reported)
   - Column (a): Stock description (e.g., "AMAZON.COM INC")
   - Column (b): Date acquired (vest date)
   - Column (c): Date sold (sale date)
   - Column (d): Proceeds (from 1099-B)
   - Column (e): Cost basis (FMV at vest × shares)
   - Column (f): Adjustment code "B" (basis not reported)
   - Column (g): Adjustment amount (cost basis, since 1099-B reported $0)
   - Column (h): Gain or loss (d - e)
```

## Common Pitfalls

1. **Multiple vests on same date**: If 2 grants vest on the same day, match by grant ID or sort by quantity
2. **Fractional shares**: RSU sales often involve fractional shares — match to 3+ decimal places
3. **Different SSNs for joint filers**: Each spouse's RSUs are separate — don't mix
4. **Prior year vests sold in current year**: Cost basis is from the ORIGINAL vest date, not current year
5. **Wash sales across RSU and brokerage**: If you sell AMZN at a loss in Robinhood and AMZN RSUs vest within 30 days, wash sale rules apply
6. **Stock splits**: If company did a stock split between vest and sale, adjust the FMV and share count accordingly
