import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import { Input, Block, Button, Space, Select } from "~/components/primitive";
import { BoxWithTitle, CopyToClipboardPopover } from "~/components/shared";
import { withAuthRulesPage } from "~/modules/auth";
import { useDidMount } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import { isMobileDevice } from "@diegofrayo/utils/browser";
import { generateSlug, replaceAll } from "@diegofrayo/utils/strings";

import { Output } from "./components";

function WhatsAppPage() {
	// --- STATES & REFS ---
	const [phone, setPhone] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [isAppOptionSelected, setIsAppOptionSelected] = React.useState(false);
	const isInputPhoneValid = React.useRef(false);

	// --- VARS ---
	const whatsAppUrl = composeWhatsAppUrl();

	// --- EFFECTS ---
	useDidMount(() => {
		setIsAppOptionSelected(isMobileDevice());
	});

	// --- HANDLERS ---
	function onInputPhoneChangeHandler(event: DR.React.Events.OnChangeEvent<HTMLInputElement>) {
		const { value } = event.currentTarget;

		isInputPhoneValid.current = event.currentTarget.validity.valid;

		setPhone((value.includes("+") ? "+" : "") + replaceAll(generateSlug(value), "-", ""));
	}

	function onInputMessageChangeHandler(event: DR.React.Events.OnChangeEvent<HTMLInputElement>) {
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

		url.append("phone", `${phone.includes("+") ? "" : "+57"}${phone}`);
		url.append("text", message || "Hola!");

		return isInputPhoneValid.current === false
			? "Error: INVALID FORM VALUES"
			: `https://${isAppOptionSelected ? "api" : "web"}.whatsapp.com/send?${url.toString()}`;
	}

	return (
		<Page
			config={{
				title: "WhatsApp",
				disableSEO: true,
			}}
		>
			<MainLayout title="WhatsApp">
				<Block className="tw-mx-auto tw-w-full tw-max-w-screen-xs">
					<BoxWithTitle
						title="Config"
						className="tw-p-2 tw-py-3 tw-pt-4"
					>
						<Block>
							<Input
								variant={Input.variant.STYLED}
								id="input-phone"
								type="tel"
								value={phone}
								placeholder="🇨🇴 +57"
								pattern="\+?[0-9]{10,15}"
								componentProps={{ label: "Phone number" }}
								onChange={onInputPhoneChangeHandler}
								required
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
								onChange={onInputMessageChangeHandler}
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
					</BoxWithTitle>

					<Space
						size={10}
						variant={Space.variant.DASHED}
					/>

					<BoxWithTitle
						className="tw-p-2 tw-py-3 tw-pt-4"
						title="Output"
					>
						<Output>{whatsAppUrl}</Output>

						<Space size={1} />

						<Block className="tw-flex tw-justify-end tw-gap-2">
							<Button
								variant={Button.variant.STYLED}
								disabled={isInputPhoneValid.current === false}
								onClick={handleOpenLinkClick}
							>
								Open link
							</Button>
							<CopyToClipboardPopover textToCopy={whatsAppUrl}>
								<Button
									variant={Button.variant.STYLED}
									disabled={isInputPhoneValid.current === false}
								>
									Copy URL
								</Button>
							</CopyToClipboardPopover>
						</Block>
					</BoxWithTitle>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default withAuthRulesPage(WhatsAppPage, { requireAuth: true });
