import * as React from "react";

import { MainLayout, Page } from "~/components/layout";
import {
	Block,
	Button,
	Collapsible,
	Icon,
	InlineText,
	List,
	Pre,
	Space,
	Text,
} from "~/components/primitive";
import { ImageGallery } from "~/components/shared";
import AnalyticsService from "~/modules/analytics";
import { createArray } from "@diegofrayo/utils/arrays-and-objects";
import v from "@diegofrayo/v";

function ArticlesPage() {
	// --- VARS ---
	const ARTICLES = [
		{
			id: "teclado",
			name: "Teclado USB alámbrico marca QBex",
			price: "15.000",
			status: "Nuevo",
			details: "",
			images: 1,
		},
		{
			id: "mouse",
			name: "Mouse gamer alambrico marca Vivitar",
			price: "40.000",
			status: "Nuevo",
			details: "",
			images: 2,
		},
		{
			id: "hdmi-a-vga",
			name: "Conector HDMI a VGA",
			price: "15.000",
			status: "Nuevo",
			details: "",
			images: 1,
		},
		{
			id: "usb-hub",
			name: "USB Hub 2.0",
			price: "10.000",
			status: "Nuevo",
			details: "",
			images: 2,
		},
	];

	// -- HANDLERS ---
	function handleContactViaWhatsAppClick() {
		const url = new URLSearchParams();

		url.append("phone", "+573113728898");
		url.append("text", "Hola, estoy interesado en uno de los artículos que vi en su sitio web");

		window.open(`https://api.whatsapp.com/send?${url.toString()}`, "_blank");
	}

	return (
		<Page
			config={{
				title: "Artículos",
				disableSEO: true,
			}}
		>
			<MainLayout title="Articulos">
				<Text className="tw-text-left">Vendo, intercambio o dono los siguientes artículos:</Text>
				<Space size={2} />

				<Block>
					{ARTICLES.map((article) => {
						return (
							<Collapsible
								key={article.id}
								title={article.name}
								className="tw-mb-2 tw-pb-2 last:tw-mb-0"
								onShowContentHandler={AnalyticsService.trackClickEvent("ARTICULOS|OPEN", {
									article: article.id,
								})}
								onHideContentHandler={AnalyticsService.trackClickEvent("ARTICULOS|CLOSE", {
									article: article.id,
								})}
							>
								<List variant={List.variant.SIMPLE}>
									<List.Item>
										<Text>
											<InlineText is="strong">💰</InlineText>{" "}
											<InlineText>{`${article.price} COP`}</InlineText>
										</Text>
									</List.Item>

									<List.Item>
										<Text>
											<InlineText is="strong">📋</InlineText>{" "}
											<InlineText>{article.status}</InlineText>
										</Text>
									</List.Item>

									{v.isNotEmptyString(article.details) ? (
										<List.Item>
											<Block>
												<Text className="tw-font-bold">Detalles:</Text> <Pre>{article.details}</Pre>
											</Block>
										</List.Item>
									) : null}
								</List>
								<Space size={1} />

								<ImageGallery
									id={article.id}
									className="tw-ml-4"
									images={createArray(article.images, 1).map((item) => {
										return {
											url: `/assets/images/pages/articulos/${article.id}-${item}.jpg`,
											alt: `${article.name} ${item}`,
										};
									})}
								/>
							</Collapsible>
						);
					})}
				</Block>
				<Space
					size={8}
					variant={Space.variant.DASHED}
				/>

				<Block className="tw-text-center">
					<Text>Si está interesado en algún artículo...</Text>
					<Text>👇</Text>
					<Space size={2} />
					<Button
						variant={Button.variant.STYLED}
						onClick={handleContactViaWhatsAppClick}
					>
						<Icon
							icon={Icon.icon.WHATSAPP_MONO}
							size={32}
							wrapperClassName="tw-mr-2"
						/>
						<InlineText>Contactar vía WhatsApp</InlineText>
					</Button>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default ArticlesPage;
