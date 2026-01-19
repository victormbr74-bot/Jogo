const STATE_KEY = "fogo-seda-board-state-v1";

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
  const raw = localStorage.getItem(STATE_KEY);
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
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
};

export const loadCollection = (key, fallback = []) => {
  if (typeof localStorage === "undefined") return [...fallback];
  const raw = localStorage.getItem(key);
  if (!raw) return [...fallback];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.warn("Falha ao ler colecao salva.", error);
  }
  return [...fallback];
};

export const saveCollection = (key, items) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
};
