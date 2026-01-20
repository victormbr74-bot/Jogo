import { loadState, saveState, loadCollection, saveCollection } from "../utils/storage.js";
import { clamp, pickMany, pickOne, randInt } from "../utils/random.js";
import { validateActions, validateCards, withBans } from "../utils/validation.js";
import { BoardRenderer } from "./boardRenderer.js";
import { bindModal, closeModal, openModal } from "./modals.js";
import { initTopbar } from "./topbar.js";
import { initCurrentActionBox } from "./currentActionBox.js";
import { initBottomSheets, openSheet } from "./bottomSheet.js";
import { initBottomTabs } from "./bottomTabs.js";

const USER_ACTIONS_KEY = "user_actions_v1";
const USER_NORMAL_KEY = "user_cards_normal_v1";
const USER_EVENT6_KEY = "user_cards_event6_v1";

const PLAYER_COLORS = ["#F05B5B", "#F7B34A", "#75C4AD", "#7C6AF2", "#F2E88B", "#72B7FF"];

const DEFAULTS = {
  players: [
    {
      id: "p1",
      name: "Jogador 1",
      color: PLAYER_COLORS[0],
      position: 1,
      score: 0,
      blockedRounds: 0,
      interactionBlocked: false
    },
    {
      id: "p2",
      name: "Jogador 2",
      color: PLAYER_COLORS[1],
      position: 1,
      score: 0,
      blockedRounds: 0,
      interactionBlocked: false
    }
  ],
  currentPlayerIndex: 0,
  filters: { noNudez: false, noDom: false, noOral: false },
  hunterColor: "#e04f5f",
  history: [],
  gameOver: false
};

const state = loadState(DEFAULTS);

state.players = state.players.map((player, index) => ({
  id: player.id || `p${index + 1}`,
  name: player.name || `Jogador ${index + 1}`,
  color: player.color || PLAYER_COLORS[index % PLAYER_COLORS.length],
  position: player.position || 1,
  score: player.score || 0,
  blockedRounds: player.blockedRounds || 0,
  interactionBlocked: Boolean(player.interactionBlocked)
}));
state.currentPlayerIndex = clamp(
  state.currentPlayerIndex || 0,
  0,
  Math.max(state.players.length - 1, 0)
);
state.pendingEvent = null;
state.modalOpen = false;

