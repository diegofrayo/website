import useDidMount from "./useDidMount";

function useOnWindowStopScroll({
  onScrollStoppedCallback,
  onScrollCallback = (): void => undefined,
  timeout = 3000,
}: {
  onScrollStoppedCallback: () => void;
  onScrollCallback?: () => void;
  timeout?: number;
}): any {
  let isScrolling = 0;
  let mounted = false;

  useDidMount(() => {
    mounted = true;
    window.addEventListener("scroll", onScroll, false);
  });

  function onScrollStopped() {
    if (!mounted) return;
    onScrollStoppedCallback();
  }

  function onScroll() {
    window.clearTimeout(isScrolling);

    onScrollCallback();

    isScrolling = window.setTimeout(() => {
      onScrollStopped();
    }, timeout);
  }

  return () => {
    mounted = false;
    window.removeEventListener("scroll", onScroll, false);
  };
}

export default useOnWindowStopScroll;
