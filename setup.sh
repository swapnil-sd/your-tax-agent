#!/bin/bash
set -e

echo "Setting up your-tax-agent..."
echo ""

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Step 1: Install RAG dependencies
echo "Installing RAG dependencies..."
pip3 install --break-system-packages -q -r "$REPO_ROOT/rag/requirements.txt" 2>/dev/null || \
pip3 install -q -r "$REPO_ROOT/rag/requirements.txt"

# Step 2: Build RAG index
echo "Building IRS publications search index..."
python3 "$REPO_ROOT/rag/ingest.py" 2>/dev/null

# Step 3: Install dashboard dependencies
if [ -d "$REPO_ROOT/dashboard" ] && [ -f "$REPO_ROOT/dashboard/package.json" ]; then
  echo "Installing dashboard dependencies..."
  cd "$REPO_ROOT/dashboard" && npm install --silent 2>/dev/null
  cd "$REPO_ROOT"
fi

# Step 4: Install agent definitions
echo "Installing Claude Code agent definitions..."
mkdir -p ~/.claude/agents

for agent_file in "$REPO_ROOT/agents"/tax-*.md; do
  filename=$(basename "$agent_file")
  sed "s|{{PROJECT_ROOT}}|$REPO_ROOT|g" "$agent_file" > ~/.claude/agents/"$filename"
  echo "   Installed: $filename"
done

# Step 5: Create user config from templates
if [ ! -f "$REPO_ROOT/context.md" ]; then
  cp "$REPO_ROOT/config/context.example.md" "$REPO_ROOT/context.md"
  echo ""
  echo "Created context.md -- please fill in your personal details"
fi

if [ ! -f "$REPO_ROOT/.env" ]; then
  cp "$REPO_ROOT/config/.env.example" "$REPO_ROOT/.env"
fi

# Step 6: Check for Google Drive MCP
echo ""
echo "Checking Google Drive MCP..."
if command -v claude &>/dev/null; then
  if claude mcp list 2>/dev/null | grep -q "google-drive"; then
    echo "   Google Drive MCP is configured"
  else
    echo ""
    echo "   Google Drive MCP is NOT configured."
    echo "   You have two options for providing tax documents:"
    echo ""
    echo "   OPTION A: Set up Google Drive MCP (recommended)"
    echo "     Run: npm install -g @piotr-agier/google-drive-mcp"
    echo "     Then: claude mcp add google-drive npx @piotr-agier/google-drive-mcp start"
    echo "     Follow the OAuth setup instructions to authorize access."
    echo ""
    echo "   OPTION B: Use local files instead"
    echo "     Put your tax documents (PDFs) in a local folder, e.g.:"
    echo "       ~/Documents/tax-docs-2025/"
    echo "     When running the agent, tell it:"
    echo "       'My tax documents are in ~/Documents/tax-docs-2025/'"
    echo "     The agent will read them directly -- no Google Drive needed."
    echo ""
  fi
else
  echo "   Claude Code not found. Install it from: https://claude.ai/code"
  echo "   After installing, re-run this setup script."
fi

# Step 7: Check for Typst (PDF export)
if ! command -v typst &>/dev/null; then
  echo "For PDF export, install Typst: brew install typst"
fi

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit context.md with your personal details"
echo "  2. Put your tax documents in Google Drive OR a local folder"
echo "  3. Run: claude"
echo "  4. Say: Use the tax-prepare agent to prepare my 2025 taxes."
echo "     Then provide your Google Drive folder URL or local folder path."
echo ""
echo "Optional:"
echo "  View dashboard: cd dashboard && npm run dev"
echo "  Generate PDF:   typst compile output/2025/filing_guide.typ"
