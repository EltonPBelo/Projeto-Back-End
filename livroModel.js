const mongoose = require('mongoose');

// 1. Define o "formato" do Livro
const livroSchema = new mongoose.Schema({
    titulo: { 
        type: String,
        required: true
    },
    autor: { 
        type: String,
        required: true
    },
    isbn: { // Adicionei o ISBN que tinhas no frontend
        type: String,
        required: true,
        unique: true // Garante que não há ISBNs repetidos
    }
    // Podes adicionar mais campos aqui, ex: anoPublicacao, editora, etc.
});

// 2. Cria e exporta o "Modelo"
// O Mongoose vai criar uma coleção chamada "livros" (plural)
module.exports = mongoose.model('Livro', livroSchema);