import * as React from "react";

import { Space, Button, Input, Block, Text } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import {
	focusElement,
	focusInputAndSelectText,
	handleCopyToClipboardClick,
	isSmallScreen,
} from "~/utils/browser";
import { replaceAll } from "~/utils/strings";
import { isNull } from "~/utils/validations";
import type { T_ReactElement, T_ReactOnClickEventHandler, T_ReactRefObject } from "~/types";

function TextPage(): T_ReactElement {
	const {
		// states & refs
		output,
		inputRef,

		// handlers
		handleProcessTextClick,
		onInputFocusHandler,
	} = useController();

	return (
		<div className="root">
			<Input
				ref={inputRef}
				type="text"
				id="input"
				label="Ingrese un texto"
				containerProps={{ className: "tw-my-1" }}
				autoComplete="on"
				is="textarea"
				className="tw-h-40"
				onClick={onInputFocusHandler}
			/>
			<Block className="tw-flex tw-flex-wrap tw-justify-end">
				<Button
					variant={Button.variant.DEFAULT}
					onClick={handleProcessTextClick}
				>
					procesar
				</Button>
			</Block>

			<Space
				size={10}
				variant={Space.variant.DASHED}
			/>

			<Block>
				<Text className="tw-font-bold">Resultado</Text>
				<output className="tw-my-1 tw-block tw-min-h-[40px] tw-w-full tw-border tw-p-3 dfr-border-color-secondary">
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

export default TextPage;

// --- Controller ---

type T_UseControllerReturn = {
	output: string;
	inputRef: T_ReactRefObject<HTMLInputElement>;
	handleProcessTextClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
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
	const handleProcessTextClick: T_UseControllerReturn["handleProcessTextClick"] =
		function handleProcessTextClick(): void {
			const text = (inputRef.current?.value || "").trim();
			setOutput(processText(text));
		};

	const onInputFocusHandler: T_UseControllerReturn["onInputFocusHandler"] =
		function onInputFocusHandler(event) {
			focusInputAndSelectText(event.currentTarget);
		};

	// utils
	function processText(text: string): string {
		return replaceAll(text, "\n", " ");
	}

	return {
		// states & refs
		output,
		inputRef,

		// handlers
		handleProcessTextClick,
		onInputFocusHandler,
	};
}
