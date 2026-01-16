const LEVELS = {
  leve: { label: "Leve", count: 300 },
  quente: { label: "Quente", count: 350 },
  fogo: { label: "Pegando fogo", count: 350 }
};

const FILTER_KEYWORDS = {
  oral: ["sexo oral", "oral", "chupar", "chupe", "chupa", "chup", "lingua", "boca"],
  dom: ["ordens", "dominar", "dominado", "mandar", "prendo", "presas", "comando", "submis"],
  nudez: ["nu(a)", "nua", "nu", "striptease", "ficar so de", "tirar roupa", "pelado"]
};

const STORAGE_KEY = "fogo-seda-state-v2";

const DATA = {
  leve: {
    truth: [
      "Qual parte do meu corpo voce mais quer beijar agora?",
      "O que te faz entrar no clima mais rapido?",
      "Que tipo de carinho te deixa arrepiado(a)?",
      "Qual elogio safado voce quer ouvir hoje?",
      "Voce prefere beijos longos ou beijos rapidos? Por que?",
      "Qual foi o beijo mais gostoso que voce ja deu?",
      "Onde voce gostaria que eu te tocasse primeiro?",
      "Qual lugar da casa te excita mais para comecar?",
      "Voce gosta de mordidinhas no {parte}?",
      "Que tipo de musica deixaria o clima perfeito?",
      "Voce prefere conduzir ou ser conduzido(a) na hora do beijo?",
      "Qual fantasia leve voce toparia hoje sem pensar?",
      "Que cheiro no meu corpo te deixa louco(a)?",
      "Qual roupa minha voce mais gosta de ver no chao?",
      "Voce curte provocacao lenta ou direta?",
      "Qual toque leve te deixa mais sensivel?",
      "Voce gosta quando eu sussurro coisas no seu ouvido?",
      "Qual parte do seu corpo voce quer que eu acaricie com {intensidade}?",
      "Qual foi o momento mais romantico que te excita lembrar?",
      "Voce prefere comecar com caricias nas costas ou na cintura?"
    ],
    dare: [
      "Beije meu {parte} por {duracao} sem usar as maos.",
      "Sussurre tres coisas que voce faria comigo hoje.",
      "Tire uma {roupa} lentamente, olhando nos meus olhos.",
      "Faca uma massagem nas minhas costas por {duracao}.",
      "Danca bem colado(a) comigo por {duracao}.",
      "Passe a ponta dos dedos pelo meu {parte} com {intensidade}.",
      "Me abrace por tras e beije meu {parte} sem pressa.",
      "Encoste sua boca no meu {parte} e fique provocando.",
      "Me de tres beijos diferentes: um lento, um rapido e um com mordida leve.",
      "Deite ao meu lado e conte no meu ouvido algo picante.",
      "Tire minha {roupa} com cuidado e depois beije meu {parte}.",
      "Use a lingua para desenhar um caminho do meu {parte} ate o {parte}.",
      "Me faca fechar os olhos e adivinhar onde voce vai beijar.",
      "Sente no meu colo e rebola devagar por {duracao}.",
      "Passe sua boca no meu {parte} e depois no meu {parte}.",
      "Me beije no {parte} enquanto suas maos passeiam na cintura.",
      "Segure minhas maos e me provoque so com beijos por {duracao}.",
      "Diga no meu ouvido um apelido safado que voce quer usar.",
      "Beije minha barriga descendo ate o {parte}.",
      "Faca um striptease leve ate ficar so de {roupa}."
    ],
    tokens: {
      parte: ["pescoco", "orelha", "bochecha", "ombro", "cintura", "costas", "coxa", "barriga", "peito", "bumbum", "labios", "maos"],
      duracao: ["30 segundos", "1 minuto", "2 minutos", "ate eu mandar parar", "o tempo de uma musica", "3 minutos"],
      intensidade: ["bem devagar", "com carinho", "de forma provocante", "com leves mordidas", "sem pressa", "com vontade"],
      roupa: ["camiseta", "calca", "sutia", "cueca", "calcinha", "meias", "jaqueta", "saia"]
    }
  },
  quente: {
    truth: [
      "Voce gosta de provocar por baixo da roupa?",
      "Qual parte sua e mais sensivel ao toque hoje?",
      "Voce prefere receber sexo oral ou dar?",
      "Qual posicao voce mais gosta para comecar?",
      "Voce gosta de ouvir safadezas no ouvido?",
      "Qual foi a situacao mais picante que ja te excitou?",
      "Voce gosta de puxoes leves de cabelo?",
      "Qual ritmo de gemidos te enlouquece?",
      "Voce curte ver seu parceiro(a) se tocando?",
      "Voce ja gozou so com beijos e maos?",
      "Qual tipo de lingerie te deixa fora de si?",
      "Voce gosta de toques com oleo ou com gelo?",
      "Qual lembranca sexual voce quer repetir comigo?",
      "Voce gosta de ser beijado(a) no {parte} durante a provocacao?",
      "Voce prefere que eu fique por cima ou por baixo?",
      "Qual parte do seu corpo voce quer que eu chupe agora?",
      "Voce curte receber caricias entre as coxas?",
      "Qual palavra safada voce quer que eu diga?",
      "Voce gosta quando eu fico por tras e encosto meu corpo no seu?",
      "Qual fantasia quente voce toparia hoje sem pudor?"
    ],
    dare: [
      "Tire duas pecas de roupa sem usar as maos.",
      "Passe a mao por baixo da minha roupa e provoque por {duracao}.",
      "Chupe meu {parte} com {intensidade}.",
      "Sente no meu rosto e deixe eu te beijar do pescoco para baixo.",
      "Use a lingua para marcar uma trilha do meu {parte} ate o {parte}.",
      "Me beije e morda de leve meu {parte} por {duracao}.",
      "Fique so de {roupa} e faca um giro lento para eu te ver.",
      "Encoste seu corpo no meu e faca friccao bem devagar por {duracao}.",
      "Me deixe com as maos presas enquanto voce me provoca.",
      "Use seus dedos para me provocar no {parte} por {duracao}.",
      "Sussurre no meu ouvido uma ordem safada e faca eu obedecer.",
      "Beije minha boca e desca ate o {parte} sem parar.",
      "Me sente no colo e rebole mais firme por {duracao}.",
      "Tire minha {roupa} com os dentes e depois me beije.",
      "Me faca gemer so com beijos e maos por {duracao}.",
      "Passe gelo no meu {parte} e aqueca com a boca logo em seguida.",
      "Deixe eu tocar seu {parte} enquanto voce me beija.",
      "Faca um striptease ate ficar nu(a) e me puxe para perto.",
      "Me provoque por tras com beijos no {parte}.",
      "Deslize sua boca no meu {parte} e suba ate meu ouvido."
    ],
    tokens: {
      parte: ["pescoco", "orelha", "mamilos", "barriga", "coxa", "virilha", "bumbum", "costas", "peito", "entre as coxas", "ombro", "lombar"],
      duracao: ["1 minuto", "2 minutos", "3 minutos", "ate eu pedir mais", "ate eu quase gozar", "o tempo de uma musica lenta"],
      intensidade: ["bem devagar", "com firmeza", "de forma provocante", "alternando lambidas e mordidas", "sem pressa", "com vontade"],
      roupa: ["camiseta", "calca", "sutia", "cueca", "calcinha", "meias", "saia", "vestido"]
    }
  },
  fogo: {
    truth: [
      "Qual a coisa mais explicita que voce quer fazer comigo agora?",
      "Como voce quer que eu te leve ao orgasmo hoje?",
      "Voce prefere penetracao lenta ou rapida? Por que?",
      "Qual posicao voce quer para uma penetracao mais profunda?",
      "Voce curte que eu goze no seu corpo? Onde?",
      "Voce gosta de dominar ou ser dominado(a) na cama?",
      "Qual parte do meu corpo voce quer beijar enquanto faz sexo oral?",
      "Voce gosta de ouvir meus gemidos bem alto?",
      "Voce prefere gozar primeiro ou me fazer gozar primeiro?",
      "Qual fantasia mais suja voce ainda nao realizou?",
      "Voce quer que eu te masturbe com as maos ou com a boca?",
      "Qual palavra de comando te deixa mais excitado(a)?",
      "Voce gosta de ser estimulado(a) ao mesmo tempo no {parte} e no {parte}?",
      "Qual tipo de penetracao te deixa mais proximo(a) do limite?",
      "Voce quer que eu te provoque ate implorar?",
      "O que te faz gozar mais rapido: lingua, dedos ou friccao?",
      "Voce curte quando eu prendo suas maos enquanto te uso?",
      "Qual parte sua voce quer sentir mais pressionada hoje?",
      "Voce gosta de sujar a boca com sexo oral?",
      "Como voce quer que eu termine: devagar ou sem controle?"
    ],
    dare: [
      "Faca sexo oral em mim por {duracao} sem parar.",
      "Use sua boca e suas maos para me levar ate quase gozar.",
      "Me masturbe com firmeza no {parte} por {duracao}.",
      "Deixe eu te penetrar na posicao {posicao} ate o ritmo ficar intenso.",
      "Rebola em cima de mim com forca por {duracao}.",
      "Me beije e mande eu gozar exatamente quando voce quiser.",
      "Fique nu(a) e deixe eu explorar seu corpo com boca e dedos.",
      "Use seus dedos no meu {parte} enquanto sua boca provoca o {parte}.",
      "Me deixe ouvir seus gemidos enquanto voce se toca.",
      "Deite de costas e deixe eu te chupar ate voce quase gozar.",
      "Vire de costas e deixe eu te usar com {intensidade}.",
      "Monta em mim e controle o ritmo por {duracao}.",
      "Me provoque com friccao no {parte} ate eu perder o controle.",
      "Me faca gozar usando lingua e dedos sem pausa.",
      "Sente no meu rosto e mantenha o ritmo firme por {duracao}.",
      "Me de ordens safadas enquanto eu te penetro.",
      "Me beije no {parte} e desca para sexo oral imediato.",
      "Deixe eu te masturbar ate voce gozar, sem segurar.",
      "Use a boca no meu {parte} e nao pare ate eu pedir.",
      "Me faca gozar onde voce quiser."
    ],
    tokens: {
      parte: ["clitoris", "penis", "mamilos", "virilha", "bumbum", "boca", "pescoco", "entre as coxas", "peito", "lombar"],
      duracao: ["2 minutos", "3 minutos", "4 minutos", "ate eu quase gozar", "ate eu pedir para parar", "o tempo de duas musicas"],
      posicao: ["de ladinho", "por tras", "de frente", "com as pernas abertas", "com as pernas no ombro", "ajoelhado(a)"],
      intensidade: ["com forca", "bem devagar e profundo", "alternando ritmos", "sem perder o contato", "com intensidade crescente", "com vontade total"]
    }
  }
};

