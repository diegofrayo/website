import * as React from "react";

import { Space, Button, Input, Block, Text } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { reportError } from "~/utils/app";
import { decrypt, encrypt } from "~/utils/dencrypt";
import { isNull } from "~/utils/validations";
import {
	focusElement,
	focusInputAndSelectText,
	handleCopyToClipboardClick,
	isSmallScreen,
} from "~/utils/browser";
import type { T_ReactElement, T_ReactOnClickEventHandler, T_ReactRefObject } from "~/types";

function Dencrypt(): T_ReactElement {
	const {
		// states & refs
		output,
		inputRef,

		// handlers
		handleEncryptClick,
		handleDecryptClick,
		onInputFocusHandler,
	} = useController();

	return (
		<div className="root">
			<Block className="tw-mb-8">
				<Input
					type="text"
					id="input"
					label="Ingrese un texto"
					containerProps={{ className: "tw-my-1" }}
					ref={inputRef}
					onClick={onInputFocusHandler}
				/>
				<Block className="tw-flex tw-flex-wrap tw-justify-between">
					<Button
						variant={Button.variant.DEFAULT}
						onClick={handleEncryptClick}
					>
						encriptar
					</Button>
					<Button
						variant={Button.variant.DEFAULT}
						onClick={handleDecryptClick}
					>
						desencriptar
					</Button>
				</Block>
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
					className="tw-ml-auto tw-block"
					data-clipboard-text={output}
					onClick={handleCopyToClipboardClick}
				>
					copiar
				</Button>
			</Block>
		</div>
	);
}

export default Dencrypt;

// --- Controller ---

type T_UseControllerReturn = {
	output: string;
	inputRef: T_ReactRefObject<HTMLInputElement>;
	handleEncryptClick: T_ReactOnClickEventHandler;
	handleDecryptClick: T_ReactOnClickEventHandler;
	onInputFocusHandler: T_ReactOnClickEventHandler<HTMLInputElement>;
};

function useController(): T_UseControllerReturn {
	// states & refs
	const [output, setOutput] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	// effects
	useDidMount(() => {
		if (isSmallScreen() || isNull(inputRef.current)) {
			return;
		}

		focusElement(inputRef.current);
	});

	// handlers
	async function handleEncryptClick(): Promise<void> {
		try {
			const encryptedText = await encrypt(inputRef.current?.value || "");
			setOutput(encryptedText);
		} catch (error) {
			reportError(error);
			setOutput("Error, el texto no pudo ser encriptado");
		}
	}

	async function handleDecryptClick(): Promise<void> {
		try {
			const decryptedText = await decrypt(inputRef.current?.value || "");

			setOutput(decryptedText);
		} catch (error) {
			reportError(error);
			setOutput("Error, el texto no pudo ser desencriptado");
		}
	}

	const onInputFocusHandler: T_UseControllerReturn["onInputFocusHandler"] =
		function onInputFocusHandler(event) {
			focusInputAndSelectText(event.currentTarget);
		};

	return {
		// states & refs
		output,
		inputRef,

		// handlers
		handleEncryptClick,
		handleDecryptClick,
		onInputFocusHandler,
	};
}
