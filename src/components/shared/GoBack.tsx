import classNames from "classnames";
import * as React from "react";

import { Block, Button, Icon, InlineText } from "~/components/primitive";
import { goBack } from "~/features/routing";
import type { T_ReactElement } from "~/types";
import { isNotTrue, isTrue } from "~/utils/validations";

type T_GoBackProps = {
	className: string;
	withConfirmation?: boolean;
};

function GoBack({ className, withConfirmation = false }: T_GoBackProps): T_ReactElement {
	// handlers
	function handleGoBackClick(): void {
		if (
			isNotTrue(withConfirmation) ||
			(isTrue(withConfirmation) && window.confirm("¿Are you sure?"))
		) {
			goBack();
		}
	}

	return (
		<Block
			className={classNames(
				"tw-left-0 tw-right-0 tw-h-8 tw-p-1 tw-text-sm tw-font-bold dfr-text-color-gs-white dfr-bg-color-gs-black",
				className,
			)}
		>
			<Button
				variant={Button.variant.SIMPLE}
				onClick={handleGoBackClick}
			>
				<Icon
					icon={Icon.icon.CHEVRON_LEFT}
					color="dfr-text-color-gs-white"
				/>
				<InlineText className="tw-align-middle tw-font-bold"> Go back</InlineText>
			</Button>
		</Block>
	);
}

export default GoBack;
