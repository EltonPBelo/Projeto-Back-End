// /routes/livroRoutes.js (Corrigido)

const express = require('express');
const router = express.Router();
const Livro = require('../models/livroModel'); // Importa o modelo que acabámos de criar

// ROTA 1: Criar um novo livro (POST /api/livros)
// Esta rota será chamada pelo 'acervo.js' do frontend
router.post('/', async (req, res) => {
    try {
        // Pega os dados (titulo, autor, isbn) do corpo da requisição
        const novoLivro = new Livro({
            titulo: req.body.titulo,
            autor: req.body.autor,
            isbn: req.body.isbn
        });
        
        const livroSalvo = await novoLivro.save();
        res.status(201).json(livroSalvo); // 201 = Criado com sucesso
    } catch (err) {
        res.status(400).json({ message: err.message }); // 400 = Pedido inválido
    }
});

// ROTA 2: Listar todos os livros (GET /api/livros)
router.get('/', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (err) {
        res.status(500).json({ message: err.message }); // 500 = Erro de servidor
    }
});

// ROTA 3: Deletar um livro por ID (DELETE /api/livros/:id)
// Esta rota será chamada pelo 'acervo.js'
router.delete('/:id', async (req, res) => {
    try {
        // O req.params.id vem da URL (ex: /api/livros/12345)
        const livroDeletado = await Livro.findByIdAndDelete(req.params.id);
        
        if (!livroDeletado) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        
        res.json({ message: 'Livro deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;