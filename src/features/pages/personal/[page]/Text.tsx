import * as React from "react";
import classNames from "classnames";

import { Space, Button, Input, Block, Text } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import v from "~/lib/v";
import {
	focusElement,
	focusInputAndSelectText,
	handleCopyToClipboardClick,
	isSmallScreen,
} from "~/utils/browser";
import { replaceAll } from "~/utils/strings";
import type { T_ReactElement, T_ReactOnClickEventHandler, T_ReactRef } from "~/types";

function TextPage(): T_ReactElement {
	const {
		// --- STATES & REFS ---
		output,
		inputRef,

		// --- HANDLERS ---
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
				autoComplete="off"
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

// --- CONTROLLER ---

type T_UseControllerReturn = {
	output: string;
	inputRef: T_ReactRef<HTMLInputElement>;
	handleProcessTextClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
	onInputFocusHandler: T_ReactOnClickEventHandler<HTMLInputElement>;
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
	const handleProcessTextClick: T_UseControllerReturn["handleProcessTextClick"] =
		function handleProcessTextClick(): void {
			const text = (inputRef.current?.value || "").trim();
			setOutput(processText(text));
		};

	const onInputFocusHandler: T_UseControllerReturn["onInputFocusHandler"] =
		function onInputFocusHandler(event) {
			focusInputAndSelectText(event.currentTarget);
		};

	// --- UTILS ---
	function processText(text: string): string {
		return replaceAll(text, "\n", " ");
	}

	return {
		// --- STATES & REFS ---
		output,
		inputRef,

		// --- HANDLERS ---
		handleProcessTextClick,
		onInputFocusHandler,
	};
}
