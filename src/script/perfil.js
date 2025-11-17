/* eslint-env browser */

document.addEventListener('DOMContentLoaded', function () {

    // --- Seleção de Elementos ---
    const formPerfil = document.getElementById('formPerfilAluno');
    const inputNome = document.getElementById('perfilNome');
    const inputEmail = document.getElementById('perfilEmail');
    const inputMatricula = document.getElementById('perfilMatricula');
    const alertSuccess = document.getElementById('alertSuccess');

    // --- SIMULAÇÃO: Identificar o Aluno Logado ---
    // Como não temos login, vamos assumir que o aluno logado
    // é o PRIMEIRO aluno na nossa lista do localStorage.
    
    let alunos = JSON.parse(localStorage.getItem('bibliotecaAlunos')) || [];
    let alunoLogado = null;
    
    if (alunos.length > 0) {
        // Pega o primeiro aluno como o "logado"
        alunoLogado = alunos[0]; 
        
        // 1. Preenche o formulário com os dados do aluno
        inputNome.value = alunoLogado.nome;
        inputEmail.value = alunoLogado.email;
        inputMatricula.value = alunoLogado.matricula;
    } else {
        // Se não houver alunos, desativa o formulário
        formPerfil.innerHTML = '<p class="text-center text-danger">Nenhum aluno encontrado. Faça um registo primeiro.</p>';
    }

    // --- Lógica para Salvar o Perfil ---
    formPerfil.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Se não houver aluno (segurança)
        if (!alunoLogado) return;

        // 1. Atualiza os dados do objeto 'alunoLogado'
        alunoLogado.nome = inputNome.value;
        alunoLogado.email = inputEmail.value;
        // A matrícula (readonly) não precisa ser atualizada

        // 2. Encontra o aluno na lista 'alunos' e substitui-o
        const index = alunos.findIndex(a => a.matricula === alunoLogado.matricula);
        if (index !== -1) {
            alunos[index] = alunoLogado;
        }

        // 3. Salva a lista de alunos ATUALIZADA de volta no localStorage
        try {
            localStorage.setItem('bibliotecaAlunos', JSON.stringify(alunos));
            
            // Mostra o alerta de sucesso
            alertSuccess.style.display = 'block';
            // Esconde o alerta depois de 3 segundos
            setTimeout(() => {
                alertSuccess.style.display = 'none';
            }, 3000);

        } catch (e) {
            console.error("Erro ao salvar perfil:", e);
            alert("Não foi possível salvar as alterações.");
        }

        // Nota: A lógica da "Nova Senha" não é guardada
        // porque não temos um sistema de login para a usar.
        document.getElementById('perfilSenha').value = ''; // Limpa o campo
    });

});