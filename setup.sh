#!/bin/bash
set -e

echo "🔧 Setting up your-tax-agent..."
echo ""

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Step 1: Install RAG dependencies
echo "📦 Installing RAG dependencies..."
pip3 install --break-system-packages -q -r "$REPO_ROOT/rag/requirements.txt" 2>/dev/null || \
pip3 install -q -r "$REPO_ROOT/rag/requirements.txt"

# Step 2: Build RAG index
echo "🔍 Building IRS publications search index..."
python3 "$REPO_ROOT/rag/ingest.py" 2>/dev/null

# Step 3: Install dashboard dependencies
if [ -d "$REPO_ROOT/dashboard" ] && [ -f "$REPO_ROOT/dashboard/package.json" ]; then
  echo "🎨 Installing dashboard dependencies..."
  cd "$REPO_ROOT/dashboard" && npm install --silent 2>/dev/null
  cd "$REPO_ROOT"
fi

# Step 4: Install agent definitions
echo "🤖 Installing Claude Code agent definitions..."
mkdir -p ~/.claude/agents

for agent_file in "$REPO_ROOT/agents"/tax-*.md; do
  filename=$(basename "$agent_file")
  sed "s|{{PROJECT_ROOT}}|$REPO_ROOT|g" "$agent_file" > ~/.claude/agents/"$filename"
  echo "   ✓ $filename"
done

# Step 5: Create user config from templates
if [ ! -f "$REPO_ROOT/context.md" ]; then
  cp "$REPO_ROOT/config/context.example.md" "$REPO_ROOT/context.md"
  echo ""
  echo "📝 Created context.md — please fill in your personal details"
fi

if [ ! -f "$REPO_ROOT/.env" ]; then
  cp "$REPO_ROOT/config/.env.example" "$REPO_ROOT/.env"
fi

# Step 6: Check for Typst (PDF export)
if ! command -v typst &>/dev/null; then
  echo ""
  echo "📄 For PDF export, install Typst: brew install typst"
fi

# Step 7: Check for Claude Code
if ! command -v claude &>/dev/null; then
  echo ""
  echo "⚠️  Claude Code not found. Install it from: https://claude.ai/code"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit context.md with your personal details"
echo "  2. Upload your tax documents to a Google Drive folder"
echo "  3. Run: claude"
echo "  4. In Claude Code, type: /tax-prepare"
echo ""
echo "Optional:"
echo "  • View dashboard: cd dashboard && npm run dev"
echo "  • Generate PDF: typst compile output/2025/filing_guide.typ"
