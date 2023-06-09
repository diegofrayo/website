import * as React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Text, InlineText, Title } from "~/components/primitive";
import { Render } from "~/components/shared";
import { AuthService } from "~/features/auth";
import { useQuery } from "~/hooks";
import { T_Locale, useTranslation } from "~/features/i18n";
import { getFormattedDatesDifference } from "~/utils/dates";
import { ROUTES } from "~/features/routing";
import { isDevelopmentEnvironment } from "~/utils/app";
import type { T_ReactElement } from "~/types";

import BlogService, { T_BlogPost } from "./service";

function Blog(): T_ReactElement {
	// --- HOOKS ---
	const { isLoading, error, data } = useQuery<T_BlogPost[]>("blog", BlogService.fetchPosts);
	const { t } = useTranslation();

	return (
		<Page
			config={{
				title: t("seo:title"),
				description: t("seo:description"),
				pathname: ROUTES.BLOG,
				disableSEO: Boolean(t("page:config:is_seo_disabled")),
			}}
		>
			<MainLayout title={t("seo:title")}>
				<Render
					isLoading={isLoading}
					error={error}
					data={data}
				>
					{(posts): T_ReactElement => {
						return (
							<Block className="tw-flex tw-flex-wrap tw-justify-between">
								{posts
									.filter((post: T_BlogPost) => {
										return (
											isDevelopmentEnvironment() || AuthService.isUserLoggedIn() || post.isPublished
										);
									})
									.map((post) => {
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
			</MainLayout>
		</Page>
	);
}

export default Blog;

// --- COMPONENTS ---

type T_BlogEntryProps = Pick<
	T_BlogPost,
	"title" | "categories" | "slug" | "publishedAt" | "locales" | "thumbnail" | "isPublished"
>;

function BlogEntry({
	slug,
	title,
	categories,
	publishedAt,
	locales,
	thumbnail,
	isPublished,
}: T_BlogEntryProps): T_ReactElement {
	// --- HOOKS ---
	const { t } = useTranslation();
	const { locale } = useRouter();

	// --- UTILS ---
	function getLocale(): T_Locale {
		return locales.find((l) => l === locale) || locales[0];
	}

	return (
		<Block
			is="article"
			className="tw-my-8 tw-w-full dfr-shadow sm:tw-w-5/12"
		>
			<Link
				href={`${ROUTES.BLOG}/${slug}`}
				variant={Link.variant.SIMPLE}
				locale={getLocale()}
				className="tw-flex tw-h-full tw-w-full tw-flex-col"
			>
				<Block
					is="header"
					className="tw-h-[280px] tw-bg-cover tw-bg-center tw-bg-no-repeat sm:tw-h-[140px]"
					style={{ backgroundImage: `url('${thumbnail}')` }}
				/>
				<Block
					is="footer"
					className="tw-relative tw-flex-1 tw-pb-8 tw-pt-2"
				>
					<Title
						is="h1"
						variant={Title.variant.SECONDARY}
						className="tw-px-2"
					>
						{title}
					</Title>
					<Block className="tw-px-2">
						{categories.map((category) => {
							return (
								<InlineText
									key={category.id}
									className={classNames(
										"tw-mr-1 tw-inline-block tw-px-2 tw-py-1 tw-text-xs tw-font-semibold dfr-text-color-gs-white",
										category.color,
									)}
								>
									{category.value}
								</InlineText>
							);
						})}
					</Block>
					<Block className="tw-absolute tw-bottom-0 tw-flex tw-w-full tw-items-end tw-justify-end tw-px-2 tw-py-2">
						<Text className="tw-text-right tw-text-xs tw-italic dfr-text-color-secondary">
							{isPublished ? (
								<React.Fragment>
									<InlineText>{t("page:published_at")} </InlineText>
									<InlineText is="strong">
										{getFormattedDatesDifference(publishedAt, new Date())}
									</InlineText>
								</React.Fragment>
							) : (
								"Draft 📝"
							)}
						</Text>
					</Block>
				</Block>
			</Link>
		</Block>
	);
}
