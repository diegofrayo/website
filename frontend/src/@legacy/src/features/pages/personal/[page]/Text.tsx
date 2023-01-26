import * as React from "react";
import classNames from "classnames";

import { Space, Button, Input, Block, Text } from "~/@legacy/src/components/primitive";
import { useDidMount } from "~/@legacy/src/hooks";
import v from "~/@legacy/src/lib/v";
import {
	focusElement,
	focusInputAndSelectText,
	handleCopyToClipboardClick,
	isSmallScreen,
} from "~/@legacy/src/utils/browser";
import { replaceAll } from "~/@legacy/src/utils/strings";
import type { T_ReactElement, T_ReactOnClickEventHandler, T_ReactRef } from "~/@legacy/src/types";

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
				componentProps={{ label: "Ingrese un texto", is: "textarea" }}
				containerProps={{ className: "tw-my-1" }}
				id="input"
				type="text"
				autoComplete="on"
				className="tw-h-40"
				ref={inputRef}
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
		</div>
	);
}

export default TextPage;

// --- Controller ---

type T_UseControllerReturn = {
	output: string;
	inputRef: T_ReactRef<HTMLInputElement>;
	handleProcessTextClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
	onInputFocusHandler: T_ReactOnClickEventHandler<HTMLInputElement>;
};

function useController(): T_UseControllerReturn {
	// states & refs
	const [output, setOutput] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	// effects
	useDidMount(() => {
		if (isSmallScreen() || v.isNull(inputRef.current)) {
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
