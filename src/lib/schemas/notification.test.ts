import {expect, test} from '@jest/globals';
import {notificationInit} from '@/lib/schemas/notification.ts';

describe('notificationSchema', () => {
	test('debería validar un objeto válido según el esquema', () => {
		const validData = {
			tutorId: 1,
			studentId: 2,
			message: 'Mensaje de notificación',
		};

		// Comprueba si los datos válidos pasan la validación del esquema
		const result = notificationInit.parse(validData);

		// Verifica que el resultado coincida con los datos válidos
		expect(result).toEqual(validData);
	});
});
