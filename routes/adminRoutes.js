// (Novo Ficheiro)

const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel'); // Importa o Modelo
const jwt = require('jsonwebtoken'); // Para criar o "token" de login

// --- ROTA DE REGISTO DE ADMIN ---
// POST /api/admin/registrar
router.post('/registrar', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // 1. Verifica se o admin já existe
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Este email já está registado.' });
        }
        
        // 2. Cria o novo admin (a senha será encriptada pelo 'AdminModel.js')
        admin = new Admin({ nome, email, senha });

        // 3. Salva no banco de dados
        await admin.save();
        
        res.status(201).json({ message: 'Administrador registado com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});


// --- ROTA DE LOGIN DE ADMIN ---
// POST /api/admin/login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Encontra o admin pelo email (e pede para incluir a senha)
        const admin = await Admin.findOne({ email }).select('+senha');
        
        if (!admin) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // 2. Compara a senha usando o método que criámos
        const senhaCorreta = await admin.sistemaSegurança(senha);

        if (!senhaCorreta) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // 3. GERA O TOKEN DE LOGIN (JWT)
        const token = jwt.sign(
            { id: admin._id, nome: admin.nome, tipo: 'admin' }, // Guarda o tipo
            'O_TEU_SEGREDO_JWT_ADMIN', // Usa um segredo diferente do aluno!
            { expiresIn: '8h' }
        );

        // 4. Envia o token de volta para o frontend
        res.json({ token, message: 'Login de Admin bem-sucedido!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});

module.exports = router;