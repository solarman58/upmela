/**
 * Sector matching utilities for Mela projects.
 * Robust matching between node names (e.g. "Sector 1", "Sector 10", "S1")
 * and floors in floors array (e.g. name "Sector 1", level "S1").
 * Avoids false substring matches (e.g. "Sector 10" falsely matching "Sector 1").
 */
export function findMatchingSectorFloor(nodeName, floors = []) {
  if (!nodeName || !floors?.length) return null;

  const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const nClean = clean(nodeName); // e.g. "sector1", "sector10"

  // Extract number from nodeName if present (e.g. "Sector 1" -> 1, "Sector 10" -> 10)
  const nodeNumMatch = nodeName.match(/(\d+)/);
  const nodeNum = nodeNumMatch ? parseInt(nodeNumMatch[1], 10) : null;

  // 1. Exact match on cleaned string (excluding MAIN overview)
  const exactMatch = floors.find(f => {
    if (f.level === 'MAIN') return false;
    const fNameClean = clean(f.name);
    const fLevelClean = clean(f.level);
    return nClean === fNameClean || nClean === fLevelClean;
  });
  if (exactMatch) return exactMatch;

  // 2. Exact match by Sector number if both have a number
  if (nodeNum !== null) {
    const numMatch = floors.find(f => {
      if (f.level === 'MAIN') return false;
      const fNameNumMatch = (f.name || '').match(/(\d+)/);
      if (fNameNumMatch && parseInt(fNameNumMatch[1], 10) === nodeNum) return true;
      const fLevelNumMatch = (f.level || '').match(/(\d+)/);
      if (fLevelNumMatch && parseInt(fLevelNumMatch[1], 10) === nodeNum) return true;
      return false;
    });
    if (numMatch) return numMatch;
  }

  // 3. Exact word match fallback
  const wordMatch = floors.find(f => {
    if (f.level === 'MAIN') return false;
    const words = (f.name || '').toLowerCase().trim().split(/\s+/);
    const nodeWords = nodeName.toLowerCase().trim().split(/\s+/);
    return words.length === nodeWords.length && words.every((w, i) => w === nodeWords[i]);
  });

  return wordMatch || null;
}
