/* eslint-env browser */

// Aguarda o documento estar totalmente carregado
document.addEventListener('DOMContentLoaded', function () {
  
    // --- 1. URLs da API (Obrigatório) ---
    const API_URL_ALUNO = 'http://localhost:3002/api/alunos'; 
    const API_URL_ADMIN = 'http://localhost:3002/api/admin'; 

    // --- 2. Seleção de Elementos (Telas) ---
    const roleSelection = document.getElementById('roleSelection');
    const studentForm = document.getElementById('studentForm');
    const adminForm = document.getElementById('adminForm');
    const btnShowStudent = document.getElementById('btnShowStudent');
    const btnShowAdmin = document.getElementById('btnShowAdmin');
    const btnBack = document.querySelectorAll('.btn-back');

    // --- 3. Lógica de Troca de Telas (O teu código original - Perfeito) ---
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
        showPanel(roleSelection);
    }

    // --- 4. Lógica de ALUNO (Não foi alterada) ---
    // (O teu código de login e registo de aluno continua aqui... vou assumir que está correto)
    
    // 4.1 Registo de Aluno (Vou usar os IDs que vi no teu HTML)
    const formAlunoReg = document.getElementById('formAlunoRegister'); // <-- Assumi este ID
    if (formAlunoReg) {
        formAlunoReg.addEventListener('submit', async function(e) {
            e.preventDefault();

            const nome = document.getElementById('stuRegName').value; // <-- Assumi este ID
            const email = document.getElementById('stuRegEmail').value; // <-- Assumi este ID
            const matricula = document.getElementById('stuRegMatricula').value; // <-- Assumi este ID
            const senha = document.getElementById('stuRegPass').value; // <-- Assumi este ID

            try {
                const response = await fetch(`${API_URL_ALUNO}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, matricula, senha })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao registar aluno.');

                alert('Aluno registado com sucesso! Por favor, faça o login.');
                formAlunoReg.reset();
                
            } catch (error) {
                console.error('Erro no registo de aluno:', error);
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // 4.2 Login de Aluno
    const formAlunoLogin = document.getElementById('formAlunoLogin'); // <-- Assumi este ID
    if (formAlunoLogin) {
        formAlunoLogin.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('stuEmail').value; // <-- Assumi este ID
            const senha = document.getElementById('stuPass').value; // <-- Assumi este ID

            try {
                const response = await fetch(`${API_URL_ALUNO}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao fazer login.');

                localStorage.setItem('authToken', data.token); 
                window.location.href = 'dashboard-aluno.html'; 

            } catch (error) {
                console.error('Erro no login de aluno:', error);
                alert(`Erro: ${error.message}`);
            }
        });
    }


    // --- 5. Lógica de ADMIN (AQUI ESTÁ A CORREÇÃO) ---

    // 5.1 Registo de Admin (IDs corrigidos)
    const formAdminReg = document.getElementById('formAdminRegister'); // <-- CORRIGIDO
    if (formAdminReg) {
        formAdminReg.addEventListener('submit', async function(e) {
            e.preventDefault(); 

            // Pega os valores dos campos do teu HTML
            const nome = document.getElementById('adminRegName').value; // <-- CORRIGIDO
            const email = document.getElementById('adminRegEmail').value;
            const senha = document.getElementById('adminRegPass').value;
            const chaveSeguranca = document.getElementById('adminRegKey').value; 

            // (Validação da Chave Secreta)
            if (chaveSeguranca !== '11desetembro') {
                alert('Chave de Segurança de administrador incorreta!');
                return;
            }

            try {
                const response = await fetch(`${API_URL_ADMIN}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao registar admin.');
                }

                alert('Administrador registado com sucesso! Por favor, faça o login.');
                formAdminReg.reset();
                
                // (Opcional) Mudar para a aba de login automaticamente
                // const loginTabButton = document.getElementById('admin-login-tab');
                // if (loginTabButton) new bootstrap.Tab(loginTabButton).show();

            } catch (error) {
                console.error('Erro no registo de admin:', error);
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // 5.2 Login de Admin (IDs corrigidos)
    const formAdminLogin = document.getElementById('formAdminLogin');
    if (formAdminLogin) {
        formAdminLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Pega os valores dos campos do teu HTML
            const email = document.getElementById('adminEmail').value; // <-- CORRIGIDO
            const senha = document.getElementById('adminPass').value; // <-- CORRIGIDO

            try {
                const response = await fetch(`${API_URL_ADMIN}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao fazer login de admin.');
                }
                
                // SUCESSO!
                localStorage.setItem('adminAuthToken', data.token); 
                window.location.href = 'dashboard-admin.html'; // Redireciona

            } catch (error) {
                console.error('Erro no login de admin:', error);
                alert(`Erro: ${error.message}`);
            }
        });
    }

});