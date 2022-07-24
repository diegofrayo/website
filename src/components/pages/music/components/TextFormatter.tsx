// @ts-nocheck

import * as React from "react";
import classNames from "classnames";
import reactStringReplace from "react-string-replace";

import { Button, Icon, Modal, Space, Block, InlineText } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { GuitarChord, GuitarService, T_Chord } from "~/lib/guitar";
import { safeCastNumber } from "~/utils/numbers";
import { createArray } from "~/utils/objects-and-arrays";
import type { T_ReactChildren, T_ReactElement } from "~/types";

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
		handleUpdateSelectedChordIndex,

		// handlers
		handleModalClose,

		// vars
		parsedLyrics,
	} = useController(props);

	return (
		<Block>
			{parsedLyrics}

			<Modal
				visible={isModalVisible}
				onCloseHandler={handleModalClose}
			>
				<Block className="dfr-border-color-dark-strong dark:dfr-border-color-light-strong tw-w-96 tw-max-w-full tw-border-4 tw-p-4 dfr-bg-color-wb-inv dark:dfr-bg-color-primary-inv">
					{Array.isArray(selectedChord) ? (
						<Block>
							{selectedChord.map((chord, index) => {
								return (
									<Block
										key={`${chord.name}-${index}`}
										className={classNames(index === selectedChordIndex ? "tw-block" : "tw-hidden")}
									>
										<GuitarChord
											name={chord.name}
											musicNotes={chord.musicNotes}
											playedStrings={chord.playedStrings}
										/>
									</Block>
								);
							})}
							<Space size={1} />
							<Block className="tw-flex tw-items-center tw-justify-center">
								<Button
									variant={Button.variant.SIMPLE}
									onClick={() => {
										handleUpdateSelectedChordIndex("-");
									}}
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
												key={`Chord-point-${index}`}
												className={classNames(
													"tw-mx-1 tw-inline-flex tw-h-4 tw-w-4 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-text-xxs tw-leading-0 dfr-text-color-white-pin dark:dfr-text-color-black-pin",
													selectedChordIndex === index
														? "tw-font-bold dfr-bg-color-bw-inv dark:dfr-bg-color-wb-inv"
														: "tw-bg-gray-400",
												)}
												onClick={() => handleUpdateSelectedChordIndex(index)}
											>
												{index + 1}
											</InlineText>
										);
									})}
								</Block>
								<Button
									variant={Button.variant.SIMPLE}
									onClick={() => {
										handleUpdateSelectedChordIndex("+");
									}}
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
							playedStrings={selectedChord.playedStrings}
						/>
					) : null}
					<Space size={2} />
					<Button
						variant={Button.variant.SIMPLE}
						className="tw-block tw-w-full tw-text-center tw-leading-0"
						onClick={handleModalClose}
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

function useController({ children, insertions }: T_TextFormatterProps): {
	isModalVisible: boolean;
	selectedChord: T_Chord | undefined;
	selectedChordIndex: number;

	handleUpdateSelectedChordIndex: (value: number | string) => void;
	handleModalClose: () => void;

	parsedLyrics: T_ReactChildren;
} {
	const [isModalVisible, setIsModalVisible] = React.useState(false);
	const [selectedChord, setSelectedChord] = React.useState<T_Chord | undefined>(undefined);
	const [selectedChordIndex, setSelectedChordIndex] = React.useState(0);

	useDidMount(() => {
		document.querySelectorAll(".dfr-Chord")?.forEach((button) => {
			button.addEventListener("click", function (event) {
				const target = event.target as HTMLElement;
				const chord = GuitarService.findChord(target?.innerText);

				if (!chord) {
					alert("This chord does not exist");
					return;
				}

				setSelectedChord(chord);
				setSelectedChordIndex(safeCastNumber(target?.getAttribute("data-chord-index") || ""));
				setIsModalVisible(true);
			});
		});
	});

	function handleModalClose(): void {
		setIsModalVisible(false);
		setSelectedChord(undefined);
	}

	function handleUpdateSelectedChordIndex(value: number | string): void {
		if (typeof value === "number") {
			setSelectedChordIndex(value);
			return;
		}

		const operator = 1 * (value === "+" ? 1 : -1);

		if (selectedChordIndex + operator < 0) {
			setSelectedChordIndex((selectedChord as T_Chord[]).length - 1);
		} else if (selectedChordIndex + operator > (selectedChord as T_Chord[]).length - 1) {
			setSelectedChordIndex(0);
		} else {
			setSelectedChordIndex(selectedChordIndex + operator);
		}
	}

	function parseInsertions(
		parsedContent: string,
		insertions?: T_TextFormatterProps["insertions"],
	): T_ReactChildren {
		let result;

		if (insertions) {
			insertions.forEach(({ text, replacement }, index) => {
				result = reactStringReplace(index === 0 ? parsedContent : result, text, () => replacement);
			});
		} else {
			result = [parsedContent];
		}

		return result.map((item, index) => {
			if (typeof item === "string") {
				return (
					<pre
						key={`TextFormatter-item-${index}`}
						className="tw-break-normal tw-p-1 tw-leading-none"
						dangerouslySetInnerHTML={{ __html: item }}
					/>
				);
			}

			return <React.Fragment key={`TextFormatter-item-${index}`}>{item}</React.Fragment>;
		});
	}

	return {
		// states
		isModalVisible,
		selectedChord,
		selectedChordIndex,
		handleUpdateSelectedChordIndex,

		// handlers
		handleModalClose,

		// vars
		parsedLyrics: parseInsertions(GuitarService.formatText(children), insertions),
	};
}
