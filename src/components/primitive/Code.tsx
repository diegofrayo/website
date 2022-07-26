import * as React from "react";
import classNames from "classnames";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_CodeProps = T_HTMLElementAttributes["code"];

function Code({ children, className, ...rest }: T_CodeProps): T_ReactElement {
	return (
		<code
			className={classNames(
				"dfr-Code tw-text-base tw-italic dfr-text-color-inline-code",
				className,
			)}
			{...rest}
		>
			{children}

			<style jsx>
				{`
					code::before,
					code::after {
						content: "\`";
					}
				`}
			</style>
		</code>
	);
}

export default Code;
