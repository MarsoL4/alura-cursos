# Material de apoio — Context Engineering e workflows complexos

Repositório de apoio sobre **desenvolvimento com IA focado em contexto e fluxos de trabalho** (Alura).

Aqui estão **exemplos comentados** (instruções persistentes, prompts e decisão de sessão), além das **ferramentas de medição** usadas na parte inicial do material. O fio condutor é: **você só pode melhorar o que consegue medir**.

---

## O que há neste repositório

### `exemplos-agents/` — regras boas vs. regras que a IA ignora

Dois `AGENTS.md` comentados (bom × ruim) e um resumo em tabela.

| Arquivo | O que é |
|---|---|
| `exemplos-agents/AGENTS_md_BOM.md` | Boas práticas: instruções acionáveis, stack com versões, comandos concretos, progressive disclosure e restrições binárias |
| `exemplos-agents/AGENTS_md_RUIM.md` | Antipadrões: instruções vagas, roleplay desnecessário, princípios sem contexto e tokens desperdiçados |
| `exemplos-agents/AGENTS_md_RESUMO.md` | Resumo rápido do que incluir e o que evitar, e onde versionar o arquivo |

Nos exemplos bom/ruim, comentários em HTML (`<!-- ✅ POR QUÊ / ❌ PROBLEMA -->`) explicam cada decisão. Leia os dois lado a lado para ver o contraste.

### `exemplos-promps/` — prompts ruim × bom

Cenários em **arquivos separados** (`01-code-review.md` … `06-restricao-explicita.md`) para abrir só o trecho em uso. Detalhes: `exemplos-promps/README.md`.

### `clear-compact-subagent/` — /compact vs. nova sessão vs. subagent

Árvore de decisão em Markdown e Mermaid (`compact-vs-nova-sessao-vs-subagent.md` / `.mermaid`) para escolher quando compactar, reabrir sessão ou delegar a um subagent.

---

## Ferramentas usadas neste material

### 🔍 AgentLens — AI Context Cost Scanner

**Repositório:** [github.com/alura-cursos/agentlens](https://github.com/alura-cursos/agentlens)

AgentLens escaneia repositórios em busca de arquivos de configuração de agentes (`AGENTS.md`, `CLAUDE.md`, `.cursorrules` e outros), resolve todas as referências e imports declarados nesses arquivos, e calcula o **custo real em tokens por requisição** — com suporte a 20+ modelos da Anthropic, OpenAI, Google, DeepSeek e outros.

**Por que entra aqui:**

A linha de raciocínio começa medindo custo antes de otimizar. AgentLens torna esse custo visível: você cola a URL do seu repositório (ou roda via CLI na pasta local) e vê quanto contexto seu `AGENTS.md` está consumindo em cada sessão — e quanto isso custa em dólares. Sem essa medição, melhorar o contexto é tiro no escuro.

**Como usar:**

```bash
# CLI (requer Node.js >= 18)
npm install -g @alura-cursos/agentlens
agentlens              # analisa o diretório atual
agentlens /path/repo   # analisa um caminho específico
agentlens --open       # abre o relatório no navegador
```

Ou baixe `agentlens.html` do repositório e cole a URL de qualquer repo público do GitHub direto no navegador.

---

### 📊 Claude Code Statusline

**Repositório:** [github.com/alura-cursos/claude-code-statusline](https://github.com/alura-cursos/claude-code-statusline)

Script de statusline para Claude Code que exibe, em tempo real no terminal, três camadas de informação sobre a sessão em andamento:

- Modelo em uso, diretório e branch git
- Barra de progresso da janela de contexto com porcentagem, tamanho, custo em USD/BRL e duração
- Taxa de acerto do prompt cache (tokens em cache custam 90% menos)

A barra muda de cor conforme o contexto se enche (verde → amarelo → vermelho), e emite aviso quando ultrapassa 200K tokens.

**Por que entra aqui:**

Context engineering sem observabilidade é cego. O statusline transforma o custo da sessão em algo que você vê o tempo todo — não como surpresa no final do mês, mas como painel de controle em tempo real. É um baseline visual útil na parte de medição e em comparações antes/depois.

**Como instalar:**

```bash
# Instalação em um comando
curl -fsSL https://raw.githubusercontent.com/alura-cursos/claude-code-statusline/main/install.sh | bash
```

Ou manualmente: baixe `statusline.sh` para `~/.claude/statusline.sh` e adicione ao seu `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```

Reinicie o Claude Code. Requer `bash`, `jq` e `git`.

---

## 📚 Aprofundamento e Referências

O arquivo **[Material.md](Material.md)** oferece um caminho prático de aprofundamento: começando pela documentação oficial, passando por ferramentas de apoio, artigos importantes e espaços de comunidade, com explicações sobre como cada recurso ajuda no aprendizado.
