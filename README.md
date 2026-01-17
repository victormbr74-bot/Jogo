# Fogo & Seda — Verdade ou Consequência

Jogo adulto, consensual e seguro. Funciona 100% no navegador (GitHub Pages), sem backend.

## Estrutura

- `index.html` — layout principal.
- `styles.css` — estilos e responsividade.
- `data/items.json` — base de itens com metadados.
- `ui/app.js` — logica de UI e estados.
- `utils/validation.js` — validacao e filtros.
- `utils/random.js` — sorteio inteligente e antirepeticao.
- `utils/storage.js` — persistencia no localStorage.
- `utils/qr.js` — geracao offline de QR code.

## Esquema do items.json

```json
{
  "id": "L-C-01",
  "type": "truth",
  "level": "leve",
  "mode": ["solo", "casal", "grupo"],
  "text": "Texto em PT-BR natural",
  "tags": ["romance", "conexao"],
  "bans": { "oral": false, "dominacao": false, "nudez": false },
  "duration_hint": 30
}
```

Campos obrigatorios:
- `id`, `type`, `level`, `mode`, `text`, `tags`, `bans`

## Como adicionar/editar itens

1. Abra `data/items.json`.
2. Copie um item existente e edite `id`, `text`, `tags` e `bans`.
3. Mantenha coerência de nível:
   - `leve`: conversa e carinho (sem explícito).
   - `quente`: flerte e toques leves.
   - `fogo`: desejo explicito (marque `bans` quando envolver oral, nudez, dominacao).

## Filtros e bloqueio de palavras

- Filtros rapidos (sem oral, sem dominacao, sem nudez) removem itens com `bans` correspondentes.
- Palavra-chave filtra e destaca texto do item.
- Palavras bloqueadas removem itens que contenham o termo (case-insensitive e sem acento).

## Checklist manual

- Filtros excluem itens corretamente.
- Trocar equivalente funciona (mesmo tipo/level/modo).
- Antirepeticao respeita as ultimas N rodadas.
- Link com params restaura configuração.
- PDF exporta título, configurações, histórico e aviso 18+.
- Layout mobile OK com painel de configurações.
