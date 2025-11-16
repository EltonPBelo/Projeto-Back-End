// /middleware/adminAuthMiddleware.js (Novo Ficheiro)

const jwt = require('jsonwebtoken');

/**
 * IMPORTANTE:
 * 1. Este segredo é o mesmo que usamos em /routes/adminRoutes.js
 * 2. Lembra-te da nossa conversa sobre segurança: o ideal é mover isto
 * para um ficheiro .env (ex: process.env.JWT_SECRET_ADMIN)
 */

const ADMIN_SECRET_KEY = '11desetembro'; 

module.exports = function(req, res, next) {
    // 1. Pega o token do cabeçalho
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // 2. Separa o "Bearer" do token
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token mal formatado.' });
    }

    try {
        // 3. Verifica o token USANDO O SEGREDO DE ADMIN
        const decoded = jwt.verify(token, ADMIN_SECRET_KEY);

        // 4. (Extra) Verifica se o token é mesmo de um admin
        //    (Definimos 'tipo: "admin"' no adminRoutes.js)
        if (decoded.tipo !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Permissões insuficientes.' });
        }

        // 5. Guarda o ID do admin no 'req' e deixa o pedido passar
        req.adminId = decoded.id;
        next();

    } catch (ex) {
        // Se o token for inválido ou expirado
        res.status(400).json({ message: 'Token inválido.' });
    }
};