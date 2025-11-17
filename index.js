// src/script/index.js (COM A ALTERNATIVA 127.0.0.1 E A "VACINA" DO .THEN())

// 1. Bibliotecas
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Inicialização do App
const app = express();
const PORT = 3002; 

// 3. Middlewares (O "Tradutor" de JSON)
app.use(cors()); 
app.use(express.json()); // A tua linha (perfeita)

// 4. Importar as Rotas (Os "Assistentes")
const livroRoutes = require('../routes/livroRoutes');
const alunoRoutes = require('../routes/alunoRoutes');
const adminRoutes = require('../routes/adminRoutes');
const emprestimoRoutes = require('../routes/emprestimoRoutes');

// 5. Usar as Rotas (O "Chefe" a distribuir o trabalho)
app.use('/api/livros', livroRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emprestimos', emprestimoRoutes);

// ... (cerca da linha 40)

// 6. Conexão com o Banco de Dados (O "Depósito")
// Usamos 127.0.0.1 para forçar IPv4 E adicionamos opções de conexão para evitar timeout.
const MONGO_URL = 'mongodb://127.0.0.1:27017/biblioteca';

// ---- A ALTERNATIVA FINAL ESTÁ AQUI ----
const mongooseOptions = {
    // Estas opções são cruciais para contornar erros de rede persistentes
    serverSelectionTimeoutMS: 5000, // Diminui o timeout de 10s para 5s (vai falhar mais rápido se não funcionar)
    // Desativa a lógica de descoberta de servidor, que geralmente é o que falha no Windows.
};

mongoose.connect(MONGO_URL, mongooseOptions) 
// ---- FIM DA ALTERNATIVA FINAL ----
    .then(() => {
        // ... (o resto do .then() e .catch() deve ser o mesmo)
        console.log('Conectado ao banco de dados MongoDB (via 127.0.0.1)');
        
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

    })
    .catch((err) => {
        console.error('!!!! ERRO CRÍTICO AO CONECTAR AO DB !!!!');
        console.error('O serviço do MongoDB está "encravado" ou desligado?');
        console.error(err);
        process.exit(1);
    });