const state = {
  level: "leve",
  mode: "solo",
  theme: "wine",
  turnIndex: 0,
  groupNames: "",
  warmupEnabled: false,
  warmupRemaining: 5,
  blindDraw: false,
  blindSeconds: 5,
  roleRotation: false,
  filters: {
    oral: false,
    dom: false,
    nudez: false
  },
  soundEnabled: true,
  soundVolume: 40,
  autoSave: true,
  history: [],
  pools: {
    truth: {},
    dare: {}
  }
};

const timerState = {
  durationSeconds: 300,
  remainingSeconds: 300,
  running: false,
  intervalId: null
};

const elements = {
  card: document.getElementById("card"),
  stats: document.getElementById("stats"),
  groupNames: document.getElementById("groupNames"),
  warmupStatus: document.getElementById("warmupStatus"),
  blindDraw: document.getElementById("blindDraw"),
  blindSeconds: document.getElementById("blindSeconds"),
  warmupMode: document.getElementById("warmupMode"),
  filterOral: document.getElementById("filterOral"),
  filterDom: document.getElementById("filterDom"),
  filterNudez: document.getElementById("filterNudez"),
  roleRotation: document.getElementById("roleRotation"),
  themeButtons: document.querySelectorAll(".theme-btn"),
  soundToggle: document.getElementById("soundToggle"),
  soundVolume: document.getElementById("soundVolume"),
  shareLink: document.getElementById("shareLink"),
  copyShare: document.getElementById("copyShare"),
  generateQr: document.getElementById("generateQr"),
  qrImage: document.getElementById("qrImage"),
  autoSave: document.getElementById("autoSave"),
  historyList: document.getElementById("historyList"),
  copyHistory: document.getElementById("copyHistory"),
  clearHistory: document.getElementById("clearHistory"),
  exportPdf: document.getElementById("exportPdf"),
  ritualTimer: document.getElementById("ritualTimer"),
  timerStart: document.getElementById("timerStart"),
  timerReset: document.getElementById("timerReset"),
  timerPresets: document.querySelectorAll(".timer-preset"),
  sidebar: document.getElementById("sidebar"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  sidebarToggle: document.getElementById("sidebarToggle")
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const renderTemplate = (template, index, tokens) =>
  template.replace(/\{(\w+)\}/g, (_, key) => {
    const list = tokens[key];
    if (!list) return key;
    const pick = (index * 7 + key.length * 13) % list.length;
    return list[pick];
  });

const isFiltered = (template) => {
  const text = template.toLowerCase();
  if (state.filters.oral && FILTER_KEYWORDS.oral.some((word) => text.includes(word))) return true;
  if (state.filters.dom && FILTER_KEYWORDS.dom.some((word) => text.includes(word))) return true;
  if (state.filters.nudez && FILTER_KEYWORDS.nudez.some((word) => text.includes(word))) return true;
  return false;
};

const getActiveTemplates = (levelKey, type) => {
  const templates = DATA[levelKey][type];
  const filtered = templates.filter((template) => !isFiltered(template));
  return filtered.length ? filtered : templates;
};

const buildList = (levelKey, type) => {
  const level = DATA[levelKey];
  const templates = getActiveTemplates(levelKey, type);
  const count = LEVELS[levelKey].count;
  const list = [];
  for (let i = 0; i < count; i += 1) {
    const template = templates[i % templates.length];
    list.push({
      level: levelKey,
      text: renderTemplate(template, i, level.tokens)
    });
  }
  return list;
};

const resetPools = () => {
  Object.keys(LEVELS).forEach((levelKey) => {
    state.pools.truth[levelKey] = shuffle(buildList(levelKey, "truth"));
    state.pools.dare[levelKey] = shuffle(buildList(levelKey, "dare"));
  });
  updateStats();
  saveState();
};

const getGroupNames = () => {
  const names = elements.groupNames.value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  if (names.length) return names;
  return ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4"];
};

const getRoleInfo = () => {
  if (state.mode === "solo") return { meta: "", inline: "" };
  const names = state.mode === "couple" ? ["Voce", "Parceiro(a)"] : getGroupNames();
  if (!state.roleRotation) {
    const current = names[state.turnIndex % names.length];
    return { meta: "", inline: `${current}: ` };
  }
  const asker = names[state.turnIndex % names.length];
  const responder = names[(state.turnIndex + 1) % names.length];
  const observer = names[(state.turnIndex + 2) % names.length];
  if (state.mode === "couple") {
    return { meta: `Pergunta: ${asker} / Responde: ${responder}`, inline: "" };
  }
  return { meta: `Pergunta: ${asker} / Responde: ${responder} / Observa: ${observer}`, inline: "" };
};

const advanceTurn = () => {
  if (state.mode === "solo") return;
  state.turnIndex += 1;
};

const getLevelForDraw = () => {
  if (state.warmupEnabled && state.warmupRemaining > 0) {
    return "leve";
  }
  return state.level;
};

const updateWarmupStatus = () => {
  if (!state.warmupEnabled) {
    elements.warmupStatus.textContent = "Aquecimento desativado.";
    return;
  }
  elements.warmupStatus.textContent = `Aquecimento: ${state.warmupRemaining} rodadas restantes.`;
};

const updateStats = () => {
  const levelKey = state.level;
  const truthLeft = state.pools.truth[levelKey].length;
  const dareLeft = state.pools.dare[levelKey].length;
  const modeLabel =
    state.mode === "solo" ? "Solteiro" : state.mode === "couple" ? "Casal" : "Em grupo";
  const levelLabel = LEVELS[levelKey].label;
  const filterLabels = [];
  if (state.filters.oral) filterLabels.push("sem oral");
  if (state.filters.dom) filterLabels.push("sem dominacao");
  if (state.filters.nudez) filterLabels.push("sem nudez");
  const filterText = filterLabels.length ? `Filtros: ${filterLabels.join(", ")}.` : "Sem filtros.";
  const warmupText = state.warmupEnabled ? `Aquecimento: ${state.warmupRemaining}.` : "";
  elements.stats.innerHTML = `
    <span>Total gerado: 1000 perguntas e 1000 desafios.</span>
    <span>Nivel atual: ${levelLabel}. Modo: ${modeLabel}.</span>
    <span>${filterText} ${warmupText}</span>
    <span>Restantes neste nivel: ${truthLeft} verdades, ${dareLeft} desafios.</span>
  `;
  updateWarmupStatus();
};

const updateHistory = () => {
  if (!state.history.length) {
    elements.historyList.innerHTML = `<div class="history-empty">Sem historico ainda.</div>`;
    return;
  }
  elements.historyList.innerHTML = state.history
    .map(
      (item) => `
        <div class="history-item">
          <div class="history-meta">${item.meta}</div>
          <div class="history-text">${item.text}</div>
        </div>`
    )
    .join("");
};

const pushHistory = (entry) => {
  state.history.unshift(entry);
  state.history = state.history.slice(0, 12);
  updateHistory();
  saveState();
};

const playSound = () => {
  if (!state.soundEnabled) return;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 440;
  gainNode.gain.value = state.soundVolume / 100;
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.15);
};

const revealCard = (type) => {
  const levelKey = getLevelForDraw();
  const pool = state.pools[type][levelKey];
  if (!pool.length) {
    state.pools[type][levelKey] = shuffle(buildList(levelKey, type));
  }
  const item = state.pools[type][levelKey].pop();
  const roleInfo = getRoleInfo();
  const roleLine = roleInfo.meta ? `<div class="card-meta">${roleInfo.meta}</div>` : "";
  const displayText = `${roleInfo.inline}${item.text}`;
  elements.card.innerHTML = `${roleLine}<span>${displayText}</span>`;
  pushHistory({
    meta: `${LEVELS[levelKey].label} - ${type === "truth" ? "Verdade" : "Desafio"}${roleInfo.meta ? ` - ${roleInfo.meta}` : ""} - ${new Date().toLocaleTimeString()}`,
    text: displayText
  });
  if (state.warmupEnabled && state.warmupRemaining > 0) {
    state.warmupRemaining -= 1;
  }
  advanceTurn();
  updateStats();
  playSound();
  saveState();
};

const drawCard = (type) => {
  if (state.blindDraw) {
    const total = Number.parseInt(state.blindSeconds, 10) || 5;
    let remaining = total;
    elements.card.innerHTML = `<div class="card-meta">Sorteio cego</div><span>Revelando em ${remaining}...</span>`;
    disableActions(true);
    const intervalId = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(intervalId);
        disableActions(false);
        revealCard(type);
      } else {
        elements.card.innerHTML = `<div class="card-meta">Sorteio cego</div><span>Revelando em ${remaining}...</span>`;
      }
    }, 1000);
    return;
  }
  revealCard(type);
};

