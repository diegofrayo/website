import * as React from "react";
import cn from "classnames";

type T_MusicTextNoteProps = {
	children: string;
	className?: string;
};

function MusicTextNote({ children, className }: T_MusicTextNoteProps) {
	return <p className={cn("tw-text-sm tw-italic", className)}>{`"${children}"`}</p>;
}

export default MusicTextNote;
