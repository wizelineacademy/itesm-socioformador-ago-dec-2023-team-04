export type Serializable<T> = T extends Array<infer U>
	? Array<Serializable<U>>
	: T extends Date
		? string
		: T extends object
			? {
				[K in keyof T]: Serializable<T[K]>;
			}
			: T;

export function makeSerializable<T>(value: T): Serializable<T> {
	if (Array.isArray(value)) {
		return value.map(element => makeSerializable(element) as unknown) as Serializable<T>;
	}

	if (value instanceof Date) {
		return value.toString() as Serializable<T>;
	}

	if (typeof value === 'object' && value !== null) {
		return Object.fromEntries(
			Object.entries(value).map(([key, innerValue]) => [key, makeSerializable(innerValue)]),
		) as Serializable<T>;
	}

	return value as Serializable<T>;
}
