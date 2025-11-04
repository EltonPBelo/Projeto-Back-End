/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {

    // Seleciona os elementos do DOM
    const formModal = document.getElementById('formAdicionarAluno');
    const tabelaCorpo = document.getElementById('tabelaCorpoAlunos');
    const linhaVazia = document.getElementById('linhaVaziaAlunos');
    
    // Seleciona o Modal do Bootstrap
    const modalElement = document.getElementById('modalAdicionarAluno');
    const modal = new bootstrap.Modal(modalElement);

    // Adiciona o "escutador" ao formulário do modal
    formModal.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // 1. Pega os valores dos inputs
        const nome = document.getElementById('alunoNome').value;
        const email = document.getElementById('alunoEmail').value;
        const matricula = document.getElementById('alunoMatricula').value;

        // 2. Remove a linha "Nenhum aluno cadastrado" (se ela existir)
        if (linhaVazia) {
            linhaVazia.remove();
        }

        // 3. Cria a nova linha da tabela (HTML)
        const novaLinhaHTML = `
            <tr>
                <td>${nome}</td>
                <td>${email}</td>
                <td>${matricula}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-remover-aluno">
                        <i class="bi bi-trash-fill"></i> Remover
                    </button>
                </td>
            </tr>
        `;

        // 4. Insere a nova linha no corpo da tabela
        tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);

        // 5. Limpa o formulário e fecha o modal
        formModal.reset(); // Limpa os campos
        modal.hide();      // Fecha o popup
    });

    // 6. Adiciona funcionalidade aos botões "Remover"
    tabelaCorpo.addEventListener('click', function(event) {
        // Verifica se o clique foi em um botão com a classe 'btn-remover-aluno'
        if (event.target.classList.contains('btn-remover-aluno') || event.target.closest('.btn-remover-aluno')) {
            // Pega a linha da tabela (o 'tr') mais próxima e a remove
            event.target.closest('tr').remove();
        }
    });

});