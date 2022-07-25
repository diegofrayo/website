import * as React from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

import { Button, Block, Text, Space } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { T_TranslationFunction, useTranslation } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import { reportError } from "~/utils/app";
import { isEmptyString, isNotEmptyString } from "~/utils/validations";
import type { T_Object, T_ReactElement } from "~/types";

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
			<Text className="tw-text-sm tw-font-bold">{t("common:useful_question")}</Text>
			<Block
				className={classNames(
					"tw-mt-4 tw-text-center tw-text-xl",
					isQuestionAnswered && "tw-opacity-50",
				)}
			>
				<Button
					variant={Button.variant.SIMPLE}
					className={classNames(questionAnswer === "YES" && "tw-font-bold")}
					disabled={isQuestionAnswered}
					onClick={handleAnswerClick("YES")}
				>
					<Emoji>👍</Emoji>
					<Text>{t("common:useful_question_yes")}</Text>
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
					<Text>{t("common:useful_question_no")}</Text>
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
	const isQuestionAnswered = isNotEmptyString(questionAnswer);

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

			toast.success(t("common:useful_question_thanks"), {
				position: toast.POSITION.BOTTOM_CENTER,
				toastId: "useful-question",
			});

			writeDataOnLocalStorage({ [window.location.pathname]: answer });
		};
	};

	// utils
	function initLocalStorageData(): void {
		const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY) || "";

		if (isNotEmptyString(storedData)) {
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

			if (isEmptyString(savedData)) {
				return {};
			}

			return JSON.parse(savedData);
		} catch (error) {
			reportError(error);
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
