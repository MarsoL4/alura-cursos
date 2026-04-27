import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { Comment } from './posts/entities/comment.entity';
import { Like } from './posts/entities/like.entity';
import { Post } from './posts/entities/post.entity';
import { User } from './users/entities/user.entity';
import { DataSource } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository(User);
  const postRepo = dataSource.getRepository(Post);
  const commentRepo = dataSource.getRepository(Comment);
  const likeRepo = dataSource.getRepository(Like);

  // Limpa dados existentes do seed (na ordem correta por FK)
  await likeRepo.delete({});
  await commentRepo.delete({});
  await postRepo.delete({});

  // Remove apenas os usuarios seed para re-criar
  await userRepo.delete({ email: 'julio@codeconnect.dev' });
  await userRepo.delete({ email: 'ana@codeconnect.dev' });
  await userRepo.delete({ email: 'marcos@codeconnect.dev' });

  // Cria usuários seed
  const hash = (pw: string) => bcrypt.hash(pw, 10);

  const julio = userRepo.create({
    name: 'Julio Silva',
    email: 'julio@codeconnect.dev',
    password: await hash('senha123'),
  });
  const ana = userRepo.create({
    name: 'Ana Costa',
    email: 'ana@codeconnect.dev',
    password: await hash('senha123'),
  });
  const marcos = userRepo.create({
    name: 'Marcos Oliveira',
    email: 'marcos@codeconnect.dev',
    password: await hash('senha123'),
  });

  await userRepo.save([julio, ana, marcos]);

  // Dados dos posts mockados
  const postsData = [
    {
      title: 'Construindo um Design System com React e TypeScript',
      content:
        'Neste post vou mostrar como criar um design system escalável usando React, TypeScript e Storybook. Vamos cobrir tokens de design, componentes atômicos, e como documentar tudo de forma eficiente para o time.\n\nUm design system bem construído economiza horas de desenvolvimento e garante consistência visual em toda a aplicação. Vamos começar pelos fundamentos: cores, tipografia e espaçamentos.',
      thumbnail: 'https://picsum.photos/seed/react-ds/800/450',
      tags: ['React', 'TypeScript', 'Design System', 'Front-end'],
      author: julio,
    },
    {
      title: 'NestJS: Arquitetura Modular para APIs Escaláveis',
      content:
        'NestJS é um framework Node.js que traz conceitos do Angular para o backend. Neste post vou mostrar como organizar módulos, controllers e services de forma escalável.\n\nVamos criar uma API REST completa com autenticação JWT, validação de dados e documentação Swagger. O NestJS facilita muito a criação de código bem estruturado e testável.',
      thumbnail: 'https://picsum.photos/seed/nestjs/800/450',
      tags: ['NestJS', 'Node.js', 'TypeScript', 'Back-end'],
      author: ana,
    },
    {
      title: 'Acessibilidade na Web: Por onde começar?',
      content:
        'Acessibilidade não é um recurso extra — é uma necessidade. Neste post vou abordar os conceitos fundamentais de WCAG, ARIA e como implementar componentes acessíveis do zero.\n\nVeremos como testar acessibilidade com screen readers, ferramentas de auditoria e como integrar verificações automatizadas no CI/CD.',
      thumbnail: 'https://picsum.photos/seed/a11y/800/450',
      tags: ['Acessibilidade', 'Front-end', 'HTML', 'CSS'],
      author: marcos,
    },
    {
      title: 'React Query: Gerenciamento de Estado Servidor',
      content:
        'React Query revolucionou a forma como lidamos com dados do servidor no React. Neste post vou mostrar como usar queries, mutations e cache de forma eficiente.\n\nVamos substituir useEffect + useState pelo pattern declarativo do React Query, reduzindo drasticamente o boilerplate e melhorando a experiência do usuário.',
      thumbnail: null,
      tags: ['React', 'React Query', 'State Management'],
      author: julio,
    },
    {
      title: 'Tailwind CSS v4: O que mudou?',
      content:
        'O Tailwind CSS v4 trouxe mudanças significativas na configuração e performance. Vamos explorar a nova sintaxe @theme no CSS, a eliminação do tailwind.config.js e as melhorias de velocidade.\n\nA nova abordagem CSS-first facilita muito a integração com design tokens e torna o código mais próximo do CSS nativo.',
      thumbnail: 'https://picsum.photos/seed/tailwind/800/450',
      tags: ['Tailwind CSS', 'CSS', 'Front-end'],
      author: ana,
    },
    {
      title: 'PostgreSQL Full Text Search: Do Básico ao Avançado',
      content:
        'O PostgreSQL possui capacidades nativas de busca full-text que muitas vezes substituem a necessidade de ferramentas como Elasticsearch. Vamos explorar tsvector, tsquery e índices GIN.\n\nNeste post vou mostrar como implementar busca em português com stemming correto e ranking de relevância.',
      thumbnail: null,
      tags: ['PostgreSQL', 'Back-end', 'Database', 'Performance'],
      author: marcos,
    },
    {
      title: 'Hooks Customizados: Abstraindo Lógica no React',
      content:
        'Hooks customizados são uma das features mais poderosas do React. Neste post vou mostrar como criar hooks reutilizáveis para casos comuns: formulários, requisições, debounce, e muito mais.\n\nVamos seguir boas práticas de nomenclatura, testes e documentação para garantir que os hooks sejam fáceis de usar e manter.',
      thumbnail: 'https://picsum.photos/seed/hooks/800/450',
      tags: ['React', 'Hooks', 'Front-end'],
      author: julio,
    },
    {
      title: 'Docker para Desenvolvedores Front-end',
      content:
        'Docker não é só para o time de backend! Neste post vou mostrar como containerizar aplicações React, configurar ambientes de desenvolvimento consistentes e usar Docker Compose para orquestrar serviços.\n\nVamos criar um setup que funciona igual em qualquer máquina, eliminando o clássico "funciona na minha máquina".',
      thumbnail: null,
      tags: ['Docker', 'DevOps', 'Front-end'],
      author: ana,
    },
    {
      title: 'Testing Library: Testes que Importam',
      content:
        'Testing Library mudou a forma como testamos componentes React. A filosofia é clara: teste comportamento, não implementação. Neste post vou mostrar como escrever testes que realmente agregam valor.\n\nVamos cobrir queries, eventos, async testing e como integrar com Vitest para um setup moderno e rápido.',
      thumbnail: 'https://picsum.photos/seed/testing/800/450',
      tags: ['Testing', 'React', 'Vitest', 'Front-end'],
      author: marcos,
    },
    {
      title: 'GraphQL vs REST: Quando usar cada um?',
      content:
        'Essa é uma das perguntas mais frequentes em entrevistas e discussões técnicas. Neste post vou comparar GraphQL e REST de forma honesta, sem hype.\n\nVamos analisar casos de uso reais, performance, complexidade de implementação e quando cada abordagem faz mais sentido para o seu projeto.',
      thumbnail: null,
      tags: ['GraphQL', 'REST', 'Back-end', 'API'],
      author: julio,
    },
    {
      title: 'Monorepos com pnpm: Configuração e Boas Práticas',
      content:
        'Monorepos são uma ótima forma de organizar projetos que compartilham código entre múltiplos apps. O pnpm tem suporte nativo a workspaces e é extremamente eficiente no gerenciamento de dependências.\n\nVamos criar um monorepo do zero com pnpm, configurar scripts compartilhados e resolver os problemas comuns de hoisting.',
      thumbnail: 'https://picsum.photos/seed/monorepo/800/450',
      tags: ['pnpm', 'Monorepo', 'DevOps'],
      author: ana,
    },
    {
      title: 'Animações com Framer Motion no React',
      content:
        'Framer Motion é a biblioteca de animações mais completa para React. Neste post vou mostrar como criar animações fluidas, transições de página e gestos interativos.\n\nVamos explorar as APIs declarativas do Framer Motion e como integrar animações sem comprometer a acessibilidade e performance.',
      thumbnail: null,
      tags: ['React', 'Framer Motion', 'Animações', 'Front-end'],
      author: marcos,
    },
  ];

  const posts = await postRepo.save(postsData.map((d) => postRepo.create(d)));

  // Adiciona comentários nos primeiros posts
  const comments = [
    { content: 'Excelente post! Aprendi muito com esse conteúdo.', author: ana, post: posts[0] },
    { content: 'Muito bem explicado. Vou aplicar isso no meu projeto.', author: marcos, post: posts[0] },
    { content: 'Parabéns pela clareza na explicação!', author: julio, post: posts[1] },
    { content: 'Tinha dúvidas sobre isso e você esclareceu tudo.', author: ana, post: posts[2] },
    { content: 'Conteúdo de qualidade. Continua postando!', author: marcos, post: posts[3] },
    { content: 'Que post incrível! Salvei para ler com calma.', author: julio, post: posts[4] },
  ];

  await commentRepo.save(comments.map((c) => commentRepo.create(c)));

  // Adiciona likes em alguns posts
  const likePairs = [
    { user: ana, post: posts[0] },
    { user: marcos, post: posts[0] },
    { user: julio, post: posts[1] },
    { user: marcos, post: posts[1] },
    { user: ana, post: posts[1] },
    { user: julio, post: posts[2] },
    { user: ana, post: posts[3] },
    { user: marcos, post: posts[4] },
    { user: julio, post: posts[4] },
    { user: ana, post: posts[5] },
    { user: julio, post: posts[6] },
    { user: marcos, post: posts[7] },
    { user: ana, post: posts[8] },
  ];

  await likeRepo.save(likePairs.map((l) => likeRepo.create(l)));

  console.log('✅ Seed concluído com sucesso!');
  console.log(`   ${posts.length} posts criados`);
  console.log(`   ${comments.length} comentários criados`);
  console.log(`   ${likePairs.length} likes criados`);
  console.log('   Usuários: julio@codeconnect.dev, ana@codeconnect.dev, marcos@codeconnect.dev (senha: senha123)');

  await app.close();
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
