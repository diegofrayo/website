import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Link, Select, Space, Text } from "~/components/primitive";
import { AnalyticsService } from "~/features/analytics";
import { AuthService, withAuthComponent } from "~/features/auth";
import { renderIf } from "~/hocs";
import { useClickOutside, useDidMount, useOnWindowResize } from "~/hooks";
import { isLocalhostEnvironment } from "~/utils/app";
import type {
	T_ReactChildren,
	T_ReactElement,
	T_ReactElementNullable,
	T_ReactOnChangeEventObject,
} from "~/types";

import { initDevToolsConfig, readDevToolsConfig, updateDevToolsConfig } from "./utils";

function DevelopmentTools(): T_ReactElementNullable {
	// states & refs
	const [isConfigOpened, setIsConfigOpened] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);

	// effects
	useDidMount(() => {
		initDevToolsConfig();
	});

	useClickOutside(containerRef, () => {
		setIsConfigOpened(false);
	});

	// handlers
	function handleToggleShowConfigClick(): void {
		setIsConfigOpened((currentValue) => !currentValue);
	}

	return isLocalhostEnvironment() ? (
		<Block
			className="tw-fixed tw-top-2 tw-left-2 tw-z-40 tw-rounded-md tw-p-2 tw-text-sm dfr-shadow dfr-bg-color-secondary print:tw-hidden"
			ref={containerRef}
		>
			<Block className="tw-flex tw-items-center tw-justify-between tw-gap-2">
				<Button
					variant={Button.variant.DEFAULT}
					className="tw-leading-0"
					onClick={handleToggleShowConfigClick}
				>
					<Icon icon={Icon.icon.CODE} />
				</Button>
				<Flags />
			</Block>

			{isConfigOpened ? (
				<Block className="tw-w-48">
					<Space
						size={2}
						variant={Space.variant.DASHED}
					/>
					<CSSDebugging />
					<Space size={2} />
					<UsersConfig />
					<Space size={2} />
					<EnvironmentConfig />
					<Space size={2} />
					<HTTPRequestsConfig />
					<Space size={2} />
					<AuthPagesConfig />
					<Space size={2} />
					<ErrorPages />
					<Space size={2} />
					<WindowSizeConfig />
				</Block>
			) : null}
		</Block>
	) : (
		<Flags className="tw-fixed tw-top-2 tw-right-2 tw-z-40 tw-rounded-md tw-p-1 dfr-shadow dfr-bg-color-secondary print:tw-hidden" />
	);
}

export default DevelopmentTools;

// --- Components ---

const Flags = renderIf(function Flags({
	className = "",
}: {
	className?: string;
}): T_ReactElementNullable {
	return (
		<Block
			className={classNames("tw-flex tw-flex-col tw-items-center tw-justify-center", className)}
		>
			<UserLoggedInFlag />
			<Space className="tw-h-0.5" />
			<AnalyticsDisabledFlag />
		</Block>
	);
})(() => AuthService.isUserLoggedIn() || AnalyticsService.isAnalyticsDisabled());

const UserLoggedInFlag = withAuthComponent(function UserLoggedInFlag(): T_ReactElement {
	return <Flag color="dfr-bg-color-bw" />;
});

const AnalyticsDisabledFlag = renderIf(function AnalyticsDisabledFlag(): T_ReactElement {
	return <Flag color="tw-bg-amber-600 dark:tw-bg-red-400" />;
})(() => AnalyticsService.isAnalyticsDisabled());

type T_FlagProps = {
	className?: string;
	color: string;
};

function Flag({ className, color }: T_FlagProps): T_ReactElement {
	return <InlineText className={classNames("tw-block tw-h-1 tw-w-1", className, color)} />;
}

function CSSDebugging(): T_ReactElement {
	// vars
	const { isCSSDebuggingEnabled } = readDevToolsConfig();

	// handlers
	function onChangeHandler(event: T_ReactOnChangeEventObject<HTMLSelectElement>): void {
		const isCSSDebuggingEnabledValue = event.currentTarget.value === "true";

		if (isCSSDebuggingEnabledValue) {
			document.getElementsByTagName("html")[0].classList.add("css-debugging");
		} else {
			document.getElementsByTagName("html")[0].classList.remove("css-debugging");
		}

		updateDevToolsConfig({ isCSSDebuggingEnabled: isCSSDebuggingEnabledValue });
	}

	return (
		<ConfigBlock title="CSS Debugging">
			<Select
				id="select-css-debugging"
				defaultValue={isCSSDebuggingEnabled ? "true" : "false"}
				onChange={onChangeHandler}
			>
				<Select.Option value="true">Enabled</Select.Option>
				<Select.Option value="false">Disabled</Select.Option>
			</Select>
		</ConfigBlock>
	);
}

