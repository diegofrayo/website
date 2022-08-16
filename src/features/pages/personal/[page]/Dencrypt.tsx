import * as React from "react";
import classNames from "classnames";

import { Space, Button, Input, Block, Text } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { reportError } from "~/utils/app";
import { decrypt, encrypt } from "~/utils/dencrypt";
import { isEmptyString, isNotEmptyString, isNull } from "~/utils/validations";
import {
	focusElement,
	focusInputAndSelectText,
	handleCopyToClipboardClick,
	isSmallScreen,
} from "~/utils/browser";
import type {
	T_ReactElement,
	T_ReactOnClickEventHandler,
	T_ReactOnSubmitEventHandler,
	T_ReactRefObject,
} from "~/types";

function Dencrypt(): T_ReactElement {
	const {
		// states & refs
		output,
		inputRef,

		// handlers
		onSubmitHandler,
		onInputFocusHandler,
	} = useController();

	return (
		<Block>
			<form
				className="tw-mb-8"
				onSubmit={onSubmitHandler}
			>
				<Input
					componentProps={{ label: "Ingrese un texto" }}
					containerProps={{ className: "tw-my-1" }}
					id="input"
					type="text"
					autoComplete="on"
					ref={inputRef}
					onClick={onInputFocusHandler}
				/>
				<Block className="tw-flex tw-flex-wrap tw-justify-between">
					<Button
						variant={Button.variant.DEFAULT}
						type="submit"
						value="encrypt"
					>
						encriptar
					</Button>
					<Button
						variant={Button.variant.DEFAULT}
						type="submit"
						value="decrypt"
					>
						desencriptar
					</Button>
				</Block>
			</form>

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
					className={classNames("tw-ml-auto", isNotEmptyString(output) ? "tw-block" : "tw-hidden")}
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

// --- Controller ---

type T_UseControllerReturn = {
	output: string;
	inputRef: T_ReactRefObject<HTMLInputElement>;
	onSubmitHandler: T_ReactOnSubmitEventHandler<HTMLFormElement>;
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
	const onSubmitHandler: T_UseControllerReturn["onSubmitHandler"] = function onSubmitHandler(
		event,
	): void {
		event.preventDefault();
		const text = (inputRef.current?.value || "").trim();

		if (isEmptyString(text)) {
			return;
		}

		// WARN: Find a better way to accomplish this
		// @ts-ignore
		if (event.nativeEvent?.submitter.value === "decrypt") {
			decryptText(text);
		} else {
			encryptText(text);
		}
	};

	const onInputFocusHandler: T_UseControllerReturn["onInputFocusHandler"] =
		function onInputFocusHandler(event) {
			focusInputAndSelectText(event.currentTarget);
		};

	// utils
	async function encryptText(text: string): Promise<void> {
		try {
			const encryptedText = await encrypt(text);
			setOutput(encryptedText);
		} catch (error) {
			reportError(error);
			setOutput("Error, el texto no pudo ser encriptado");
		}
	}

	async function decryptText(text: string): Promise<void> {
		try {
			const decryptedText = await decrypt(text);
			setOutput(decryptedText);
		} catch (error) {
			reportError(error);
			setOutput("Error, el texto no pudo ser desencriptado");
		}
	}

	return {
		// states & refs
		output,
		inputRef,

		// handlers
		onSubmitHandler,
		onInputFocusHandler,
	};
}
