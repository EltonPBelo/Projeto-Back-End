/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {

    const tabelaCorpo = document.getElementById('tabelaCorpoSolicitacoes');

    // --- Carregar Solicitações do LocalStorage ---
    function carregarSolicitacoes() {
        const solicitacoes = JSON.parse(localStorage.getItem('bibliotecaSolicitacoes')) || [];

        if (solicitacoes.length === 0) {
            tabelaCorpo.innerHTML = '<tr id="linhaVaziaSolicitacoes"><td colspan="4" class="text-center text-muted">Nenhuma solicitação nova.</td></tr>';
            return;
        }

        tabelaCorpo.innerHTML = ''; // Limpa a linha "vazia"

        solicitacoes.forEach(item => {
            const novaLinhaHTML = `
                <tr data-id-solicitacao="${item.id}">
                    <td>${item.titulo}</td>
                    <td>${item.autor}</td>
                    <td>${item.aluno}</td>
                    <td>
                        <a href="acervo-admin.html" class="btn btn-success btn-sm" title="Adicionar ao Acervo">
                            <i class="bi bi-check-circle"></i> Aprovar
                        </a>
                        <button class="btn btn-danger btn-sm btn-rejeitar" title="Rejeitar Solicitação">
                            <i class="bi bi-trash-fill"></i> Rejeitar
                        </button>
                    </td>
                </tr>
            `;
            tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);
        });
    }

    // --- Ações da Tabela (Rejeitar) ---
    tabelaCorpo.addEventListener('click', function(event) {
        const botaoRejeitar = event.target.closest('.btn-rejeitar');
        if (!botaoRejeitar) return;

        const linha = botaoRejeitar.closest('tr');
        const idSolicitacao = linha.dataset.idSolicitacao;

        // Remove do localStorage
        let solicitacoes = JSON.parse(localStorage.getItem('bibliotecaSolicitacoes')) || [];
        const novasSolicitacoes = solicitacoes.filter(s => s.id != idSolicitacao);
        localStorage.setItem('bibliotecaSolicitacoes', JSON.stringify(novasSolicitacoes));
        
        // Recarrega a tabela
        carregarSolicitacoes();
    });

    // --- Carregar os dados assim que a página abre ---
    carregarSolicitacoes();

});     