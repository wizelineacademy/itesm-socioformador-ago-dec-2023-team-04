import {expect, test} from '@jest/globals';
import { AuthenticationError, AuthorizationError } from '@/lib/errors.ts';

describe('AuthenticationError', () => {
	test('debería crear una instancia de AuthenticationError', () => {
		const error = new AuthenticationError();
		expect(error).toBeInstanceOf(AuthenticationError);
		expect(error.message).toBe('No has iniciado sesión.');
	});

	test('debería ser una instancia de Error', () => {
		const error = new AuthenticationError();
		expect(error).toBeInstanceOf(Error);
	});
});

describe('AuthorizationError', () => {
	test('debería crear una instancia de AuthorizationError', () => {
		const error = new AuthorizationError();
		expect(error).toBeInstanceOf(AuthorizationError);
		expect(error.message).toBe('No estas autorizado para realizar esta acción.');
	});

	test('debería ser una instancia de Error', () => {
		const error = new AuthorizationError();
		expect(error).toBeInstanceOf(Error);
	});
});
