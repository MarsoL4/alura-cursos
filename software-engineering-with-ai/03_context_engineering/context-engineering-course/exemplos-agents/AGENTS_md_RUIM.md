# ❌ EXEMPLO RUIM de AGENTS.md
# Regras boas vs. regras que a IA ignora
# Context Engineering e workflows complexos

> **Como usar este arquivo:** Leia os comentários em `<!-- -->` para entender
> POR QUE cada trecho é considerado um problema. Use em comparação com o
> arquivo `AGENTS_md_BOM.md`.

---

# AGENTS.md

## ❌ Sobre o projeto

Este é um projeto de software moderno que usa tecnologias recentes e segue
boas práticas de desenvolvimento. O time é comprometido com qualidade e
entrega de valor para os usuários.

<!-- ❌ PROBLEMA: Completamente vago. "Tecnologias recentes" e "boas práticas"
não dizem nada ao agent. Ele não sabe qual linguagem, framework, versão,
gerenciador de pacotes ou estrutura de pastas usar. Isso ocupa tokens sem
entregar contexto útil. -->

## ❌ Regras gerais

- Sempre escreva código limpo e legível.
- Siga as boas práticas do mercado.
- Seja cuidadoso ao fazer mudanças.
- Pense bem antes de responder.
- Faça o melhor que puder.
- Nunca esqueça de testar.
- Lembre-se de documentar o código.

<!-- ❌ PROBLEMA: "Código limpo", "boas práticas do mercado" e "seja cuidadoso"
são instruções não-acionáveis. O agent não tem como verificar se obedeceu.
São afirmações tão genéricas que seriam válidas para qualquer projeto de
qualquer empresa do mundo — ou seja, não fazem diferença nenhuma. Além disso,
"pense bem antes de responder" e "faça o melhor que puder" são instruções que
o model já segue por padrão. Tokens desperdiçados. -->

## ❌ Sobre o código

O código deve ser bem organizado. Use variáveis com nomes descritivos. Evite
funções muito longas. Prefira soluções simples quando possível. Não use
código desnecessário. Tente manter a consistência com o restante do projeto.

<!-- ❌ PROBLEMA: Redundante com o que modelos modernos já fazem
automaticamente. "Variáveis com nomes descritivos" e "evite funções longas"
são conselhos de livro introdutório — não orientações específicas do seu
projeto. O agent vai ignorar isso na prática porque não há acionamento claro.
"Tente manter consistência" é vago demais para ser verificável. -->

## ❌ Testes

Sempre escreva testes para seu código. Testes são importantes para garantir a
qualidade do software. Tente ter boa cobertura de testes. Use testes
unitários, de integração e end-to-end quando necessário.

<!-- ❌ PROBLEMA: Não diz qual framework de testes usar. Não diz onde ficam
os testes (pasta separada? junto ao código?). Não informa o comando para
rodar. Não define cobertura mínima. "Quando necessário" é uma não-instrução —
o agent não sabe quando isso se aplica. Resultado: o agent vai adivinhar, e
vai adivinhar diferente toda vez. -->

## ❌ Git e commits

Use mensagens de commit descritivas. Faça commits pequenos e frequentes.
Siga o GitFlow. Não commite código quebrado. Revise o código antes de fazer
push. Use branches para novas features.

<!-- ❌ PROBLEMA: "Use mensagens de commit descritivas" sem mostrar um exemplo
do formato esperado. "Siga o GitFlow" sem definir qual variação (existem
várias). "Não commite código quebrado" é óbvio. Nenhum desses itens é
verificável — o agent não sabe o que você considera "quebrado" ou
"descritivo". -->

## ❌ Segurança

Pense em segurança. Não exponha dados sensíveis. Valide as entradas do
usuário. Use variáveis de ambiente para configurações importantes.

