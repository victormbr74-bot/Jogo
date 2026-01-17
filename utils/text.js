export const normalizeText = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const includesNormalized = (text, term) => {
  if (!term) return true;
  return normalizeText(text).includes(normalizeText(term));
};

const buildIndexMap = (text) => {
  const normalizedChars = [];
  const indexMap = [];
  for (let i = 0; i < text.length; i += 1) {
    const normalized = text[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (let j = 0; j < normalized.length; j += 1) {
      normalizedChars.push(normalized[j].toLowerCase());
      indexMap.push(i);
    }
  }
  return { normalized: normalizedChars.join(""), indexMap };
};

export const highlightText = (text, term) => {
  if (!term) return text;
  const normalizedTerm = normalizeText(term).trim();
  if (!normalizedTerm) return text;
  const { normalized, indexMap } = buildIndexMap(text);
  const ranges = [];
  let startIndex = 0;
  while (startIndex <= normalized.length) {
    const hit = normalized.indexOf(normalizedTerm, startIndex);
    if (hit === -1) break;
    const start = indexMap[hit];
    const endIndex = hit + normalizedTerm.length - 1;
    const end = indexMap[endIndex];
    ranges.push([start, end]);
    startIndex = hit + normalizedTerm.length;
  }
  if (!ranges.length) return text;
  let result = "";
  let lastIndex = 0;
  ranges.forEach(([start, end]) => {
    result += text.slice(lastIndex, start);
    result += `<mark>${text.slice(start, end + 1)}</mark>`;
    lastIndex = end + 1;
  });
  result += text.slice(lastIndex);
  return result;
};