const elements = {
  currentPlayerName: document.getElementById("currentPlayerName"),
  zoneBadge: document.getElementById("zoneBadge"),
  turnStatus: document.getElementById("turnStatus"),
  rollDice: document.getElementById("rollDice"),
  diceValue: document.getElementById("diceValue"),
  boardWrap: document.getElementById("boardWrap"),
  boardSvg: document.getElementById("boardSvg"),
  centerPlayer: document.getElementById("centerPlayer"),
  normalDeck: document.getElementById("normalDeck"),
  event6Deck: document.getElementById("event6Deck"),
  normalDeckCount: document.getElementById("normalDeckCount"),
  event6DeckCount: document.getElementById("event6DeckCount"),
  leaderboardList: document.getElementById("leaderboardList"),
  currentActionBox: document.getElementById("currentActionBox"),
  currentActionBadge: document.getElementById("currentActionBadge"),
  currentActionKind: document.getElementById("currentActionKind"),
  currentActionText: document.getElementById("currentActionText"),
  currentActionZone: document.getElementById("currentActionZone"),
  currentActionMandatory: document.getElementById("currentActionMandatory"),
  currentActionPenalty: document.getElementById("currentActionPenalty"),
  currentActionExpand: document.getElementById("currentActionExpand"),
  actionIcon: document.getElementById("actionIcon"),
  actionType: document.getElementById("actionType"),
  actionMeta: document.getElementById("actionMeta"),
  actionText: document.getElementById("actionText"),
  actionMandatory: document.getElementById("actionMandatory"),
  actionPenalty: document.getElementById("actionPenalty"),
  actionCard: document.getElementById("actionCard"),
  actionExecute: document.getElementById("actionExecute"),
  actionRefuse: document.getElementById("actionRefuse"),
  actionWarning: document.getElementById("actionWarning"),
  relaxFilters: document.getElementById("relaxFilters"),
  historyList: document.getElementById("historyList"),
  exportPdf: document.getElementById("exportPdf"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  settingsModal: document.getElementById("settingsModal"),
  deckModal: document.getElementById("deckModal"),
  cardsModal: document.getElementById("cardsModal"),
  editModal: document.getElementById("editModal"),
  resetModal: document.getElementById("resetModal"),
  openSettings: document.getElementById("openSettings"),
  resetTop: document.getElementById("resetTop"),
  resetGame: document.getElementById("resetGame"),
  resetConfirm: document.getElementById("resetConfirm"),
  resetCancel: document.getElementById("resetCancel"),
  resetTotal: document.getElementById("resetTotal"),
  playersList: document.getElementById("playersList"),
  addPlayer: document.getElementById("addPlayer"),
  removePlayer: document.getElementById("removePlayer"),
  noNudez: document.getElementById("noNudez"),
  noDom: document.getElementById("noDom"),
  noOral: document.getElementById("noOral"),
  openDeckEditor: document.getElementById("openDeckEditor"),
  actionsList: document.getElementById("actionsList"),
  normalCardsList: document.getElementById("normalCardsList"),
  event6CardsList: document.getElementById("event6CardsList"),
  addAction: document.getElementById("addAction"),
  addNormalCard: document.getElementById("addNormalCard"),
  addEvent6Card: document.getElementById("addEvent6Card"),
  exportDeck: document.getElementById("exportDeck"),
  importDeck: document.getElementById("importDeck"),
  cardsGrid: document.getElementById("cardsGrid"),
  editTitle: document.getElementById("editTitle"),
  editForm: document.getElementById("editForm"),
  editId: document.getElementById("editId"),
  editKind: document.getElementById("editKind"),
  editText: document.getElementById("editText"),
  editZone: document.getElementById("editZone"),
  editCategory: document.getElementById("editCategory"),
  editCategoryRow: document.getElementById("editCategoryRow"),
  editIconRow: document.getElementById("editIconRow"),
  editIcon: document.getElementById("editIcon"),
  editMandatoryRow: document.getElementById("editMandatoryRow"),
  editMandatory: document.getElementById("editMandatory"),
  banNudez: document.getElementById("banNudez"),
  banDom: document.getElementById("banDom"),
  banOral: document.getElementById("banOral")
};

let boardData = null;
let actions = [];
let normalCards = [];
let event6Cards = [];
let renderer = null;
let actionQueue = [];
let currentRoll = null;
let filterWarning = false;
let pendingCardChoices = null;
let pendingCardResolve = null;

const DEBUG = false;
const debugLog = (...args) => {
  if (!DEBUG) return;
  console.log(...args);
};

const zoneLabel = (zone) => {
  if (zone === "quente") return "Zona Quente";
  if (zone === "final") return "Zona Final";
  return "Zona Leve";
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "").trim();
  if (![3, 6].includes(clean.length)) return null;
  const value = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = Number.parseInt(value, 16);
  if (Number.isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

const getTextOnAccent = (rgb) => {
  if (!rgb) return "#0d0b0e";
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luminance > 0.6 ? "#0d0b0e" : "#f6f2f7";
};

const applyTheme = (theme = {}) => {
  const accent = theme.accent || state.hunterColor || "#e04f5f";
  const accent2 = theme.accent2 || "#ff7b57";
  const accent3 = theme.accent3 || "#f6c86a";
  const rgb = hexToRgb(accent);
  const root = document.documentElement.style;
  root.setProperty("--accent", accent);
  root.setProperty("--accent-2", accent2);
  root.setProperty("--accent-3", accent3);
  root.setProperty("--accent-rgb", rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "224, 79, 95");
  root.setProperty("--text-on-accent", getTextOnAccent(rgb));
  state.hunterColor = accent;
  saveState(state);
  if (renderer) renderer.refreshTheme();
  renderLeaderboard();
  renderPendingEvent();
  window.dispatchEvent(new CustomEvent("themechange", { detail: { accent, accent2, accent3 } }));
};

window.applyTheme = applyTheme;

const matchesFilters = (item) => {
  if (state.filters.noNudez && item.bans?.nudez) return false;
  if (state.filters.noDom && item.bans?.dominacao) return false;
  if (state.filters.noOral && item.bans?.oral) return false;
  return true;
};

const pickFromPool = (pool, zone) => {
  const zonePool = pool.filter((item) => item.zone === zone);
  const filtered = zonePool.filter(matchesFilters);
  if (filtered.length) return { item: pickOne(filtered), warning: false };
  if (zonePool.length) return { item: pickOne(zonePool), warning: true };
  const fallback = pool.filter(matchesFilters);
  if (fallback.length) return { item: pickOne(fallback), warning: true };
  return { item: null, warning: true };
};

const buildActionFromTile = (tile) => {
  if (tile.type === "verdade") {
    const result = pickFromPool(actions.filter((item) => item.category === "verdade"), tile.zone);
    if (!result.item) return null;
    return {
      ...result.item,
      source: "tile",
      type: "verdade",
      zone: tile.zone,
      warning: result.warning
    };
  }
  if (tile.type === "desafio") {
    const result = pickFromPool(actions.filter((item) => item.category === "desafio"), tile.zone);
    if (!result.item) return null;
    return {
      ...result.item,
      source: "tile",
      type: "desafio",
      zone: tile.zone,
      warning: result.warning
    };
  }
  if (tile.type === "acao_visual") {
    const result = pickFromPool(
      actions.filter((item) => item.category === "acao_visual"),
      tile.zone
    );
    if (!result.item) return null;
    return {
      ...result.item,
      source: "tile",
      type: "acao_visual",
      zone: tile.zone,
      warning: result.warning
    };
  }
  if (tile.type === "especial") {
    const special = tile.special || { action: "advance", steps: 1 };
    const textMap = {
      advance: `Avance ${special.steps || 1} casas agora.`,
      back: `Volte ${special.steps || 1} casas agora.`,
      repeat: "Repita a ultima acao executada."
    };
    return {
      id: `special-${tile.id}`,
      source: "special",
      type: "especial",
      zone: tile.zone,
      text: textMap[special.action] || "Acao especial agora.",
      icon: "✨",
      mandatory: true,
      special
    };
  }
  return null;
};

const getTile = (id) => boardData.tiles.find((tile) => tile.id === id);

const updateActionCard = (action) => {
  if (!action) {
    elements.actionIcon.textContent = "✨";
    elements.actionType.textContent = "Pronto para jogar";
    elements.actionMeta.textContent = "Rolar o dado para comecar";
    elements.actionText.textContent = "As instrucoes aparecem aqui.";
    elements.actionMandatory.hidden = true;
    elements.actionWarning.hidden = true;
    elements.actionExecute.disabled = true;
    elements.actionRefuse.disabled = true;
    return;
  }
  elements.actionIcon.textContent = action.icon || "🎯";
  elements.actionType.textContent = action.type?.toUpperCase() || "ACAO";
  elements.actionMeta.textContent = action.source === "event6" ? "Carta Evento 6" : "Acao atual";
  elements.actionText.textContent = action.text || "Acao atual";
  elements.actionMandatory.hidden = !action.mandatory;
  elements.actionExecute.disabled = Boolean(action.readOnly);
  elements.actionRefuse.disabled = Boolean(action.readOnly);
  elements.actionWarning.hidden = !filterWarning;
};

const setPendingEvent = (action) => {
  state.pendingEvent = action ? { ...action } : null;
  renderPendingEvent();
};

const broadcastActionChange = () => {
  window.dispatchEvent(new CustomEvent("actionchange", { detail: state.pendingEvent }));
};

const renderPendingEvent = () => {
  updateActionCard(state.pendingEvent);
  debugLog("pendingEvent", state.pendingEvent);
  broadcastActionChange();
};

const pushHistory = (entry) => {
  state.history.unshift(entry);
  state.history = state.history.slice(0, 30);
  saveState(state);
  renderHistory();
};

const renderHistory = () => {
  if (!state.history.length) {
    elements.historyList.innerHTML = "<div class=\"history-item\">Sem historico ainda.</div>";
    return;
  }
  elements.historyList.innerHTML = state.history
    .map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      const status = entry.refused ? "Recusado" : "Executado";
      return `
        <div class="history-item">
          <strong>${entry.player}</strong> | ${time} | Dado: ${entry.roll ?? "-"} | Casa ${
        entry.tileId ?? "-"
      } | ${status}<br />
          ${entry.text}
        </div>
      `;
    })
    .join("");
};

