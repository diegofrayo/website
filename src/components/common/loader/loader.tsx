import cn from "@diegofrayo-pkg/cn";

import { Box } from "~/components/primitive";

import styles from "./loader.styles.module.css";

function Loader() {
	return (
		<Box className={cn(styles["dr-loader"], "relative inline-block")}>
			<Box />
			<Box />
		</Box>
	);
}

export default Loader;
