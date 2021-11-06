import React from "react";

function useDocumentTitle(title?: string): void {
  React.useEffect(
    function changeDocumentTitle() {
      if (!title) return;

      document.title = title;
    },
    [title],
  );
}

export default useDocumentTitle;
