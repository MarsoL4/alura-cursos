# Material de Aprofundamento

A ideia é oferecer um caminho prático de aprofundamento: começando pela documentação oficial, passando por ferramentas de apoio, artigos importantes e espaços de comunidade. Em cada item, há uma breve explicação sobre o que o estudante vai encontrar e como aquele recurso pode ajudar no aprendizado.

## 📚 Documentação Oficial

- **[Context Engineering for Agents — Anthropic](https://www.anthropic.com/engineering/context-engineering)**
  Explica como estruturar contexto de forma eficiente para agentes baseados em LLMs. É um material importante para entender como organizar instruções, memória, histórico e dados de apoio, ajudando o estudante a projetar agentes mais estáveis, úteis e previsíveis.

- **[Building Effective Agents — Anthropic Research](https://www.anthropic.com/research/building-effective-agents)**
  Apresenta princípios e boas práticas para construir agentes realmente eficazes. Esse conteúdo ajuda o estudante a enxergar além do prompt isolado, entendendo como combinar raciocínio, ferramentas, contexto e fluxo de execução em sistemas mais robustos.

- **[Claude Code: Memória e AGENTS.md](https://code.claude.com/docs/en/memory)**
  Mostra como funciona a memória no Claude Code e o papel do arquivo `AGENTS.md` na orientação do comportamento do agente. É útil para quem quer aprender a dar continuidade ao trabalho entre sessões e manter instruções persistentes e organizadas.

- **[Claude Code: Hooks](https://code.claude.com/docs/en/hooks)**
  Documenta o uso de hooks no Claude Code, permitindo acionar comportamentos automáticos em momentos específicos do fluxo. Esse recurso é valioso para o estudante que deseja automatizar verificações, customizar processos e tornar o agente mais integrado ao ambiente de desenvolvimento.

- **[Prompt Caching — Anthropic Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)**
  Explica como reutilizar partes de prompts para reduzir custo e latência. Esse tema é especialmente útil para quem pretende trabalhar com aplicações em escala, pois mostra como otimizar chamadas sem perder consistência no contexto enviado ao modelo.

- **[Precificação da API Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)**
  Apresenta os preços dos modelos e recursos da API da Anthropic. É importante para o estudante entender os custos envolvidos em prototipagem e produção, além de aprender a tomar decisões técnicas com consciência financeira.

- **[Guia completo de Skills para Claude (PDF) / Docs](https://code.claude.com/docs/en/skills)**
  Reúne orientações práticas para criar skills no ecossistema do Claude. É um material útil para quem deseja transformar tarefas recorrentes em fluxos reutilizáveis, organizados e mais produtivos.

- **[Prompt Engineering Guide (Anthropic)](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)**
  Traz uma visão estruturada sobre escrita de prompts, padrões de instrução e boas práticas. Serve como base para estudantes que querem evoluir da experimentação informal para uma abordagem mais técnica e consistente em prompting.

## 🛠️ Ferramentas

- **[Claude Code Statusline](https://github.com/hugohvf/claude-code-statusline)**
  Projeto voltado para exibir informações de status durante o uso do Claude Code. É interessante para estudantes que querem melhorar a observabilidade da experiência de desenvolvimento e acompanhar melhor o que o agente está fazendo.

- **[Langfuse — observabilidade para LLMs](https://langfuse.com/)**
  Plataforma de observabilidade para aplicações com modelos de linguagem. Ajuda o estudante a monitorar prompts, respostas, custos, traces e desempenho, o que é essencial em projetos mais sérios e ambientes de produção.

- **[Claude Skills Hub (marketplace)](https://github.com/anthropics/skills)**
  Espaço para explorar skills disponíveis no ecossistema Claude. É útil para entender casos de uso prontos, descobrir padrões de automação e se inspirar para criar novas skills.

- **[CLAUDE.md Gallery](https://github.com/anthropics/claude-md-gallery)** *(Referência de comunidade)*
  Galeria com exemplos de arquivos `CLAUDE.md` / `AGENTS.md`. Pode ajudar o estudante a aprender, por comparação, como organizar instruções persistentes, convenções de projeto e preferências de uso para o agente.

## 📄 Artigos e Papers

- **[Lost in the Middle (Stanford/UC Berkeley)](https://arxiv.org/abs/2307.03172)**
  Paper importante sobre como modelos de linguagem lidam com informações distribuídas em contextos longos. É muito útil para entender limitações práticas no uso de janelas extensas de contexto e melhorar a forma de organizar informações relevantes.

- **[LLM Patterns (Eugene Yan)](https://eugeneyan.com/writing/llm-patterns/)**
  Artigo que reúne padrões recorrentes no desenvolvimento com LLMs. Ajuda o estudante a identificar arquiteturas e estratégias que aparecem com frequência em aplicações reais, facilitando a construção de repertório técnico.

- **[Building a C Compiler with Claude](https://www.anthropic.com/news/building-a-c-compiler-with-claude)**
  Relato prático de uso do Claude em uma tarefa complexa de engenharia. É um bom exemplo para perceber até onde um agente pode ir em atividades técnicas quando bem orientado, além de mostrar limites e boas práticas.

- **[ReAct: Reasoning + Acting in LLMs](https://arxiv.org/abs/2210.03629)**
  Paper clássico que apresenta a combinação entre raciocínio e ação em modelos de linguagem. É leitura essencial para quem quer entender a base conceitual de muitos agentes modernos que pensam, planejam e usam ferramentas.

- **[Simon Willison — Prompting Guide](https://simonwillison.net/)**
  Guia prático com observações úteis sobre prompting e interação com modelos. É um recurso acessível e valioso para melhorar a clareza das instruções e obter respostas mais úteis e confiáveis.

## 💬 Comunidade

- **[Claude Code Discussions (GitHub)](https://github.com/anthropics/claude-code/discussions)**
  Espaço de discussão sobre Claude Code no GitHub. É útil para tirar dúvidas, acompanhar problemas comuns, descobrir soluções práticas e aprender com experiências compartilhadas por outros usuários.

- **[Anthropic Discord](https://discord.com/invite/anthropic)**
  Comunidade oficial no Discord para trocar ideias e acompanhar discussões sobre produtos e recursos da Anthropic. Pode ser um bom espaço para aprendizado contínuo e contato com novidades.

- **[Anthropic Engineering Blog](https://www.anthropic.com/engineering)**
  Blog de engenharia da Anthropic com textos técnicos, relatos de projeto e reflexões sobre desenvolvimento de sistemas de IA. É um ótimo recurso para quem quer complementar a documentação com contexto prático e visão de engenharia aplicada.
