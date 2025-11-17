/* eslint-env browser */

// SIMULAÇÃO DE LOGIN:
// Este nome DEVE ser idêntico ao que está em 'script/buscar.js'
const ALUNO_LOGADO_SIMULADO = "Aluno Teste (teste@mail.com)";

document.addEventListener('DOMContentLoaded', function () {

    const tabelaCorpo = document.getElementById('tabelaMeusEmprestimos');

    // Função para calcular o prazo e o status (igual à do admin)
    function calcularStatus(dataAluguerISO, diasPrazo) {
        const dataAluguer = new Date(dataAluguerISO);
        const dataDevolucao = new Date(dataAluguer.getTime());
        dataDevolucao.setDate(dataAluguer.getDate() + diasPrazo);

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
    function carregarMeusEmprestimos() {
        const todosEmprestimos = JSON.parse(localStorage.getItem('bibliotecaEmprestimos')) || [];
        
        // *** A GRANDE DIFERENÇA: FILTRAMOS OS RESULTADOS ***
        const meusEmprestimos = todosEmprestimos.filter(e => e.aluno === ALUNO_LOGADO_SIMULADO);

        if (meusEmprestimos.length === 0) {
            tabelaCorpo.innerHTML = '<tr id="linhaVaziaEmprestimos"><td colspan="4" class="text-center text-muted">Você não tem empréstimos ativos.</td></tr>';
            return;
        }

        // Limpa a tabela (remove a linha "vazia")
        tabelaCorpo.innerHTML = '';

        meusEmprestimos.forEach(emprestimo => {
            const { prazo, status } = calcularStatus(emprestimo.dataAluguer, emprestimo.diasPrazo);
            
            const dataAluguerFormatada = new Date(emprestimo.dataAluguer).toLocaleDateString('pt-BR');

            // Tabela simplificada (sem colunas de Aluno ou Ações)
            const novaLinhaHTML = `
                <tr>
                    <td>${emprestimo.titulo}</td>
                    <td>${dataAluguerFormatada}</td>
                    <td>${prazo}</td>
                    <td>${status}</td>
                </tr>
            `;
            tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);
        });
    }

    // --- Carregar os dados assim que a página abre ---
    carregarMeusEmprestimos();

});