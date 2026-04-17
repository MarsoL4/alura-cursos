<?php

//Operadores de Comparação
// == (igual a)
// === (idêntico a)
// != (diferente de)
// <> (diferente de)
// !== (não idêntico a)
// > (maior que)
// >= (maior ou igual a)
// < (menor que)
// <= (menor ou igual a)

//Exemplos:
$a = 10; // Atribui o valor 10 à variável $a
$b = 5; // Atribui o valor 5 à variável $b
$c = 30; // Atribui o valor 30 à variável $c

$igual = $b == $a; // Nesse caso, a variável $igual ficará com o valor *false*, pois o valor de $b não é igual ao valor de $a.
$diferente = $b != $c; // A variável $diferente ficará com o valor *true*, pois o valor de $b é diferente do valor de $c.
$maior = $b > $a; // A variável maior ficará com o valor *false*, pois o valor de $b é menor que o valor de $a.
$menorIgual = $b <= $c; // A variável $menorIgual ficará com o valor *true*, pois o valor de $b é menor que o valor de $c.


// A diferença entre == e === e entre != e !== é que os tipos são levados em consideração
$a = '1';
$b = 1;

$igual = $a == $b; // A variável $igual será *true*, pois o PHP vai realizar algumas conversões de tipos
$identico = $a === $b; // A variável $identico será *false*, pois os tipos são diferentes.
$diferente = $a != $b; // A variável $diferente será *false*, pois o PHP vai realizar a conversão de tipo e comparar apenas o valor, e 1 não é diferente de 1.
$naoIdentico = $a !== $b; // A variável $naoIdentico será *true*, pois o texto '1' é não é idêntico ao número 1, ou seja, os tipos são diferentes.

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------//

// Operadores de incremento e decremento

// O operador de pré-incremento (++$variavel) aumenta o valor da variável em 1 antes de usar a variável em uma expressão
$num = 5;
$resultado = ++$num; // num é incrementado para 6 e depois atribuído ao resultado
echo $num; // Exibe 6
echo $resultado; // Exibe 6

// Já o operador de pós-incremento ($variavel++) aumenta o valor da variável em 1 depois de usar a variável em uma expressão
$num = 5;
$resultado = $num++; // $num é atribuído primeiramente à variável $resultado e depois incrementado para 6
echo $num; // Exibe 6
echo $resultado; // Exibe 5

// O mesmo para os operadores de decremento, que diminuem o valor de uma variável em 1: pré-decremento (--$variavel) e pós-decremento ($variavel--).

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------//

// Operadores Ternários

$resultado = $expressao1 ? $expressao2 : $expressao3;
// Se $expressao1 for verdadeira (true), $resultado terá o valor de $expressão2. Caso contrário, $resultado terá o valor de $expressão3.