function UsersConfig(): T_ReactElement {
	// vars
	const { isUserLoggedIn } = readDevToolsConfig();

	// handlers
	function onChangeHandler(event: T_ReactOnChangeEventObject<HTMLSelectElement>): void {
		updateDevToolsConfig({ isUserLoggedIn: event.currentTarget.value === "true" });
		window.location.reload();
	}

	return (
		<ConfigBlock title="User session">
			<Select
				id="select-user-session"
				defaultValue={isUserLoggedIn ? "true" : "false"}
				onChange={onChangeHandler}
			>
				<Select.Option value="true">Logged in</Select.Option>
				<Select.Option value="false">Guest</Select.Option>
			</Select>
		</ConfigBlock>
	);
}

function EnvironmentConfig(): T_ReactElement {
	// vars
	const { isDevelopmentEnvironment: isDevelopmentEnvironmentConfig } = readDevToolsConfig();

	// handlers
	function onChangeHandler(event: T_ReactOnChangeEventObject<HTMLSelectElement>): void {
		updateDevToolsConfig({ isDevelopmentEnvironment: event.currentTarget.value === "true" });
		window.location.reload();
	}

	return (
		<ConfigBlock title="Environment">
			<Select
				id="select-environment"
				defaultValue={isDevelopmentEnvironmentConfig ? "true" : "false"}
				onChange={onChangeHandler}
			>
				<Select.Option value="true">Development</Select.Option>
				<Select.Option value="false">Production</Select.Option>
			</Select>
		</ConfigBlock>
	);
}

function HTTPRequestsConfig(): T_ReactElement {
	// vars
	const { httpRequestsHaveToFail } = readDevToolsConfig();

	// handlers
	function onChangeHandler(event: T_ReactOnChangeEventObject<HTMLSelectElement>): void {
		updateDevToolsConfig({ httpRequestsHaveToFail: event.currentTarget.value === "true" });
		window.location.reload();
	}

	return (
		<ConfigBlock title="HTTP Requests">
			<Select
				id="select-http-requests"
				defaultValue={httpRequestsHaveToFail ? "true" : "false"}
				onChange={onChangeHandler}
			>
				<Select.Option value="true">Fail</Select.Option>
				<Select.Option value="false">No-intercept</Select.Option>
			</Select>
		</ConfigBlock>
	);
}

function AuthPagesConfig(): T_ReactElement {
	// vars
	const { authPagesEnabled } = readDevToolsConfig();

	// handlers
	function onChangeHandler(event: T_ReactOnChangeEventObject<HTMLSelectElement>): void {
		updateDevToolsConfig({ authPagesEnabled: event.currentTarget.value === "true" });
		window.location.reload();
	}

	return (
		<ConfigBlock title="Auth pages">
			<Select
				id="select-auth-pages"
				defaultValue={authPagesEnabled ? "true" : "false"}
				onChange={onChangeHandler}
			>
				<Select.Option value="true">Enabled</Select.Option>
				<Select.Option value="false">Disabled</Select.Option>
			</Select>
		</ConfigBlock>
	);
}

function ErrorPages(): T_ReactElement {
	return (
		<ConfigBlock title="Error pages">
			<Block className="tw-flex tw-gap-4">
				<Link
					variant={Link.variant.SIMPLE}
					href="/404"
					isExternalLink
				>
					<Icon icon={Icon.icon.EXTERNAL_LINK} />
					<InlineText className="tw-ml-0.5 tw-text-xs">404</InlineText>
				</Link>
				<Link
					variant={Link.variant.SIMPLE}
					href="/500"
					isExternalLink
				>
					<Icon icon={Icon.icon.EXTERNAL_LINK} />
					<InlineText className="tw-ml-0.5 tw-text-xs">500</InlineText>
				</Link>
			</Block>
		</ConfigBlock>
	);
}

function WindowSizeConfig(): T_ReactElement {
	// states & refs
	const [size, setSize] = React.useState([0, 0]);

	// effects
	useOnWindowResize(() => {
		setSize([window.innerWidth, window.innerHeight]);
	});

	return (
		<ConfigBlock title="Window size">
			<Block>
				<InlineText>{size.join("x")} | </InlineText>
				<InlineText className="tw-inline-block sm:tw-hidden">mobile</InlineText>
				<InlineText className="tw-hidden sm:tw-inline-block md:tw-hidden">sm</InlineText>
				<InlineText className="lg:tw-hidden tw-hidden md:tw-inline-block">md</InlineText>
				<InlineText className="lg:tw-inline-block tw-hidden">lg</InlineText>
			</Block>
		</ConfigBlock>
	);
}

type T_ConfigBlockProps = {
	title: string;
	children: T_ReactChildren;
};

function ConfigBlock({ title, children }: T_ConfigBlockProps): T_ReactElement {
	return (
		<Block>
			<Text className="tw-font-bold">{title}:</Text>
			{children}
		</Block>
	);
}
