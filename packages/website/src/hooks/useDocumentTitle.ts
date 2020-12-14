import { useEffect } from "react";

function useDocumentTitle(title?: string): void {
  useEffect(() => {
    if (!title) return;

    document.title = title;
  }, [title]);
}

export default useDocumentTitle;
