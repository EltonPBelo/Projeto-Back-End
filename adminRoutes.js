// src/routes/adminRoutes.js (COM O TEU CÓDIGO DE VALIDAÇÃO CORRIGIDO)

const express = require('express');
const router = express.Router(); // Usamos 'router' aqui, não 'app'
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

const ADMIN_SECRET_KEY = 'minha-chave-secreta-de-admin-nao-e-11desetembro';

/**
 * ROTA DE REGISTO DE ADMIN (POST /registrar)
 */
router.post('/registrar', async (req, res) => {
    
    // Debug: Vamos ver o que o frontend está a enviar
    console.log("BACKEND RECEBEU /registrar. Dados:", req.body);

    try {
        // ---- A TUA VALIDAÇÃO (AGORA CORRIGIDA) ----
        const { nome, email, senha } = req.body;
        
        // O teu código só tinha 'email' e 'senha'. O 'nome' em falta causava o Erro 500.
        if (!nome || !email || !senha) {
            console.error("!!!! ERRO DE VALIDAÇÃO: Campos em falta !!!!");
            return res.status(400).json({ message: "Erro de validação: Todos os campos (nome, email, senha) são obrigatórios." });
        }
        // ---- FIM DA VALIDAÇÃO ----

        // 1. Verifica se o admin já existe
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Este email já está registado.' });
        }
        
        // 2. Cria o novo admin
        admin = new Admin({ nome, email, senha });

        // 3. Salva no banco de dados
        await admin.save();
        
        // 4. Se tudo correr bem (a tua mensagem de sucesso)
        res.status(201).json({ message: "Usuário registrado com sucesso" });

    } catch (error) {
        
        // ---- O TEU CATCH (AGORA MAIS INTELIGENTE) ----
        console.error("!!!! ERRO NO CATCH DO REGISTO DE ADMIN !!!!", error); 
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erro de validação Mongoose: ' + error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Erro ao registar. Este email já existe.' });
        }
        
        // O teu erro genérico
        res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
    }
});


/**
 * ROTA DE LOGIN DE ADMIN (POST /login)
 */
router.post('/login', async (req, res) => {
    // (O código de login continua aqui, não precisa de mexer)
    try {
        const { email, senha } = req.body;
        const admin = await Admin.findOne({ email }).select('+senha');
        
        if (!admin) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }
        const senhaCorreta = await admin.sistemaSegurança(senha);
        if (!senhaCorreta) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }
        const token = jwt.sign(
            { id: admin._id, nome: admin.nome, tipo: 'admin' }, 
            ADMIN_SECRET_KEY, 
            { expiresIn: '8h' }
        );
        res.json({ token, message: 'Login de admin bem-sucedido!' });

    } catch (error) {
        console.error("!!!! ERRO NO LOGIN DE ADMIN !!!!", error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
});

module.exports = router;