const updatePlayersUI = () => {
  elements.playersList.innerHTML = state.players
    .map(
      (player, index) => `
        <div class="player-row">
          <div class="player-chip" style="background:${player.color}">${index + 1}</div>
          <input data-player-id="${player.id}" value="${player.name}" />
          <small>${
            player.blockedRounds
              ? "Bloqueado (" + player.blockedRounds + ")"
              : player.interactionBlocked
              ? "Sem interacao"
              : ""
          }</small>
        </div>
      `
    )
    .join("");
};

const renderLeaderboard = () => {
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  const leaderScore = sorted.length ? sorted[0].score : 0;
  elements.leaderboardList.innerHTML = sorted
    .map((player, index) => {
      const isLeader = leaderScore > 0 && player.score === leaderScore;
      const isBlocked = player.blockedRounds > 0 || player.interactionBlocked;
      const status = isBlocked ? `<span class="leaderboard-status">Bloqueado</span>` : "";
      return `
        <div class="leaderboard-item ${isLeader ? "is-leader" : ""} ${
        isBlocked ? "is-blocked" : ""
      }">
          <div class="leaderboard-rank">${index + 1}</div>
          <div class="leaderboard-name">${player.name}${status}</div>
          <div class="leaderboard-score">${player.score}</div>
        </div>
      `;
    })
    .join("");
};

const updateDeckCounts = () => {
  if (elements.normalDeckCount) elements.normalDeckCount.textContent = String(normalCards.length);
  if (elements.event6DeckCount) elements.event6DeckCount.textContent = String(event6Cards.length);
};

const animateDeckDraw = (deckEl) => {
  if (!deckEl) return;
  deckEl.classList.remove("is-drawing");
  void deckEl.offsetWidth;
  deckEl.classList.add("is-drawing");
};

const updateTurnUI = () => {
  const player = state.players[state.currentPlayerIndex];
  const tile = getTile(player.position);
  if (player.blockedRounds === 0) {
    player.interactionBlocked = false;
  }
  elements.currentPlayerName.textContent = player.name;
  elements.zoneBadge.textContent = zoneLabel(tile.zone);
  elements.turnStatus.textContent = player.blockedRounds
    ? "Bloqueado (1 rodada). Clique rolar para passar."
    : "";
  elements.rollDice.disabled = Boolean(state.pendingEvent) || state.gameOver;
  if (renderer) renderer.setActiveTile(player.position);
  renderLeaderboard();
};


