// /routes/alunoRoutes.js

const express = require('express');
const router = express.Router();
const Aluno = require('../models/alunoModel'); // Importa o Modelo
const jwt = require('jsonwebtoken'); // Para criar o "token" de login
const bcrypt = require('bcryptjs'); // Para comparar as senhas no login

// --- ROTA DE REGISTO (para login.html) ---
// POST /api/alunos/registrar
router.post('/registrar', async (req, res) => {
    try {
        // Pega os dados do formulário de registo (ex: stuRegNome, stuRegEmail, ...)
        const { matricula, nome, email, senha } = req.body;

        // 1. Verifica se o aluno já existe
        let aluno = await Aluno.findOne({ email });
        if (aluno) {
            return res.status(400).json({ message: 'Este email já está registado.' });
        }
        
        // 2. Cria o novo aluno (a senha será "embaralhada" pelo 'alunoModel.js')
        aluno = new Aluno({
            matricula,
            nome,
            email,
            senha
        });

        // 3. Salva no banco de dados
        await aluno.save();
        
        // 4. Responde com sucesso (sem mostrar a senha)
        res.status(201).json({ message: 'Aluno registado com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});


// --- ROTA DE LOGIN (para login.html) ---
// POST /api/alunos/login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Encontra o aluno pelo email (e pede para o DB incluir a senha)
        const aluno = await Aluno.findOne({ email }).select('+senha');
        
        if (!aluno) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // 2. Compara a senha digitada com a senha no DB
        const senhaCorreta = await aluno.compararSenha(senha); // Usamos o método que criámos

        if (!senhaCorreta) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // 3. GERA O TOKEN DE LOGIN (JWT)
        // Este token é a "prova" de que o aluno está logado
        const token = jwt.sign(
            { id: aluno._id, nome: aluno.nome }, // O que guardar no token
            'O_TEU_SEGREDO_JWT',                  // Chave secreta (muda isto!)
            { expiresIn: '8h' }                  // Duração do token
        );

        // 4. Envia o token de volta para o frontend
        res.json({ token, message: 'Login bem-sucedido!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});


// --- ROTA PARA LISTAR ALUNOS (para aluno-admin.html) ---
// GET /api/alunos
router.get('/', async (req, res) => {
    try {
        // Encontra todos os alunos
        // A senha não virá, pois definimos 'select: false' no Modelo
        const alunos = await Aluno.find(); 
        res.json(alunos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- ROTA PARA DELETAR ALUNOS (para aluno-admin.html) ---
// DELETE /api/alunos/:id
router.delete('/:id', async (req, res) => {
    try {
        const alunoDeletado = await Aluno.findByIdAndDelete(req.params.id);
        
        if (!alunoDeletado) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        
        res.json({ message: 'Aluno deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;