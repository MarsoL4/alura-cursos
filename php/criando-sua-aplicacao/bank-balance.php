<?php

// Desafio do Curso de PHP: Criando sua Aplicação - Sistema de controle de Saldo Bancário

// Exemplo de menu a ser exibido no terminal:
// ********************
// Titular: Vinicius Dias
// Saldo atual: R$ 1000
// *********************
// 1. Consultar saldo atual
// 2. Sacar valor
// 3. Depositar valor
// 4. Sair
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------//

$dadosConta = [
    "titular" => "Vinícius Dias",
    "saldo" => 2_000
];

echo "********************\nTitular: " . $dadosConta["titular"] . "\nSaldo Atual: " . $dadosConta["saldo"] . "\n********************";

$opcao = 0;

do {
    echo "\n\n1. Consultar saldo atual \n2. Sacar valor \n3. Depositar valor \n4. Sair \n\nDigite a opção desejada: ";

    $opcao = (int) fgets(STDIN);

    switch ($opcao) {
        case 1:
            echo "Seu saldo atual é de R$ " . $dadosConta["saldo"];
            break;

        case 2:
            echo "Digite o valor que deseja sacar: ";
            $valorSaque = (float) fgets(STDIN);

            if ($dadosConta["saldo"] > $valorSaque && $valorSaque > 0) {
                $dadosConta["saldo"] -= $valorSaque;
                echo "Saque concluído com sucesso! Seu saldo agora é de R$ " . $dadosConta["saldo"];
            
            } elseif ($valorSaque <= 0) {
                echo "Digite um valor maior que 0";

            } else {
                echo "Saldo insuficiente";
            }
            break;

        case 3:
            echo "Digite o valor a ser depositado: ";
            $valorDeposito = (float) fgets(STDIN);
            
            if ($valorDeposito > 0) {
                $dadosConta["saldo"] += $valorDeposito;
                echo "Depósito concluído com sucesso! Seu saldo agora é de R$ " . $dadosConta["saldo"];
            
            } elseif ($valorDeposito <= 0) {
                echo "Digite um valor maior que 0";

            }
            break;

        case 4:
            echo "\nSaindo...";
            break;

        default:
            echo "\nOpção Inválida";
            break;

    }

} while ($opcao != 4);