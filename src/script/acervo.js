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
    
    // Campos novos
    const inputCapaUrl = document.getElementById('livroCapaUrl');
    const inputPaginas = document.getElementById('livroPaginas');
    const inputDescricao = document.getElementById('livroDescricao'); // Campo escondido
    const displayDescricao = document.getElementById('livroDescricaoDisplay'); // Textarea visível

    // --- Carregar Tabela do LocalStorage (NOVO) ---
    // Faz com que os livros já salvos apareçam ao recarregar a página
    carregarLivrosDoStorage();

    // --- LÓGICA DE BUSCA DA API (Atualizada) ---
    btnBuscarIsbn.addEventListener('click', async function() {
        const isbn = inputIsbnBusca.value.trim();
        if (!isbn) {
            isbnHelp.textContent = "Por favor, digite um ISBN.";
            isbnHelp.className = "form-text text-danger";
            return;
        }

        // Reseta os campos
        resetarCamposModal();
        isbnSpinner.style.display = 'block';
        isbnHelp.textContent = "Buscando...";
        isbnHelp.className = "form-text text-muted";

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            if (!response.ok) throw new Error('Falha na rede');
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const book = data.items[0].volumeInfo;
                const placeholderCapa = 'https://via.placeholder.com/64x96.png?text=Sem+Capa';
                
                // PREENCHE TODOS OS CAMPOS (visíveis e escondidos)
                inputTitulo.value = book.title || 'Título não encontrado';
                inputAutor.value = book.authors ? book.authors.join(', ') : 'Autor desconhecido';
                inputIsbnSalvo.value = isbn; 
                inputCapaUrl.value = book.imageLinks?.thumbnail || placeholderCapa; 
                inputPaginas.value = book.pageCount || 'Não informado';
                
                const descricao = book.description || 'Sem descrição disponível.';
                inputDescricao.value = descricao; // Guarda no campo escondido
                displayDescricao.value = descricao; // Mostra na textarea

                isbnHelp.textContent = "Livro encontrado! Clique em 'Salvar Livro'.";
                isbnHelp.className = "form-text text-success";
                btnSalvarLivro.disabled = false; 
            } else {
                isbnHelp.textContent = "Nenhum livro encontrado com este ISBN.";
                isbnHelp.className = "form-text text-danger";
            }

        } catch (error) {
            console.error("Erro ao buscar ISBN:", error);
            isbnHelp.textContent = "Erro ao buscar. Verifique a conexão.";
            isbnHelp.className = "form-text text-danger";
        } finally {
            isbnSpinner.style.display = 'none'; 
        }
    });

    // --- LÓGICA DE SALVAR (Totalmente Atualizada) ---
    formModal.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // 1. Cria o objeto do novo livro com TODOS os detalhes
        const newBook = {
            titulo: inputTitulo.value,
            autor: inputAutor.value,
            isbn: inputIsbnSalvo.value,
            capaUrl: inputCapaUrl.value,
            paginas: inputPaginas.value,
            descricao: inputDescricao.value
        };

        // 2. Adiciona o livro na tabela (para feedback visual)
        adicionarLivroNaTabela(newBook);

        // 3. Salva no LocalStorage (A parte mais importante)
        salvarLivroNoStorage(newBook);

        // 4. Limpa tudo e fecha o modal
        resetarCamposModal();
        modal.hide();
    });

    // --- LÓGICA DE REMOVER (Atualizada) ---
    tabelaCorpo.addEventListener('click', function(event) {
        const botaoRemover = event.target.closest('.btn-remover');
        if (botaoRemover) {
            const linha = botaoRemover.closest('tr');
            // Pega o ISBN da linha para saber qual livro remover do storage
            const isbnParaRemover = linha.dataset.isbn; 
            
            // Remove do storage
            removerLivroDoStorage(isbnParaRemover);
            
            // Remove da tabela
            linha.remove();

            // Verifica se a tabela está vazia
            if (tabelaCorpo.rows.length === 0) {
                tabelaCorpo.innerHTML = '<tr id="linhaVazia"><td colspan="5" class="text-center text-muted">Nenhum livro cadastrado.</td></tr>';
            }
        }
    });

    // --- Funções Auxiliares ---

    function adicionarLivroNaTabela(livro) {
        if (linhaVazia) {
            linhaVazia.remove();
        }
        
        // Adicionamos 'data-isbn' na linha para sabermos quem remover
        const novaLinhaHTML = `
            <tr data-isbn="${livro.isbn}"> 
                <td>
                    <img src="${livro.capaUrl}" alt="Capa de ${livro.titulo}" style="width: 64px; height: auto;">
                </td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.isbn}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-remover">
                        <i class="bi bi-trash-fill"></i> Remover
                    </button>
                </td>
            </tr>
        `;
        tabelaCorpo.insertAdjacentHTML('beforeend', novaLinhaHTML);
    }

    function salvarLivroNoStorage(livro) {
        // Pega o acervo atual, ou cria um array vazio
        let acervo = JSON.parse(localStorage.getItem('bibliotecaAcervo')) || [];
        
        // Adiciona o novo livro
        acervo.push(livro);
        
        // Salva o acervo atualizado de volta no localStorage
        localStorage.setItem('bibliotecaAcervo', JSON.stringify(acervo));
    }

    function carregarLivrosDoStorage() {
        let acervo = JSON.parse(localStorage.getItem('bibliotecaAcervo')) || [];
        if (acervo.length === 0) return; // Não faz nada se estiver vazio

        // Se houver livros, adiciona cada um na tabela
        acervo.forEach(livro => {
            adicionarLivroNaTabela(livro);
        });
    }

    function removerLivroDoStorage(isbn) {
        let acervo = JSON.parse(localStorage.getItem('bibliotecaAcervo')) || [];
        // Cria um novo array com todos os livros, MENOS o que tem o ISBN correspondente
        const novoAcervo = acervo.filter(livro => livro.isbn !== isbn);
        // Salva o novo acervo
        localStorage.setItem('bibliotecaAcervo', JSON.stringify(novoAcervo));
    }

    function resetarCamposModal() {
        formModal.reset();
        btnSalvarLivro.disabled = true;
        isbnHelp.textContent = "Busque pelo ISBN para preencher os campos.";
        isbnHelp.className = "form-text";
    }

});