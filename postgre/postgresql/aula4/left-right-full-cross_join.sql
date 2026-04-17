/* Criando Consultas com Relacionamentos usando LEFT JOIN, RIGHT JOIN, FULL JOIN e CROSS JOIN */

INSERT INTO aluno (nome) VALUES ('Nico');

SELECT * FROM aluno;

SELECT aluno.nome as "Nome do aluno",
	   curso.nome as "Nome do curso"
  FROM aluno
  JOIN aluno_curso ON aluno_curso.aluno_id = aluno.id
  JOIN curso		   ON curso.id		   = aluno_curso.curso_id;
  
INSERT INTO curso (id,nome) VALUES (3,'CSS');

SELECT * FROM curso;

/* o LEFT JOIN é utilizado quando queremos trazer todos os registros da tabela da esquerda (aluno) e os registros correspondentes da tabela da direita (curso). Se não houver correspondência, os campos da tabela da direita serão preenchidos com NULL. */
SELECT aluno.nome as "Nome do aluno",
	   curso.nome as "Nome do curso"
     FROM aluno
LEFT JOIN aluno_curso ON aluno_curso.aluno_id = aluno.id
LEFT JOIN curso		   ON curso.id		   = aluno_curso.curso_id;

/* o RIGHT JOIN é utilizado quando queremos trazer todos os registros da tabela da direita (curso) e os registros correspondentes da tabela da esquerda (aluno). Se não houver correspondência, os campos da tabela da esquerda serão preenchidos com NULL. */
SELECT aluno.nome as "Nome do aluno",
	   curso.nome as "Nome do curso"
     FROM aluno
RIGHT JOIN aluno_curso ON aluno_curso.aluno_id = aluno.id
RIGHT JOIN curso		   ON curso.id		   = aluno_curso.curso_id;

/* o FULL JOIN é utilizado quando queremos trazer todos os registros de ambas as tabelas, independentemente de haver correspondência ou não. Se não houver correspondência, os campos da tabela que não tiver correspondência serão preenchidos com NULL. */
SELECT aluno.nome as "Nome do aluno",
	   curso.nome as "Nome do curso"
     FROM aluno
FULL JOIN aluno_curso ON aluno_curso.aluno_id = aluno.id
FULL JOIN curso		   ON curso.id		   = aluno_curso.curso_id;

/* o CROSS JOIN é utilizado quando queremos combinar cada registro de uma tabela com cada registro de outra tabela, resultando em um produto cartesiano. Ele não requer uma condição de junção e pode resultar em um grande número de registros, dependendo do tamanho das tabelas envolvidas. */
SELECT aluno.nome as "Nome do aluno",
	   curso.nome as "Nome do curso"
     FROM aluno
CROSS JOIN curso;

INSERT INTO aluno (nome) VALUES ('João');