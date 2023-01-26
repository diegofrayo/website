import classNames from "classnames";
import * as React from "react";

import { Block, Button, Icon, InlineText } from "~/@legacy/src/components/primitive";
import { goBack } from "~/@legacy/src/features/routing";
import v from "~/@legacy/src/lib/v";
import { isConfirmAlertAccepted } from "~/@legacy/src/utils/browser";
import type { T_ReactElement } from "~/@legacy/src/types";

type T_GoBackProps = {
	className: string;
	withConfirmation?: boolean;
};

function GoBack({ className, withConfirmation = false }: T_GoBackProps): T_ReactElement {
	// handlers
	function handleGoBackClick(): void {
		if (
			v.isNotTrue(withConfirmation) ||
			(v.isTrue(withConfirmation) && isConfirmAlertAccepted("¿Are you sure?"))
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
