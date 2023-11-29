import {expect, test} from '@jest/globals';
import fetch from 'node-fetch';
import getIcon, { IconProperties } from '@/lib/get-icon.ts';

// Mock para la función fetch
jest.mock('node-fetch');

describe('getIcon', () => {
	const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('debería obtener el ícono con propiedades predeterminadas', async () => {
		const iconProperties: IconProperties = {
			weight: 400,
			isFilled: false,
			grade: 0,
			size: 'md',
		};

		// @ts-ignore
		mockFetch.mockResolvedValueOnce({
			ok: true,
			text: () => Promise.resolve('<svg>Icono</svg>'),
		});

		const iconName = 'example-icon';
		const result = await getIcon(iconName, iconProperties);

		expect(mockFetch).toHaveBeenCalledWith(
			`https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/${iconName}/default/24px.svg`
		);
		expect(result).toBe('<svg>Icono</svg>');
	});

	test('debería retornar null si la respuesta no es exitosa', async () => {
		const iconProperties: IconProperties = {
			weight: 400,
			isFilled: false,
			grade: 0,
			size: 'md',
		};

		// @ts-ignore
		mockFetch.mockResolvedValueOnce({
			ok: false,
		});

		const iconName = 'example-icon';
		const result = await getIcon(iconName, iconProperties);

		expect(mockFetch).toHaveBeenCalledWith(
			`https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/${iconName}/default/24px.svg`
		);
		expect(result).toBeNull();
	});
});
