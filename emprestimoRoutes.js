

const express = require('express');
const router = express.Router();
const Emprestimo = require('../models/emprestimoModel');
const authMiddleware = require('../middleware/authMiddleware'); // O nosso "segurança"

// --- ROTA 1: VER OS EMPRÉSTIMOS DO ALUNO LOGADO ---
// GET /api/emprestimos/meus-emprestimos
// (Nota: 'authMiddleware' corre primeiro!)
router.get('/meus-emprestimos', authMiddleware, async (req, res) => {
    try {
        // Graças ao middleware, temos o 'req.alunoId'
        const emprestimos = await Emprestimo.find({ aluno: req.alunoId })
            .populate('livro'); // <-- MÁGICA: Substitui o ID do livro pelos dados do livro!
        
        res.json(emprestimos);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar empréstimos.', error: error.message });
    }
});

// --- ROTA 2: ALUNO FAZ UM NOVO EMPRÉSTIMO ---
// POST /api/emprestimos/novo
router.post('/novo', authMiddleware, async (req, res) => {
    try {
        const { livroId } = req.body; // O frontend só precisa de enviar o ID do livro
        const alunoId = req.alunoId; // Já temos o ID do aluno

        // Define a data de devolução (ex: 7 dias a partir de hoje)
        const dataDevolucao = new Date();
        dataDevolucao.setDate(dataDevolucao.getDate() + 7);

        // (Aqui poderias adicionar lógicas, ex: "Este livro já está emprestado?")

        const novoEmprestimo = new Emprestimo({
            aluno: alunoId,
            livro: livroId,
            dataDevolucaoPrevista: dataDevolucao,
            status: 'Emprestado'
        });

        await novoEmprestimo.save();
        
        // Devolve o novo empréstimo com os dados do livro
        const emprestimoSalvo = await novoEmprestimo.populate('livro');
        
        res.status(201).json(emprestimoSalvo);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar empréstimo.', error: error.message });
    }
});


// --- ROTA 3: ALUNO DEVOLVE UM LIVRO ---
// PUT /api/emprestimos/devolver/:id
router.put('/devolver/:id', authMiddleware, async (req, res) => {
    try {
        const emprestimoId = req.params.id; // ID do *empréstimo*, não do livro

        // Encontra o empréstimo e verifica se pertence ao aluno logado
        const emprestimo = await Emprestimo.findOne({ 
            _id: emprestimoId, 
            aluno: req.alunoId 
        });

        if (!emprestimo) {
            return res.status(404).json({ message: 'Empréstimo não encontrado ou não pertence a este aluno.' });
        }

        if (emprestimo.status === 'Devolvido') {
            return res.status(400).json({ message: 'Este livro já foi devolvido.' });
        }

        // Atualiza o status
        emprestimo.status = 'Devolvido';
        await emprestimo.save();

        res.json({ message: 'Livro devolvido com sucesso!', emprestimo });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao devolver livro.', error: error.message });
    }
});


module.exports = router;