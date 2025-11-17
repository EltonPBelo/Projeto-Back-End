/* eslint-env browser */

// O ACERVO FALSO FOI REMOVIDO DAQUI
// Agora vamos ler o acervo real do localStorage

document.addEventListener('DOMContentLoaded', function () {
    
    // --- Seleção de Elementos ---
    const formBusca = document.getElementById('formBusca');
    const termoBusca = document.getElementById('termoBusca');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Áreas de Resultado
    const areaResultadosInternos = document.getElementById('areaResultadosInternos');
    const areaSugestoes = document.getElementById('areaSugestoes');
    const areaResultadosApi = document.getElementById('areaResultadosApi');

    // Modals
    const modalAlugarEl = document.getElementById('modalAlugarLivro');
    const modalAlugar = new bootstrap.Modal(modalAlugarEl);
    const formAlugar = document.getElementById('formAlugarLivro');

    const modalSolicitarEl = document.getElementById('modalSolicitarLivro');
    const modalSolicitar = new bootstrap.Modal(modalSolicitarEl);
    const formSolicitar = document.getElementById('formSolicitarLivro');

    // --- LÓGICA DE BUSCA PRINCIPAL (ATUALIZADA) ---
    if (formBusca) {
        formBusca.addEventListener('submit', function(event) {
            event.preventDefault();
            const termo = termoBusca.value.trim().toLowerCase();
            if (!termo) return;

            // Limpa a tela
            areaResultadosInternos.innerHTML = '';
            areaSugestoes.style.display = 'none';
            areaResultadosApi.innerHTML = '';

            // 1. Lê o Acervo REAL do localStorage
            const acervoReal = JSON.parse(localStorage.getItem('bibliotecaAcervo')) || [];

            const resultadosInternos = acervoReal.filter(livro => 
                livro.titulo.toLowerCase().includes(termo) || 
                livro.autor.toLowerCase().includes(termo)
            );

            // 2. Processa os resultados
            if (resultadosInternos.length > 0) {
                // ENCONTROU! Exibe os resultados internos.
                exibirResultadosInternos(resultadosInternos);
            } else {
                // NÃO ENCONTROU! Mostra a seção de sugestões.
                areaResultadosInternos.innerHTML = '<p class="col-12 text-center text-muted">Não encontramos este livro em nosso acervo.</p>';
                areaSugestoes.style.display = 'block';
                buscarNaApi(termo); // Chama a API do Google para sugestões
            }
        });
    }

    // --- Função: Exibir Resultados INTERNOS (ATUALIZADA) ---
    function exibirResultadosInternos(livros) {
        let htmlResultados = '';
        livros.forEach(livro => {
            // USA 'livro.capaUrl' (que o admin salvou) em vez de 'livro.capa'
            htmlResultados += `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 shadow-sm">
                        <img src="${livro.capaUrl}" class="card-img-top" alt="${livro.titulo}" style="height: 250px; object-fit: contain; padding: 10px;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${livro.titulo}</h5>
                            <p class="card-text text-muted">${livro.autor}</p>
                            <button class="btn btn-primary mt-auto btn-alugar" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modalAlugarLivro"
                                    data-titulo-livro="${livro.titulo}">
                                Alugar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        areaResultadosInternos.innerHTML = htmlResultados;
    }

    // --- Função: Chamar API do GOOGLE para sugestões (Sem alteração) ---
    async function buscarNaApi(termo) {
        loadingSpinner.style.display = 'block';
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${termo}&maxResults=4`);
            if (!response.ok) throw new Error('Falha na busca da API');
            
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                exibirResultadosApi(data.items);
            } else {
                areaResultadosApi.innerHTML = '<p class="col-12 text-center text-muted">Não encontramos sugestões no Google Books.</p>';
            }
        } catch (error) {
            console.error('Erro na API:', error);
            areaResultadosApi.innerHTML = '<p class="col-12 text-center text-danger">Erro ao carregar sugestões.</p>';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // --- Função: Exibir Resultados da API (Sugestões) (Sem alteração) ---
    function exibirResultadosApi(livros) {
        let htmlResultados = '';
        livros.forEach(livro => {
            const info = livro.volumeInfo;
            const titulo = info.title || 'Título indisponível';
            const autores = info.authors ? info.authors.join(', ') : 'Autor desconhecido';
            const capa = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=Sem+Capa';

            htmlResultados += `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 shadow-sm" style="opacity: 0.7;">
                        <img src="${capa}" class="card-img-top" alt="${titulo}" style="height: 250px; object-fit: contain; padding: 10px;">
                        <div class="card-body">
                            <h5 class="card-title">${titulo}</h5>
                            <p class="card-text text-muted">${autores}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        areaResultadosApi.innerHTML = htmlResultados;
    }

    // --- Lógica dos Modals (Sem alteração) ---

    if(modalAlugarEl) {
        modalAlugarEl.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; 
            const titulo = button.getAttribute('data-titulo-livro');
            const modalTitle = modalAlugarEl.querySelector('#tituloLivroAlugar');
            modalTitle.textContent = titulo;
        });
    }

    if(formAlugar) {
        formAlugar.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const tempoDias = parseInt(document.getElementById('tempoAluguel').value, 10);
            const titulo = modalAlugarEl.querySelector('#tituloLivroAlugar').textContent;
            const dataAluguer = new Date();
            const aluno = "Aluno Teste (teste@mail.com)"; 

            const novoEmprestimo = {
                id: Date.now(),
                titulo: titulo,
                aluno: aluno,
                dataAluguer: dataAluguer.toISOString(),
                diasPrazo: tempoDias
            };

            try {
                let emprestimos = JSON.parse(localStorage.getItem('bibliotecaEmprestimos')) || [];
                emprestimos.push(novoEmprestimo);
                localStorage.setItem('bibliotecaEmprestimos', JSON.stringify(emprestimos));
                
                modalAlugar.hide();
                alert(`Livro "${titulo}" alugado por ${tempoDias} dias!`);

            } catch (e) {
                console.error("Erro ao salvar empréstimo:", e);
                alert("Erro ao processar aluguer.");
            }
        });
    }

    if (formSolicitar) {
        formSolicitar.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const titulo = document.getElementById('solicitarTitulo').value;
            const autor = document.getElementById('solicitarAutor').value;
            const aluno = "Aluno Teste (teste@mail.com)";
            
            const novaSolicitacao = {
                id: Date.now(),
                titulo: titulo,
                autor: autor,
                aluno: aluno
            };

            try {
                let solicitacoes = JSON.parse(localStorage.getItem('bibliotecaSolicitacoes')) || [];
                solicitacoes.push(novaSolicitacao);
                localStorage.setItem('bibliotecaSolicitacoes', JSON.stringify(solicitacoes));

                modalSolicitar.hide();
                alert(`Solicitação para o livro "${titulo}" enviada com sucesso!`);
                formSolicitar.reset();

            } catch (e) {
                console.error("Erro ao salvar solicitação:", e);
                alert("Erro ao enviar solicitação.");
            }
        });
    }

});