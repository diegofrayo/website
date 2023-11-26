function MyBlock({ children, ...props }: T_HTMLElementAttributes["div"]) {
	const [timerInterval, setTimerInterval] = React.useState<T_SetTimeout | null>(null);

	function start(): void {
		setTimerInterval(setInterval(() => {}, 1000));
	}

	function stopInterval() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		setTimerInterval(null);
	}

	return <div {...props}>{children}</div>;
}
