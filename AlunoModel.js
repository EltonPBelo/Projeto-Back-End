import { Schema, model, models } from 'mongoose';

const alunoSchema = 

new Schema({
  matricula: { 
      type: String,
        required: true 
    },
  nome:{ 
      type: String, 
      required: true 
    },
  email:{
     type: String,
        required: true 
      },
  senha:     {
     type: String,
      required: true 
    }
});

alunoSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});



// Evita redeclaração em ambiente de reload (nodemon/ts-node-dev)
const Aluno = models.Aluno ? models.Aluno : model('Aluno', alunoSchema);

export default Aluno;