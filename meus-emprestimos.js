/* eslint-env browser */

// **** LÓGICA CORRIGIDA ****
// SIMULAÇÃO DE LOGIN:
// Pega o primeiro aluno da lista (mesma lógica do perfil.js)
let alunos = JSON.parse(localStorage.getItem('bibliotecaAlunos')) || [];
let ALUNO_LOGADO_SIMULADO = "aluno.desconhecido@mail.com"; // Valor padrão
if (alunos.length > 0) {
    ALUNO_LOGADO_SIMULADO = alunos[0].email; // Filtra pelo email do primeiro aluno
}
// **** FIM DA LÓGICA CORRIGIDA ****


document.addEventListener('DOMContentLoaded', function () {

    const tabelaCorpo = document.getElementById('tabelaMeusEmprestimos');

    // Função para calcular o prazo e o status
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
            prazo: dataDevolucao.toLocaleDateString('pt-BR'), 
            status: status
        };
    }

    // --- Carregar Empréstimos do LocalStorage ---
    function carregarMeusEmprestimos() {
        const todosEmprestimos = JSON.parse(localStorage.getItem('bibliotecaEmprestimos')) || [];
        
        // Filtra os empréstimos pelo aluno "logado"
        const meusEmprestimos = todosEmprestimos.filter(e => e.aluno === ALUNO_LOGADO_SIMULADO);

        if (meusEmprestimos.length === 0) {
            tabelaCorpo.innerHTML = '<tr id="linhaVaziaEmprestimos"><td colspan="4" class="text-center text-muted">Você não tem empréstimos ativos.</td></tr>';
            return;
        }

        tabelaCorpo.innerHTML = '';

        meusEmprestimos.forEach(emprestimo => {
            const { prazo, status } = calcularStatus(emprestimo.dataAluguer, emprestimo.diasPrazo);
            const dataAluguerFormatada = new Date(emprestimo.dataAluguer).toLocaleDateString('pt-BR');

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

    carregarMeusEmprestimos();

});