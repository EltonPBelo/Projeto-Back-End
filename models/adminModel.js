// /models/AdminModel.js (Corrigido)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Precisamos de importar o bcrypt aqui

const adminSchema = new mongoose.Schema({
    nome: { 
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true // Boa prática
    },
    senha: { 
        type: String,
        required: true,
        select: false // Não mostra a senha em buscas
    }
});

// Encripta a senha ANTES de salvar
adminSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Compara a senha (corrigido para 'methods')
adminSchema.methods.sistemaSegurança = async function(senhaInput) {
    return await bcrypt.compare(senhaInput, this.senha);
};  

// Exporta no formato CommonJS
module.exports = mongoose.model('Admin', adminSchema);