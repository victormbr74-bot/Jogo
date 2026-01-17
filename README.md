# Fogo & Seda — Verdade ou Consequência

Jogo adulto, consensual e seguro. Funciona 100% no navegador (GitHub Pages), sem backend.

## Estrutura

- `index.html` — layout principal.
- `styles.css` — estilos, tema e responsividade.
- `data/items.json` — base de itens com metadados.
- `ui/app.js` — estado, UI, sorteio e historico.
- `utils/validation.js` — validacao e filtros.
- `utils/random.js` — sorteio inteligente e antirrepetição.
- `utils/storage.js` — persistencia no localStorage.
- `utils/text.js` — normalizacao e highlight.

## Esquema do items.json

```json
{
  "id": "L-C-T-01",
  "type": "truth",
  "level": "leve",
  "mode": ["solo", "casal", "grupo"],
  "text": "Texto em PT-BR natural",
  "tags": ["romance", "conexao"],
  "bans": { "oral": false, "dominacao": false, "nudez": false },
  "duration_hint": 30,
  "fallback": false
}
```

Campos obrigatorios:
- `id`, `type`, `level`, `mode`, `text`, `tags`, `bans`

Observacoes:
- `id` usa o padrão `L|Q|F` (nível) + `C|S|G|FB` (modo) + `T|D` (tipo) + número.
- `fallback` é opcional. Use `true` para itens universais de emergência por nível.

## Como adicionar/editar itens

1. Abra `data/items.json`.
2. Copie um item existente e edite `id`, `text`, `tags` e `bans`.
3. Mantenha coerência de nível:
   - `leve`: conversa e carinho (sem explícito).
   - `quente`: flerte e toques leves.
   - `fogo`: desejo explicito (marque `bans` quando envolver oral, nudez, dominacao).
4. Evite itens que exijam acessorios especiais ou ambientes fora de casa.

## Filtros, bloqueio e equivalencia

- Filtros rapidos (sem oral, sem dominacao, sem nudez) removem itens com `bans` correspondentes.
- Palavra-chave filtra e destaca texto do item (normaliza acentos).
- Palavras bloqueadas removem itens que contenham o termo (case-insensitive e sem acento).
- Ao trocar, o sistema busca equivalente do mesmo tipo, nível e modo.

## Parametros de URL

Exemplo:

```
?level=quente&mode=casal&no_oral=1&no_dom=1&no_nudez=1&norepeat=12&theme=ember
```

## Checklist manual

- Filtros excluem itens corretamente.
- Trocar equivalente funciona (mesmo tipo/level/modo).
- Antirrepetição respeita as últimas N rodadas.
- Link com params restaura configuração.
- PDF exporta título, configurações, histórico e aviso 18+.
- Layout mobile OK com painel de configurações.
