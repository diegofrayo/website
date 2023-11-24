import * as React from "react";

function useDocumentTitle(title: string) {
	React.useEffect(() => {
		document.title = title;
	}, [title]);
}

export default useDocumentTitle;
