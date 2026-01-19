let activeSheet = null;

const setSheetState = (sheet, isOpen) => {
  if (!sheet) return;
  sheet.classList.toggle("is-open", isOpen);
  sheet.setAttribute("aria-hidden", isOpen ? "false" : "true");
};

export const openSheet = (id) => {
  const sheet = document.getElementById(id);
  const backdrop = document.getElementById("sheetBackdrop");
  if (!sheet || !backdrop) return;
  if (activeSheet && activeSheet !== sheet) {
    setSheetState(activeSheet, false);
  }
  activeSheet = sheet;
  setSheetState(sheet, true);
  backdrop.hidden = false;
  document.body.classList.add("sheet-open");
};

export const closeSheet = () => {
  const backdrop = document.getElementById("sheetBackdrop");
  if (activeSheet) {
    setSheetState(activeSheet, false);
    activeSheet = null;
  }
  if (backdrop) backdrop.hidden = true;
  document.body.classList.remove("sheet-open");
};

export const initBottomSheets = () => {
  const backdrop = document.getElementById("sheetBackdrop");
  document.querySelectorAll("[data-sheet-close]").forEach((button) => {
    button.addEventListener("click", closeSheet);
  });
  backdrop?.addEventListener("click", closeSheet);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSheet();
  });
};
