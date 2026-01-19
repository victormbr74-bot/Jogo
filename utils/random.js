export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const pickOne = (items) => {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
};

export const pickMany = (items, count) => shuffle(items).slice(0, count);

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
