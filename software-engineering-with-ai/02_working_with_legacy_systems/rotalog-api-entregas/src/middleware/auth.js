const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

function authMiddleware(req, res, next) {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		logger.error('[AUTH] JWT_SECRET não configurado');
		return res.status(500).json({ error: 'Erro de configuração do servidor' });
	}

	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ error: 'Token não fornecido' });
	}

	const parts = authHeader.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		return res.status(401).json({ error: 'Token mal formatado' });
	}

	const token = parts[1];

	try {
		const decoded = jwt.verify(token, secret);
		req.user = decoded;
		logger.info('[AUTH] Token válido', { userId: decoded.id });
		next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expirado' });
		}
		return res.status(401).json({ error: 'Token inválido' });
	}
}

module.exports = authMiddleware;
