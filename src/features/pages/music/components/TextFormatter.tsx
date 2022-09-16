import * as React from "react";
import classNames from "classnames";
import reactStringReplace from "react-string-replace";

import { Button, Icon, Modal, Space, Block, InlineText, Pre } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { GuitarChord, GuitarService, T_GuitarChord } from "~/lib/guitar";
import { showAlert } from "~/utils/browser";
import { safeCastNumber } from "~/utils/numbers";
import { createArray } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import { isNumber, isUndefined } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement, T_ReactNode } from "~/types";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_TextFormatterProps = {
	children: string;
	chords: string[];
	insertions: { text: string; replacement: T_ReactElement }[];
};

function TextFormatter(props: T_TextFormatterProps): T_ReactElement {
	const {
		// states
		isModalVisible,
		selectedChord,
		selectedChordIndex,
		handleUpdateSelectedChordVariantClick,

		// handlers
		onModalCloseHandler,

		// vars
		parsedLyrics,
	} = useController(props);

	return (
		<Block>
			{parsedLyrics}

			<Modal
				visible={isModalVisible}
				onCloseHandler={onModalCloseHandler}
			>
				<Block className="tw-w-96 tw-max-w-full tw-border-4 tw-p-4 dfr-border-color-bw dfr-bg-color-wb dark:dfr-bg-color-primary">
					{Array.isArray(selectedChord) ? (
						<Block>
							{selectedChord.map((chord, index) => {
								return (
									<Block
										key={generateSlug(`${chord.name}-${index}`)}
										className={classNames(index === selectedChordIndex ? "tw-block" : "tw-hidden")}
									>
										<GuitarChord
											name={chord.name}
											musicNotes={chord.musicNotes}
											touchedStrings={chord.touchedStrings}
										/>
									</Block>
								);
							})}
							<Space size={1} />
							<Block className="tw-flex tw-items-center tw-justify-center">
								<Button
									variant={Button.variant.SIMPLE}
									onClick={handleUpdateSelectedChordVariantClick("-")}
								>
									<Icon
										icon={Icon.icon.CHEVRON_LEFT}
										size={20}
									/>
								</Button>
								<Block className="tw-flex tw-flex-1 tw-items-center tw-justify-center">
									{createArray(selectedChord.length, 0).map((index) => {
										return (
											<InlineText
												key={generateSlug(`TextFormatter-InlineText-index-${index}`)}
												className={classNames(
													"tw-mx-1 tw-inline-flex tw-h-4 tw-w-4 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-text-xxs tw-leading-0",
													selectedChordIndex === index
														? "tw-font-bold dfr-bg-color-bw dfr-text-color-wb"
														: "tw-border dfr-text-color-gs-black dfr-border-color-gs-black dark:tw-border-0 dark:dfr-bg-color-gs-400",
												)}
												onClick={handleUpdateSelectedChordVariantClick(index)}
											>
												{index + 1}
											</InlineText>
										);
									})}
								</Block>
								<Button
									variant={Button.variant.SIMPLE}
									onClick={handleUpdateSelectedChordVariantClick("+")}
								>
									<Icon
										icon={Icon.icon.CHEVRON_RIGHT}
										size={20}
									/>
								</Button>
							</Block>
						</Block>
					) : selectedChord ? (
						<GuitarChord
							name={selectedChord.name}
							musicNotes={selectedChord.musicNotes}
							touchedStrings={selectedChord.touchedStrings}
						/>
					) : null}
					<Space size={2} />
					<Button
						variant={Button.variant.SIMPLE}
						className="tw-block tw-w-full tw-text-center tw-leading-0"
						onClick={onModalCloseHandler}
					>
						<Icon
							icon={Icon.icon.X}
							size={24}
						/>
					</Button>
				</Block>
			</Modal>
		</Block>
	);
}

export default TextFormatter;

// --- Controller ---

type T_UseControllerReturn = {
	isModalVisible: boolean;
	selectedChord: T_GuitarChord | undefined;
	selectedChordIndex: number;

	handleUpdateSelectedChordVariantClick: (input: number | "+" | "-") => () => void;
	onModalCloseHandler: () => void;

	parsedLyrics: T_ReactChildren;
};

function useController({ children, insertions }: T_TextFormatterProps): T_UseControllerReturn {
	// states & refs
	const [isModalVisible, setIsModalVisible] = React.useState(false);
	const [selectedChord, setSelectedChord] = React.useState<T_GuitarChord | undefined>(undefined);
	const [selectedChordIndex, setSelectedChordIndex] = React.useState(0);

	// effects
	useDidMount(() => {
		document.querySelectorAll(".dfr-Chord").forEach((button) => {
			button.addEventListener("click", (event) => {
				const target = event.target as HTMLElement;
				const chord = GuitarService.findChord(target?.innerText);

				if (isUndefined(chord)) {
					showAlert(`"${target?.innerText}" details not found`);
					return;
				}

				setSelectedChord(chord);
				setSelectedChordIndex(safeCastNumber(target?.getAttribute("data-chord-index") || ""));
				setIsModalVisible(true);
			});
		});
	});

	// handlers
	function onModalCloseHandler(): void {
		setIsModalVisible(false);
		setSelectedChord(undefined);
	}

	const handleUpdateSelectedChordVariantClick: T_UseControllerReturn["handleUpdateSelectedChordVariantClick"] =
		function handleUpdateSelectedChordVariantClick(value) {
			return () => {
				if (isNumber(value)) {
					setSelectedChordIndex(value);
					return;
				}

				const operator = 1 * (value === "+" ? 1 : -1);

				if (selectedChordIndex + operator < 0) {
					setSelectedChordIndex((selectedChord as T_GuitarChord[]).length - 1);
				} else if (selectedChordIndex + operator > (selectedChord as T_GuitarChord[]).length - 1) {
					setSelectedChordIndex(0);
				} else {
					setSelectedChordIndex(selectedChordIndex + operator);
				}
			};
		};

	// utils
	function parseInsertions(parsedContent: string): T_ReactChildren {
		let result: (string | T_ReactNode)[] = [];

		if (insertions) {
			insertions.forEach(({ text, replacement }, index) => {
				result = reactStringReplace(
					index === 0 ? parsedContent : result,
					text,
					() => replacement,
				) as T_ReactNode[];
			});
		} else {
			result = [parsedContent];
		}

		return result.map((item, index) => {
			if (typeof item === "string") {
				return (
					<Pre
						key={generateSlug(`TextFormatter-Pre-item-${index}`)}
						variant={Pre.variant.UNSTYLED}
						className="tw-overflow-visible tw-leading-none"
						dangerouslySetInnerHTML={{ __html: item }}
					/>
				);
			}

			return (
				<React.Fragment key={generateSlug(`TextFormatter-React.Fragment-item-${index}`)}>
					{item}
				</React.Fragment>
			);
		});
	}

	return {
		// states
		isModalVisible,
		selectedChord,
		selectedChordIndex,

		// handlers
		handleUpdateSelectedChordVariantClick,
		onModalCloseHandler,

		// vars
		parsedLyrics: parseInsertions(GuitarService.parseSongLyrics(children)),
	};
}