const rollDice = async () => {
  const player = state.players[state.currentPlayerIndex];
  if (player.blockedRounds > 0) {
    player.blockedRounds = Math.max(0, player.blockedRounds - 1);
    advanceTurn();
    saveState(state);
    return;
  }
  if (state.pendingEvent || state.gameOver) return;
  elements.rollDice.disabled = true;
  elements.diceValue.textContent = "🎲";
  const cycles = randInt(8, 12);
  for (let i = 0; i < cycles; i += 1) {
    elements.diceValue.textContent = String(randInt(1, 6));
    await wait(70);
  }
  const roll = randInt(1, 6);
  currentRoll = roll;
  elements.diceValue.textContent = String(roll);
  const maxId = Math.max(...boardData.tiles.map((tile) => tile.id));
  const destination = clamp(player.position + roll, 1, maxId);
  renderer.setPreviewTile(destination);
  await movePlayer(player, roll);
  const tile = getTile(player.position);
  await resolveTile(tile, roll);
  renderer.clearPreview();
  updateTurnUI();
};

// Use rAF stepping to avoid full rerenders and reduce layout thrash while moving.
const movePlayer = (player, steps, direction = 1) =>
  new Promise((resolve) => {
    const maxId = Math.max(...boardData.tiles.map((tile) => tile.id));
    const stepDuration = 260;
    let stepIndex = 0;
    let lastStepTime = null;

    const tick = (time) => {
      if (!lastStepTime) lastStepTime = time;
      if (time - lastStepTime >= stepDuration) {
        player.position = clamp(player.position + direction, 1, maxId);
        renderer.updateTokens(state.players);
        renderer.setActiveTile(player.position);
        stepIndex += 1;
        lastStepTime = time;
      }
      if (stepIndex < steps) {
        requestAnimationFrame(tick);
        return;
      }
      resolve();
    };

    requestAnimationFrame(tick);
  });

const resolveTile = async (tile, roll) => {
  if (!tile) return;
  debugLog("tile", tile, "roll", roll);
  if (tile.type === "finish") {
    state.gameOver = true;
    actionQueue = [];
    setPendingEvent({
      id: "finish",
      source: "finish",
      type: "fim",
      text: "Fim de jogo. Jogador venceu.",
      icon: "🏁",
      mandatory: false,
      readOnly: true
    });
    return;
  }
  if (tile.type === "comprar_carta") {
    await openCardsChoice(tile);
  } else {
    const action = buildActionFromTile(tile);
    queueAction(action);
  }
  if (roll === 6) {
    const eventCard = pickFromPool(event6Cards, tile.zone);
    if (eventCard.item) {
      animateDeckDraw(elements.event6Deck);
      queueAction({
        ...eventCard.item,
        source: "event6",
        mandatory: true,
        warning: eventCard.warning
      });
    } else {
      filterWarning = true;
    }
  }
  processNextAction();
};

const queueAction = (action) => {
  if (!action) return;
  actionQueue.push({ ...action });
};

const processNextAction = () => {
  if (state.pendingEvent) return;
  if (!actionQueue.length) return;
  const nextAction = actionQueue.shift();
  filterWarning = Boolean(nextAction.warning);
  setPendingEvent(nextAction);
};

const openCardsChoice = (tile) =>
  new Promise((resolve) => {
    const pool = normalCards.filter((card) => card.zone === tile.zone);
    const filtered = pool.filter(matchesFilters);
    const selection = filtered.length ? filtered : pool;
    filterWarning = filtered.length === 0;
    const choices = pickMany(selection, 3);
    if (!choices.length) {
      filterWarning = true;
      resolve(null);
      return;
    }
    animateDeckDraw(elements.normalDeck);
    pendingCardChoices = choices;
    pendingCardResolve = (selected) => {
      state.modalOpen = false;
      closeModal(elements.cardsModal, elements.modalBackdrop);
      if (selected) {
        queueAction({ ...selected, source: "normal", mandatory: false, warning: filterWarning });
      }
      resolve(selected);
      pendingCardChoices = null;
      pendingCardResolve = null;
    };
    elements.cardsGrid.innerHTML = choices
      .map(
        (card, index) => `
          <div class="card-choice" data-id="${card.id}" style="animation-delay:${index * 80}ms">
            <strong>${card.type?.toUpperCase() || "CARTA"}</strong>
            <p>${card.text}</p>
          </div>
        `
      )
      .join("");
    state.modalOpen = true;
    openModal(elements.cardsModal, elements.modalBackdrop);
    elements.cardsGrid.querySelectorAll(".card-choice").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const selected = choices.find((card) => card.id === cardEl.dataset.id);
        pendingCardResolve(selected);
      });
    });
  });

const applyPenalty = async (player) => {
  await movePlayer(player, 3, -1);
  player.blockedRounds = 1;
  player.interactionBlocked = true;
  return "Penalidade: voltou 3 casas, perdeu 1 rodada e ficou sem interacao.";
};

