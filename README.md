# Fogo & Seda - Tabuleiro

Jogo adulto, consensual e seguro. Roda 100% no navegador (GitHub Pages), sem backend.

## Estrutura

- `index.html` layout principal.
- `styles.css` tema e responsividade.
- `data/board.json` tabuleiro com 50 casas em grade (row/col).
- `data/actions.json` acoes base (verdade, desafio, acao_visual).
- `data/normal_cards.json` baralho de cartas normais.
- `data/event6_cards.json` baralho de cartas evento 6.
- `ui/app.js` logica do jogo, estado, fluxo e editor.
- `ui/boardRenderer.js` render do tabuleiro SVG.
- `ui/modals.js` utilitarios de modal.
- `utils/storage.js` persistencia no localStorage.
- `utils/validation.js` validacao e normalizacao.
- `utils/random.js` sorteio e utilitarios aleatorios.

## Como editar o tabuleiro (board.json)

- Edite `data/board.json`.
- O tabuleiro e uma grade zig-zag: `rows`, `cols`, `tileSize`, `gap`, `padding`.
- Cada casa exige: `id`, `row`, `col`, `zone`, `type`.
- `zone`: `leve`, `quente`, `final`.
- `type`: `start`, `finish`, `verdade`, `desafio`, `acao_visual`, `comprar_carta`, `especial`.
- Para casas especiais, use:

```json
{
  "id": 8,
  "row": 1,
  "col": 2,
  "zone": "leve",
  "type": "especial",
  "special": { "action": "advance", "steps": 2 }
}
```

- A ordem das casas (1..50) define o caminho em zig-zag no renderer.
- Para ajustar o tamanho do tabuleiro, altere `tileSize`, `gap` e `padding`.

## Tema, zonas e visual premium

- Cores base e zonas ficam em `styles.css` via CSS variables:
  `--bg`, `--surface`, `--surface-2`, `--text`, `--muted`,
  `--zone-leve`, `--zone-quente`, `--zone-final`.
- A cor do cacador e o `--accent`. Para trocar dinamicamente use:

```js
window.applyTheme({ accent: "#e04f5f" });
```

- Tiles usam brilho por zona, sombra interna e bordas destacadas.
- Decks usam pilha inclinada e o contador mostra o total de cartas.

## Como adicionar cartas e acoes (Meu Baralho)

1. Clique em `Preferencias`.
2. Abra `Meu Baralho`.
3. Use `Adicionar` para criar acoes, cartas normais ou cartas evento 6.
4. Para editar base, use `Duplicar` e edite a copia.
5. `Exportar JSON` baixa apenas seus itens locais.
6. `Importar JSON` substitui suas listas salvas.

Persistencia local:
- `user_actions_v1`
- `user_cards_normal_v1`
- `user_cards_event6_v1`

## Pontuacao

- Executar acao: +2 pontos.
- Acoes obrigatorias executadas: +3 pontos.
- Recusar acao: -1 ponto (minimo 0).
- O placar destaca o lider e jogadores bloqueados.

## Checklist de testes

- Dado anima e move a peca casa a casa (com 6 acionando carta evento 6).
- Casas `comprar_carta` mostram 3 cartas e permitem escolher 1.
- Penalidade ao recusar: volta 3 casas, perde 1 rodada, bloqueio de interacao.
- Filtros removem cartas/acoes e avisam quando nao ha equivalentes.
- Pecas nao se sobrepoem na mesma casa (offset automatico).
- Placar atualiza em tempo real e destaca lider/bloqueado.
- Botao `Centralizar na minha peca` funciona no mobile.
- PDF exporta configuracoes e historico recente (ate 30).
