import { includesNormalized } from "./text.js";

const REQUIRED_FIELDS = ["id", "type", "level", "mode", "text", "tags", "bans"];
const VALID_TYPES = ["truth", "dare"];
const VALID_LEVELS = ["leve", "quente", "fogo"];

export const validateItems = (items) => {
  const errors = [];
  const validItems = [];
  const ids = new Set();
  items.forEach((item, index) => {
    const missing = REQUIRED_FIELDS.filter((field) => item[field] === undefined);
    if (missing.length) {
      errors.push(`Item ${index} sem campos: ${missing.join(", ")}`);
      return;
    }
    if (!VALID_TYPES.includes(item.type)) {
      errors.push(`Item ${item.id} com type invalido: ${item.type}`);
      return;
    }
    if (!VALID_LEVELS.includes(item.level)) {
      errors.push(`Item ${item.id} com level invalido: ${item.level}`);
      return;
    }
    if (!Array.isArray(item.mode) || !item.mode.length) {
      errors.push(`Item ${item.id} com mode invalido`);
      return;
    }
    if (!item.text || typeof item.text !== "string") {
      errors.push(`Item ${item.id} com texto invalido`);
      return;
    }
    if (ids.has(item.id)) {
      errors.push(`ID duplicado: ${item.id}`);
      return;
    }
    ids.add(item.id);
    validItems.push(item);
  });
  return { validItems, errors };
};

export const filterItems = (items, options) => {
  const { level, type, mode, filters, blockedWords, keyword } = options;
  return items.filter((item) => {
    if (item.level !== level || item.type !== type) return false;
    if (!item.mode.includes(mode)) return false;
    if (filters?.noOral && item.bans?.oral) return false;
    if (filters?.noDom && item.bans?.dominacao) return false;
    if (filters?.noNudez && item.bans?.nudez) return false;
    if (blockedWords?.length) {
      const blocked = blockedWords.some((word) => includesNormalized(item.text, word));
      if (blocked) return false;
    }
    if (keyword && !includesNormalized(item.text, keyword)) return false;
    return true;
  });
};

export const getFallbackItems = (items, options) => {
  const { level, type, mode } = options;
  return items.filter(
    (item) =>
      item.fallback === true &&
      item.level === level &&
      item.type === type &&
      item.mode.includes(mode)
  );
};
