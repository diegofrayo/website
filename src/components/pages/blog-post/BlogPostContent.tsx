import * as React from "react";

function BlogPostContent({ content }: Record<string, any>): any {
  return <article className="tw-prose tw-prose-lg tw-max-w-full">{content}</article>;
}

export default BlogPostContent;
