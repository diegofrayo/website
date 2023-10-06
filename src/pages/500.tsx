import * as React from "react";
import ErrorPage from "~/features/pages/ErrorPage";

function Page500Error() {
	return (
		<ErrorPage
			title="500"
			variant="500"
		/>
	);
}

export default Page500Error;
