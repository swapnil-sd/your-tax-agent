# How RSU Basis Correction Works

## The Problem: Double Taxation

If you work at a tech company (Amazon, Google, Meta, Apple, Microsoft, etc.) and receive RSUs, you're almost certainly being double-taxed unless you correct your cost basis.

Here's how it happens:

### Step 1: You receive RSUs
Your company grants you 100 shares of stock that vest over time.

### Step 2: Shares vest
When 10 shares vest at $200/share:
- $2,000 is added to your W-2 as ordinary income
- You pay ~$640 in income tax through payroll withholding
- Your employer sells 3 shares to cover the taxes ("sell to cover")
- 7 shares are deposited into your brokerage account

### Step 3: The 1099-B problem
Your broker (Fidelity, Schwab, etc.) reports the 3 sold shares on Form 1099-B:
```
Proceeds: $600 (3 shares x $200)
Cost Basis: $0   <-- THIS IS WRONG
Gain: $600       <-- THIS IS WRONG
```

### Step 4: The IRS sees double income
Without correction, the IRS sees:
- W-2 income: $2,000 (includes the $600 for the 3 sold shares) -- **taxed once**
- 1099-B gain: $600 (same income, reported again with $0 basis) -- **taxed again**

**You're paying tax twice on the same $600.**

### Step 5: The fix
Report the correct cost basis on Form 8949:
```
Proceeds: $600
Cost Basis: $600 (3 shares x $200 FMV at vest)
Gain: $0
```

## How Much This Costs You

| Annual RSU Income | Phantom Gain (if uncorrected) | Tax Overpayment (at 32%) |
|---|---|---|
| $35,000 | ~$14,000 | ~$4,500 |
| $70,000 | ~$28,000 | ~$9,000 |
| $150,000 | ~$60,000 | ~$19,200 |

## How your-tax-agent Fixes This

The RSU Specialist agent:
1. Reads your 1099-B and identifies sales with "$0 cost basis" and "basis not reported to IRS"
2. Reads your RSU vesting report (from Fidelity NetBenefits, Schwab, etc.)
3. Matches each sale to its vesting event using dates and share quantities
4. Calculates the correct cost basis (FMV at vest x shares sold)
5. Generates Form 8949 entries with the corrected basis

**The agent does this automatically for Fidelity, Schwab, E*Trade, and Morgan Stanley.**

## Where to Get Your Vesting Records

### Fidelity (Amazon, many others)
1. Log into netbenefits.fidelity.com
2. Stock Plans > Summary > "Your awards"
3. Or: Statements/Records > Year-End Investment Report (pages 6-7)

### Schwab (Google, Apple)
1. Log into schwab.com
2. Accounts > Equity Awards > View Details
3. Or: Tax Center > Cost Basis Report

### E*Trade / Morgan Stanley (Meta, others)
1. Log into us.etrade.com or morganstanley.com/atwork
2. Stock Plan > My Account > Holdings
3. Or: Tax Center > Supplemental Info

## FAQ

**Q: Is this legal?**
A: Yes. You're reporting the correct cost basis that the broker failed to report. The IRS expects you to do this — it's documented in IRS Publication 525 and the Form 8949 instructions.

**Q: What if I didn't correct this in prior years?**
A: You can file amended returns (Form 1040-X) for the past 3 years. Each year you didn't correct it, you overpaid.

**Q: My broker shows the correct basis on a supplemental form. Do I still need to fix it?**
A: The supplemental form is for your records. The official 1099-B filed with the IRS still shows $0. You need to report the correct basis on your tax return.
