import { BrowserStorageManager } from "@diegofrayo/storage";

export function recoverFromBreakingChanges() {
	const BS_BreakingChanges = BrowserStorageManager.createItem({
		key: "DR_BREAKING_CHANGES",
		value: "",
		saveWhileInitialization: true,
		readInitialValueFromStorage: true,
	});
	const BREAKING_CHANGES = [
		"Mon Oct 02 2023 15:29:15",
		"Mon Oct 02 2023 16:30:15",
		"Mon Oct 02 2023 16:59:15",
		"Mon Oct 24 2023 07:04:15",
	];
	const lastBreakingChange = BREAKING_CHANGES.at(-1) as string;
	const thereAreBreakingChanges = BS_BreakingChanges.get() !== lastBreakingChange;

	if (thereAreBreakingChanges) {
		window.localStorage.clear();
		BS_BreakingChanges.set(lastBreakingChange);
		window.location.reload();
	}
}
