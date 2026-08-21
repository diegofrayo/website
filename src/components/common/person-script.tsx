import { WEBSITE_METADATA } from "~/constants";

function PersonScript() {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify({
					"@context": "http://schema.org",
					"@type": "Person",
					name: WEBSITE_METADATA.fullName,
					email: WEBSITE_METADATA.email,
					jobTitle: WEBSITE_METADATA.jobTitle,
					url: WEBSITE_METADATA.url,
					address: WEBSITE_METADATA.address,
					sameAs: [
						WEBSITE_METADATA.social.github,
						WEBSITE_METADATA.social.instagram,
						WEBSITE_METADATA.social.linkedin,
						WEBSITE_METADATA.social.x,
					],
				}),
			}}
		/>
	);
}

export default PersonScript;
