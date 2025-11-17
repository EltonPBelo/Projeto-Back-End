// src/models/adminModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true, select: false }
});

// A PARTE IMPORTANTE É ESTA:
adminSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    
    // TEM DE TER ESTE TRY...CATCH
    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error); 
    }
    // FIM DA PARTE IMPORTANTE
});

adminSchema.methods.sistemaSegurança = async function(senhaInput) {
    return await bcrypt.compare(senhaInput, this.senha);
};  

module.exports = mongoose.model('Admin', adminSchema);