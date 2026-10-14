const fs = require('fs');

const path = './src/components/LandingPage/LandingPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find the boundaries of Scan & Go
const startMarker = "{/* ─── SCAN & GO SECTION ─── */}";
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  console.log("Could not find start marker");
  process.exit(1);
}

// Find the end of the section by looking for the next major section marker
const nextMarker = "{/* ─── PRICING ─────────────────────────────────────────── */}";
const endIdx = content.indexOf(nextMarker);
if (endIdx === -1) {
  console.log("Could not find end marker");
  process.exit(1);
}

// Extract the section
const sectionToMove = content.substring(startIdx, endIdx);

// Remove the section from its original place
content = content.slice(0, startIdx) + content.slice(endIdx);

// Find the insertion point (after lp-hero)
const heroEndMarker = "</header>\n      )}";
const insertIdx = content.indexOf(heroEndMarker);
if (insertIdx === -1) {
  console.log("Could not find insertion point");
  process.exit(1);
}

// Insert the section
const insertionPoint = insertIdx + heroEndMarker.length + 1; // +1 for newline
content = content.slice(0, insertionPoint) + "\n\n      " + sectionToMove + content.slice(insertionPoint);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully moved section.");
