import * as React from "react";

import { Input, Block, Button, Icon, Link } from "~/@legacy/src/components/primitive";
import { ENV_VARS } from "~/@legacy/src/constants";
import { logAndReportError } from "~/@legacy/src/features/logging";
import http from "~/@legacy/src/lib/http";
import { showAlert } from "~/@legacy/src/utils/browser";
import { getErrorMessage } from "~/@legacy/src/utils/misc";
import type {
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnClickEventHandler,
} from "~/@legacy/src/types";

function ISR(): T_ReactElement {
	const {
		// states & refs
		path,

		// handlers
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

// --- Controller ---

type T_UseControllerReturn = {
	path: string;
	onChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
	handleUpdateClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
};

function useController(): T_UseControllerReturn {
	// states & refs
	const [path, setPath] = React.useState("/resume");

	// handlers
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
		// states & refs
		path,

		// handlers
		onChangeHandler,
		handleUpdateClick,
	};
}