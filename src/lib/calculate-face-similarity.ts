import {type FaceResult} from '@stock17944/human';
import {List} from 'immutable';

export function calculateFaceSimilarity(f1: FaceResult, f2: FaceResult) {
	const d1 = f1.embedding;
	const d2 = f2.embedding;

	if (d1 === undefined || d2 === undefined) {
		return undefined;
	}

	const differences = List(d1)
		.zip(List(d2))
		.map(([v1, v2]) => (v1 - v2) ** 2);

	let sum = 0;

	for (const difference of differences) {
		sum += difference;
	}

	return 1 - (Math.sqrt(sum * 60) / 100);
}
