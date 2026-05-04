# Tarefa com restrição explícita

<table>
<thead>
<tr><th>Prompt ruim</th><th>Prompt bom</th></tr>
</thead>
<tbody>
<tr>
<td>

<pre>
Melhore a função de geração de relatório HTML para que ela seja mais
completa e informativa, com mais detalhes sobre os modelos e os custos.
</pre>

</td>
<td>

<pre>
Na função generateReport(): adiciona coluna "Cache savings ($)" na tabela.

Calcula como: (input_tokens * 0.9 * price_per_token).

Não muda o layout, não adiciona outras colunas.
</pre>

</td>
</tr>
</tbody>
</table>
