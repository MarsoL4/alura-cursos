<?php
// ** Laço For **:
// Explicação do For em PHP:
// for (inicializacao; condicao da repeticao; incremento) {

// }

// Exemplo de uso:
for ($contador = 1; $contador < $argc; $contador += 1) { // O laço For só irá parar quando o contador for maior que a quantidade de parametros recebidos no terminal ao executar o codigo
    $somaDeNotas += $argv[$contador];
}

// ** Laço While **:
// Exemplo de soma de Notas com While
$contador = 1;
while ($argv[$contador] != 0) { // Enquanto tiver parametros passados (diferentes de 0) recebidos na linha de comando no terminal ao executar o programa, o while será executado
    $somaDeNotas += $argv[$contador++];
}

// ** Laço Do **:
// Explicação do laço Do
// Executa alguma ação enquanto a condiçao no while for true
do {
    //alguma ação
} while (true /*condicao*/);

// ** Laço Foreach **:
// Exemplo:
$somaDeNotas = 0;
foreach ($notas as $nota) { // Para cada item do array $notas, cria uma variavel notas e salva o valor dele nela e soma no valor de $somaDeNotas
    $somaDeNotas += $nota;
}