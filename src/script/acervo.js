/* eslint-env browser (corrigido)*/

document.addEventListener('DOMContentLoaded', function () {

    // 1. Configuração da API 
    const API_URL = 'http://localhost:3002/api/livros'; // A tua porta do backend

    // Pega o token de Admin (guardado no login.js do admin)
    // Assumi que o nome é 'adminAuthToken'. Se for outro, muda aqui.
    const adminToken = localStorage.getItem('adminAuthToken'); 

    // 2. Seleção de Elementos (Como o teu original) 
    const formModal = document.getElementById('formAdicionarLivro');
    const tabelaCorpo = document.getElementById('tabelaCorpoLivros');
    const modalElement = document.getElementById('modalAdicionarLivro');
    const modal = new bootstrap.Modal(modalElement);

    // Elementos do Modal
    const btnBuscarIsbn = document.getElementById('btnBuscarIsbn');
    const btnSalvarLivro = document.getElementById('btnSalvarLivro');
    const inputIsbnBusca = document.getElementById('livroIsbnBusca');
    const inputIsbnSalvo = document.getElementById('livroIsbn');
    const inputTitulo = document.getElementById('livroTitulo');
    const inputAutor = document.getElementById('livroAutor');
    const isbnSpinner = document.getElementById('isbnSpinner');
    const isbnHelp = document.getElementById('isbnHelp');

    /**
     * Verifica se o admin está logado antes de fazer qualquer coisa.
     * Se não houver token, bloqueia a funcionalidade e avisa.
     */
    if (!adminToken) {
        console.error('Token de admin não encontrado. Acesso negado.');
        tabelaCorpo.innerHTML = `
            <tr id="linhaVazia">
                <td colspan="4" class="text-center text-danger">
                    Erro de autenticação. Por favor, faça login novamente.
                </td>
            </tr>
        `;
        // Desativa os botões se não estiver logado
        btnBuscarIsbn.disabled = true;
        btnSalvarLivro.disabled = true;
        // Interrompe a execução do resto do script
        return; 
    }

    //  3. Função Auxiliar para Adicionar Linha (Refatorado) 
    /**
     * Desenha uma nova linha na tabela.
     * Esta função é usada tanto ao carregar a página como ao salvar um novo livro.
     * @param {object} livro - O objeto do livro (ex: { _id, titulo, autor, isbn })
     */
    function adicionarLinhaNaTabela(livro) {
        const linhaVaziaAtual = document.getElementById('linhaVazia');
        if (linhaVaziaAtual) {
            linhaVaziaAtual.remove();
        }

        const novaLinhaHTML = `
            <tr data-id="${livro._id}"> 
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

    //  4. Função para Carregar Livros (NOVO e FUNDAMENTAL) 
    /**
     * Busca os livros da NOSSA API (base de dados) e preenche a tabela
     * assim que a página é carregada.
     */
    async function carregarLivros() {
        try {
            // Nota: Para listar livros, talvez não precise de token,
            // mas para criar/deletar é essencial.
            // Se a tua rota GET /api/livros for pública, podes tirar o 'headers'.
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminToken}` // Recomendado se a lista for protegida
                }
            }); 
            
            if (!response.ok) {
                throw new Error('Falha ao carregar o acervo. Faça login novamente.');
            }
            
            const livros = await response.json();
            
            tabelaCorpo.innerHTML = ''; // Limpa a tabela

            if (livros.length === 0) {
                tabelaCorpo.innerHTML = `
                    <tr id="linhaVazia">
                        <td colspan="4" class="text-center text-muted">Nenhum livro cadastrado.</td>
                    </tr>
                `;
            } else {
                livros.forEach(livro => {
                    adicionarLinhaNaTabela(livro);
                });
            }

        } catch (error) {
            console.error('Erro ao carregar livros:', error);
            tabelaCorpo.innerHTML = `
                <tr id="linhaVazia">
                    <td colspan="4" class="text-center text-danger">${error.message}</td>
                </tr>
            `;
        }
    }

    // 5. Lógica de BUSCA da API do Google (O teu código original - Está bom) 
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
        isbnHelp.className = "form-text";

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const volumeInfo = data.items[0].volumeInfo;
                
                inputTitulo.value = volumeInfo.title || '';
                inputAutor.value = volumeInfo.authors ? volumeInfo.authors.join(', ') : '';
                inputIsbnSalvo.value = isbn; // Salva o ISBN que foi buscado

                btnSalvarLivro.disabled = false; // ATIVA o botão Salvar
                isbnHelp.textContent = "Livro encontrado! Pode salvar.";
                isbnHelp.className = "form-text text-success";
            } else {
                isbnHelp.textContent = "Nenhum livro encontrado com este ISBN.";
                isbnHelp.className = "form-text text-danger";
            }
        } catch (error) {
            console.error('Erro ao buscar ISBN:', error);
            isbnHelp.textContent = "Erro ao conectar-se à API do Google.";
            isbnHelp.className = "form-text text-danger";
        } finally {
            isbnSpinner.style.display = 'none'; // Esconde o spinner
        }
    });

    // 6. Lógica de SALVAR (CORRIGIDO) 
    /**
     * Pega os dados do formulário e envia para o NOSSO BACKEND (POST)
     */
    formModal.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const titulo = inputTitulo.value;
        const autor = inputAutor.value;
        const isbn = inputIsbnSalvo.value;

        // Validação simples
        if (!titulo || !autor || !isbn) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        try {
            // Chama a NOSSA API para salvar
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}` // Envia o token de Admin
                },
                body: JSON.stringify({ titulo, autor, isbn })
            });

            const livroSalvo = await response.json(); // O livro que vem do MongoDB

            if (!response.ok) {
                // 'livroSalvo.message' é a mensagem de erro que vem do backend
                throw new Error(livroSalvo.message || 'Falha ao salvar o livro.');
            }

            // SUCESSO: Adiciona o livro (com o _id) na tabela
            adicionarLinhaNaTabela(livroSalvo); 
            
            // Limpa tudo e fecha o modal (como o teu original)
            formModal.reset();
            modal.hide();
            btnSalvarLivro.disabled = true;
            isbnHelp.textContent = "Busque pelo ISBN para preencher os campos.";
            isbnHelp.className = "form-text";

        } catch (error) {
            console.error('Erro ao salvar livro:', error);
            alert('Erro ao salvar livro: ' + error.message);
        }
    });

    // --- 7. Lógica de REMOVER (CORRIGIDO) ---
    /**
     * Escuta cliques na tabela e, se for no botão "Remover",
     * apaga o livro do BACKEND (DELETE).
     */
    tabelaCorpo.addEventListener('click', async function(event) {
        const botaoRemover = event.target.closest('.btn-remover');
        
        if (botaoRemover) {
            const linha = botaoRemover.closest('tr');
            // Pega o ID que guardámos no 'data-id'
            const livroId = linha.dataset.id; 

            if (!livroId) return;

            if (!confirm('Tem a certeza que deseja remover este livro do acervo?')) {
                return;
            }

            try {
                // Chama a NOSSA API para deletar
                const response = await fetch(`${API_URL}/${livroId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${adminToken}` // Envia o token de Admin
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao deletar.');
                }
                
                // Se deu certo no backend, remove a linha do HTML
                linha.remove(); 
                
                // Verifica se a tabela ficou vazia
                if (tabelaCorpo.children.length === 0) {
                    tabelaCorpo.innerHTML = `
                        <tr id="linhaVazia">
                            <td colspan="4" class="text-center text-muted">Nenhum livro cadastrado.</td>
                        </tr>
                    `;
                }

            } catch (error) {
                console.error('Erro ao remover livro:', error);
                alert(`Erro: ${error.message}`);
            }
        }
    });
    
    // 8. Inicia a Página 
    carregarLivros(); // Carrega os livros do DB assim que a página abre

});/* eslint-env browser */

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
