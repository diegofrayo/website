import { Box, Icon, Link, Paragraph, Title } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

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
					name={IconCatalog.GITHUB_MONO}
					className="mr-3 text-black"
					size={24}
				/>
				<Box className="flex-1 text-left">
					<Title
						as="h3"
						className="text-base font-bold text-black sm:text-lg"
						variant={Title.variant.UNSTYLED}
					>
						{name}
					</Title>
					<Paragraph className="text-sm">{description}</Paragraph>
				</Box>

				<Icon
					name={IconCatalog.LINK}
					className="absolute top-2 right-2 text-black"
				/>
			</Link>
		</Box>
	);
}

export default MFMAMGitHubRepo;
