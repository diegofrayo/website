import * as React from "react";

function BlogContent({ content }: Record<string, any>): any {
  return <article className="tw-prose tw-max-w-full">{content}</article>;
}

export default BlogContent;