const disableActions = (disabled) => {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.disabled = disabled;
  });
};

const updateModeField = () => {
  const isGroup = state.mode === "group";
  elements.groupNames.disabled = !isGroup;
  elements.groupNames.classList.toggle("is-muted", !isGroup);
  elements.roleRotation.disabled = state.mode === "solo";
};

const updateTheme = () => {
  document.body.classList.remove("theme-wine", "theme-gold");
  document.body.classList.add(`theme-${state.theme}`);
  elements.themeButtons.forEach((button) => {
    const active = button.dataset.theme === state.theme;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
};

const updateShareLink = () => {
  const url = new URL(window.location.href);
  url.searchParams.set("level", state.level);
  url.searchParams.set("mode", state.mode);
  url.searchParams.set("theme", state.theme);
  if (state.groupNames) {
    url.searchParams.set("names", state.groupNames);
  } else {
    url.searchParams.delete("names");
  }
  url.searchParams.set("warmup", state.warmupEnabled ? "1" : "0");
  url.searchParams.set("blind", state.blindDraw ? "1" : "0");
  url.searchParams.set("blindSeconds", state.blindSeconds);
  url.searchParams.set("roleRotation", state.roleRotation ? "1" : "0");
  url.searchParams.set("filters", [
    state.filters.oral ? "oral" : "",
    state.filters.dom ? "dom" : "",
    state.filters.nudez ? "nudez" : ""
  ].filter(Boolean).join(","));
  elements.shareLink.value = url.toString();
};

const updateTimerDisplay = () => {
  const minutes = Math.floor(timerState.remainingSeconds / 60);
  const seconds = timerState.remainingSeconds % 60;
  elements.ritualTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const startTimer = () => {
  if (timerState.running) return;
  timerState.running = true;
  elements.timerStart.textContent = "Pausar";
  timerState.intervalId = setInterval(() => {
    timerState.remainingSeconds -= 1;
    if (timerState.remainingSeconds <= 0) {
      timerState.remainingSeconds = 0;
      stopTimer();
      playSound();
    }
    updateTimerDisplay();
  }, 1000);
};

const stopTimer = () => {
  timerState.running = false;
  elements.timerStart.textContent = "Iniciar";
  if (timerState.intervalId) clearInterval(timerState.intervalId);
  timerState.intervalId = null;
};

const resetTimer = () => {
  stopTimer();
  timerState.remainingSeconds = timerState.durationSeconds;
  updateTimerDisplay();
};

const setTimerDuration = (minutes) => {
  timerState.durationSeconds = minutes * 60;
  timerState.remainingSeconds = timerState.durationSeconds;
  updateTimerDisplay();
};

const exportPdf = () => {
  const windowRef = window.open("", "_blank");
  if (!windowRef) return;
  const levels = Object.keys(LEVELS);
  const sections = levels
    .map((levelKey) => {
      const truths = buildList(levelKey, "truth").map((item) => `<li>${item.text}</li>`).join("");
      const dares = buildList(levelKey, "dare").map((item) => `<li>${item.text}</li>`).join("");
      return `
        <section>
          <h2>${LEVELS[levelKey].label}</h2>
          <h3>Verdades</h3>
          <ol>${truths}</ol>
          <h3>Desafios</h3>
          <ol>${dares}</ol>
        </section>
      `;
    })
    .join("");
  windowRef.document.write(`
    <html>
      <head>
        <title>Fogo & Seda - Exportar PDF</title>
        <style>
          body { font-family: "Times New Roman", serif; padding: 24px; }
          h2 { margin-top: 32px; }
          ol { columns: 2; column-gap: 28px; }
        </style>
      </head>
      <body>
        <h1>Fogo & Seda</h1>
        ${sections}
      </body>
    </html>
  `);
  windowRef.document.close();
  windowRef.focus();
  windowRef.print();
};

const saveState = () => {
  if (!state.autoSave) return;
  const payload = {
    state: {
      level: state.level,
      mode: state.mode,
      theme: state.theme,
      turnIndex: state.turnIndex,
      groupNames: state.groupNames,
      warmupEnabled: state.warmupEnabled,
      warmupRemaining: state.warmupRemaining,
      blindDraw: state.blindDraw,
      blindSeconds: state.blindSeconds,
      roleRotation: state.roleRotation,
      filters: state.filters,
      soundEnabled: state.soundEnabled,
      soundVolume: state.soundVolume,
      autoSave: state.autoSave,
      history: state.history
    },
    pools: state.pools,
    timer: {
      durationSeconds: timerState.durationSeconds,
      remainingSeconds: timerState.remainingSeconds
    }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const loadState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed.state);
    if (parsed.pools) state.pools = parsed.pools;
    if (parsed.timer) {
      timerState.durationSeconds = parsed.timer.durationSeconds || timerState.durationSeconds;
      timerState.remainingSeconds = parsed.timer.remainingSeconds || timerState.durationSeconds;
    }
  } catch (error) {
    console.warn("Falha ao carregar estado salvo.", error);
  }
};

const applyQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const level = params.get("level");
  const mode = params.get("mode");
  const theme = params.get("theme");
  const names = params.get("names");
  if (LEVELS[level]) state.level = level;
  if (["solo", "couple", "group"].includes(mode)) state.mode = mode;
  if (["wine", "gold"].includes(theme)) state.theme = theme;
  if (names) state.groupNames = names;
  state.warmupEnabled = params.get("warmup") === "1";
  if (state.warmupEnabled) {
    state.warmupRemaining = 5;
  }
  state.blindDraw = params.get("blind") === "1";
  state.blindSeconds = Number.parseInt(params.get("blindSeconds"), 10) || state.blindSeconds;
  state.roleRotation = params.get("roleRotation") === "1";
  const filters = (params.get("filters") || "").split(",").map((item) => item.trim());
  state.filters.oral = filters.includes("oral");
  state.filters.dom = filters.includes("dom");
  state.filters.nudez = filters.includes("nudez");
};

const syncControls = () => {
  document.querySelectorAll(".level-btn").forEach((button) => {
    const active = button.dataset.level === state.level;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  document.querySelectorAll(".mode-btn").forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  elements.warmupMode.checked = state.warmupEnabled;
  elements.filterOral.checked = state.filters.oral;
  elements.filterDom.checked = state.filters.dom;
  elements.filterNudez.checked = state.filters.nudez;
  elements.blindDraw.checked = state.blindDraw;
  elements.blindSeconds.value = String(state.blindSeconds);
  elements.roleRotation.checked = state.roleRotation;
  elements.soundToggle.checked = state.soundEnabled;
  elements.soundVolume.value = state.soundVolume;
  elements.autoSave.checked = state.autoSave;
  elements.groupNames.value = state.groupNames || "";
  updateTheme();
  updateModeField();
  updateWarmupStatus();
  updateHistory();
  updateTimerDisplay();
  updateShareLink();
};

const openSidebar = () => {
  elements.sidebar.classList.add("open");
  elements.sidebarBackdrop.classList.add("show");
};

const closeSidebar = () => {
  elements.sidebar.classList.remove("open");
  elements.sidebarBackdrop.classList.remove("show");
};

document.querySelectorAll(".level-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".level-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    state.level = button.dataset.level;
    updateShareLink();
    updateStats();
    saveState();
    closeSidebar();
  });
});

