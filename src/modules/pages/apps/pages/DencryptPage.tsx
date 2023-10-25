import * as React from "react";
import cn from "classnames";

import { MainLayout, Page } from "~/components/layout";
import { Block, Button, Input, Space } from "~/components/primitive";
import { CopyToClipboardPopover, Toast } from "~/components/shared";
import { useAsync, useDidMount } from "~/hooks";
import ServerAPI from "~/modules/api";
import { withAuthRulesPage } from "~/modules/auth";
import { logAndReportError } from "~/modules/logging";
import v from "@diegofrayo/v";
import { focusElement, focusInputAndSelectText, isSmallScreen } from "@diegofrayo/utils/browser";
import { getErrorMessage } from "@diegofrayo/utils/misc";
import type DR from "@diegofrayo/types";
import {
	type T_DencryptFormSchema,
	type T_DencryptResponseSchema,
} from "~/server/api/endpoints/dencrypt/schemas";

import { Output } from "../components";

function DencryptPage() {
	// --- HOOKS ---
	const { mutation: dencryptMutation, isLoading } = useAsync("/dencrypt", DencryptAPI.dencrypt);

	// --- STATES & REFS ---
	const [output, setOutput] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	// --- EFFECTS ---
	useDidMount(() => {
		if (isSmallScreen() || v.isNull(inputRef.current)) {
			return;
		}

		focusElement(inputRef.current);
	});

	// --- HANDLERS ---
	function onKeyUpHandler(event: DR.React.Events.OnKeyUpEvent<HTMLInputElement>): void {
		const text = getInputText();

		if (event.key === "Enter" && v.isNotEmptyString(text)) {
			launchDencryptRequest(text.startsWith("U2F") ? "decrypt" : "encrypt");
		}
	}

	function onInputFocusHandler(event: DR.React.Events.OnClickEvent<HTMLInputElement>) {
		focusInputAndSelectText(event.currentTarget);
	}

	async function handleEncryptClick() {
		launchDencryptRequest("encrypt");
	}

	async function handleDecryptClick() {
		launchDencryptRequest("decrypt");
	}

	function handleClearClick() {
		setOutput("");
	}

	// --- UTILS ---
	function getInputText() {
		return (inputRef.current?.value || "").trim();
	}

	async function launchDencryptRequest(action: T_DencryptFormSchema["action"]) {
		try {
			setOutput("");
			const text = getInputText();

			if (v.isNotEmptyString(text)) {
				const result = await dencryptMutation({ action, text });
				setOutput(result.data.output);
			}
		} catch (error) {
			setOutput("");
			logAndReportError(error);
			Toast.error(getErrorMessage(error));
		}
	}

	return (
		<Page
			config={{
				title: "Dencrypt",
				disableSEO: true,
			}}
		>
			<MainLayout title="Dencrypt">
				<Block className="tw-mx-auto tw-w-96 tw-max-w-full">
					<Input
						ref={inputRef}
						variant={Input.variant.STYLED}
						id="input"
						type="text"
						autoComplete="off"
						componentProps={{ label: "Enter a text" }}
						onKeyUp={onKeyUpHandler}
						onClick={onInputFocusHandler}
					/>
					<Block
						className={cn(
							"tw-mt-2 tw-flex tw-flex-wrap tw-justify-between",
							isLoading && "tw-pointer-events-none tw-opacity-50",
						)}
					>
						<Button
							variant={Button.variant.STYLED}
							onClick={handleEncryptClick}
						>
							encrypt
						</Button>
						<Button
							variant={Button.variant.STYLED}
							onClick={handleDecryptClick}
						>
							decrypt
						</Button>
					</Block>

					<Block className={cn(v.isEmptyString(output) ? "tw-hidden" : "tw-block")}>
						<Space
							size={10}
							variant={Space.variant.DASHED}
						/>

						<Input.Label>Output</Input.Label>
						<Output>{output}</Output>
						<Space size={1} />

						<Block className="tw-flex tw-justify-end tw-gap-2">
							<Button
								variant={Button.variant.STYLED}
								onClick={handleClearClick}
							>
								clear
							</Button>
							<CopyToClipboardPopover textToCopy={output}>
								<Button variant={Button.variant.STYLED}>copy</Button>
							</CopyToClipboardPopover>
						</Block>
					</Block>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(DencryptPage, { requireAuth: true });

// --- API ---

const DencryptAPI = {
	dencrypt: (body: T_DencryptFormSchema) => {
		return ServerAPI.post<T_DencryptResponseSchema>("/dencrypt", body);
	},
};
