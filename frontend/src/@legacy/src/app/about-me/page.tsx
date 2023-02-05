"use client";

import * as React from "react";

import { Block, Link, Title } from "~/components/primitive";
import v from "~/@diegofrayo/library/v";

import AboutMeBlock from "./(about-me)/components";

function AboutMePage() {
	const DATA = {
		PERSONAL_INFO: {
			shortName: "Diego Rayo",
			age: 29,
		},
		SERVER_URL: "",
	};
	const parentUrl = "/";
	const title = "About me";

	return (
		<Block className="tw-mx-auto tw-max-w-md">
			<Block className="tw-text-center">
				{v.isNotEmptyString(parentUrl) ? (
					<Link
						variant={Link.variant.SIMPLE}
						href={parentUrl}
						className="tw-mb-4 tw-inline-block tw-underline"
					>
						{parentUrl}
					</Link>
				) : null}

				<Title
					is="h1"
					variant={Title.variant.UNSTYLED}
					className="tw-mb-16 tw-text-3xl tw-font-bold tw-uppercase sm:tw-text-6xl"
				>
					{title}
				</Title>
			</Block>
			<AboutMeBlock
				text={`Hi there. My name is ${DATA.PERSONAL_INFO.shortName}, I'm ${DATA.PERSONAL_INFO.age} years old, from Armenia, Quindío, and I work as a Software Developer.`}
				layout="L"
			/>
			<AboutMeBlock
				image={`${DATA.SERVER_URL}/cms/about-me/assets/1.jpg`}
				text="I enjoy bookmark and learning about history, old civilizations, and human behavior. I like playing guitar, coding, hiking, biking, photography, cooking, playing soccer, and table tennis."
				layout="L"
			/>
			<AboutMeBlock
				image={`${DATA.SERVER_URL}/cms/about-me/assets/2.jpg`}
				text="This website is like a digital garden for me, a place to have fun coding, and also to express ideas, thoughts, knowledge, and information that I usually don't post on my social networks. Besides, it is a good place to experiment and learn new things about Software Development."
				layout="R"
			/>
			<AboutMeBlock
				text="Welcome to my space!"
				layout="C"
			/>
		</Block>
	);
}

export default AboutMePage;
