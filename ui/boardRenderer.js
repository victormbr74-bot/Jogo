const DEFAULT_GRID = {
  rows: 10,
  cols: 5,
  tileSize: 72,
  gap: 14,
  padding: 24
};
const TOKEN_RADIUS = 12;

const createSvgEl = (name) => document.createElementNS("http://www.w3.org/2000/svg", name);

export class BoardRenderer {
  constructor(svgEl, options = {}) {
    this.svg = svgEl;
    this.tiles = [];
    this.tileMap = new Map();
    this.tileElMap = new Map();
    this.tokenMap = new Map();
    this.onTileClick = options.onTileClick || null;
    this.pathGroup = null;
    this.tileGroup = null;
    this.tokenGroup = null;
    this.grid = { ...DEFAULT_GRID };
    this.boardSize = { width: 0, height: 0 };
    this.activeTileId = null;
    this.previewTileId = null;
  }

  load(boardData) {
    this.tiles = boardData.tiles || [];
    this.tileMap = new Map(this.tiles.map((tile) => [tile.id, tile]));
    this.tileElMap.clear();
    this.grid = {
      rows: boardData.rows ?? DEFAULT_GRID.rows,
      cols: boardData.cols ?? DEFAULT_GRID.cols,
      tileSize: boardData.tileSize ?? DEFAULT_GRID.tileSize,
      gap: boardData.gap ?? DEFAULT_GRID.gap,
      padding: boardData.padding ?? DEFAULT_GRID.padding
    };
    this.boardSize = {
      width:
        this.grid.padding * 2 +
        this.grid.cols * this.grid.tileSize +
        Math.max(this.grid.cols - 1, 0) * this.grid.gap,
      height:
        this.grid.padding * 2 +
        this.grid.rows * this.grid.tileSize +
        Math.max(this.grid.rows - 1, 0) * this.grid.gap
    };
    boardData.width = this.boardSize.width;
    boardData.height = this.boardSize.height;
    this.tiles.forEach((tile) => {
      const center = this.getTileCenter(tile);
      tile.x = center.x;
      tile.y = center.y;
    });
    this.svg.setAttribute("viewBox", `0 0 ${this.boardSize.width} ${this.boardSize.height}`);
    this.svg.setAttribute("role", "img");
    this.svg.innerHTML = "";

    const defs = createSvgEl("defs");
    defs.innerHTML = `
      <filter id="tileInset" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feOffset dx="0" dy="2" result="offsetBlur" />
        <feComposite in="offsetBlur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
        <feColorMatrix
          in="innerShadow"
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.65 0"
          result="shadowColor"
        />
        <feComposite in="shadowColor" in2="SourceGraphic" operator="over" />
      </filter>
    `;

    this.pathGroup = createSvgEl("g");
    this.tileGroup = createSvgEl("g");
    this.tokenGroup = createSvgEl("g");
    this.svg.append(defs, this.pathGroup, this.tileGroup, this.tokenGroup);

    this.drawPath(boardData.connections || []);
    this.drawTiles();
  }

