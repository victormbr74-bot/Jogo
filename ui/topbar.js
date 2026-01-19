export const initTopbar = ({ openSettingsBtn, resetBtn, onOpenSettings, onReset }) => {
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener("click", onOpenSettings);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", onReset);
  }
};
