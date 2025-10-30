/* eslint-env browser */

// Aguarda o documento estar totalmente carregado
document.addEventListener('DOMContentLoaded', function () {
  
  // --- 1. Seleção de Elementos (Telas) ---
  const roleSelection = document.getElementById('roleSelection');
  const studentForm = document.getElementById('studentForm');
  const adminForm = document.getElementById('adminForm');
  const btnShowStudent = document.getElementById('btnShowStudent');
  const btnShowAdmin = document.getElementById('btnShowAdmin');
  const btnBack = document.querySelectorAll('.btn-back');

  // --- 2. Lógica de Troca de Telas ---
  if (btnShowStudent) {
    btnShowStudent.addEventListener('click', () => showPanel(studentForm));
  }
  if (btnShowAdmin) {
    btnShowAdmin.addEventListener('click', () => showPanel(adminForm));
  }
  btnBack.forEach((button) => {
    button.addEventListener('click', showRoleSelection);
  });

  function showPanel(panelToShow) {
    if (roleSelection) roleSelection.style.display = 'none';
    if (studentForm) studentForm.style.display = 'none';
    if (adminForm) adminForm.style.display = 'none';
    if (panelToShow) panelToShow.style.display = 'block';
  }

  function showRoleSelection() {
    if (roleSelection) roleSelection.style.display = 'block';
    if (studentForm) studentForm.style.display = 'none';
    if (adminForm) adminForm.style.display = 'none';
  }

  // --- 3. FUNÇÃO DE SIMULAÇÃO DE LOGIN/CADASTRO ---

  function simularLogin(event) {
    // Impede o recarregamento da página
    event.preventDefault();

    // ***** LINHA DO POPUP REMOVIDA DAQUI *****
    
    // Redireciona o usuário imediatamente
    window.location.href = 'dashboard-aluno.html';
  }

  // --- 4. Adiciona a função a TODOS os formulários ---

  const formStudentLogin = document.getElementById('formStudentLogin');
  const formStudentRegister = document.getElementById('formStudentRegister');
  const formAdminLogin = document.getElementById('formAdminLogin');
  const formAdminRegister = document.getElementById('formAdminRegister');

  if (formStudentLogin) {
    formStudentLogin.addEventListener('submit', simularLogin);
  }
  if (formStudentRegister) {
    formStudentRegister.addEventListener('submit', simularLogin);
  }
  if (formAdminLogin) {
    formAdminLogin.addEventListener('submit', simularLogin);
  }
  if (formAdminRegister) {
    formAdminRegister.addEventListener('submit', simularLogin);
  }
});