/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {
    
    // Seleciona os elementos da página
    const formBusca = document.getElementById('formBusca');
    const termoBusca = document.getElementById('termoBusca');
    const areaResultados = document.getElementById('areaResultados');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Adiciona o "escutador" ao formulário
    formBusca.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o recarregamento da página
        
        const termo = termoBusca.value.trim(); // Pega o texto e limpa espaços
        
        if (!termo) return; // Não faz nada se a busca estiver vazia

        // Prepara a interface para a busca
        areaResultados.innerHTML = ''; // Limpa resultados antigos
        loadingSpinner.style.display = 'block'; // Mostra o "Carregando..."

        try {
            // 1. CHAMA A API DO GOOGLE BOOKS
            // Usamos 'await' para esperar a resposta
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${termo}&maxResults=12`);
            
            if (!response.ok) {
                throw new Error('Falha ao buscar os livros.');
            }

            const data = await response.json();
            
            // 2. PROCESSA OS RESULTADOS
            if (data.items && data.items.length > 0) {
                // Chama a função para exibir os livros na tela
                exibirLivros(data.items);
            } else {
                areaResultados.innerHTML = '<p class="col-12 text-center text-muted">Nenhum livro encontrado.</p>';
            }

        } catch (error) {
            // 3. TRATA ERROS
            console.error('Erro na busca:', error);
            areaResultados.innerHTML = '<p class="col-12 text-center text-danger">Erro ao carregar. Tente novamente.</p>';
        
        } finally {
            // Esconde o "Carregando..."
            loadingSpinner.style.display = 'none';
        }
    });

    // Função para "desenhar" os cards na tela
    function exibirLivros(livros) {
        let htmlResultados = '';

        livros.forEach(livro => {
            const info = livro.volumeInfo;

            // Variáveis de "fallback" (caso a info não exista)
            const titulo = info.title || 'Título indisponível';
            const autores = info.authors ? info.authors.join(', ') : 'Autor desconhecido';
            const capa = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=Sem+Capa';

            // Monta o HTML do Card do Bootstrap
            htmlResultados += `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 shadow-sm book-card">
                        <img src="${capa}" class="card-img-top" alt="Capa do livro ${titulo}" style="height: 250px; object-fit: contain; padding: 10px;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${titulo}</h5>
                            <p class="card-text text-muted">${autores}</p>
                            <a href="${info.previewLink}" target="_blank" class="btn btn-primary mt-auto">Ver Mais</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Insere todo o HTML gerado na página
        areaResultados.innerHTML = htmlResultados;
    }

});