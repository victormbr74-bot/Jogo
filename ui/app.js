import { loadState, saveState } from "../utils/storage.js";
import { validateItems, filterItems, getFallbackItems } from "../utils/validation.js";
import { highlightText, includesNormalized } from "../utils/text.js";
import { pickWeighted, pickEquivalent, updateScore } from "../utils/random.js";

const DEFAULTS = {
  level: "leve",
  mode: "casal",
  theme: "ember",
  filters: { noOral: false, noDom: false, noNudez: false },
  noRepeat: 12,
  keyword: "",
  blockedWords: [],
  history: [],
  recentIds: [],
  feedbackScores: {},
  lastItemId: null
};

const state = loadState(DEFAULTS);

const elements = {
  itemType: document.getElementById("itemType"),
  itemMeta: document.getElementById("itemMeta"),
  itemText: document.getElementById("itemText"),
  card: document.getElementById("card"),
  drawTruth: document.getElementById("drawTruth"),
  drawDare: document.getElementById("drawDare"),
  drawRandom: document.getElementById("drawRandom"),
  swapItem: document.getElementById("swapItem"),
  reshuffle: document.getElementById("reshuffle"),
  likeItem: document.getElementById("likeItem"),
  dislikeItem: document.getElementById("dislikeItem"),
  copyItem: document.getElementById("copyItem"),
  historyList: document.getElementById("historyList"),
  copyHistory: document.getElementById("copyHistory"),
  clearHistory: document.getElementById("clearHistory"),
  levelButtons: document.querySelectorAll(".level-btn"),
  modeButtons: document.querySelectorAll(".mode-btn"),
  filterOral: document.getElementById("noOral"),
  filterDom: document.getElementById("noDom"),
  filterNudez: document.getElementById("noNudez"),
  keywordSearch: document.getElementById("keywordSearch"),
  blockKeyword: document.getElementById("blockKeyword"),
  blockedList: document.getElementById("blockedList"),
  noRepeat: document.getElementById("noRepeat"),
  noRepeatValue: document.getElementById("noRepeatValue"),
  themeButtons: document.querySelectorAll(".theme-btn"),
  shareLink: document.getElementById("shareLink"),
  copyShare: document.getElementById("copyShare"),
  qrCanvas: document.getElementById("qrCanvas"),
  exportPdf: document.getElementById("exportPdf"),
  poolWarning: document.getElementById("poolWarning"),
  relaxFilters: document.getElementById("relaxFilters"),
  switchLevel: document.getElementById("switchLevel"),
  settingsPanel: document.getElementById("settingsPanel"),
  settingsBackdrop: document.getElementById("settingsBackdrop"),
  openSettings: document.getElementById("openSettings"),
  closeSettings: document.getElementById("closeSettings")
};

let itemsCache = [];
let currentItem = null;

const levelLabels = { leve: "Leve", quente: "Quente", fogo: "Fogo" };
const modeLabels = { solo: "Solo", casal: "Casal", grupo: "Grupo" };

const applyQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) return;
  const level = params.get("level");
  const mode = params.get("mode");
  const noRepeat = Number.parseInt(params.get("norepeat"), 10);
  if (["leve", "quente", "fogo"].includes(level)) state.level = level;
  if (["solo", "casal", "grupo"].includes(mode)) state.mode = mode;
  if (!Number.isNaN(noRepeat)) state.noRepeat = Math.min(Math.max(noRepeat, 6), 20);
  state.filters.noOral = params.get("no_oral") === "1";
  state.filters.noDom = params.get("no_dom") === "1";
  state.filters.noNudez = params.get("no_nudez") === "1";
  const theme = params.get("theme");
  if (["ember", "sunrise"].includes(theme)) state.theme = theme;
};

