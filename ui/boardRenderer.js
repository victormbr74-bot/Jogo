const TILE_SIZE = 44;
const TOKEN_RADIUS = 12;

const createSvgEl = (name) => document.createElementNS("http://www.w3.org/2000/svg", name);

export class BoardRenderer {
  constructor(svgEl, options = {}) {
    this.svg = svgEl;
    this.tiles = [];
    this.tileMap = new Map();
    this.tokenMap = new Map();
    this.onTileClick = options.onTileClick || null;
    this.pathGroup = null;
    this.tileGroup = null;
    this.tokenGroup = null;
  }

  load(boardData) {
    this.tiles = boardData.tiles || [];
    this.tileMap = new Map(this.tiles.map((tile) => [tile.id, tile]));
    this.svg.setAttribute("viewBox", `0 0 ${boardData.width} ${boardData.height}`);
    this.svg.setAttribute("role", "img");
    this.svg.innerHTML = "";

    this.pathGroup = createSvgEl("g");
    this.tileGroup = createSvgEl("g");
    this.tokenGroup = createSvgEl("g");
    this.svg.append(this.pathGroup, this.tileGroup, this.tokenGroup);

    this.drawPath(boardData.connections || []);
    this.drawTiles();
  }

  drawPath(connections) {
    if (!connections.length) return;
    const path = createSvgEl("path");
    const points = connections
      .map((conn) => this.tileMap.get(conn.from))
      .filter(Boolean)
      .map((tile) => [tile.x, tile.y]);
    const lastTile = this.tileMap.get(connections[connections.length - 1].to);
    if (lastTile) points.push([lastTile.x, lastTile.y]);
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
      const rect = createSvgEl("rect");
      rect.setAttribute("x", tile.x - TILE_SIZE / 2);
      rect.setAttribute("y", tile.y - TILE_SIZE / 2);
      rect.setAttribute("width", TILE_SIZE);
      rect.setAttribute("height", TILE_SIZE);
      rect.setAttribute("rx", 10);
      rect.setAttribute("ry", 10);
      const text = createSvgEl("text");
      text.setAttribute("x", tile.x);
      text.setAttribute("y", tile.y + 4);
      text.setAttribute("text-anchor", "middle");
      text.textContent = String(tile.id);
      group.append(rect, text);
      if (this.onTileClick) {
        group.addEventListener("click", () => this.onTileClick(tile));
      }
      this.tileGroup.appendChild(group);
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
}
