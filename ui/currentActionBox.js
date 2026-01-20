const SOURCE_LABELS = {
  tile: "Casa",
  normal: "Carta",
  event6: "Evento 6",
  special: "Especial"
};

const TYPE_LABELS = {
  verdade: "Verdade",
  desafio: "Desafio",
  acao_visual: "Ação visual",
  especial: "Especial"
};

const ZONE_LABELS = {
  leve: "Zona Leve",
  quente: "Zona Quente",
  final: "Zona Final"
};

const DEFAULT_PENALTY = "-3 casas · 1 rodada · sem interação";

const formatActionLabel = (action) => {
  if (!action) return "Ação";
  return TYPE_LABELS[action.category ?? action.type] || "Ação";
};

const renderAction = (action, elements) => {
  const hasAction = Boolean(action);
  const badge = hasAction ? SOURCE_LABELS[action.source] || "Ação" : "Aguardando";
  const text =
    hasAction && action.text
      ? action.text
      : "Nenhuma ação pendente. Role o dado para iniciar.";
  if (elements.currentActionBadge) {
    elements.currentActionBadge.textContent = badge;
  }
  if (elements.currentActionKind) {
    elements.currentActionKind.textContent = hasAction ? formatActionLabel(action) : "Ação";
  }
  if (elements.currentActionText) {
    elements.currentActionText.textContent = text;
  }
  if (elements.currentActionZone) {
    elements.currentActionZone.textContent = ZONE_LABELS[action?.zone] || "Zona Leve";
    elements.currentActionZone.hidden = !hasAction;
  }
  if (elements.currentActionMandatory) {
    elements.currentActionMandatory.hidden = !hasAction || !action?.mandatory;
  }
  if (elements.currentActionPenalty) {
    elements.currentActionPenalty.textContent = `Penalidade: ${action?.penalty || DEFAULT_PENALTY}`;
    elements.currentActionPenalty.hidden = !hasAction;
  }
  if (elements.currentActionExpand) {
    elements.currentActionExpand.disabled = !hasAction;
  }
  if (elements.currentActionBox) {
    elements.currentActionBox.classList.toggle("is-empty", !hasAction);
  }
};

export const initCurrentActionBox = (elements, { onExpand } = {}) => {
  const handler = (event) => renderAction(event.detail, elements);
  window.addEventListener("actionchange", handler);
  renderAction(null, elements);
  if (elements.currentActionExpand) {
    elements.currentActionExpand.addEventListener("click", (event) => {
      event.stopPropagation();
      if (elements.currentActionExpand.disabled) return;
      if (typeof onExpand === "function") onExpand();
    });
  }
};
