// Aguarda o documento estar totalmente carregado para rodar o script
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Seleciona os Elementos Principais ---
    const roleSelection = document.getElementById('roleSelection');
    const studentForm = document.getElementById('studentForm');
    const adminForm = document.getElementById('adminForm');

    // --- 2. Seleciona os Botões de Ação ---
    const btnShowStudent = document.getElementById('btnShowStudent');
    const btnShowAdmin = document.getElementById('btnShowAdmin');
    
    // Seleciona TODOS os botões "Voltar" (usando querySelectorAll)
    const btnBack = document.querySelectorAll('.btn-back');

    // --- 3. Funções para trocar de tela ---

    // Mostra o formulário de Aluno
    btnShowStudent.addEventListener('click', function() {
        roleSelection.style.display = 'none';
        studentForm.style.display = 'block';
        adminForm.style.display = 'none';
    });

    // Mostra o formulário de Admin
    btnShowAdmin.addEventListener('click', function() {
        roleSelection.style.display = 'none';
        studentForm.style.display = 'none';
        adminForm.style.display = 'block';
    });

    // Função para voltar à seleção de função
    function goBack() {
        roleSelection.style.display = 'block';
        studentForm.style.display = 'none';
        adminForm.style.display = 'none';
    }

    // Adiciona o evento de 'click' a CADA botão "Voltar"
    btnBack.forEach(function(button) {
        button.addEventListener('click', goBack);
    });

});