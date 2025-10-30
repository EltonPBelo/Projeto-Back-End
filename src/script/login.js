document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Seleção de Elementos (Telas) ---
    const roleSelection = document.getElementById('roleSelection');
    const studentForm = document.getElementById('studentForm');
    const adminForm = document.getElementById('adminForm');
    const btnShowStudent = document.getElementById('btnShowStudent');
    const btnShowAdmin = document.getElementById('btnShowAdmin');
    const btnBack = document.querySelectorAll('.btn-back');

    // --- 2. Lógica de Troca de Telas (Igual a antes) ---
    btnShowStudent.addEventListener('click', () => showPanel(studentForm));
    btnShowAdmin.addEventListener('click', () => showPanel(adminForm));
    btnBack.forEach(button => button.addEventListener('click', showRoleSelection));

    function showPanel(panelToShow) {
        roleSelection.style.display = 'none';
        studentForm.style.display = 'none';
        adminForm.style.display = 'none';
        panelToShow.style.display = 'block';
    }
    function showRoleSelection() {
        roleSelection.style.display = 'block';
        studentForm.style.display = 'none';
        adminForm.style.display = 'none';
    }

    // --- 3. SIMULAÇÃO DE LOGIN ---

    // Seleciona o formulário de Login do Aluno
    const formStudentLogin = document.getElementById('formStudentLogin');
    formStudentLogin.addEventListener('submit', function(event) {
        // Impede o recarregamento da página
        event.preventDefault(); 
        
        // Exibe um alerta simples (opcional)
        alert('Login (simulado) com sucesso! Redirecionando...');
        
        // Redireciona o usuário para a nova página de dashboard
        window.location.href = 'dashboard-aluno.html';
    });

    // Seleciona o formulário de Login do Admin
    const formAdminLogin = document.getElementById('formAdminLogin');
    formAdminLogin.addEventListener('submit', function(event) {
        event.preventDefault(); 
        alert('Login de Admin (simulado) com sucesso! Redirecionando...');
        
        // (No futuro, poderíamos redirecionar para 'dashboard-admin.html')
        // Por enquanto, vamos para o de aluno também como exemplo
        window.location.href = 'dashboard-aluno.html';
    });


    // (Não precisamos mais dos formulários de *cadastro* para esta simulação)
    // (Mas você pode adicionar o mesmo redirecionamento para eles se quiser)

});