/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {

    // Seleciona os elementos do DOM
    const formModal = document.getElementById('formAdicionarAluno');
    const tabelaCorpo = document.getElementById('tabelaCorpoAlunos');
    const linhaVazia = document.getElementById('linhaVaziaAlunos');
    
    const modalElement = document.getElementById('modalAdicionarAluno');
    const modal = new bootstrap.Modal(modalElement);

    // --- CARREGA OS ALUNOS GUARDADOS ASSIM QUE A PÁGINA ABRE ---
    carregarAlunosDoStorage();

    // --- Adiciona o "escutador" ao formulário do modal (quando o ADMIN adiciona) ---
    formModal.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // 1. Pega os valores dos inputs
        const nome = document.getElementById('alunoNome').value;
        const email = document.getElementById('alunoEmail').value;
        const matricula = document.getElementById('alunoMatricula').value;

        const novoAluno = { nome, email, matricula };

        // 2. Adiciona na tabela (feedback visual)
        adicionarAlunoNaTabela(novoAluno);

        // 3. Salva no Storage
        salvarAlunoNoStorage(novoAluno);

        // 4. Limpa e fecha
        formModal.reset(); 
        modal.hide();      
    });

    // --- Adiciona funcionalidade aos botões "Remover" ---
    tabelaCorpo.addEventListener('click', function(event) {
        const btnRemover = event.target.closest('.btn-remover-aluno');
        if (btnRemover) {
            const linha = btnRemover.closest('tr');
            // Pega a matrícula da linha para saber quem remover
            const matriculaParaRemover = linha.dataset.matricula; 
            
            // Remove do storage
            removerAlunoDoStorage(matriculaParaRemover);
            
            // Remove da tabela
            linha.remove();

            // Verifica se a tabela ficou vazia
            if (tabelaCorpo.rows.length === 0) {
                tabelaCorpo.innerHTML = '<tr id="linhaVaziaAlunos"><td colspan="4" class="text-center text-muted">Nenhum aluno cadastrado.</td></tr>';
            }
        }
    });

    // --- Funções Auxiliares do LocalStorage ---

    function adicionarAlunoNaTabela(aluno) {
        // Remove a linha "vazia" se ela existir
        const linhaVaziaEl = document.getElementById('linhaVaziaAlunos');
        if (linhaVaziaEl) {
            linhaVaziaEl.remove();
        }

        // Adiciona 'data-matricula' na linha para sabermos quem remover
        const novaLinhaHTML = `
            <tr data-matricula="${aluno.matricula}">
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.matricula}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-remover-aluno">
                        <i class="bi bi-trash-fill"></i> Remover
                    </button>
                </td>
            </tr>
        `;
        tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);
    }

    function salvarAlunoNoStorage(aluno) {
        // Pega o acervo atual, ou cria um array vazio
        let alunos = JSON.parse(localStorage.getItem('bibliotecaAlunos')) || [];
        
        // Adiciona o novo aluno
        alunos.push(aluno);
        
        // Salva o acervo atualizado de volta no localStorage
        localStorage.setItem('bibliotecaAlunos', JSON.stringify(alunos));
    }

    function carregarAlunosDoStorage() {
        let alunos = JSON.parse(localStorage.getItem('bibliotecaAlunos')) || [];
        if (alunos.length === 0) return; // Não faz nada se estiver vazio

        // Se houver livros, adiciona cada um na tabela
        alunos.forEach(aluno => {
            adicionarAlunoNaTabela(aluno);
        });
    }

    function removerAlunoDoStorage(matricula) {
        let alunos = JSON.parse(localStorage.getItem('bibliotecaAlunos')) || [];
        // Cria um novo array com todos os alunos, MENOS o que tem a matrícula correspondente
        const novoAlunos = alunos.filter(aluno => aluno.matricula !== matricula);
        // Salva o novo acervo
        localStorage.setItem('bibliotecaAlunos', JSON.stringify(novoAlunos));
    }

});