// /models/alunoModel.js(Corrigido)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Biblioteca para "embaralhar" a senha

// 1. Define o "formato" (Schema) do Aluno
const alunoSchema = new mongoose.Schema({
    matricula: { 
        type: String,
        required: true,
        unique: true // Garante que não há matrículas duplicadas
    },
    nome:{ 
        type: String, 
        required: true 
    },
    email:{
        type: String,
        required: true,
        unique: true // Garante que não há emails duplicados
    },
    senha: {
        type: String,
        required: true,
        select: false // Não mostra a senha em buscas (ex: GET /alunos)
    }
});

// 2. Lógica ANTES de salvar (pre 'save')
// Esta função "middleware" corre automaticamente ANTES de um aluno ser salvo
alunoSchema.pre('save', async function(next) {
    // Se a senha não foi modificada (ex: aluno só trocou o email), não faz nada
    if (!this.isModified('senha')) {
        return next();
    }
    
    try {
        // "Embaralha" a senha com um "custo" 10 (padrão de segurança)
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 3. Método para comparar senhas (para o Login)
// Vamos adicionar um método ao nosso "Aluno" para verificar a senha
alunoSchema.methods.compararSenha = async function(senhaDigitada) {
    // Compara a senha que o utilizador digitou com a senha "embaralhada" no DB
    return await bcrypt.compare(senhaDigitada, this.senha);
};

// 4. Cria e exporta o Modelo
module.exports = mongoose.model('Aluno', alunoSchema);