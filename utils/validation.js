const VALID_ZONES = ["leve", "quente", "final"];
const VALID_CATEGORIES = ["verdade", "desafio", "acao_visual"];

const ensureBans = (bans) => ({
  nudez: Boolean(bans?.nudez),
  dominacao: Boolean(bans?.dominacao),
  oral: Boolean(bans?.oral)
});

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

export const validateActions = (items = []) => {
  const errors = [];
  const valid = [];
  const ids = new Set();
  items.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      errors.push(`Acao ${index} invalida`);
      return;
    }
    if (!item.id || ids.has(item.id)) {
      errors.push(`Acao com id invalido: ${item.id}`);
      return;
    }
    if (!VALID_CATEGORIES.includes(item.category)) {
      errors.push(`Acao ${item.id} com categoria invalida`);
      return;
    }
    if (!VALID_ZONES.includes(item.zone)) {
      errors.push(`Acao ${item.id} com zona invalida`);
      return;
    }
    if (!hasText(item.text)) {
      errors.push(`Acao ${item.id} sem texto`);
      return;
    }
    if (item.category === "acao_visual" && !hasText(item.icon)) {
      errors.push(`Acao visual ${item.id} sem icone`);
      return;
    }
    ids.add(item.id);
    valid.push({ ...item, bans: ensureBans(item.bans) });
  });
  return { valid, errors };
};

export const validateCards = (items = []) => {
  const errors = [];
  const valid = [];
  const ids = new Set();
  items.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      errors.push(`Carta ${index} invalida`);
      return;
    }
    if (!item.id || ids.has(item.id)) {
      errors.push(`Carta com id invalido: ${item.id}`);
      return;
    }
    if (!VALID_ZONES.includes(item.zone)) {
      errors.push(`Carta ${item.id} com zona invalida`);
      return;
    }
    if (!hasText(item.text)) {
      errors.push(`Carta ${item.id} sem texto`);
      return;
    }
    ids.add(item.id);
    valid.push({ ...item, bans: ensureBans(item.bans) });
  });
  return { valid, errors };
};

export const withBans = (item) => ({ ...item, bans: ensureBans(item.bans) });
