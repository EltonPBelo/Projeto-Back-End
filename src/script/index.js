// index.js (Corrigido)

// 1. Bibliotecas
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Importar as nossas rotas
const livroRoutes = require('./routes/livroRoutes');
const alunoRoutes = require('./routes/alunoRoutes'); // NOVO: Importa as rotas de aluno
const emprestimoRoutes = require('./routes/emprestimoRoutes'); 
// ... (código de ligação ao BD) ...

// 2.1 Definir as Rotas da API
app.use('/api/livros', livroRoutes);
app.use('/api/alunos', alunoRoutes);
const adminRoutes = require('./routes/adminRoutes');

// 3. Configurações
const app = express();
app.use(cors()); // Permite comunicação entre domínios
app.use(bodyParser.json()); // Lê o corpo das requisições como JSON


// 4. Ligar ao Banco de Dados (BD)
const MONGO_URL = 'mongodb://localhost:27017/biblioteca';
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao banco de dados MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao banco de dados MongoDB:', err);
});

// 5. Definir as Rotas da API
// Diz ao Express: "Qualquer pedido para /api/livros, usa o ficheiro livroRoutes"
app.use('/api/livros', livroRoutes);

// Diz ao Express: "Qualquer pedido para /api/alunos, usa o ficheiro alunoRoutes"
app.use('/api/alunos', alunoRoutes);

// Diz ao Express: "Qualquer pedido para /api/admin, usa o ficheiro adminRoutes"
app.use('/api/admin', adminRoutes);

// NOVO: Rotas de Empréstimos
app.use('/api/emprestimos', emprestimoRoutes); 

// 6. Iniciar o Servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
