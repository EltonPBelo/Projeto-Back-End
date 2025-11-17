/* eslint-env browser (corrigido)*/

document.addEventListener('DOMContentLoaded', function () {

    //  1. URLs da API 
    const API_URL = 'http://localhost:3002/api/alunos'; // Certifica-te que a porta está correta

    //  2. Seleção de Elementos 
    const formModal = document.getElementById('formAdicionarAluno');
    const tabelaCorpo = document.getElementById('tabelaCorpoAlunos');
    const linhaVazia = document.getElementById('linhaVaziaAlunos');
    const modalElement = document.getElementById('modalAdicionarAluno');
    const modal = new bootstrap.Modal(modalElement);

    /**
     * NOTA IMPORTANTE:
     * Já que o `alunoModel.js` EXIGE uma senha (`required: true`).
     * O formulário `aluno-admin.html` não tem um campo de senha.
     * Para respeitar o "não mexer no front" (não adicionar o campo de senha),
     * coloquei a senha provisória padrão para todos os alunos criados pelo admin.
     */
    
    const SENHA_PROVISORIA = 'mudar123';

    //  3. Função para Adicionar Linha (Auxiliar) 
    function adicionarLinhaNaTabela(aluno) {
        // Remove a linha "Nenhum aluno cadastrado" (se ela existir)
        const linhaVaziaAtual = document.getElementById('linhaVaziaAlunos');
        if (linhaVaziaAtual) {
            linhaVaziaAtual.remove();
        }

        // Cria a nova linha da tabela (HTML)
        const novaLinhaHTML = `
            <tr data-id="${aluno._id}">
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
        // Insere a nova linha no corpo da tabela
        tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);
    }

    //  4. Função para Carregar Alunos (Ao iniciar) 
    async function carregarAlunos() {
        try {
            const response = await fetch(API_URL); // GET /api/alunos
            if (!response.ok) {
                throw new Error('Falha ao buscar alunos.');
            }
            const alunos = await response.json();

            // Limpa a tabela antes de adicionar
            tabelaCorpo.innerHTML = ''; 

            if (alunos.length > 0) {
                alunos.forEach(adicionarLinhaNaTabela);
            } else {
                tabelaCorpo.innerHTML = `
                    <tr id="linhaVaziaAlunos">
                        <td colspan="4" class="text-center text-muted">Nenhum aluno cadastrado.</td>
                    </tr>
                `;
            }
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            tabelaCorpo.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger">Erro ao carregar dados.</td>
                </tr>
            `;
        }
    }

    // 5. Evento: Adicionar Aluno (Modal) 
    formModal.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o recarregamento

        // Pega os valores dos inputs
        const nome = document.getElementById('alunoNome').value;
        const email = document.getElementById('alunoEmail').value;
        const matricula = document.getElementById('alunoMatricula').value;

        try {
            // Envia os dados para a API (incluindo a senha provisória)
            const response = await fetch(`${API_URL}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nome, 
                    email, 
                    matricula, 
                    senha: SENHA_PROVISORIA // Envia a senha padrão
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao salvar aluno.');
            }

            // O backend não devolve o aluno, apenas uma mensagem.
            // Para atualizar a tabela, o ideal seria o backend devolver o aluno criado.
            // Solução alternativa: Recarregar a lista inteira.
            await carregarAlunos(); 

            // Limpa o formulário e fecha o modal
            formModal.reset();
            modal.hide();

        } catch (error) {
            console.error('Erro ao adicionar aluno:', error);
            alert(`Erro: ${error.message}`);
        }
    });

    // 6. Evento: Remover Aluno (Clique na Tabela) 
    tabelaCorpo.addEventListener('click', async function(event) {
        // Verifica se o clique foi em um botão de remover
        const botaoRemover = event.target.closest('.btn-remover-aluno');
        
        if (botaoRemover) {
            const linha = botaoRemover.closest('tr');
            const alunoId = linha.dataset.id; // Pega o ID que guardámos no 'data-id'

            if (!alunoId) return;

            // Confirmação
            if (!confirm('Tem a certeza que deseja remover este aluno?')) {
                return;
            }

            try {
                // Chama a API para deletar
                const response = await fetch(`${API_URL}/${alunoId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao deletar.');
                }
                
                // Se deu certo, remove a linha do HTML
                linha.remove();
                
                // Verifica se a tabela ficou vazia
                if (tabelaCorpo.children.length === 0) {
                    tabelaCorpo.innerHTML = `
                        <tr id="linhaVaziaAlunos">
                            <td colspan="4" class="text-center text-muted">Nenhum aluno cadastrado.</td>
                        </tr>
                    `;
                }

            } catch (error) {
                console.error('Erro ao remover aluno:', error);
                alert(`Erro: ${error.message}`);
            }
        }
    });

    // 7. Inicia a Página 
    // Carrega todos os alunos assim que a página é aberta
    carregarAlunos();
});
