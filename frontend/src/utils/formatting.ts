export function formatPhoneNumber(phone: string): string {
	const cleaned = `${phone}`.replace(/\D/g, "");
	const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

	if (match) {
		return `(${match[1]}) ${match[2]}-${match[3]}`;
	}

	return phone;
}

export function addLeftPadding(number: number): string {
	return number >= 10 ? `${number}` : `0${number}`;
}
