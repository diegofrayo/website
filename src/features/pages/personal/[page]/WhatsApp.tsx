import * as React from "react";
import classNames from "classnames";

import { Icon, Input, Link, Block, Button, InlineText } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import v from "~/lib/v";
import { focusElement, handleCopyToClipboardClick } from "~/utils/browser";
import { generateSlug, replaceAll } from "~/utils/strings";
import type {
	T_ReactElement,
	T_ReactOnChangeEventHandler,
	T_ReactOnKeyUpEventHandler,
	T_ReactRef,
} from "~/types";

function WhatsApp(): T_ReactElement {
	const {
		// --- STATES & REFS ---
		phone,
		inputRef,
		isInvalidPhone,
		isAppOptionSelected,

		// --- VARS ---
		whatsAppUrl,

		// --- HANDLERS ---
		onKeyUpHandler,
		onChangeHandler,
		onRadioChangeHandler,
	} = useController();

	return (
		<Block>
			<Block className="tw-flex-no-wrap tw-flex tw-w-full tw-items-center tw-justify-center">
				<Input
					componentProps={{ label: "Ingrese un número de celular" }}
					id="input"
					containerProps={{ className: "tw-flex-1 tw-mr-2" }}
					type="tel"
					ref={inputRef}
					value={phone}
					placeholder="🇨🇴 +57"
					pattern="\+?[0-9]{10,15}"
					onChange={onChangeHandler}
					onKeyUp={onKeyUpHandler}
				/>
				<Link
					variant={Link.variant.SIMPLE}
					href={whatsAppUrl}
					className={classNames(
						"tw-flex tw-self-end",
						isInvalidPhone && "tw-pointer-events-none tw-opacity-30",
					)}
					id="link-to-wp"
					isExternalLink
				>
					<Icon
						icon={Icon.icon.WHATSAPP}
						size={36}
					/>
				</Link>
			</Block>
			<Block className="tw-mt-1 tw-flex tw-flex-row-reverse tw-justify-between tw-pr-14">
				<Block>
					<label htmlFor="radio-app">
						<input
							type="radio"
							className="tw-mr-1"
							id="radio-app"
							name="option"
							value="app"
							checked={isAppOptionSelected}
							onChange={onRadioChangeHandler}
						/>
						<InlineText
							is={isAppOptionSelected ? "strong" : "span"}
							className="tw-cursor-pointer"
						>
							app
						</InlineText>
					</label>
				</Block>
				<Block>
					<label htmlFor="radio-web">
						<input
							type="radio"
							className="tw-mr-1"
							id="radio-web"
							name="option"
							value="web"
							checked={!isAppOptionSelected}
							onChange={onRadioChangeHandler}
						/>
						<InlineText
							is={!isAppOptionSelected ? "strong" : "span"}
							className="tw-cursor-pointer"
						>
							web
						</InlineText>
					</label>
				</Block>
			</Block>
			<Block className="tw-mt-3 tw-text-left sm:tw-text-center">
				<Button
					variant={Button.variant.UNSTYLED}
					className="tw-inline-block tw-border tw-border-dashed tw-px-2 tw-py-1 tw-text-xs tw-italic dfr-border-color-primary"
					data-clipboard-text={whatsAppUrl}
					onClick={handleCopyToClipboardClick}
				>
					{whatsAppUrl}
				</Button>
			</Block>
		</Block>
	);
}

export default WhatsApp;

// --- CONTROLLER ---

type T_UseControllerReturn = {
	phone: string;
	inputRef: T_ReactRef<HTMLInputElement>;
	isInvalidPhone: boolean;
	isAppOptionSelected: boolean;
	whatsAppUrl: string;
	onKeyUpHandler: T_ReactOnKeyUpEventHandler<HTMLInputElement>;
	onChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
	onRadioChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
};

function useController(): T_UseControllerReturn {
	// --- STATES & REFS ---
	const [phone, setPhone] = React.useState("");
	const [isInvalidPhone, setIsInvalidPhone] = React.useState(true);
	const [isAppOptionSelected, setIsAppOptionSelected] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	// --- EFFECTS ---
	useDidMount(() => {
		if (v.isNull(inputRef.current)) return;

		focusElement(inputRef.current);
	});

	React.useEffect(() => {
		setIsInvalidPhone(!inputRef?.current?.validity?.valid || !phone);
	}, [phone]);

	// --- HANDLERS ---
	const onKeyUpHandler: T_UseControllerReturn["onKeyUpHandler"] = function onKeyUpHandler(event) {
		if (event.key !== "Enter" || isInvalidPhone) return;
		document.getElementById("link-to-wp")?.click();
	};

	const onChangeHandler: T_UseControllerReturn["onChangeHandler"] = function onChangeHandler(
		event,
	) {
		const { value } = event.currentTarget;
		setPhone((value.includes("+") ? "+" : "") + replaceAll(generateSlug(value), "-", ""));
	};

	const onRadioChangeHandler: T_UseControllerReturn["onRadioChangeHandler"] =
		function onRadioChangeHandler(event) {
			setIsAppOptionSelected(event.currentTarget.value === "app");
		};

	// --- UTILS ---
	function composeWhatsAppUrl(): string {
		const url = new URLSearchParams();
		url.append("phone", `${phone.includes("+") ? "" : "+57"}${phone}`);
		url.append("text", "Hey!");

		return `https://${isAppOptionSelected ? "api" : "web"}.whatsapp.com/send?${url.toString()}`;
	}

	return {
		// --- STATES & REFS ---
		phone,
		inputRef,
		isInvalidPhone,
		isAppOptionSelected,

		// --- VARS ---
		whatsAppUrl: composeWhatsAppUrl(),

		// --- HANDLERS ---
		onKeyUpHandler,
		onChangeHandler,
		onRadioChangeHandler,
	};
}