document.querySelectorAll(".mode-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    state.mode = button.dataset.mode;
    state.turnIndex = 0;
    updateModeField();
    updateShareLink();
    updateStats();
    saveState();
    closeSidebar();
  });
});

elements.roleRotation.addEventListener("change", () => {
  state.roleRotation = elements.roleRotation.checked;
  updateShareLink();
  updateStats();
  saveState();
});

elements.warmupMode.addEventListener("change", () => {
  state.warmupEnabled = elements.warmupMode.checked;
  state.warmupRemaining = 5;
  updateStats();
  updateShareLink();
  resetPools();
});

elements.blindDraw.addEventListener("change", () => {
  state.blindDraw = elements.blindDraw.checked;
  updateShareLink();
  saveState();
});

elements.blindSeconds.addEventListener("change", () => {
  state.blindSeconds = Number.parseInt(elements.blindSeconds.value, 10);
  updateShareLink();
  saveState();
});

elements.filterOral.addEventListener("change", () => {
  state.filters.oral = elements.filterOral.checked;
  resetPools();
  updateShareLink();
});

elements.filterDom.addEventListener("change", () => {
  state.filters.dom = elements.filterDom.checked;
  resetPools();
  updateShareLink();
});

elements.filterNudez.addEventListener("change", () => {
  state.filters.nudez = elements.filterNudez.checked;
  resetPools();
  updateShareLink();
});

