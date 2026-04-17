/* Limitamos consultas utilizando a cláusula LIMIT, que é usada para limitar o número de registros retornados por uma consulta. */

SELECT * FROM funcionarios;

SELECT * FROM funcionarios LIMIT 5;

SELECT * 
	FROM funcionarios 
	ORDER BY nome
	LIMIT 5;
	
SELECT * 
	FROM funcionarios 
	ORDER BY id
	LIMIT 5
	OFFSET 3; /* OFFSET é usado para pular um número específico de registros antes de começar a retornar os resultados. */