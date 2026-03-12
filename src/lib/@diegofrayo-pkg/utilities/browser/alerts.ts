export function showAlert(message: string) {
	alert(message);
}

export function isConfirmAlertAccepted(message: string) {
	return window.confirm(message);
}
