/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {

    const tabelaCorpo = document.getElementById('tabelaCorpoEmprestimos');
    const linhaVazia = document.getElementById('linhaVaziaEmprestimos');

    // Função para calcular o prazo e o status
    function calcularStatus(dataAluguerISO, diasPrazo) {
        const dataAluguer = new Date(dataAluguerISO);
        const dataDevolucao = new Date(dataAluguer.getTime());
        dataDevolucao.setDate(dataAluguer.getDate() + diasPrazo); // Adiciona os dias ao prazo

        const hoje = new Date();

        let status = '';
        if (hoje > dataDevolucao) {
            status = '<span class="badge bg-danger">ATRASADO</span>';
        } else {
            status = '<span class="badge bg-success">Em dia</span>';
        }
        
        return {
            prazo: dataDevolucao.toLocaleDateString('pt-BR'), // Formata a data para dd/mm/aaaa
            status: status
        };
    }

    // --- Carregar Empréstimos do LocalStorage ---
    function carregarEmprestimos() {
        const emprestimos = JSON.parse(localStorage.getItem('bibliotecaEmprestimos')) || [];

        if (emprestimos.length === 0) {
            // Garante que a linha vazia exista se não houver dados
            tabelaCorpo.innerHTML = '<tr id="linhaVaziaEmprestimos"><td colspan="6" class="text-center text-muted">Nenhum empréstimo ativo.</td></tr>';
            return;
        }

        // Limpa a tabela (remove a linha "vazia")
        tabelaCorpo.innerHTML = '';

        emprestimos.forEach(emprestimo => {
            const { prazo, status } = calcularStatus(emprestimo.dataAluguer, emprestimo.diasPrazo);
            
            const dataAluguerFormatada = new Date(emprestimo.dataAluguer).toLocaleDateString('pt-BR');

            const novaLinhaHTML = `
                <tr data-id-emprestimo="${emprestimo.id}">
                    <td>${emprestimo.titulo}</td>
                    <td>${emprestimo.aluno}</td>
                    <td>${dataAluguerFormatada}</td>
                    <td>${prazo}</td>
                    <td>${status}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-multa" title="Aplicar Multa">
                            <i class="bi bi-cash-coin"></i>
                        </button>
                        <button class="btn btn-danger btn-sm btn-remover-emprestimo" title="Remover (Devolvido)">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);
        });
    }

    // --- Ações da Tabela (Multa e Remover) ---
    tabelaCorpo.addEventListener('click', function(event) {
        const botao = event.target.closest('button');
        if (!botao) return;

        const linha = botao.closest('tr');
        const idEmprestimo = linha.dataset.idEmprestimo;

        // Botão de Multa (Simulação)
        if (botao.classList.contains('btn-multa')) {
            const tituloLivro = linha.cells[0].textContent;
            alert(`Simulação: Multa aplicada ao empréstimo do livro "${tituloLivro}".`);
        }

        // Botão Remover (Marcar como devolvido)
        if (botao.classList.contains('btn-remover-emprestimo')) {
            // Remove do localStorage
            let emprestimos = JSON.parse(localStorage.getItem('bibliotecaEmprestimos')) || [];
            // O ID no dataset é string, o ID no objeto é número, por isso '=='
            const novosEmprestimos = emprestimos.filter(e => e.id != idEmprestimo);
            localStorage.setItem('bibliotecaEmprestimos', JSON.stringify(novosEmprestimos));
            
            // Recarrega a tabela
            carregarEmprestimos();
        }
    });

    // --- Carregar os dados assim que a página abre ---
    carregarEmprestimos();

});