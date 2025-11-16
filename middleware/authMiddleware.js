const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // 1. Pega o token do cabeçalho
    // O frontend vai enviar assim: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // 2. Separa o "Bearer" do token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Formato do token inválido.' });
    }

    try {
        // 3. Verifica o token
        // (Usa a mesma chave secreta que definiste no 'alunoRoutes.js')
        const decoded = jwt.verify(token, 'O_TEU_SEGREDO_JWT'); 

        // 4. Adiciona o ID do aluno ao 'request' para usarmos na rota
        req.alunoId = decoded.id; 
        
        // 5. Deixa o pedido continuar para a rota
        next(); 

    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
}

module.exports = authMiddleware;