  drawPath(connections) {
    const orderedTiles = connections.length
      ? connections
          .map((conn) => this.tileMap.get(conn.from))
          .filter(Boolean)
          .concat(
            connections.length
              ? [this.tileMap.get(connections[connections.length - 1].to)]
              : []
          )
      : [...this.tiles].sort((a, b) => a.id - b.id);
    const points = orderedTiles.filter(Boolean).map((tile) => [tile.x, tile.y]);
    if (points.length < 2) return;
    const path = createSvgEl("path");
    const d = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`)
      .join(" ");
    path.setAttribute("d", d);
    path.classList.add("path-line");
    this.pathGroup.appendChild(path);
  }

  drawTiles() {
    this.tiles.forEach((tile) => {
      const group = createSvgEl("g");
      group.classList.add("tile", tile.zone, tile.type);
      group.dataset.id = tile.id;
      const half = this.grid.tileSize / 2;
      const radius = Math.round(this.grid.tileSize * 0.2);
      const rect = createSvgEl("rect");
      rect.classList.add("tile-base");
      rect.setAttribute("x", tile.x - half);
      rect.setAttribute("y", tile.y - half);
      rect.setAttribute("width", this.grid.tileSize);
      rect.setAttribute("height", this.grid.tileSize);
      rect.setAttribute("rx", radius);
      rect.setAttribute("ry", radius);
      const inset = createSvgEl("rect");
      inset.classList.add("tile-inset");
      inset.setAttribute("x", tile.x - half);
      inset.setAttribute("y", tile.y - half);
      inset.setAttribute("width", this.grid.tileSize);
      inset.setAttribute("height", this.grid.tileSize);
      inset.setAttribute("rx", radius);
      inset.setAttribute("ry", radius);
      inset.setAttribute("filter", "url(#tileInset)");
      const text = createSvgEl("text");
      text.classList.add("tile-number");
      text.setAttribute("x", tile.x);
      text.setAttribute("y", tile.y + 4);
      text.setAttribute("text-anchor", "middle");
      text.textContent = String(tile.id);
      const icon = this.getTileIcon(tile);
      if (icon) {
        const iconText = createSvgEl("text");
        iconText.classList.add("tile-icon");
        iconText.setAttribute("x", tile.x - half + 10);
        iconText.setAttribute("y", tile.y - half + 16);
        iconText.textContent = icon;
        group.append(rect, inset, iconText, text);
      } else {
        group.append(rect, inset, text);
      }
      if (this.onTileClick) {
        group.addEventListener("click", () => this.onTileClick(tile));
      }
      this.tileGroup.appendChild(group);
      this.tileElMap.set(tile.id, group);
    });
  }

  createTokens(players) {
    this.tokenGroup.innerHTML = "";
    this.tokenMap.clear();
    players.forEach((player) => {
      const token = createSvgEl("g");
      token.classList.add("token");
      token.dataset.playerId = player.id;
      const circle = createSvgEl("circle");
      circle.setAttribute("r", TOKEN_RADIUS);
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", 0);
      circle.setAttribute("fill", player.color);
      const text = createSvgEl("text");
      text.setAttribute("x", 0);
      text.setAttribute("y", 4);
      text.setAttribute("text-anchor", "middle");
      text.textContent = player.label;
      token.append(circle, text);
      this.tokenGroup.appendChild(token);
      this.tokenMap.set(player.id, token);
    });
  }

  updateTokens(players) {
    const grouped = new Map();
    players.forEach((player) => {
      const list = grouped.get(player.position) || [];
      list.push(player);
      grouped.set(player.position, list);
    });

    players.forEach((player) => {
      const token = this.tokenMap.get(player.id);
      const tile = this.tileMap.get(player.position);
      if (!token || !tile) return;
      const stack = grouped.get(player.position) || [];
      const index = stack.findIndex((p) => p.id === player.id);
      const total = stack.length || 1;
      const angle = total === 1 ? 0 : (index / total) * Math.PI * 2;
      const offset = total === 1 ? 0 : TOKEN_RADIUS;
      const x = tile.x + Math.cos(angle) * offset;
      const y = tile.y + Math.sin(angle) * offset;
      token.setAttribute("transform", `translate(${x}, ${y})`);
    });
  }

  getTileCenter(tile) {
    const { tileSize, gap, padding } = this.grid;
    return {
      x: padding + tile.col * (tileSize + gap) + tileSize / 2,
      y: padding + tile.row * (tileSize + gap) + tileSize / 2
    };
  }

  getTileCenterById(tileId) {
    const tile = this.tileMap.get(tileId);
    if (!tile) return null;
    return { x: tile.x, y: tile.y };
  }

  getBoardSize() {
    return { ...this.boardSize };
  }

  setActiveTile(tileId) {
    if (this.activeTileId && this.tileElMap.has(this.activeTileId)) {
      this.tileElMap.get(this.activeTileId).classList.remove("is-active");
    }
    this.activeTileId = tileId;
    if (this.activeTileId && this.tileElMap.has(this.activeTileId)) {
      this.tileElMap.get(this.activeTileId).classList.add("is-active");
    }
  }

  setPreviewTile(tileId) {
    if (this.previewTileId && this.tileElMap.has(this.previewTileId)) {
      this.tileElMap.get(this.previewTileId).classList.remove("is-preview");
    }
    this.previewTileId = tileId;
    if (this.previewTileId && this.tileElMap.has(this.previewTileId)) {
      this.tileElMap.get(this.previewTileId).classList.add("is-preview");
    }
  }

  clearPreview() {
    if (this.previewTileId && this.tileElMap.has(this.previewTileId)) {
      this.tileElMap.get(this.previewTileId).classList.remove("is-preview");
    }
    this.previewTileId = null;
  }

  refreshTheme() {
    if (this.activeTileId) this.setActiveTile(this.activeTileId);
    if (this.previewTileId) this.setPreviewTile(this.previewTileId);
  }

  getTileIcon(tile) {
    if (tile.type === "start") return "S";
    if (tile.type === "finish") return "F";
    if (tile.type === "comprar_carta") return "C";
    if (tile.type === "especial") return "!";
    if (tile.type === "verdade") return "V";
    if (tile.type === "desafio") return "D";
    if (tile.type === "acao_visual") return "A";
    return "";
  }
}
