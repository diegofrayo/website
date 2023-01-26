import * as React from "react";

import { Block } from "~/@legacy/src/components/primitive";
import type { T_ReactElement } from "~/@legacy/src/types";

function Loader(): T_ReactElement {
	return (
		<div className="dfr-Loader root tw-relative tw-inline-block">
			<Block />
			<Block />

			<style jsx>
				{`
					.root {
						width: 80px;
						height: 80px;
					}

					.root :global(div) {
						animation: root 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
						border-radius: 50%;
						border: 4px solid var(--dfr-border-color-primary);
						opacity: 1;
						position: absolute;
					}

					.root :global(div):nth-child(2) {
						animation-delay: -0.5s;
					}

					@keyframes root {
						0% {
							top: 36px;
							left: 36px;
							width: 0;
							height: 0;
							opacity: 1;
						}
						100% {
							top: 0px;
							left: 0px;
							width: 72px;
							height: 72px;
							opacity: 0;
						}
					}
				`}
			</style>
		</div>
	);
}

export default Loader;
