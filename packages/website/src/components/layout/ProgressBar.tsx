import { useRouter } from "next/router";
import NProgress from "nprogress";

import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";

function ProgressBar(): T_ReactElement {
  const router = useRouter();

  useDidMount(() => {
    let timeout: NodeJS.Timeout;

    function showProgressBar() {
      timeout = setTimeout(NProgress.start, 100);
    }

    function hideProgressBar() {
      clearTimeout(timeout);
      NProgress.done();
    }

    router.events.on("routeChangeStart", showProgressBar);
    router.events.on("routeChangeComplete", hideProgressBar);
    router.events.on("routeChangeError", hideProgressBar);

    return () => {
      router.events.off("routeChangeStart", showProgressBar);
      router.events.off("routeChangeComplete", hideProgressBar);
      router.events.off("routeChangeError", hideProgressBar);
    };
  });

  return null;
}

export default ProgressBar;
