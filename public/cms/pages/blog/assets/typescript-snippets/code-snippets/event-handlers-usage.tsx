// ###### onClick event handlers ######

function Button() {
	// way 1
	function handleClick(event: T_ReactOnClickEventObject<HTMLButtonElement>): void {
		console.log(event);
	}

	// way 2
	const handleClick: T_ReactOnClickEventHandler<HTMLButtonElement> = function handleClick(event) {
		console.log(event);
	};

	return <button onClick={handleClick}>my button</button>;
}

// ###### "mouse" event listeners ######

function useClickOutside(ref: T_ReactRef<HTMLElement>, callback: () => void): void {
	// effects
	React.useEffect(() => {
		const controller = new AbortController();

		document.addEventListener(
			"mousedown",
			function handleClickOutside(event: MouseEvent): void {
				if (
					isDOMNode(event.target) &&
					!isNull(ref.current) &&
					isNotTrue(ref.current.contains(event.target))
				) {
					callback();
				}
			},
			{ signal: controller.signal },
		);

		return () => {
			controller.abort();
		};
	}, [ref, callback]);

	// utils
	function isDOMNode(element: unknown): element is Node {
		return "nodeType" in (element || {});
	}
}

// ###### "scroll" event listeners ######

type T_Callback = (event: Event) => void;

function useOnWindowScroll(callback: T_Callback, when = true): void {
	// states & refs
	const savedHandler = React.useRef<T_Callback>(callback);

	// effects
	React.useEffect(() => {
		savedHandler.current = callback;
	});

	React.useEffect(() => {
		if (!when) {
			return () => undefined;
		}

		const passedCb: EventListener = (event: Event) => {
			savedHandler.current(event);
		};

		window.addEventListener("scroll", passedCb);

		return () => {
			window.removeEventListener("scroll", passedCb);
		};
	}, [when]);
}
