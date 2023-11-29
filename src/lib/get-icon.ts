export type IconProperties = {
	readonly weight: 100 | 200 | 300 | 400 | 500 | 600 | 700;
	readonly isFilled: boolean;
	readonly grade: -25 | 0 | 200;
	readonly size: 'sm' | 'md' | 'lg' | 'xl';
};

export default async function getIcon(name: string, properties: IconProperties) {
	const {weight, isFilled, grade, size} = properties;
	let formattedProperties = '';

	if (weight === 400 && grade === 0 && !isFilled) {
		formattedProperties = 'default';
	} else {
		if (weight !== 400) {
			formattedProperties += 'wght' + weight;
		}

		if (grade) {
			formattedProperties += 'grad' + grade.toString().replace('-', 'N');
		}

		if (isFilled) {
			formattedProperties += 'fill1';
		}
	}

	const opticalSize = {
		sm: 20,
		md: 24,
		lg: 40,
		xl: 48,
	}[size];

	const response = await fetch(`https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/${name}/${formattedProperties}/${opticalSize}px.svg`);

	if (!response.ok) {
		return null;
	}

	return response.text();
}
