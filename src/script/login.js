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

  // --- 3. FUNÇÕES DE SIMULAÇÃO DE LOGIN ---
  
  // Função para redirecionar o ALUNO
  function simularLoginAluno(event) {
    event.preventDefault(); // Impede o recarregamento
    window.location.href = 'dashboard-aluno.html'; // Redireciona para o dashboard do ALUNO
  }

  // Função para redirecionar o ADMIN
  function simularLoginAdmin(event) {
    event.preventDefault(); // Impede o recarregamento
    window.location.href = 'dashboard-admin.html'; // Redireciona para o dashboard do ADMIN
  }

  // --- 4. Adiciona as funções aos formulários CORRETOS ---

  // Formulários de Aluno
  const formStudentLogin = document.getElementById('formStudentLogin');
  const formStudentRegister = document.getElementById('formStudentRegister');
  
  // Formulários de Admin
  const formAdminLogin = document.getElementById('formAdminLogin');
  const formAdminRegister = document.getElementById('formAdminRegister');

  // Adiciona o "escutador" para ALUNOS
  if (formStudentLogin) {
    formStudentLogin.addEventListener('submit', simularLoginAluno);
  }
  if (formStudentRegister) {
    formStudentRegister.addEventListener('submit', simularLoginAluno);
  }

  // Adiciona o "escutador" para ADMINS
  if (formAdminLogin) {
    formAdminLogin.addEventListener('submit', simularLoginAdmin);
  }
  if (formAdminRegister) {
    formAdminRegister.addEventListener('submit', simularLoginAdmin);
  }
});