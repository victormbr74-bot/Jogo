export const bindModal = (modal, backdrop) => {
  const close = () => closeModal(modal, backdrop);
  modal.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", close);
  });
  return close;
};

export const openModal = (modal, backdrop) => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
};

export const closeModal = (modal, backdrop) => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
};
