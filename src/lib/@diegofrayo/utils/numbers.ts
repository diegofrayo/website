export function between(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function safeCastNumber<G_DefaultValue>(input: unknown, defaultValue: G_DefaultValue) {
	try {
		const number = Number(input);

		if (input === undefined || input === null || Number.isNaN(number) || number === Infinity) {
			return defaultValue;
		}

		return number;
	} catch (error) {
		return defaultValue;
	}
}
