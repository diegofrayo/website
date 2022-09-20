import * as React from "react";
import classNames from "classnames";
import reactStringReplace from "react-string-replace";

import { Button, Icon, Modal, Space, Block, InlineText, Pre } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { GuitarChord, GuitarService, T_PlainChord } from "~/lib/guitar";
import { showAlert } from "~/utils/browser";
import { safeCastNumber } from "~/utils/numbers";
import { createArray } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import { isNumber, notFound } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement, T_ReactNode } from "~/types";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_TextFormatterProps = {
	children: string;
	insertions: { text: string; replacement: T_ReactElement }[];
};

function TextFormatter(props: T_TextFormatterProps): T_ReactElement {
	const {
		// states
		isModalVisible,
		selectedUnparsedChord,
		selectedUnparsedChordIndex,
		handleUpdateSelectedUnparsedChordVariantClick,

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
					{Array.isArray(selectedUnparsedChord) ? (
						<Block>
							{selectedUnparsedChord.map((chord, index) => {
								return (
									<Block
										key={generateSlug(`${chord.name}-${index}`)}
										className={classNames(
											index === selectedUnparsedChordIndex ? "tw-block" : "tw-hidden",
										)}
									>
										<GuitarChord plainChord={chord} />
									</Block>
								);
							})}
							<Space size={1} />
							<Block className="tw-flex tw-items-center tw-justify-center">
								<Button
									variant={Button.variant.SIMPLE}
									onClick={handleUpdateSelectedUnparsedChordVariantClick("-")}
								>
									<Icon
										icon={Icon.icon.CHEVRON_LEFT}
										size={20}
									/>
								</Button>
								<Block className="tw-flex tw-flex-1 tw-items-center tw-justify-center">
									{createArray(selectedUnparsedChord.length, 0).map((index) => {
										return (
											<InlineText
												key={generateSlug(`TextFormatter-InlineText-index-${index}`)}
												className={classNames(
													"tw-mx-1 tw-inline-flex tw-h-4 tw-w-4 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-text-xxs tw-leading-0",
													selectedUnparsedChordIndex === index
														? "tw-font-bold dfr-bg-color-bw dfr-text-color-wb"
														: "tw-border dfr-text-color-gs-black dfr-border-color-gs-black dark:tw-border-0 dark:dfr-bg-color-gs-400",
												)}
												onClick={handleUpdateSelectedUnparsedChordVariantClick(index)}
											>
												{index + 1}
											</InlineText>
										);
									})}
								</Block>
								<Button
									variant={Button.variant.SIMPLE}
									onClick={handleUpdateSelectedUnparsedChordVariantClick("+")}
								>
									<Icon
										icon={Icon.icon.CHEVRON_RIGHT}
										size={20}
									/>
								</Button>
							</Block>
						</Block>
					) : selectedUnparsedChord ? (
						<GuitarChord plainChord={selectedUnparsedChord} />
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
	selectedUnparsedChord: T_PlainChord | undefined;
	selectedUnparsedChordIndex: number;

	handleUpdateSelectedUnparsedChordVariantClick: (input: number | "+" | "-") => () => void;
	onModalCloseHandler: () => void;

	parsedLyrics: T_ReactChildren;
};

function useController({ children, insertions }: T_TextFormatterProps): T_UseControllerReturn {
	// states & refs
	const [isModalVisible, setIsModalVisible] = React.useState(false);
	const [selectedUnparsedChord, setSelectedUnparsedChord] = React.useState<
		T_PlainChord | undefined
	>(undefined);
	const [selectedUnparsedChordIndex, setSelectedUnparsedChordIndex] = React.useState(0);

	// effects
	useDidMount(() => {
		document.querySelectorAll(`.${GuitarService.CHORD_BUTTON_SELECTOR}`).forEach((button) => {
			button.addEventListener("click", (event) => {
				const target = event.target as HTMLButtonElement;
				const chord = GuitarService.findChord(target.innerText, { returnAllVariants: true });

				if (notFound(chord)) {
					showAlert(`"${target.innerText}" details not found`);
					return;
				}

				setSelectedUnparsedChord(chord);
				setSelectedUnparsedChordIndex(
					safeCastNumber(target.getAttribute("data-chord-index") || ""),
				);
				setIsModalVisible(true);
			});
		});
	});

	// handlers
	function onModalCloseHandler(): void {
		setIsModalVisible(false);
		setSelectedUnparsedChord(undefined);
	}

	const handleUpdateSelectedUnparsedChordVariantClick: T_UseControllerReturn["handleUpdateSelectedUnparsedChordVariantClick"] =
		function handleUpdateSelectedUnparsedChordVariantClick(value) {
			return () => {
				if (isNumber(value)) {
					setSelectedUnparsedChordIndex(value);
					return;
				}

				const operator = 1 * (value === "+" ? 1 : -1);

				if (selectedUnparsedChordIndex + operator < 0) {
					setSelectedUnparsedChordIndex((selectedUnparsedChord as T_PlainChord[]).length - 1);
				} else if (
					selectedUnparsedChordIndex + operator >
					(selectedUnparsedChord as T_PlainChord[]).length - 1
				) {
					setSelectedUnparsedChordIndex(0);
				} else {
					setSelectedUnparsedChordIndex(selectedUnparsedChordIndex + operator);
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
		selectedUnparsedChord,
		selectedUnparsedChordIndex,

		// handlers
		handleUpdateSelectedUnparsedChordVariantClick,
		onModalCloseHandler,

		// vars
		parsedLyrics: parseInsertions(children),
	};
}
