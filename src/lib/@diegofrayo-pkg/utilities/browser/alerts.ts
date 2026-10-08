export function showAlert(message: string): void {
	alert(message);
}

export function showConfirm(message: string): boolean {
	return window.confirm(message);
}
