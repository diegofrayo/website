import * as React from "react";

import { Input, Block, Button, Icon, Link } from "~/components/primitive";
import { ENV_VARS } from "~/constants";
import { logAndReportError } from "~/features/logging";
import http from "~/lib/http";
import { showAlert } from "~/utils/browser";
import { getErrorMessage } from "~/utils/misc";
import type {
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnClickEventHandler,
} from "~/types";

function ISR(): T_ReactElement {
	const {
		// --- STATES & REFS ---
		path,

		// --- HANDLERS ---
		handleUpdateClick,
		onChangeHandler,
	} = useController();

	return (
		<Block>
			<Input
				componentProps={{ label: "Path" }}
				id="input-path"
				type="text"
				value={path}
				onChange={onChangeHandler}
			/>
			<Block className="tw-flex tw-justify-between">
				<Link
					variant={Link.variant.UNSTYLED}
					href={path}
					isExternalLink
				>
					<Icon icon={Icon.icon.EXTERNAL_LINK} />
				</Link>
				<Button
					variant={Button.variant.DEFAULT}
					onClick={handleUpdateClick}
				>
					update
				</Button>
			</Block>
		</Block>
	);
}

export default ISR;

// --- CONTROLLER ---

type T_UseControllerReturn = {
	path: string;
	onChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
	handleUpdateClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
};

function useController(): T_UseControllerReturn {
	// --- STATES & REFS ---
	const [path, setPath] = React.useState("/about-me");

	// --- HANDLERS ---
	const onChangeHandler: T_UseControllerReturn["onChangeHandler"] = function onChangeHandler(
		event,
	) {
		setPath(event.target.value);
	};

	const handleUpdateClick: T_UseControllerReturn["handleUpdateClick"] =
		async function handleUpdateClick() {
			try {
				await http.post("/api/diegofrayo", { path, secret: ENV_VARS.NEXT_PUBLIC_ISR_TOKEN });
				showAlert("Success");
			} catch (error) {
				logAndReportError(error);
				showAlert(getErrorMessage(error));
			}
		};

	return {
		// --- STATES & REFS ---
		path,

		// --- HANDLERS ---
		onChangeHandler,
		handleUpdateClick,
	};
}
