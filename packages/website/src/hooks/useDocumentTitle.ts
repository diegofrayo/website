import { useEffect } from "react";

function useDocumentTitle(title?: string): void {
  useEffect(
    function changeDocumentTitle() {
      if (!title) return;

      document.title = title;
    },
    [title],
  );
}

export default useDocumentTitle;
