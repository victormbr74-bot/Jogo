export const initBottomTabs = (openSheet) => {
  const tabs = document.querySelectorAll(".bottom-tabs .tab");
  if (!tabs.length) return;
  tabs[0].classList.add("active");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.sheetTarget;
      if (target) openSheet(target);
    });
  });
};