elements.soundToggle.addEventListener("change", () => {
  state.soundEnabled = elements.soundToggle.checked;
  saveState();
});

elements.soundVolume.addEventListener("input", () => {
  state.soundVolume = Number.parseInt(elements.soundVolume.value, 10);
  saveState();
});

elements.autoSave.addEventListener("change", () => {
  state.autoSave = elements.autoSave.checked;
  saveState();
});

elements.groupNames.addEventListener("input", () => {
  state.groupNames = elements.groupNames.value;
  if (state.mode === "group") updateStats();
  updateShareLink();
  saveState();
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "truth") drawCard("truth");
    if (action === "dare") drawCard("dare");
    if (action === "random") drawCard(Math.random() < 0.5 ? "truth" : "dare");
    if (action === "reset") resetPools();
  });
});

elements.themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.theme = button.dataset.theme;
    updateTheme();
    updateShareLink();
    saveState();
  });
});

elements.copyShare.addEventListener("click", () => {
  navigator.clipboard.writeText(elements.shareLink.value);
});

elements.generateQr.addEventListener("click", () => {
  updateShareLink();
  const encoded = encodeURIComponent(elements.shareLink.value);
  elements.qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;
});

elements.copyHistory.addEventListener("click", () => {
  const text = state.history.map((item) => `${item.meta} - ${item.text}`).join("\n");
  navigator.clipboard.writeText(text);
});

elements.clearHistory.addEventListener("click", () => {
  state.history = [];
  updateHistory();
  saveState();
});

elements.exportPdf.addEventListener("click", exportPdf);

elements.timerStart.addEventListener("click", () => {
  if (timerState.running) {
    stopTimer();
  } else {
    startTimer();
  }
});

elements.timerReset.addEventListener("click", resetTimer);

elements.timerPresets.forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = Number.parseInt(button.dataset.minutes, 10);
    setTimerDuration(minutes);
  });
});

if (elements.sidebarToggle) {
  elements.sidebarToggle.addEventListener("click", () => {
    if (elements.sidebar.classList.contains("open")) {
      closeSidebar();
      return;
    }
    openSidebar();
  });
}

elements.sidebarBackdrop.addEventListener("click", closeSidebar);

loadState();
applyQueryParams();
syncControls();

const hasQuery = window.location.search.length > 1;
if (hasQuery || !state.pools.truth.leve || !state.pools.truth.quente || !state.pools.truth.fogo) {
  resetPools();
} else {
  updateStats();
}
