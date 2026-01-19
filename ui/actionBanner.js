const getBadge = (action) => {
  if (!action) return "Aguardando";
  if (action.source === "event6") return "Evento 6";
  if (action.source === "normal") return "Carta";
  if (action.source === "tile") return "Casa";
  if (action.source === "special") return "Especial";
  return "Acao";
};

export const initActionBanner = (elements, { onOpen, onExecute, onRefuse }) => {
  elements.actionBannerOpen?.addEventListener("click", onOpen);
  elements.actionBannerExecute?.addEventListener("click", onExecute);
  elements.actionBannerRefuse?.addEventListener("click", onRefuse);
  elements.actionBanner?.addEventListener("click", (event) => {
    const isButton = event.target.closest("button");
    if (isButton) return;
    onOpen();
  });
};

export const updateActionBanner = (action, elements) => {
  if (!elements.actionBanner) return;
  elements.actionBannerBadge.textContent = getBadge(action);
  elements.actionBannerText.textContent = action?.text
    ? action.text
    : "Pronto para jogar. Role o dado para iniciar.";
  const disabled = !action || Boolean(action.readOnly);
  if (elements.actionBannerExecute) elements.actionBannerExecute.disabled = disabled;
  if (elements.actionBannerRefuse) elements.actionBannerRefuse.disabled = disabled;
};

export const pulseActionBanner = (banner) => {
  if (!banner) return;
  banner.classList.remove("is-pulse");
  void banner.offsetWidth;
  banner.classList.add("is-pulse");
  window.setTimeout(() => {
    banner.classList.remove("is-pulse");
  }, 200);
};
