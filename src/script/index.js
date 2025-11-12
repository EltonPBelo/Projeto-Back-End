//bibliotecas
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const livroRoutes = require('./routes/livroRoutes');

//configurações
const app = express();
app.use(bodyParser.json());
app.use(cors());

//rotas
app.use('/livros', livroRoutes);

//iniciar o servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

//Bd connection
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/biblioteca', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao banco de dados MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao banco de dados MongoDB:', err);
});

// O modelo de Livro foi movido para /models/livroModel.js;

const Livro = mongoose.model('Livro', livroSchema);

// Exportando tanto o app quanto o modelo Livro
module.exports = { app, Livro };

//rotas/livroRoutes.js
const express = require('express');
const router = express.Router();
const Livro = require('../models/livro');

// Criar um novo livro
router.post('/', async (req, res) => {
    try {
        const novoLivro = new Livro(req.body);
        const livroSalvo = await novoLivro.save();
        res.status(201).json(livroSalvo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obter todos os livros
router.get('/', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}); 

//simulação de dados livros
router.get('/simulacao', (req, res) => {
    const livrosSimulados = [
        { titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', anoPublicacao: 1954, genero: 'Fantasia' },
        { titulo: '1984', autor: 'George Orwell', anoPublicacao: 1949, genero: 'Distopia' },
        { titulo: 'Dom Quixote', autor: 'Miguel de Cervantes', anoPublicacao: 1605, genero: 'Aventura' }
    ];
    res.json(livrosSimulados);
});

// Obter um livro por ID
router.get('/:id', async (req, res) => {
    try {
        const livro = await Livro.findById(req.params.id);
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json(livro);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Atualizar um livro por ID
router.put('/:id', async (req, res) => {
    try {
        const livroAtualizado = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!livroAtualizado) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json(livroAtualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Deletar um livro por ID
router.delete('/:id', async (req, res) => {
    try {
        const livroDeletado = await Livro.findByIdAndDelete(req.params.id);
        if (!livroDeletado) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json({ message: 'Livro deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

//models/livro.js
const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    titulo: { 
        type: String,
        required: true
    },
    autor: { 
        type: String,
        required: true
    },
    anoPublicacao: { 
        type: Number,
        required: true
    },
    genero: { 
        type: String,
        required: true
    }
});

const livroModel = mongoose.model('Livro', livroSchema);

module.exports = Livro;