const resolveAction = async (refused) => {
  if (!state.pendingEvent) return;
  const player = state.players[state.currentPlayerIndex];
  const tile = getTile(player.position);
  let penaltyNote = "";
  if (refused) {
    penaltyNote = await applyPenalty(player);
    player.score = Math.max(0, player.score - 1);
  } else if (state.pendingEvent.source === "special" && state.pendingEvent.special) {
    if (state.pendingEvent.special.action === "advance") {
      await movePlayer(player, state.pendingEvent.special.steps || 1);
      const landed = getTile(player.position);
      if (landed.type === "finish") {
        state.gameOver = true;
        actionQueue = [];
        queueAction({
          id: "finish",
          source: "finish",
          type: "fim",
          text: "Fim de jogo. Jogador venceu.",
          icon: "🏁",
          mandatory: false,
          readOnly: true
        });
      } else if (landed.type === "comprar_carta") {
        await openCardsChoice(landed);
      } else {
        queueAction(buildActionFromTile(landed));
      }
    }
    if (state.pendingEvent.special.action === "back") {
      await movePlayer(player, state.pendingEvent.special.steps || 1, -1);
      const landed = getTile(player.position);
      if (landed.type === "finish") {
        state.gameOver = true;
        actionQueue = [];
        queueAction({
          id: "finish",
          source: "finish",
          type: "fim",
          text: "Fim de jogo. Jogador venceu.",
          icon: "🏁",
          mandatory: false,
          readOnly: true
        });
      } else if (landed.type === "comprar_carta") {
        await openCardsChoice(landed);
      } else {
        queueAction(buildActionFromTile(landed));
      }
    }
  }
  if (!refused) {
    player.score += state.pendingEvent?.mandatory ? 3 : 2;
  }
  renderLeaderboard();
  pushHistory({
    timestamp: new Date().toISOString(),
    player: player.name,
    roll: currentRoll,
    tileId: tile?.id,
    tileType: tile?.type,
    text: refused && penaltyNote
      ? `${state.pendingEvent.text} (${penaltyNote})`
      : state.pendingEvent.text,
    refused
  });
  setPendingEvent(null);
  processNextAction();
  if (!state.pendingEvent) advanceTurn();
};

const advanceTurn = () => {
  currentRoll = null;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  saveState(state);
  updateTurnUI();
  updatePlayersUI();
  renderLeaderboard();
};

const resetGameState = (resetTotal = false) => {
  state.gameOver = false;
  state.currentPlayerIndex = 0;
  state.history = [];
  state.pendingEvent = null;
  state.modalOpen = false;
  currentRoll = null;
  filterWarning = false;
  actionQueue = [];
  pendingCardChoices = null;
  pendingCardResolve = null;
  state.players = state.players.map((player, index) => ({
    ...player,
    name: resetTotal ? `Jogador ${index + 1}` : player.name,
    position: 1,
    score: 0,
    blockedRounds: 0,
    interactionBlocked: false
  }));
  if (resetTotal) {
    state.filters = { noNudez: false, noDom: false, noOral: false };
    elements.noNudez.checked = false;
    elements.noDom.checked = false;
    elements.noOral.checked = false;
  }
  saveState(state);
  if (renderer) {
    renderer.createTokens(state.players.map((p, i) => ({ ...p, label: String(i + 1) })));
    renderer.updateTokens(state.players);
    renderer.setActiveTile(1);
  }
  elements.diceValue.textContent = "-";
  renderPendingEvent();
  updatePlayersUI();
  updateTurnUI();
  renderHistory();
  renderLeaderboard();
};

const centerOnPlayer = () => {
  const player = state.players[state.currentPlayerIndex];
  const tile = getTile(player.position);
  if (!tile) return;
  const rect = elements.boardWrap.getBoundingClientRect();
  const svgRect = elements.boardSvg.getBoundingClientRect();
  const boardSize = renderer.getBoardSize();
  const center = renderer.getTileCenterById(tile.id);
  if (!center) return;
  const scaleX = svgRect.width / boardSize.width;
  const scaleY = svgRect.height / boardSize.height;
  const x = center.x * scaleX;
  const y = center.y * scaleY;
  elements.boardWrap.scrollTo({
    left: x - rect.width / 2,
    top: y - rect.height / 2,
    behavior: "smooth"
  });
};

