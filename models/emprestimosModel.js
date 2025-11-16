// emprestimosModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emprestimoSchema = new Schema({
    // A 'ref' é muito importante. Ela cria a ligação.
    aluno: {
        type: Schema.Types.ObjectId,
        ref: 'Aluno', // Refere-se ao 'alunoModel.js'
        required: true
    },
    livro: {
        type: Schema.Types.ObjectId,
        ref: 'Livro', // Refere-se ao 'livroModel.js'
        required: true
    },
    dataEmprestimo: {
        type: Date,
        default: Date.now // A data é definida automaticamente
    },
    dataDevolucaoPrevista: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Emprestado', 'Devolvido', 'Atrasado'], // Só aceita estes valores
        default: 'Emprestado'
    }
});

module.exports = mongoose.model('Empréstimo', emprestimoSchema);