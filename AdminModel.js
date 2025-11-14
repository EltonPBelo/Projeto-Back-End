import { Schema, model } from 'mongoose';

const adminSchema =

Schema({

   nome: { 
        type: String,
        required: true
    },
   email: { 
        type: String,
        required: true
    },
    senha: { 
        type: String,
        required: true
    }
});

adminSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

adminSchema.method.sistemaSegurança = async function(senhaInput) {
    return await bcrypt.compare(senhaInput, this.senha);
};  


export default model('admin', adminSchema); 
// o nome da coleção no MongoDB será 'admin' (Admins)