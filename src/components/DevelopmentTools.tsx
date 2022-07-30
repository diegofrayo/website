import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Space, Text } from "~/components/primitive";
import { withAuthenticationRequired } from "~/hocs";
import { useDidMount, useOnWindowResize } from "~/hooks";
import AnalyticsService from "~/services/analytics";
import { isLocalhostEnvironment } from "~/utils/app";
import { readDevToolsConfig, updateDevToolsConfig } from "~/utils/dev-tools";
import { isTrue } from "~/utils/validations";
import type {
	T_ReactChildren,
	T_ReactElement,
	T_ReactElementNullable,
	T_ReactOnChangeEventHandler,
	T_ReactOnChangeEventObject,
} from "~/types";

function DevelopmentTools(): T_ReactElementNullable {
	// states & refs
	const [showConfig, setShowConfig] = React.useState(false);

	// effects
	useDidMount(() => {
		updateDevToolsConfig({});
	});

	// handlers
	function handleToggleShowConfig(): void {
		setShowConfig((currentValue) => !currentValue);
	}

	return (
		<Block className="tw-fixed tw-top-2 tw-left-2 tw-z-40 tw-rounded-md">
			{!isLocalhostEnvironment() ? (
				<Block className="tw-p-2 tw-text-sm dfr-shadow dfr-bg-color-secondary">
					<Block className="tw-flex tw-items-center tw-justify-between tw-gap-2">
						<Button
							variant={Button.variant.DEFAULT}
							onClick={handleToggleShowConfig}
						>
							<Icon icon={Icon.icon.CODE} />
						</Button>
						<Block className="tw-flex tw-items-center tw-justify-center tw-gap-1">
							<UserLoggedInFlag />
							<AnalyticsDisabledFlag />
						</Block>
					</Block>

					{isTrue(showConfig) ? (
						<Block className="tw-w-48">
							<Space
								size={2}
								variant={Space.variant.DASHED}
							/>
							<UsersConfig />
							<Space size={2} />
							<EnvironmentConfig />
							<Space size={2} />
							<WindowSizeConfig />
						</Block>
					) : null}
				</Block>
			) : (
				<Block className="tw-flex tw-items-center tw-justify-center tw-gap-1">
					<UserLoggedInFlag />
					<AnalyticsDisabledFlag />
				</Block>
			)}
		</Block>
	);
}

export default DevelopmentTools;

// --- Components ---

function UsersConfig(): T_ReactElement {
	// vars
	const { isUserLoggedIn } = readDevToolsConfig();

	// handlers
	function onChangeHandler(event: T_ReactOnChangeEventObject<HTMLSelectElement>): void {
		updateDevToolsConfig({ isUserLoggedIn: event.currentTarget.value === "true" });
		window.location.reload();
	}

	return (
		<Block>
			<Text className="tw-font-bold">User:</Text>
			<Select
				defaultValue={isUserLoggedIn ? "true" : "false"}
				onChangeHandler={onChangeHandler}
			>
				<option value="true">Logged in</option>
				<option value="false">Guest</option>
			</Select>
		</Block>
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
		<Block>
			<Text className="tw-font-bold">Environment:</Text>
			<Select
				defaultValue={isDevelopmentEnvironmentConfig ? "true" : "false"}
				onChangeHandler={onChangeHandler}
			>
				<option value="true">Development</option>
				<option value="false">Production</option>
			</Select>
		</Block>
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
		<Block>
			<Text className="tw-font-bold">Window size:</Text>
			<Block>
				<InlineText>{size.join("x")} | </InlineText>
				<InlineText className="tw-inline-block sm:tw-hidden">mobile</InlineText>
				<InlineText className="tw-hidden sm:tw-inline-block md:tw-hidden">sm</InlineText>
				<InlineText className="lg:tw-hidden tw-hidden md:tw-inline-block">md</InlineText>
				<InlineText className="lg:tw-inline-block tw-hidden">lg</InlineText>
			</Block>
		</Block>
	);
}

const UserLoggedInFlag = withAuthenticationRequired(function UserLoggedInFlag(): T_ReactElement {
	return <Flag color="dfr-bg-color-bw" />;
});

function AnalyticsDisabledFlag(): T_ReactElementNullable {
	// hooks
	const [isAnalyticsDisabled, setIsAnalyticsDisabled] = React.useState(false);

	// effects
	useDidMount(() => {
		setIsAnalyticsDisabled(AnalyticsService.isAnalyticsDisabled());
	});

	if (isAnalyticsDisabled) {
		return <Flag color="tw-bg-amber-600 dark:tw-bg-red-400" />;
	}

	return null;
}

type T_FlagProps = {
	className?: string;
	color: string;
};

function Flag({ className, color }: T_FlagProps): T_ReactElement {
	return <InlineText className={classNames("tw-block tw-h-1 tw-w-1", className, color)} />;
}

type T_SelectProps = {
	defaultValue: string;
	onChangeHandler: T_ReactOnChangeEventHandler<HTMLSelectElement>;
	children: T_ReactChildren;
};

function Select({ defaultValue, onChangeHandler, children }: T_SelectProps): T_ReactElement {
	return (
		<select
			defaultValue={defaultValue}
			onChange={onChangeHandler}
		>
			{children}

			<style jsx>{`
				select {
					@apply dfr-bg-color-tertiary;
					@apply dfr-border-color-gs-400;
					border-width: 1px;
					width: 100%;
				}
			`}</style>
		</select>
	);
}
