import * as React from "react";
import classNames from "classnames";

import { Space, Button, Input, Block, Text } from "~/components/primitive";
import { logAndReportError } from "~/features/logging";
import { useDidMount } from "~/hooks";
import v from "~/lib/v";
import {
	focusElement,
	focusInputAndSelectText,
	handleCopyToClipboardClick,
	isSmallScreen,
} from "~/utils/browser";
import { decrypt, encrypt } from "~/utils/dencrypt";
import type {
	T_ReactElement,
	T_ReactOnClickEventHandler,
	T_ReactOnKeyUpEventHandler,
	T_ReactRef,
} from "~/types";

function Dencrypt(): T_ReactElement {
	const {
		// --- STATES & REFS ---
		output,
		inputRef,

		// --- HANDLERS ---
		onKeyUpHandler,
		onInputFocusHandler,
		handleEncryptClick,
		handleDecryptClick,
	} = useController();

	return (
		<Block>
			<Input
				componentProps={{ label: "Ingrese un texto" }}
				containerProps={{ className: "tw-my-1" }}
				id="input"
				type="text"
				autoComplete="off"
				ref={inputRef}
				onKeyUp={onKeyUpHandler}
				onClick={onInputFocusHandler}
			/>
			<Block className="tw-flex tw-flex-wrap tw-justify-between">
				<Button
					variant={Button.variant.DEFAULT}
					type="button"
					onClick={handleEncryptClick}
				>
					encriptar
				</Button>
				<Button
					variant={Button.variant.DEFAULT}
					type="button"
					onClick={handleDecryptClick}
				>
					desencriptar
				</Button>
			</Block>

			<Space
				size={10}
				variant={Space.variant.DASHED}
			/>

			<Block>
				<Text className="tw-font-bold">Resultado</Text>
				<output className="tw-my-1 tw-block tw-min-h-[40px] tw-w-full tw-border tw-p-3 dfr-border-color-primary">
					{output}
				</output>
				<Button
					variant={Button.variant.DEFAULT}
					className={classNames(
						"tw-ml-auto",
						v.isNotEmptyString(output) ? "tw-block" : "tw-hidden",
					)}
					data-clipboard-text={output}
					onClick={handleCopyToClipboardClick}
				>
					copiar
				</Button>
			</Block>
		</Block>
	);
}

export default Dencrypt;

// --- CONTROLLER ---

type T_UseControllerReturn = {
	output: string;
	inputRef: T_ReactRef<HTMLInputElement>;
	onKeyUpHandler: T_ReactOnKeyUpEventHandler<HTMLInputElement>;
	onInputFocusHandler: T_ReactOnClickEventHandler<HTMLInputElement>;
	handleEncryptClick: T_ReactOnClickEventHandler;
	handleDecryptClick: T_ReactOnClickEventHandler;
};

function useController(): T_UseControllerReturn {
	// --- STATES & REFS ---
	const [output, setOutput] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	// --- EFFECTS ---
	useDidMount(() => {
		if (isSmallScreen() || v.isNull(inputRef.current)) {
			return;
		}

		focusElement(inputRef.current);
	});

	// --- HANDLERS ---
	const onKeyUpHandler: T_UseControllerReturn["onKeyUpHandler"] = function onKeyUpHandler(
		event,
	): void {
		if (event.key !== "Enter") return;

		const text = (inputRef.current?.value || "").trim();

		if (text.startsWith("U2F")) {
			decryptText(text);
		} else {
			encryptText(text);
		}
	};

	const onInputFocusHandler: T_UseControllerReturn["onInputFocusHandler"] =
		function onInputFocusHandler(event) {
			focusInputAndSelectText(event.currentTarget);
		};

	const handleEncryptClick: T_UseControllerReturn["handleEncryptClick"] =
		function handleEncryptClick() {
			const text = (inputRef.current?.value || "").trim();

			if (v.isEmptyString(text)) {
				return;
			}

			encryptText(text);
		};

	const handleDecryptClick: T_UseControllerReturn["handleDecryptClick"] =
		function handleDecryptClick() {
			const text = (inputRef.current?.value || "").trim();

			if (v.isEmptyString(text)) {
				return;
			}

			decryptText(text);
		};

	// --- UTILS ---
	async function encryptText(text: string): Promise<void> {
		try {
			const encryptedText = await encrypt(text);
			setOutput(encryptedText);
		} catch (error) {
			logAndReportError(error);
			setOutput("Error, el texto no pudo ser encriptado");
		}
	}

	async function decryptText(text: string): Promise<void> {
		try {
			const decryptedText = await decrypt(text);
			setOutput(decryptedText);
		} catch (error) {
			logAndReportError(error);
			setOutput("Error, el texto no pudo ser desencriptado");
		}
	}

	return {
		// --- STATES & REFS ---
		output,
		inputRef,

		// --- HANDLERS ---
		onKeyUpHandler,
		onInputFocusHandler,
		handleEncryptClick,
		handleDecryptClick,
	};
}
