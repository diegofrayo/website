import * as React from "react";
import cn from "classnames";

import Block from "~/components/primitive/Block";

import styles from "./styles.module.css";

function Loader() {
	return (
		<Block className={cn(styles["dr-loader"], "tw-relative tw-inline-block")}>
			<Block />
			<Block />
		</Block>
	);
}

export default Loader;
