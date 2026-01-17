const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getWeight = (score = 0) => clamp(1 + score * 0.2, 0.25, 1.6);

export const pickWeighted = (items, weightMap, options = {}) => {
  if (!items.length) return null;
  const recentSet = new Set(options.recentIds || []);
  const lastId = options.lastId;
  let candidates = items.filter((item) => !recentSet.has(item.id) && item.id !== lastId);
  if (!candidates.length) {
    candidates = items.filter((item) => item.id !== lastId);
  }
  if (!candidates.length) candidates = items;
  const total = candidates.reduce((sum, item) => sum + getWeight(weightMap[item.id]), 0);
  let roll = Math.random() * total;
  for (let i = 0; i < candidates.length; i += 1) {
    roll -= getWeight(weightMap[candidates[i].id]);
    if (roll <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
};

export const pickEquivalent = (items, current, weightMap, options = {}) => {
  const pool = items.filter(
    (item) =>
      item.id !== current.id &&
      item.type === current.type &&
      item.level === current.level &&
      item.mode.some((mode) => current.mode.includes(mode))
  );
  return pickWeighted(pool, weightMap, options);
};

export const updateScore = (score, delta) => clamp((score || 0) + delta, -3, 3);
