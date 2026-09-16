#!/usr/bin/env node
// .git/hooks/pre-commit
// A Node-based pre-commit hook: check only staged JS files.

const { execSync } = require("child_process");

// 1. Collect staged files (Added/Copied/Modified), JS/TS only
function getStagedFiles() {
  const out = execSync("git diff --cached --name-only --diff-filter=ACM", {
    encoding: "utf8",
  });
  return out
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => /\.(js|jsx|ts|tsx)$/.test(f));
}

function main() {
  const files = getStagedFiles();
  if (files.length === 0) {
    // Nothing relevant staged, let the commit through
    process.exit(0);
  }

  try {
    // Run ESLint only on the staged files (fast, focused)
    execSync(`npx eslint ${files.join(" ")}`, { stdio: "inherit" });
  } catch (err) {
    // Non-zero exit tells Git to abort the commit
    process.exit(1);
  }

  process.exit(0);
}

main();
