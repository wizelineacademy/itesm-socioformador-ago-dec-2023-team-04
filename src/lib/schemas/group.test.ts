import {expect, test} from '@jest/globals';
import groupInitSchema, {type GroupInit} from '@/lib/schemas/group.ts';

describe('groupInitSchema', () => {
	test('debería validar un objeto válido según el esquema', () => {
		const validData = {
			name: 'Grupo 1',
			active: true,
			description: 'Descripción del grupo',
			entryHour: '12:00',
			duration: 60,
			tz: 'GMT',
			colorId: 1,
			students: JSON.stringify([1, 2, 3]),
			users: JSON.stringify([4, 5]),
			enabledMonday: true,
			enabledTuesday: false,
			enabledWednesday: true,
			enabledThursday: false,
			enabledFriday: true,
			enabledSaturday: false,
			enabledSunday: true,
		};

		// Comprueba si los datos válidos pasan la validación del esquema
		const result = groupInitSchema.safeParse(validData);

		// Verifica que el resultado coincida con los tipos inferidos
		expect(result.success).toBeTruthy();
	});
});
