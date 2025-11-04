/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {

    // Seleciona os elementos do DOM
    const formModal = document.getElementById('formAdicionarLivro');
    const tabelaCorpo = document.getElementById('tabelaCorpoLivros');
    const linhaVazia = document.getElementById('linhaVazia');
    
    // Seleciona o Modal do Bootstrap para podermos escondê-lo via JS
    const modalElement = document.getElementById('modalAdicionarLivro');
    // 'Modal.getInstance' é a forma moderna de controlar o modal
    const modal = new bootstrap.Modal(modalElement);

    // Adiciona o "escutador" ao formulário do modal
    formModal.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // 1. Pega os valores dos inputs
        const titulo = document.getElementById('livroTitulo').value;
        const autor = document.getElementById('livroAutor').value;
        const isbn = document.getElementById('livroIsbn').value;

        // 2. Remove a linha "Nenhum livro cadastrado" (se ela existir)
        if (linhaVazia) {
            linhaVazia.remove();
        }

        // 3. Cria a nova linha da tabela (HTML)
        const novaLinhaHTML = `
            <tr>
                <td>${titulo}</td>
                <td>${autor}</td>
                <td>${isbn}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-remover">
                        <i class="bi bi-trash-fill"></i> Remover
                    </button>
                </td>
            </tr>
        `;

        // 4. Insere a nova linha no corpo da tabela
        // 'insertAdjacentHTML' é mais eficiente que 'innerHTML +='
        tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);

        // 5. Limpa o formulário e fecha o modal
        formModal.reset(); // Limpa os campos
        modal.hide();      // Fecha o popup
    });

    // 6. Adiciona funcionalidade aos botões "Remover" (Usando delegação de evento)
    // Escutamos cliques na tabela inteira
    tabelaCorpo.addEventListener('click', function(event) {
        // Verifica se o clique foi em um botão com a classe 'btn-remover'
        if (event.target.classList.contains('btn-remover') || event.target.closest('.btn-remover')) {
            // Pega a linha da tabela (o 'tr') mais próxima e a remove
            event.target.closest('tr').remove();
        }
    });

});