const renderDeckEditor = () => {
  elements.actionsList.innerHTML = actions
    .map(
      (item) => `
        <div class="editor-item" data-kind="action" data-id="${item.id}">
          <div>
            <strong>${item.category}</strong> <small>${item.zone}</small>
            <div>${item.text}</div>
          </div>
          <div>
            <button class="btn ghost" data-edit>Editar</button>
            <button class="btn ghost" data-duplicate>Duplicar</button>
            ${item.user ? "<button class=\"btn ghost\" data-remove>Remover</button>" : ""}
          </div>
        </div>
      `
    )
    .join("");

  elements.normalCardsList.innerHTML = normalCards
    .map(
      (item) => `
        <div class="editor-item" data-kind="normal" data-id="${item.id}">
          <div>
            <strong>${item.type || "normal"}</strong> <small>${item.zone}</small>
            <div>${item.text}</div>
          </div>
          <div>
            <button class="btn ghost" data-edit>Editar</button>
            <button class="btn ghost" data-duplicate>Duplicar</button>
            ${item.user ? "<button class=\"btn ghost\" data-remove>Remover</button>" : ""}
          </div>
        </div>
      `
    )
    .join("");

  elements.event6CardsList.innerHTML = event6Cards
    .map(
      (item) => `
        <div class="editor-item" data-kind="event6" data-id="${item.id}">
          <div>
            <strong>${item.type || "evento"}</strong> <small>${item.zone}</small>
            <div>${item.text}</div>
          </div>
          <div>
            <button class="btn ghost" data-edit>Editar</button>
            <button class="btn ghost" data-duplicate>Duplicar</button>
            ${item.user ? "<button class=\"btn ghost\" data-remove>Remover</button>" : ""}
          </div>
        </div>
      `
    )
    .join("");
};

const openEditModal = (kind, item) => {
  elements.editKind.value = kind;
  elements.editId.value = item?.id || "";
  elements.editText.value = item?.text || "";
  elements.editZone.value = item?.zone || "leve";
  elements.editCategory.value = item?.category || "verdade";
  elements.editIcon.value = item?.icon || "";
  elements.editMandatory.checked = Boolean(item?.mandatory);
  elements.banNudez.checked = Boolean(item?.bans?.nudez);
  elements.banDom.checked = Boolean(item?.bans?.dominacao);
  elements.banOral.checked = Boolean(item?.bans?.oral);
  const isAction = kind === "action";
  elements.editCategoryRow.style.display = isAction ? "grid" : "none";
  elements.editIconRow.style.display = isAction ? "grid" : "none";
  elements.editMandatoryRow.style.display = isAction ? "grid" : "none";
  elements.editTitle.textContent = item ? "Editar item" : "Adicionar item";
  openModal(elements.editModal, elements.modalBackdrop);
};

const applyEdits = (payload) => {
  if (payload.kind === "action") {
    const userActions = loadCollection(USER_ACTIONS_KEY, []);
    const existingIndex = userActions.findIndex((item) => item.id === payload.id);
    if (existingIndex >= 0) userActions[existingIndex] = payload.item;
    else userActions.push(payload.item);
    saveCollection(USER_ACTIONS_KEY, userActions);
  }
  if (payload.kind === "normal") {
    const userCards = loadCollection(USER_NORMAL_KEY, []);
    const existingIndex = userCards.findIndex((item) => item.id === payload.id);
    if (existingIndex >= 0) userCards[existingIndex] = payload.item;
    else userCards.push(payload.item);
    saveCollection(USER_NORMAL_KEY, userCards);
  }
  if (payload.kind === "event6") {
    const userCards = loadCollection(USER_EVENT6_KEY, []);
    const existingIndex = userCards.findIndex((item) => item.id === payload.id);
    if (existingIndex >= 0) userCards[existingIndex] = payload.item;
    else userCards.push(payload.item);
    saveCollection(USER_EVENT6_KEY, userCards);
  }
  reloadCollections();
};

const reloadCollections = async () => {
  const baseActions = await fetch("data/actions.json").then((res) => res.json());
  const baseNormal = await fetch("data/normal_cards.json").then((res) => res.json());
  const baseEvent6 = await fetch("data/event6_cards.json").then((res) => res.json());
  const userActions = loadCollection(USER_ACTIONS_KEY, []).map((item) => ({ ...item, user: true }));
  const userNormal = loadCollection(USER_NORMAL_KEY, []).map((item) => ({ ...item, user: true }));
  const userEvent6 = loadCollection(USER_EVENT6_KEY, []).map((item) => ({ ...item, user: true }));
  const { valid: validActions } = validateActions(baseActions.concat(userActions));
  const { valid: validNormal } = validateCards(baseNormal.concat(userNormal));
  const { valid: validEvent6 } = validateCards(baseEvent6.concat(userEvent6));
  actions = validActions.map(withBans);
  normalCards = validNormal.map(withBans);
  event6Cards = validEvent6.map(withBans);
  renderDeckEditor();
  updateDeckCounts();
};

