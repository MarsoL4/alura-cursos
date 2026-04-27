const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// TODO: Validar credenciais contra banco de dados
// TODO: Implementar hash de senha com bcrypt
const DEV_USERS = [
	{ id: 1, email: 'admin@rotalog.com', password: 'admin123', role: 'admin' },
	{ id: 2, email: 'operador@rotalog.com', password: 'operador123', role: 'operador' },
];

router.post('/login', (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
	}

	const user = DEV_USERS.find(u => u.email === email && u.password === password);

	if (!user) {
		return res.status(401).json({ error: 'Credenciais inválidas' });
	}

	const token = jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '24h' }
	);

	res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

module.exports = router;
