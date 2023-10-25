import * as React from "react";
import cn from "classnames";

import { Input, Block, Button, Space, Select, Title } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import v from "@diegofrayo/v";
import { isMobileDevice } from "@diegofrayo/utils/browser";
import { generateSlug, replaceAll } from "@diegofrayo/utils/strings";
import { CopyToClipboardPopover } from "~/components/shared";
import DR from "@diegofrayo/types";
import { MainLayout, Page } from "~/components/layout";

function WhatsAppPage() {
	// --- STATES & REFS ---
	const [phone, setPhone] = React.useState("");
	const [message, setMessage] = React.useState(DEFAULT_INPUT_VALUES.message);
	const [isAppOptionSelected, setIsAppOptionSelected] = React.useState(false);
	const isPhoneInputValid = React.useRef(false);

	// --- VARS ---
	const whatsAppUrl = composeWhatsAppUrl();

	// --- EFFECTS ---
	useDidMount(() => {
		setIsAppOptionSelected(isMobileDevice());
	});

	// --- HANDLERS ---
	function onPhoneInputChangeHandler(event: DR.React.Events.OnChangeEvent<HTMLInputElement>) {
		const { value } = event.currentTarget;

		isPhoneInputValid.current = event.currentTarget.validity.valid;

		setPhone((value.includes("+") ? "+" : "") + replaceAll(generateSlug(value), "-", ""));
	}

	function onMessageInputChangeHandler(event: DR.React.Events.OnChangeEvent<HTMLInputElement>) {
		const { value } = event.currentTarget;
		setMessage(value);
	}

	function onSelectChangeHandler(event: DR.React.Events.OnChangeEvent<HTMLSelectElement>) {
		setIsAppOptionSelected(event.currentTarget.value === "app");
	}

	function handleOpenLinkClick() {
		window.open(whatsAppUrl, "_blank");
	}

	// --- UTILS ---
	function composeWhatsAppUrl(): string {
		const url = new URLSearchParams();

		url.append(
			"phone",
			isPhoneInputValid.current
				? `${phone.includes("+") ? "" : "+57"}${phone || DEFAULT_INPUT_VALUES.phone}`
				: "INVALID_PHONE",
		);
		url.append("text", message || DEFAULT_INPUT_VALUES.message);

		return `https://${isAppOptionSelected ? "api" : "web"}.whatsapp.com/send?${url.toString()}`;
	}

	return (
		<Page
			config={{
				title: "WhatsApp",
				disableSEO: true,
			}}
		>
			<MainLayout title="WhatsApp">
				<Block className="tw-mx-auto tw-w-96 tw-max-w-full">
					<Block>
						<Title
							is="h2"
							variant={Title.variant.PRIMARY}
							className="tw-mb-3"
						>
							Config
						</Title>
						<Block>
							<Input
								variant={Input.variant.STYLED}
								id="input-phone"
								type="tel"
								value={phone}
								placeholder="🇨🇴 +57"
								pattern="\+?[0-9]{10,15}"
								componentProps={{ label: "Phone number" }}
								onChange={onPhoneInputChangeHandler}
							/>
						</Block>
						<Space size={2} />
						<Block>
							<Input
								variant={Input.variant.STYLED}
								id="input-message"
								type="text"
								value={message}
								componentProps={{ label: "Message" }}
								onChange={onMessageInputChangeHandler}
							/>
						</Block>
						<Space size={2} />
						<Block>
							<Input.Label>Link mode</Input.Label>
							<Select
								id="select-link-mode"
								variant={Select.variant.STYLED}
								className="tw-block tw-w-full"
								value={isAppOptionSelected ? "app" : "web"}
								onChange={onSelectChangeHandler}
							>
								<Select.Option value="app">APP</Select.Option>
								<Select.Option value="web">WEB</Select.Option>
							</Select>
						</Block>
					</Block>

					<Block className={cn(v.isEmptyString(whatsAppUrl) ? "tw-hidden" : "tw-block")}>
						<Space
							size={10}
							variant={Space.variant.DASHED}
						/>

						<Title
							is="h2"
							variant={Title.variant.PRIMARY}
							className="tw-mb-3"
						>
							Result
						</Title>
						<output className="tw-block tw-min-h-[40px] tw-w-full tw-whitespace-break-spaces tw-break-all tw-border tw-p-3 tw-font-mono tw-text-sm dr-border-color-surface-300">
							{whatsAppUrl}
						</output>
						<Block className="tw-mt-2 tw-flex tw-justify-end tw-gap-2">
							<Button
								variant={Button.variant.STYLED}
								onClick={handleOpenLinkClick}
							>
								Open link
							</Button>
							<CopyToClipboardPopover textToCopy={whatsAppUrl}>
								<Button variant={Button.variant.STYLED}>Copy URL</Button>
							</CopyToClipboardPopover>
						</Block>
					</Block>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default WhatsAppPage;

// --- CONSTANTS ---

const DEFAULT_INPUT_VALUES = {
	message: "Hola!",
	phone: "3113728898",
};
