import * as React from "react";

function useDocumentTitle(title: string): void {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
}

export default useDocumentTitle;
