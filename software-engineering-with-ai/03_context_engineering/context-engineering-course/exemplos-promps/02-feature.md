# Adicionar uma feature

<table>
<thead>
<tr><th>Prompt ruim</th><th>Prompt bom</th></tr>
</thead>
<tbody>
<tr>
<td>

<pre>
Gostaria de adicionar uma nova funcionalidade ao agentlens que permita
ao usuário comparar dois repositórios diferentes.

Seria interessante mostrar uma comparação lado a lado com as diferenças
de custo entre os modelos.

Talvez pudéssemos ter opções de exportação como CSV ou JSON.

O que você acha que seria a melhor abordagem? Podemos discutir algumas
opções antes de implementar?
</pre>

</td>
<td>

<pre>
Adiciona subcomando `compare` no CLI do agentlens.

Entrada: dois caminhos de repo.

Saída: tabela com Model | Repo A ($) | Repo B ($) | Diff (%).

Flag --format json para exportar.

Sem UI adicional.
</pre>

</td>
</tr>
</tbody>
</table>
