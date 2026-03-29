# Contributing to your-tax-agent

Thanks for your interest in improving tax filing for tech workers!

## Ways to Contribute

- **Add support for new states** (beyond NY/NJ)
- **Add new RSU broker formats** (beyond Fidelity, Schwab, E*Trade, Morgan Stanley)
- **Expand the IRS publication RAG corpus** (add more Pub PDFs)
- **Update tax rules for new tax years** (brackets, limits, new credits)
- **Improve the dashboard** (new visualizations, better UX)
- **Fix bugs** in agents or tools
- **Improve documentation**

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/your-tax-agent
cd your-tax-agent
chmod +x setup.sh && ./setup.sh
```

## Agent Development

Agent definitions live in `agents/` with `{{PROJECT_ROOT}}` path placeholders. After editing:

```bash
# Re-install agents to Claude Code
./setup.sh
```

Test with:
```bash
claude
> /tax-prepare
```

## Adding a New State

See [docs/adding-a-state.md](docs/adding-a-state.md) for a step-by-step guide.

## Updating for a New Tax Year

See [docs/tax-year-update-guide.md](docs/tax-year-update-guide.md).

## Dashboard Development

```bash
cd dashboard
npm run dev
# Open http://localhost:3000
# Edit components in src/components/
# Sample data in public/sample-data.json
```

## Pull Request Process

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/add-california-state`)
3. **Ensure no personal data** in your commits (names, SSNs, dollar amounts, addresses)
4. Update relevant docs and KB files
5. Test your changes
6. Submit a PR with a clear description

## Important: No Personal Data

Never commit:
- Real names, SSNs, or addresses
- Actual tax dollar amounts from real returns
- TurboTax credentials
- context.md (gitignored for a reason)

If you include examples, use realistic but fake data.

## Code of Conduct

Be respectful and constructive. We're all here to make tax filing less painful.
