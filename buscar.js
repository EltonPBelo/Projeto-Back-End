/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. URLs da API (Obrigatório) 
    const API_URL_LIVROS = 'http://localhost:3002/api/livros';
    const API_URL_EMPRESTIMOS = 'http://localhost:3002/api/emprestimos/novo';
    
    // 2. Token do Aluno (Fundamental para Emprestar) 
    // Pega o token que o 'login.js' guardou
    const authToken = localStorage.getItem('authToken');

    // 3. Seleção de Elementos (Como o teu original)
    const formBusca = document.getElementById('formBusca');
    const termoBusca = document.getElementById('termoBusca');
    const areaResultados = document.getElementById('areaResultados');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Se o aluno não está logado, ele não pode pesquisar/emprestar.
    if (!authToken) {
        areaResultados.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    Não foi possível carregar o acervo. Por favor, 
                    <a href="login.html" class="alert-link">faça o login</a> novamente.
                </div>
            </div>
        `;
        formBusca.style.display = 'none'; // Esconde o formulário de busca
        return; // Para a execução
    }

    // 4. Lógica de BUSCA (CORRIGIDA)
    formBusca.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const termo = termoBusca.value.trim().toLowerCase(); // Pega o termo em minúsculas
        
        if (!termo) return; 

        // Prepara a interface (igual ao teu original)
        areaResultados.innerHTML = ''; 
        loadingSpinner.style.display = 'block'; 

        try {
            // 1. CHAMA A NOSSA PRÓPRIA API DE LIVROS
            const response = await fetch(API_URL_LIVROS, {
                headers: {
                    // Nota: O GET /api/livros é público, mas se fosse protegido,
                    // seria preciso enviar o token aqui também.
                    'Authorization': `Bearer ${authToken}` 
                }
            });
            
            if (!response.ok) {
                throw new Error('Falha ao buscar os livros da biblioteca.');
            }

            const todosOsLivros = await response.json();
            
            // 2. FILTRA OS RESULTADOS AQUI NO FRONTEND
            // Filtra por título OU autor que contenham o termo da busca
            const livrosFiltrados = todosOsLivros.filter(livro => {
                return livro.titulo.toLowerCase().includes(termo) || 
                       livro.autor.toLowerCase().includes(termo);
            });
            
            // 3. EXIBE OS RESULTADOS
            exibirResultados(livrosFiltrados);

        } catch (error) {
            console.error('Erro na busca:', error);
            areaResultados.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        ${error.message}
                    </div>
                </div>
            `;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    // --- 5. Função para "Desenhar" os Cards (CORRIGIDA) ---
    function exibirResultados(livros) {
        // Se a busca não retornou nada
        if (livros.length === 0) {
            areaResultados.innerHTML = `
                <div class="col-12">
                    <p class="text-center text-muted">Nenhum livro encontrado com esse termo.</p>
                </div>
            `;
            return;
        }

        let htmlResultados = '';

        livros.forEach(livro => {
            // Não temos mais a capa do Google, então usamos um placeholder
            const capaPlaceholder = 'https://via.placeholder.com/128x192.png?text=Livro';

            // Monta o HTML do Card (agora com os dados da NOSSA API)
            htmlResultados += `
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="card h-100 shadow-sm book-card">
                        <img src="${capaPlaceholder}" class="card-img-top" alt="Capa do livro" style="height: 250px; object-fit: contain; padding: 10px;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${livro.titulo}</h5> 
                            <p class="card-text text-muted">${livro.autor}</p>
                            
                            <button 
                                class="btn btn-success mt-auto btn-emprestar" 
                                data-livro-id="${livro._id}">
                                Emprestar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        // Insere todo o HTML gerado na página
        areaResultados.innerHTML = htmlResultados;
    }

    // 6. Lógica de EMPRÉSTIMO (NOVO e FUNDAMENTAL) 
    /**
     * Escuta cliques na área de resultados. Se o clique for em
     * um botão 'btn-emprestar', chama a API de empréstimos.
     */
    areaResultados.addEventListener('click', async function(event) {
        const botaoEmprestar = event.target.closest('.btn-emprestar');

        // Se o clique não foi num botão "Emprestar", ignora
        if (!botaoEmprestar) {
            return;
        }

        // Pega o ID do livro que guardámos no 'data-livro-id'
        const livroId = botaoEmprestar.dataset.livroId;

        // Desativa o botão para evitar cliques duplos
        botaoEmprestar.disabled = true;
        botaoEmprestar.textContent = 'Processando...';

        try {
            // CHAMA A API DE EMPRÉSTIMOS
            const response = await fetch(API_URL_EMPRESTIMOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Envia o token do aluno para o 'authMiddleware' do backend
                    'Authorization': `Bearer ${authToken}` 
                },
                // Envia o ID do livro no corpo (como o backend 'emprestimoRoutes.js' espera)
                body: JSON.stringify({ livroId: livroId }) 
            });

            const data = await response.json();

            if (!response.ok) {
                // Se o backend der um erro (ex: livro já emprestado), mostra a mensagem
                throw new Error(data.message || 'Erro ao tentar emprestar.');
            }

            // Sucesso!
            alert('Livro emprestado com sucesso!');
            botaoEmprestar.textContent = 'Emprestado!';
            botaoEmprestar.classList.remove('btn-success');
            botaoEmprestar.classList.add('btn-secondary');

        } catch (error) {
            console.error('Erro ao emprestar:', error);
            alert(`Erro: ${error.message}`);
            
            // Reativa o botão em caso de erro
            botaoEmprestar.disabled = false;
            botaoEmprestar.textContent = 'Emprestar';
        }
    });

});