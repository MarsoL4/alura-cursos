<?php

echo "Bem-vindo ao Screen Match!\n";

$nomeFilme = "Top Gun - Maverick";

// $anoLancamento = $argv[1] ?? 2022; // $argv contém os argumentos passados via terminal ao script; $argv[1] é o primeiro valor informado após o nome do arquivo
$anoLancamento = 2022;

$quantidadeDeNotas = $argc - 1; // Para uso de For no cálculo de Soma de Notas
// $quantidadeDeNotas = $argc - 2; // Para uso de While no cálculo de Soma de Notas

$notas = [];

// Soma de Notas com For
for ($contador = 1; $contador < $argc; $contador++) { // O laço For só irá parar quando o contador for maior que a quantidade de parametros recebidos no terminal ao executar o codigo
    $notas[] = (float) $argv[$contador];
}

// Exemplo de soma de Notas com While
// $contador = 1;
// while ($argv[$contador] != 0) {
//     $somaDeNotas += $argv[$contador++];
// }

// Outros Exemplos:
// $somaDeNotas -= 2; 
// $somaDeNotas /= 2; 
// $somaDeNotas *= 2; 
// $somaDeNotas **= 2;  // Potência
// $somaDeNotas %= 2; // Resto da Divisão

$notaFilme = array_sum($notas) / $quantidadeDeNotas;

$planoPrime = true;
$incluidoNoPlano = $planoPrime || $anoLancamento < 2010;

// Outros Exemplos:
// $incluidoNoPlano = $planoPrime && $anoLancamento < 2010; // Se ambas condições true

echo "Nome do Filme: $nomeFilme \nNota do Filme: $notaFilme \nAno de Lançamento: $anoLancamento \n";

if ($anoLancamento > 2022) {
    echo "Esse filme é um lançamento\n";

} elseif($anoLancamento > 2020 && $anoLancamento <= 2022) {
    echo "Esse filme ainda é novo\n";

}else {
    echo "Esse filme não é um lançamento\n";
}

$genero = match ($nomeFilme) {
    "Top Gun - Maverick" => "ação",
    "Thor Ragnarok" => "super-herói",
    "Se beber não case" => "comédia",
    default => "gênero desconhecido"
};

echo "O gênero do filme é: $genero\n";

$filme = [
    "nome" => "Thor: Ragnarok",
    "ano" => 2021,
    "nota" => 7.8,
    "genero" => "super-herói",
];

echo $filme["nome"];

// var_dump($argv); // Exibe todos os valores de variáveis recebidos como parâmetro ao executar o programa

// echo $argc; // Contem o numero de parametros passados na linha de comando de execucao do programa