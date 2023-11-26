import * as React from "react";

import { Link, Block, Text, InlineText, Title } from "~/components/primitive";
import { Render } from "~/components/shared";
import { useQuery } from "~/hooks";
import type { T_ReactElement } from "~/types";

import BlogService, { T_BlogPost } from "./service";

function Blog(): T_ReactElement {
	// hooks
	const { isLoading, error, data } = useQuery<T_BlogPost[]>("blog", BlogService.fetchPosts);

	return (
		<Render
			isLoading={isLoading}
			error={error}
			data={data}
		>
			{(posts): T_ReactElement => {
				return (
					<Block className="tw-flex tw-flex-wrap tw-justify-between">
						{posts.map((post) => {
							return (
								<BlogEntry
									key={post.slug}
									slug={post.slug}
									title={post.title}
									categories={post.categories}
									publishedAt={post.publishedAt}
									isPublished={post.isPublished}
									locales={post.locales}
									thumbnail={post.thumbnail}
								/>
							);
						})}
					</Block>
				);
			}}
		</Render>
	);
}

export default Blog;
