const STORAGE_KEY = "fogo-seda-state-v3";

const mergeDeep = (base, incoming) => {
  const result = { ...base };
  Object.keys(incoming || {}).forEach((key) => {
    if (incoming[key] && typeof incoming[key] === "object" && !Array.isArray(incoming[key])) {
      result[key] = { ...(base[key] || {}), ...incoming[key] };
    } else {
      result[key] = incoming[key];
    }
  });
  return result;
};

export const loadState = (defaults) => {
  if (typeof localStorage === "undefined") return { ...defaults };
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaults };
  try {
    const parsed = JSON.parse(raw);
    return mergeDeep(defaults, parsed);
  } catch (error) {
    console.warn("Falha ao ler estado salvo.", error);
    return { ...defaults };
  }
};

export const saveState = (state) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
