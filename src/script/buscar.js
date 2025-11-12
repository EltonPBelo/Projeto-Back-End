/* eslint-env browser */

// --- NOSSO ACERVO INTERNO FALSO (Simulação) ---
const acervoInternoFalso = [
    { 
        id: 1, 
        titulo: "O Senhor dos Anéis", 
        autor: "J.R.R. Tolkien", 
        isbn: "9780261102385", 
        capa: "https://via.placeholder.com/128x192.png?text=Capa+Interna" 
    },
    { 
        id: 2, 
        titulo: "O Guia do Mochileiro das Galáxias", 
        autor: "Douglas Adams", 
        isbn: "9780345391803",
        capa: "https://via.placeholder.com/128x192.png?text=Capa+Interna"
    },
    { 
        id: 3, 
        titulo: "Duna", 
        autor: "Frank Herbert", 
        isbn: "9780441172719",
        capa: "https://via.placeholder.com/128x192.png?text=Capa+Interna"
    }
];
// ----------------------------------------------------

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

    // --- LÓGICA DE BUSCA PRINCIPAL ---
    formBusca.addEventListener('submit', function(event) {
        event.preventDefault();
        const termo = termoBusca.value.trim().toLowerCase();
        if (!termo) return;

        // Limpa a tela
        areaResultadosInternos.innerHTML = '';
        areaSugestoes.style.display = 'none';
        areaResultadosApi.innerHTML = '';

        // 1. Tenta buscar no Acervo Interno Falso
        const resultadosInternos = acervoInternoFalso.filter(livro => 
            livro.titulo.toLowerCase().includes(termo) || 
            livro.autor.toLowerCase().includes(termo)
        );

        // 2. Processa os resultados
        if (resultadosInternos.length > 0) {
            exibirResultadosInternos(resultadosInternos);
        } else {
            areaResultadosInternos.innerHTML = '<p class="col-12 text-center text-muted">Não encontramos este livro em nosso acervo.</p>';
            areaSugestoes.style.display = 'block';
            buscarNaApi(termo);
        }
    });

    // --- Função: Exibir Resultados INTERNOS ---
    function exibirResultadosInternos(livros) {
        let htmlResultados = '';
        livros.forEach(livro => {
            htmlResultados += `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 shadow-sm">
                        <img src="${livro.capa}" class="card-img-top" alt="${livro.titulo}" style="height: 250px; object-fit: contain; padding: 10px;">
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

    // --- Função: Chamar API do GOOGLE para sugestões ---
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

    // --- Função: Exibir Resultados da API (Sugestões) ---
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

    // --- Lógica dos Modals ---

    modalAlugarEl.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; 
        const titulo = button.getAttribute('data-titulo-livro');
        const modalTitle = modalAlugarEl.querySelector('#tituloLivroAlugar');
        modalTitle.textContent = titulo;
    });

    // **** FUNÇÃO ATUALIZADA ****
    // Modal Alugar: Salva o empréstimo no localStorage
    formAlugar.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 1. Coleta os dados do empréstimo
        const tempoDias = parseInt(document.getElementById('tempoAluguel').value, 10);
        const titulo = modalAlugarEl.querySelector('#tituloLivroAlugar').textContent;
        const dataAluguer = new Date(); // Guarda a data e hora exatas de agora
        
        // (Simulação de quem alugou. No futuro, viria do login)
        const aluno = "Aluno Teste (teste@mail.com)"; 

        const novoEmprestimo = {
            id: Date.now(), // ID único baseado no tempo
            titulo: titulo,
            aluno: aluno,
            dataAluguer: dataAluguer.toISOString(), // Formato padrão para guardar datas
            diasPrazo: tempoDias
        };

        // 2. Salva no localStorage
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

    // Modal Solicitar: Simula o envio da solicitação
    formSolicitar.addEventListener('submit', function(event) {
        event.preventDefault();
        const titulo = document.getElementById('solicitarTitulo').value;
        modalSolicitar.hide();
        alert(`Solicitação para o livro "${titulo}" enviada com sucesso! (Simulação)`);
        formSolicitar.reset();
    });

});