const updateTheme = () => {
  document.body.classList.remove("theme-ember", "theme-sunrise");
  document.body.classList.add(`theme-${state.theme}`);
  elements.themeButtons.forEach((button) => {
    const active = button.dataset.theme === state.theme;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
};

const updateControls = () => {
  elements.levelButtons.forEach((button) => {
    const active = button.dataset.level === state.level;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  elements.modeButtons.forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  elements.filterOral.checked = state.filters.noOral;
  elements.filterDom.checked = state.filters.noDom;
  elements.filterNudez.checked = state.filters.noNudez;
  elements.noRepeat.value = String(state.noRepeat);
  elements.noRepeatValue.textContent = String(state.noRepeat);
  elements.keywordSearch.value = state.keyword;
  updateTheme();
  renderBlockedWords();
  updateShareLink();
};

const buildShareLink = () => {
  const url = new URL(window.location.href);
  url.searchParams.set("level", state.level);
  url.searchParams.set("mode", state.mode);
  url.searchParams.set("theme", state.theme);
  url.searchParams.set("norepeat", String(state.noRepeat));
  if (state.filters.noOral) url.searchParams.set("no_oral", "1");
  else url.searchParams.delete("no_oral");
  if (state.filters.noDom) url.searchParams.set("no_dom", "1");
  else url.searchParams.delete("no_dom");
  if (state.filters.noNudez) url.searchParams.set("no_nudez", "1");
  else url.searchParams.delete("no_nudez");
  return url.toString();
};

const updateShareLink = () => {
  const link = buildShareLink();
  elements.shareLink.value = link;
  drawQr(link);
};

const drawQr = (link) => {
  if (!elements.qrCanvas) return;
  const ctx = elements.qrCanvas.getContext("2d");
  ctx.clearRect(0, 0, elements.qrCanvas.width, elements.qrCanvas.height);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    ctx.drawImage(img, 0, 0, elements.qrCanvas.width, elements.qrCanvas.height);
  };
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    link
  )}`;
};

const getPool = (type) => {
  const options = {
    level: state.level,
    type,
    mode: state.mode,
    filters: state.filters,
    blockedWords: state.blockedWords,
    keyword: state.keyword
  };
  let filtered = filterItems(itemsCache, options);
  if (!filtered.length) {
    filtered = filterItems(getFallbackItems(itemsCache, options), options);
  }
  return filtered;
};

const updateWarning = () => {
  const truthPool = getPool("truth");
  const darePool = getPool("dare");
  const show = truthPool.length < 6 || darePool.length < 6;
  elements.poolWarning.hidden = !show;
};

const updateActionState = () => {
  const truthPool = getPool("truth");
  const darePool = getPool("dare");
  elements.drawTruth.disabled = !truthPool.length;
  elements.drawDare.disabled = !darePool.length;
  elements.drawRandom.disabled = !truthPool.length && !darePool.length;
  elements.swapItem.disabled = !currentItem;
  elements.likeItem.disabled = !currentItem;
  elements.dislikeItem.disabled = !currentItem;
  elements.copyItem.disabled = !currentItem;
};

const pushHistory = (item) => {
  if (state.history[0]?.id === item.id) return;
  const entry = {
    id: item.id,
    timestamp: new Date().toISOString(),
    type: item.type,
    level: item.level,
    mode: state.mode,
    text: item.text
  };
  state.history.unshift(entry);
  state.history = state.history.slice(0, 30);
};

const updateRecent = (itemId) => {
  state.recentIds = state.recentIds.filter((id) => id !== itemId);
  state.recentIds.unshift(itemId);
  state.recentIds = state.recentIds.slice(0, state.noRepeat);
  state.lastItemId = itemId;
};

const renderHistory = () => {
  if (!state.history.length) {
    elements.historyList.innerHTML = "<div class=\"history-empty\">Sem histórico ainda.</div>";
    return;
  }
  elements.historyList.innerHTML = state.history
    .map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      return `
        <div class="history-item">
          <div class="history-meta">${levelLabels[entry.level]} • ${modeLabels[entry.mode]} • ${
        entry.type === "truth" ? "Verdade" : "Desafio"
      } • ${time}</div>
          <div class="history-text">${entry.text}</div>
        </div>
      `;
    })
    .join("");
};

const renderBlockedWords = () => {
  if (!state.blockedWords.length) {
    elements.blockedList.innerHTML = "<span class=\"muted\">Nenhuma palavra bloqueada.</span>";
    return;
  }
  elements.blockedList.innerHTML = state.blockedWords
    .map(
      (word) => `
        <button class="chip" data-word="${word}" aria-label="Remover palavra bloqueada">
          ${word} <span aria-hidden="true">×</span>
        </button>
      `
    )
    .join("");
};

const updateCard = (item) => {
  currentItem = item;
  elements.itemType.textContent = item.type === "truth" ? "Verdade" : "Desafio";
  elements.itemMeta.textContent = `${levelLabels[item.level]} • ${modeLabels[state.mode]}`;
  elements.itemText.innerHTML = highlightText(item.text, state.keyword);
  elements.card.classList.remove("card-animate");
  void elements.card.offsetWidth;
  elements.card.classList.add("card-animate");
};

const drawItem = (type) => {
  const pool = getPool(type);
  if (!pool.length) return;
  const item = pickWeighted(pool, state.feedbackScores, {
    recentIds: state.recentIds,
    lastId: state.lastItemId
  });
  if (!item) return;
  updateCard(item);
  pushHistory(item);
  updateRecent(item.id);
  renderHistory();
  updateWarning();
  updateActionState();
  saveState(state);
};

const swapCurrent = () => {
  if (!currentItem) return;
  const pool = getPool(currentItem.type);
  const next = pickEquivalent(pool, currentItem, state.feedbackScores, {
    recentIds: state.recentIds,
    lastId: state.lastItemId
  });
  if (!next) return;
  updateCard(next);
  pushHistory(next);
  updateRecent(next.id);
  renderHistory();
  updateWarning();
  updateActionState();
  saveState(state);
};

const applyFeedback = (delta) => {
  if (!currentItem) return;
  state.feedbackScores[currentItem.id] = updateScore(
    state.feedbackScores[currentItem.id],
    delta
  );
  saveState(state);
};

const copyCurrentItem = () => {
  if (!currentItem) return;
  navigator.clipboard.writeText(currentItem.text);
};

const copyHistory = () => {
  const text = state.history
    .map(
      (entry) =>
        `${levelLabels[entry.level]} | ${modeLabels[entry.mode]} | ${
          entry.type === "truth" ? "Verdade" : "Desafio"
        } | ${entry.text}`
    )
    .join("\n");
  navigator.clipboard.writeText(text);
};

const clearHistory = () => {
  state.history = [];
  renderHistory();
  saveState(state);
};

const resetRepetition = () => {
  state.recentIds = [];
  state.lastItemId = null;
  saveState(state);
};

const exportPdf = () => {
  const win = window.open("", "_blank");
  if (!win) return;
  const historyList = state.history.slice(0, 30);
  const filterParts = [];
  if (state.filters.noOral) filterParts.push("sem oral");
  if (state.filters.noDom) filterParts.push("sem dominacao");
  if (state.filters.noNudez) filterParts.push("sem nudez");
  const settings = `
    <ul>
      <li>Nível: ${levelLabels[state.level]}</li>
      <li>Modo: ${modeLabels[state.mode]}</li>
      <li>Filtros: ${filterParts.length ? filterParts.join(", ") : "sem filtros"}</li>
      <li>Antirrepetição: ${state.noRepeat}</li>
      <li>Tema: ${state.theme}</li>
    </ul>
  `;
  const entries = historyList
    .map(
      (entry) => `<li><strong>${entry.type === "truth" ? "Verdade" : "Desafio"}:</strong> ${
        entry.text
      }</li>`
    )
    .join("");
  win.document.write(`
    <html>
      <head>
        <title>Fogo & Seda - Histórico</title>
        <style>
          body { font-family: "Georgia", serif; padding: 32px; line-height: 1.4; }
          h1 { margin-bottom: 4px; }
          h2 { margin-top: 24px; }
          ul { padding-left: 18px; }
        </style>
      </head>
      <body>
        <h1>Fogo & Seda - Verdade ou Consequência</h1>
        <div>${new Date().toLocaleString("pt-BR")}</div>
        <h2>Configurações</h2>
        ${settings}
        <h2>Histórico recente</h2>
        <ol>${entries || "<li>Sem itens ainda.</li>"}</ol>
        <h2>18+ e consentimento</h2>
        <p>Este jogo é para maiores de 18. Consentimento explícito e limites claros são obrigatórios.</p>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
};

const handleFilterChange = () => {
  updateWarning();
  updateActionState();
  updateShareLink();
  if (currentItem && !getPool(currentItem.type).some((item) => item.id === currentItem.id)) {
    swapCurrent();
  }
  saveState(state);
};

const setupListeners = () => {
  elements.drawTruth.addEventListener("click", () => drawItem("truth"));
  elements.drawDare.addEventListener("click", () => drawItem("dare"));
  elements.drawRandom.addEventListener("click", () =>
    drawItem(Math.random() < 0.5 ? "truth" : "dare")
  );
  elements.swapItem.addEventListener("click", swapCurrent);
  elements.reshuffle.addEventListener("click", () => {
    resetRepetition();
    updateWarning();
  });
  elements.likeItem.addEventListener("click", () => applyFeedback(1));
  elements.dislikeItem.addEventListener("click", () => applyFeedback(-1));
  elements.copyItem.addEventListener("click", copyCurrentItem);
  elements.copyHistory.addEventListener("click", copyHistory);
  elements.clearHistory.addEventListener("click", clearHistory);
  elements.exportPdf.addEventListener("click", exportPdf);
  elements.blockKeyword.addEventListener("click", () => {
    const word = state.keyword.trim();
    if (!word) return;
    if (!state.blockedWords.includes(word)) state.blockedWords.push(word);
    state.keyword = "";
    elements.keywordSearch.value = "";
    renderBlockedWords();
    handleFilterChange();
  });
  elements.blockedList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-word]");
    if (!button) return;
    const word = button.dataset.word;
    state.blockedWords = state.blockedWords.filter((item) => item !== word);
    renderBlockedWords();
    handleFilterChange();
  });
  elements.keywordSearch.addEventListener("input", () => {
    state.keyword = elements.keywordSearch.value;
    updateWarning();
    if (currentItem && !includesNormalized(currentItem.text, state.keyword)) {
      swapCurrent();
    } else if (currentItem) {
      elements.itemText.innerHTML = highlightText(currentItem.text, state.keyword);
    }
    saveState(state);
  });
  elements.filterOral.addEventListener("change", () => {
    state.filters.noOral = elements.filterOral.checked;
    handleFilterChange();
  });
  elements.filterDom.addEventListener("change", () => {
    state.filters.noDom = elements.filterDom.checked;
    handleFilterChange();
  });
  elements.filterNudez.addEventListener("change", () => {
    state.filters.noNudez = elements.filterNudez.checked;
    handleFilterChange();
  });
  elements.levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.level = button.dataset.level;
      updateControls();
      handleFilterChange();
    });
  });
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      updateControls();
      handleFilterChange();
    });
  });
  elements.noRepeat.addEventListener("input", () => {
    state.noRepeat = Number.parseInt(elements.noRepeat.value, 10);
    elements.noRepeatValue.textContent = String(state.noRepeat);
    state.recentIds = state.recentIds.slice(0, state.noRepeat);
    saveState(state);
  });
  elements.themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = button.dataset.theme;
      updateTheme();
      updateShareLink();
      saveState(state);
    });
  });
  elements.copyShare.addEventListener("click", () => {
    navigator.clipboard.writeText(elements.shareLink.value);
  });
  elements.relaxFilters.addEventListener("click", () => {
    state.filters = { noOral: false, noDom: false, noNudez: false };
    state.keyword = "";
    updateControls();
    handleFilterChange();
  });
  elements.switchLevel.addEventListener("click", () => {
    state.level = "leve";
    updateControls();
    handleFilterChange();
  });
  elements.openSettings.addEventListener("click", () => {
    elements.settingsPanel.classList.add("open");
    elements.settingsBackdrop.hidden = false;
  });
  elements.closeSettings.addEventListener("click", () => {
    elements.settingsPanel.classList.remove("open");
    elements.settingsBackdrop.hidden = true;
  });
  elements.settingsBackdrop.addEventListener("click", () => {
    elements.settingsPanel.classList.remove("open");
    elements.settingsBackdrop.hidden = true;
  });
  window.addEventListener("keydown", (event) => {
    const target = event.target;
    const isField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable;
    if (isField) return;
    if (event.code === "Space") {
      event.preventDefault();
      drawItem(Math.random() < 0.5 ? "truth" : "dare");
    }
    if (event.key.toLowerCase() === "v") drawItem("truth");
    if (event.key.toLowerCase() === "d") drawItem("dare");
    if (event.key.toLowerCase() === "r") resetRepetition();
    if (event.key === "Escape") {
      elements.settingsPanel.classList.remove("open");
      elements.settingsBackdrop.hidden = true;
    }
  });
};

const init = async () => {
  const response = await fetch("data/items.json");
  const data = await response.json();
  const { validItems, errors } = validateItems(data);
  if (errors.length) {
    console.warn("Itens com problemas:", errors);
  }
  itemsCache = validItems;
  applyQueryParams();
  updateControls();
  renderHistory();
  updateWarning();
  updateActionState();
  setupListeners();
  saveState(state);
};

init();