<!-- ❌ PROBLEMA: Extremamente vago. "Pense em segurança" não é instrução.
Não especifica quais arquivos nunca devem ser lidos ou modificados (.env,
secrets/, etc). Não diz o que fazer se encontrar credenciais. O agent pode
"pensar em segurança" e ainda assim commitar um .env porque ninguém disse
explicitamente para não fazer isso. -->

## ❌ Sobre a IA

Você é um assistente de programação especialista. Você deve ajudar o
desenvolvedor da melhor forma possível. Use seu conhecimento para entregar
soluções de alta qualidade. Seja preciso e detalhado nas respostas. Explique
o que você está fazendo em cada passo.

<!-- ❌ PROBLEMA GRAVE: Roleplay de identidade desnecessário. O agent já sabe
que é um assistente de programação — isso não precisa ser dito. "Seja preciso
e detalhado" e "explique cada passo" às vezes são desejáveis, às vezes não.
Sem condição de acionamento, o agent vai ou sempre explicar (verboso demais)
ou nunca (ignora a regra). Essa seção toda ocupa tokens sem nenhum valor. -->

## ❌ Arquitetura

O projeto segue uma arquitetura limpa e bem organizada. Os componentes são
separados por responsabilidade. O frontend se comunica com o backend através
de APIs. O banco de dados armazena os dados de forma persistente.

<!-- ❌ PROBLEMA: Isso descreve qualquer aplicação web da história. Não há
informação específica: qual arquitetura (MVC? Hexagonal? Clean Architecture?),
qual separação de pastas, como o frontend se chama, qual endpoint base da API,
qual banco de dados, qual ORM. O agent vai fazer suposições diferentes em
cada sessão. -->

## ❌ Performance

Preocupe-se com a performance do sistema. Evite consultas desnecessárias ao
banco de dados. Use cache quando apropriado. Otimize o código quando necessário.

<!-- ❌ PROBLEMA: "Quando apropriado" e "quando necessário" aparecem em quase
toda instrução deste arquivo. São condições não-definidas. O agent não tem
critérios para aplicar essas regras. Vai ou ignorar ou aplicar em momentos
errados. -->

## ❌ Boas práticas de desenvolvimento

- DRY (Don't Repeat Yourself)
- SOLID
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Clean Code

<!-- ❌ PROBLEMA: Siglas sem contexto. DRY e SOLID podem significar coisas
diferentes em Python, TypeScript ou Java. Sem exemplos concretos do que isso
significa no SEU projeto, o agent vai usar sua própria interpretação —
que pode não ser a sua. Listar princípios famosos não é instrução, é
decoração de AGENTS.md. -->

## ❌ Outros

Se tiver dúvidas, pergunte. Tente entender bem o problema antes de codificar.
Sempre revise o código gerado. Use o bom senso. Adapte as regras acima
ao contexto.

<!-- ❌ PROBLEMA FINAL: "Use o bom senso" e "adapte as regras ao contexto"
contradizem todo o propósito de ter um AGENTS.md. Se as regras precisam de
adaptação no contexto, elas não são regras — são sugestões vagas. O agent
vai tratá-las como tal e ignorá-las quando forem inconvenientes. -->

---

## ❌ Resumo dos antipadrões deste exemplo

| Antipadrão | Impacto |
|---|---|
| Instruções não-acionáveis ("seja cuidadoso") | Agent ignora na prática |
| Roleplay desnecessário ("você é um especialista") | Tokens desperdiçados |
| Condições vagas ("quando necessário") | Agent não sabe quando aplicar |
| Princípios sem exemplos (DRY, SOLID) | Interpretação arbitrária |
| Informações óbvias ("não commite código quebrado") | Ruído sem sinal |
| Arquitetura genérica ("frontend + backend + banco") | Qualquer projeto se encaixa |
| Stack sem versão ("tecnologias modernas") | Agent vai adivinhar |
| Ausência de path-scoping | Regras globais onde deveriam ser locais |
| Sem comandos concretos (build, test, lint) | Agent não sabe como rodar o projeto |
| Excesso de tokens sem valor | Degrada prompt cache e custo |
