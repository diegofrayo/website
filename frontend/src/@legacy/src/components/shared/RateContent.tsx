import * as React from "react";
import classNames from "classnames";

import { Button, Block, Text, Space } from "~/@legacy/src/components/primitive";
import { useDidMount } from "~/@legacy/src/hooks";
import { AnalyticsService } from "~/@legacy/src/features/analytics";
import { T_TranslationFunction, useTranslation } from "~/@legacy/src/features/i18n";
import { logAndReportError } from "~/@legacy/src/features/logging";
import v from "~/@legacy/src/lib/v";
import { showToast } from "~/@legacy/src/utils/browser";
import type { T_Object, T_ReactElement } from "~/@legacy/src/types";

import Emoji from "./Emoji";

function RateContent(): T_ReactElement {
	const {
		// hooks
		t,

		// vars
		isQuestionAnswered,

		// states & refs
		questionAnswer,

		// handlers
		handleAnswerClick,
	} = useController();

	return (
		<Block className="tw-text-center print:tw-hidden">
			<Text className="tw-mb-2 tw-text-sm tw-font-bold">{t("common:useful_question")}</Text>
			<Block
				className={classNames("tw-text-center tw-text-xl", isQuestionAnswered && "tw-opacity-50")}
			>
				<Button
					variant={Button.variant.SIMPLE}
					className={classNames(questionAnswer === "YES" && "tw-font-bold")}
					disabled={isQuestionAnswered}
					onClick={handleAnswerClick("YES")}
				>
					<Emoji>👍</Emoji>
					<Text className="tw-text-sm">{t("common:useful_question_yes")}</Text>
				</Button>
				<Space
					size={3}
					orientation="v"
				/>
				<Button
					variant={Button.variant.SIMPLE}
					className={classNames(questionAnswer === "NO" && "tw-font-bold")}
					disabled={isQuestionAnswered}
					onClick={handleAnswerClick("NO")}
				>
					<Emoji>👎</Emoji>
					<Text className="tw-text-sm">{t("common:useful_question_no")}</Text>
				</Button>
			</Block>
		</Block>
	);
}

export default RateContent;

// --- Controller ---

type T_UseController = {
	t: T_TranslationFunction;
	isQuestionAnswered: boolean;
	questionAnswer: string;
	handleAnswerClick: (answer: "YES" | "NO") => () => void;
};

function useController(): T_UseController {
	// hooks
	const { t } = useTranslation();

	// states & refs
	const [questionAnswer, setQuestionAnswer] = React.useState("");

	// vars
	const LOCAL_STORAGE_KEY = "DFR_CONTENT_RATED";
	const isQuestionAnswered = v.isNotEmptyString(questionAnswer);

	// effects
	useDidMount(() => {
		initLocalStorageData();
		setQuestionAnswer(readLocalStorageData()[window.location.pathname] || "");
	});

	// handlers
	const handleAnswerClick: T_UseController["handleAnswerClick"] = function handleAnswerClick(
		answer,
	) {
		return () => {
			setQuestionAnswer(answer);

			AnalyticsService.trackEvent("RATE_CONTENT", {
				answer,
				page: window.location.pathname,
			});

			showToast({ type: "SUCCESS", message: t("common:useful_question_thanks") });
			writeDataOnLocalStorage({ [window.location.pathname]: answer });
		};
	};

	// utils
	function initLocalStorageData(): void {
		const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY) || "";

		if (v.isNotEmptyString(storedData)) {
			window.localStorage.setItem(
				LOCAL_STORAGE_KEY,
				JSON.stringify({ [window.location.pathname]: "" }),
			);
		}
	}

	function writeDataOnLocalStorage(data: T_Object<string>): void {
		window.localStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify({
				...readLocalStorageData(),
				...data,
			}),
		);
	}

	function readLocalStorageData(): T_Object<string> {
		try {
			const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY) || "";

			if (v.isEmptyString(savedData)) {
				return {};
			}

			return JSON.parse(savedData);
		} catch (error) {
			logAndReportError(error);
			return {};
		}
	}

	return {
		// hooks
		t,

		// vars
		isQuestionAnswered,

		// states & refs
		questionAnswer,

		// handlers
		handleAnswerClick,
	};
}
