/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {

    // --- Seleção de Elementos ---
    const formModal = document.getElementById('formAdicionarLivro');
    const tabelaCorpo = document.getElementById('tabelaCorpoLivros');
    const linhaVazia = document.getElementById('linhaVazia');
    const modalElement = document.getElementById('modalAdicionarLivro');
    const modal = new bootstrap.Modal(modalElement);

    // --- Elementos do Modal ---
    const btnBuscarIsbn = document.getElementById('btnBuscarIsbn');
    const btnSalvarLivro = document.getElementById('btnSalvarLivro');
    const inputIsbnBusca = document.getElementById('livroIsbnBusca');
    const inputIsbnSalvo = document.getElementById('livroIsbn');
    const inputTitulo = document.getElementById('livroTitulo');
    const inputAutor = document.getElementById('livroAutor');
    const isbnSpinner = document.getElementById('isbnSpinner');
    const isbnHelp = document.getElementById('isbnHelp');

    // --- LÓGICA DE BUSCA DA API ---
    btnBuscarIsbn.addEventListener('click', async function() {
        const isbn = inputIsbnBusca.value.trim();
        if (!isbn) {
            isbnHelp.textContent = "Por favor, digite um ISBN.";
            isbnHelp.className = "form-text text-danger";
            return;
        }

        // Reseta os campos e mostra o spinner
        inputTitulo.value = '';
        inputAutor.value = '';
        inputIsbnSalvo.value = '';
        btnSalvarLivro.disabled = true;
        isbnSpinner.style.display = 'block';
        isbnHelp.textContent = "Buscando...";
        isbnHelp.className = "form-text text-muted";

        try {
            // A API do Google Books pode buscar por ISBN assim:
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            
            if (!response.ok) throw new Error('Falha na rede');
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const book = data.items[0].volumeInfo;
                
                // PREENCHE OS CAMPOS!
                inputTitulo.value = book.title || 'Título não encontrado';
                inputAutor.value = book.authors ? book.authors.join(', ') : 'Autor desconhecido';
                inputIsbnSalvo.value = isbn; // Salva o ISBN que foi buscado
                
                isbnHelp.textContent = "Livro encontrado! Clique em 'Salvar Livro'.";
                isbnHelp.className = "form-text text-success";
                btnSalvarLivro.disabled = false; // Habilita o botão de salvar
            } else {
                isbnHelp.textContent = "Nenhum livro encontrado com este ISBN.";
                isbnHelp.className = "form-text text-danger";
            }

        } catch (error) {
            console.error("Erro ao buscar ISBN:", error);
            isbnHelp.textContent = "Erro ao buscar. Verifique a conexão.";
            isbnHelp.className = "form-text text-danger";
        } finally {
            isbnSpinner.style.display = 'none'; // Esconde o spinner
        }
    });

    // --- LÓGICA DE SALVAR NA TABELA (Como antes) ---
    formModal.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento

        // Pega os valores dos campos (agora preenchidos pela API)
        const titulo = inputTitulo.value;
        const autor = inputAutor.value;
        const isbn = inputIsbnSalvo.value;

        if (linhaVazia) {
            linhaVazia.remove();
        }

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
        tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);

        // Limpa tudo e fecha o modal
        formModal.reset();
        modal.hide();
        btnSalvarLivro.disabled = true;
        isbnHelp.textContent = "Busque pelo ISBN para preencher os campos.";
        isbnHelp.className = "form-text";
    });

    // --- LÓGICA DE REMOVER DA TABELA (Como antes) ---
    tabelaCorpo.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-remover') || event.target.closest('.btn-remover')) {
            event.target.closest('tr').remove();
        }
    });

});