const setupDeckEditorEvents = () => {
  const handleListClick = (event, list, kind) => {
    const target = event.target.closest(".editor-item");
    if (!target) return;
    const id = target.dataset.id;
    const items = kind === "action" ? actions : kind === "normal" ? normalCards : event6Cards;
    const item = items.find((entry) => entry.id === id);
    if (event.target.hasAttribute("data-edit")) {
      const editable = item.user ? item : { ...item, id: `${item.id}-copy`, user: true };
      openEditModal(kind, editable);
    }
    if (event.target.hasAttribute("data-duplicate")) {
      const duplicated = { ...item, id: `${item.id}-${Date.now()}`, user: true };
      applyEdits({ kind, id: duplicated.id, item: duplicated });
    }
    if (event.target.hasAttribute("data-remove") && item.user) {
      const key = kind === "action" ? USER_ACTIONS_KEY : kind === "normal" ? USER_NORMAL_KEY : USER_EVENT6_KEY;
      const collection = loadCollection(key, []);
      const next = collection.filter((entry) => entry.id !== id);
      saveCollection(key, next);
      reloadCollections();
    }
  };

  elements.actionsList.addEventListener("click", (event) =>
    handleListClick(event, elements.actionsList, "action")
  );
  elements.normalCardsList.addEventListener("click", (event) =>
    handleListClick(event, elements.normalCardsList, "normal")
  );
  elements.event6CardsList.addEventListener("click", (event) =>
    handleListClick(event, elements.event6CardsList, "event6")
  );
};

const exportDeck = () => {
  const payload = {
    actions: loadCollection(USER_ACTIONS_KEY, []),
    normalCards: loadCollection(USER_NORMAL_KEY, []),
    event6Cards: loadCollection(USER_EVENT6_KEY, [])
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "fogo-seda-meu-baralho.json";
  link.click();
  URL.revokeObjectURL(url);
};

const importDeck = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (Array.isArray(parsed.actions)) saveCollection(USER_ACTIONS_KEY, parsed.actions);
      if (Array.isArray(parsed.normalCards)) saveCollection(USER_NORMAL_KEY, parsed.normalCards);
      if (Array.isArray(parsed.event6Cards)) saveCollection(USER_EVENT6_KEY, parsed.event6Cards);
      reloadCollections();
    } catch (error) {
      console.warn("Falha ao importar JSON.", error);
    }
  };
  reader.readAsText(file);
};

