<?php

// Exemplo de entrada de dados no terminal em PHP usando fgets(STDIN)
echo "Digite um número: \n";
$numero = (float) fgets(STDIN); // Aguarda a entrada do usuário no terminal e converte para float
// Se o valor recebido não for um número, a conversão para float resultará em 0.0

echo "O número é: $numero\n";