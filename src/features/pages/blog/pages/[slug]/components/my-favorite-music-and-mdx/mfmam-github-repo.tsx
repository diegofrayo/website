import { Box, Icon, IconCatalog, Link, Text, Title } from "~/components/primitive";

type MFMAMGitHubRepoProps = {
	name: string;
	url: string;
	description: string;
};

function MFMAMGitHubRepo({ name, url, description }: MFMAMGitHubRepoProps) {
	return (
		<Box
			className="text-center sm:text-left"
			data-markdown-block
		>
			<Link
				variant={Link.variant.SMOOTH}
				className="relative inline-flex items-center rounded-md border border-zinc-300 bg-zinc-100 p-4 pr-8"
				href={url}
				isExternalLink
			>
				<Icon
					icon={IconCatalog.GITHUB_MONO}
					wrapperClassName="mr-3"
					size={24}
					color="text-black"
				/>
				<Box className="flex-1 text-left">
					<Title
						as="h3"
						className="text-base font-bold text-black sm:text-lg"
						variant={Title.variant.UNSTYLED}
					>
						{name}
					</Title>
					<Text className="text-sm">{description}</Text>
				</Box>

				<Icon
					icon={IconCatalog.LINK}
					wrapperClassName="absolute top-2 right-2"
					color="text-black"
				/>
			</Link>
		</Box>
	);
}

export default MFMAMGitHubRepo;
