/* Filtramos as consultas agrupadas utilizando a cláusula HAVING, que é usada para filtrar os resultados de uma consulta agrupada com base em uma condição especificada. */

SELECT * FROM aluno;
SELECT * FROM aluno_curso;
SELECT * FROM curso;

SELECT * 
	FROM curso
	LEFT JOIN aluno_curso ON aluno_curso.curso_id = curso.id
	LEFT JOIN aluno ON aluno.id = aluno_curso.aluno_id;
	
SELECT curso.nome,
	   COUNT(aluno.id)
	FROM curso
	LEFT JOIN aluno_curso ON aluno_curso.curso_id = curso.id
	LEFT JOIN aluno ON aluno.id = aluno_curso.aluno_id
	GROUP BY 1;

SELECT  curso.nome,
	   COUNT(aluno.id)
	FROM curso
	LEFT JOIN aluno_curso ON aluno_curso.curso_id = curso.id
	LEFT JOIN aluno ON aluno.id = aluno_curso.aluno_id
	-- WHERE curso.nome =  'Javascript'
	GROUP BY 1
	HAVING COUNT(aluno.id) > 0;
	
SELECT nome	
	FROM funcionarios
	GROUP BY nome
	HAVING COUNT (id) > 1; /* HAVING serve para filtrar os resultados de uma consulta agrupada com base em uma condição especificada. */
	
SELECT nome,
	   COUNT(id)
	FROM funcionarios
	GROUP BY nome
	HAVING COUNT(id) > 1;

SELECT nome,
	   COUNT(id)
	FROM funcionarios
	GROUP BY nome
	HAVING COUNT(id) =1;