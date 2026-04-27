const jwt = require('jsonwebtoken');
const authMiddleware = require('./auth');

const TEST_SECRET = 'test-secret-for-jest';

function makeReq(authHeader) {
	return { headers: { authorization: authHeader } };
}

function makeRes() {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
}

function signToken(payload, options = {}) {
	return jwt.sign(payload, TEST_SECRET, { expiresIn: '1h', ...options });
}

describe('authMiddleware', () => {
	beforeEach(() => {
		process.env.JWT_SECRET = TEST_SECRET;
	});

	afterEach(() => {
		delete process.env.JWT_SECRET;
	});

	describe('when JWT_SECRET is not configured', () => {
		it('should return 500', () => {
			delete process.env.JWT_SECRET;
			const req = makeReq('Bearer ' + signToken({ id: 42 }));
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Erro de configuração do servidor' });
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('when Authorization header is absent or malformed', () => {
		it('should return 401 when Authorization header is missing', () => {
			const req = makeReq(undefined);
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
			expect(next).not.toHaveBeenCalled();
		});

		it('should return 401 when header has no space', () => {
			const req = makeReq('BearerSomeToken');
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Token mal formatado' });
			expect(next).not.toHaveBeenCalled();
		});

		it('should return 401 when scheme is not Bearer', () => {
			const req = makeReq('Basic dXNlcjpwYXNz');
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Token mal formatado' });
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('when token is invalid', () => {
		it('should return 401 when token is not a valid JWT', () => {
			const req = makeReq('Bearer not-a-real-jwt-token');
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
			expect(next).not.toHaveBeenCalled();
		});

		it('should return 401 when token is signed with wrong secret', () => {
			const token = jwt.sign({ id: 1 }, 'wrong-secret');
			const req = makeReq('Bearer ' + token);
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
			expect(next).not.toHaveBeenCalled();
		});

		it('should return 401 with "Token expirado" when token is expired', () => {
			const token = signToken({ id: 1 }, { expiresIn: -1 });
			const req = makeReq('Bearer ' + token);
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Token expirado' });
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('when token is valid', () => {
		it('should call next() and populate req.user with decoded payload', () => {
			const payload = { id: 42, nome: 'João', role: 'motorista' };
			const token = signToken(payload);
			const req = makeReq('Bearer ' + token);
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
			expect(req.user).toMatchObject(payload);
			expect(res.status).not.toHaveBeenCalled();
		});

		it('should not override req.user with a fixed admin user', () => {
			const payload = { id: 7, role: 'operador' };
			const token = signToken(payload);
			const req = makeReq('Bearer ' + token);
			const res = makeRes();
			const next = jest.fn();

			authMiddleware(req, res, next);

			expect(req.user.id).toBe(7);
			expect(req.user.role).toBe('operador');
		});
	});
});
