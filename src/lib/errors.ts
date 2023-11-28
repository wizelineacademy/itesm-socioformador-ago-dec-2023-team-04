export class AuthenticationError extends Error {
	constructor() {
		super('No has iniciado sesión.');
	}
}

export class AuthorizationError extends Error {
	constructor() {
		super('No estas autorizado para realizar esta acción.');
	}
}