const exportPdf = () => {
  const win = window.open("", "_blank");
  if (!win) return;
  const filters = [];
  if (state.filters.noNudez) filters.push("sem nudez");
  if (state.filters.noDom) filters.push("sem dominacao");
  if (state.filters.noOral) filters.push("sem oral");
  const historyHtml = state.history
    .slice(0, 30)
    .map((entry) => `<li>${entry.player}: ${entry.text} (${entry.refused ? "recusado" : "ok"})</li>`)
    .join("");
  win.document.write(`
    <html>
      <head>
        <title>Fogo & Seda - Historico</title>
        <style>
          body { font-family: Georgia, serif; padding: 24px; line-height: 1.4; }
          h1 { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <h1>Fogo & Seda</h1>
        <div>${new Date().toLocaleString("pt-BR")}</div>
        <h2>Configuracoes</h2>
        <ul>
          <li>Jogadores: ${state.players.map((player) => player.name).join(", ")}</li>
          <li>Filtros: ${filters.length ? filters.join(", ") : "nenhum"}</li>
        </ul>
        <h2>Historico recente</h2>
        <ol>${historyHtml || "<li>Sem registros.</li>"}</ol>
        <h2>18+ e consentimento</h2>
        <p>Jogo para maiores de 18. Consentimento explicito e limites claros sao obrigatorios.</p>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
};

const setupTabs = () => {
  if (!elements.deckModal) return;
  const tabs = elements.deckModal.querySelectorAll(".tab");
  const panels = elements.deckModal.querySelectorAll(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((button) => button.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      elements.deckModal.querySelector(`[data-panel="${target}"]`).classList.add("active");
    });
  });
};

const setupListeners = () => {
  elements.rollDice.addEventListener("click", rollDice);
  elements.centerPlayer.addEventListener("click", centerOnPlayer);
  elements.actionExecute.addEventListener("click", () => resolveAction(false));
  elements.actionRefuse.addEventListener("click", () => resolveAction(true));
  bindModal(elements.settingsModal, elements.modalBackdrop);
  bindModal(elements.deckModal, elements.modalBackdrop);
  bindModal(elements.editModal, elements.modalBackdrop);
  bindModal(elements.resetModal, elements.modalBackdrop);

  elements.addPlayer.addEventListener("click", () => {
    if (state.players.length >= 6) return;
    const id = `p${state.players.length + 1}`;
    const color = PLAYER_COLORS[state.players.length % PLAYER_COLORS.length];
    state.players.push({
      id,
      name: `Jogador ${state.players.length + 1}`,
      color,
      position: 1,
      score: 0,
      blockedRounds: 0,
      interactionBlocked: false
    });
    updatePlayersUI();
    renderer.createTokens(state.players.map((p, i) => ({ ...p, label: String(i + 1) })));
    renderer.updateTokens(state.players);
    saveState(state);
    renderLeaderboard();
  });
  elements.removePlayer.addEventListener("click", () => {
    if (state.players.length <= 2) return;
    state.players.pop();
    if (state.currentPlayerIndex >= state.players.length) state.currentPlayerIndex = 0;
    updatePlayersUI();
    renderer.createTokens(state.players.map((p, i) => ({ ...p, label: String(i + 1) })));
    renderer.updateTokens(state.players);
    saveState(state);
    renderLeaderboard();
  });

  elements.playersList.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-player-id]");
    if (!input) return;
    const player = state.players.find((entry) => entry.id === input.dataset.playerId);
    if (player) {
      player.name = input.value;
      updateTurnUI();
      saveState(state);
    }
  });

  elements.noNudez.addEventListener("change", () => {
    state.filters.noNudez = elements.noNudez.checked;
    saveState(state);
  });
  elements.noDom.addEventListener("change", () => {
    state.filters.noDom = elements.noDom.checked;
    saveState(state);
  });
  elements.noOral.addEventListener("change", () => {
    state.filters.noOral = elements.noOral.checked;
    saveState(state);
  });

  elements.openDeckEditor.addEventListener("click", () =>
    openModal(elements.deckModal, elements.modalBackdrop)
  );
  elements.addAction.addEventListener("click", () => openEditModal("action", null));
  elements.addNormalCard.addEventListener("click", () => openEditModal("normal", null));
  elements.addEvent6Card.addEventListener("click", () => openEditModal("event6", null));

  elements.exportDeck.addEventListener("click", exportDeck);
  elements.importDeck.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) importDeck(file);
    event.target.value = "";
  });
  elements.exportPdf.addEventListener("click", exportPdf);
  elements.resetGame?.addEventListener("click", () => {
    if (elements.resetTotal) elements.resetTotal.checked = false;
    openModal(elements.resetModal, elements.modalBackdrop);
  });
  elements.resetCancel?.addEventListener("click", () =>
    closeModal(elements.resetModal, elements.modalBackdrop)
  );
  elements.resetConfirm?.addEventListener("click", () => {
    const resetTotal = Boolean(elements.resetTotal?.checked);
    resetGameState(resetTotal);
    closeModal(elements.resetModal, elements.modalBackdrop);
  });
  elements.relaxFilters.addEventListener("click", () => {
    state.filters = { noNudez: false, noDom: false, noOral: false };
    elements.noNudez.checked = false;
    elements.noDom.checked = false;
    elements.noOral.checked = false;
    filterWarning = false;
    renderPendingEvent();
    saveState(state);
  });

  elements.editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const kind = elements.editKind.value;
    const id = elements.editId.value || `${kind}-${Date.now()}`;
    const item = {
      id,
      text: elements.editText.value.trim(),
      zone: elements.editZone.value,
      bans: {
        nudez: elements.banNudez.checked,
        dominacao: elements.banDom.checked,
        oral: elements.banOral.checked
      },
      user: true
    };
    if (kind === "action") {
      item.category = elements.editCategory.value;
      item.icon = elements.editIcon.value.trim() || "✨";
      item.mandatory = elements.editMandatory.checked;
    }
    applyEdits({ kind, id, item });
    closeModal(elements.editModal, elements.modalBackdrop);
  });

  const closeCardsModal = () => {
    if (!pendingCardResolve) {
      state.modalOpen = false;
      closeModal(elements.cardsModal, elements.modalBackdrop);
      return;
    }
    const selected = pickOne(pendingCardChoices || []);
    pendingCardResolve(selected);
  };

  elements.cardsModal.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeCardsModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      rollDice();
    }
    if (event.key === "Escape") {
      if (elements.cardsModal.classList.contains("open")) {
        closeCardsModal();
        return;
      }
      closeModal(elements.settingsModal, elements.modalBackdrop);
      closeModal(elements.deckModal, elements.modalBackdrop);
      closeModal(elements.editModal, elements.modalBackdrop);
      closeModal(elements.resetModal, elements.modalBackdrop);
    }
  });

  window.addEventListener("resize", () => {});
};

const init = async () => {
  boardData = await fetch("data/board.json").then((res) => res.json());
  await reloadCollections();
  renderer = new BoardRenderer(elements.boardSvg, {
    onTileClick: null
  });
  renderer.load(boardData);
  renderer.createTokens(state.players.map((player, index) => ({ ...player, label: String(index + 1) })));
  renderer.updateTokens(state.players);
  renderer.setActiveTile(state.players[state.currentPlayerIndex].position);
  elements.noNudez.checked = state.filters.noNudez;
  elements.noDom.checked = state.filters.noDom;
  elements.noOral.checked = state.filters.noOral;
  updatePlayersUI();
  updateTurnUI();
  renderHistory();
  renderLeaderboard();
  setupDeckEditorEvents();
  setupTabs();
  setupListeners();
  initBottomSheets();
  initBottomTabs(openSheet);
  initCurrentActionBox(elements, {
    onExpand: () => openSheet("actionSheet")
  });
  initTopbar({
    openSettingsBtn: elements.openSettings,
    resetBtn: elements.resetTop,
    onOpenSettings: () => openModal(elements.settingsModal, elements.modalBackdrop),
    onReset: () => {
      if (elements.resetTotal) elements.resetTotal.checked = false;
      openModal(elements.resetModal, elements.modalBackdrop);
    }
  });
  setActionCardMode("expanded");
  updateLayoutMetrics();
  applyTheme({ accent: state.hunterColor });
  saveState(state);
};

init();
