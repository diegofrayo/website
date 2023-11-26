type T_MyComponentProps = {
	children: T_ReactChildren;
	visible: boolean;
	innerContainerStyles: T_ReactStyles;
	containerAttributes: T_HTMLElementAttributes["div"];
};

function MyComponent({
	children,
	visible,
	innerContainerStyles,
	containerAttributes,
}: T_MyComponentProps): T_ReactElementNullable {
	if (visible) {
		return (
			<div
				{...containerAttributes}
				style={innerContainerStyles}
			>
				{children}
			</div>
		);
	}

	return null;
}

function useMyHook({ callback }: { callback: T_ReactEffectCallback }): {
	index: number;
	setIndex: T_ReactSetState<number>;
	myRef: T_ReactRef<HTMLDivElement>;
} {
	const [index, setIndex] = React.useState(0);
	const myRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(callback, []);

	return {
		index,
		setIndex,
		myRef,
	};
}
