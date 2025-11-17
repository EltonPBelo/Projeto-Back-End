// src/middleware/adminAuthMiddleware.js (CORRIGIDO)

const jwt = require('jsonwebtoken');

// 1. CHAVE SECRETA NOVA E DIFERENTE
const ADMIN_SECRET_KEY = 'minha-chave-secreta-de-admin-nao-e-11desetembro'; 

module.exports = function(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token mal formatado.' });
    }

    try {
        // 2. Verifica usando a chave de ADMIN
        const decoded = jwt.verify(token, ADMIN_SECRET_KEY);

        if (decoded.tipo !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Permissões insuficientes.' });
        }

        req.adminId = decoded.id;
        next();

    } catch (ex) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};