# Resumo — O que incluir e o que evitar no AGENTS.md
# Regras boas vs. regras que a IA ignora
# Context Engineering e workflows complexos

---

## O que colocar (e o que deixar de fora)

| ✅ Incluir | ❌ Excluir |
|---|---|
| Comandos ou fluxos que o assistente não adivinha só pela leitura do repositório | O que já fica claro ao explorar o código |
| Regras de estilo que diferem do padrão do time ou da linguagem | Convenções genéricas que o modelo já conhece bem |
| Instruções de teste e o test runner preferido | Documentação extensa de API (prefira link ou referência curta) |
| Etiqueta do repositório (nomenclatura de branches, convenções de PR) | Informações que mudam com frequência |
| Decisões arquiteturais específicas do projeto | Explicações longas ou tutoriais |
| Peculiaridades do ambiente (variáveis de ambiente necessárias, setup não óbvio) | Descrições arquivo a arquivo da codebase |
| Armadilhas comuns ou comportamentos não óbvios | Práticas vazias como “escreva código limpo” |

---

## Onde colocar o arquivo

Você pode versionar instruções para agentes em vários locais. O nome e o formato dependem da ferramenta — exemplos comuns: **`agents.md`** / **`AGENTS.md`** (Cursor e outros) e **`claude.md`** / **`CLAUDE.md`** (Claude Code); alguns editores usam ainda `.cursor/rules` ou equivalentes.

- **Pasta home ou config global** (ex.: `~/.claude/CLAUDE.md` no Claude Code, ou regras globais do seu editor): vale para todas as sessões daquele ambiente.
- **Raiz do projeto** (`./AGENTS.md`, `./agents.md`, `./CLAUDE.md`, etc.): commite no git para o time compartilhar o mesmo contexto.
- **Diretórios pai**: útil em monorepos — arquivo na raiz e em subpastas podem ser carregados em camadas.
- **Diretórios filhos**: muitas ferramentas carregam instruções de subpastas sob demanda, quando você trabalha em arquivos daquele trecho da árvore.
