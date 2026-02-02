import {AcfArticle, Shortcode} from "../../pages/blog/[post]";
import HtmlBlock from "./HtmlBlock";
import ProductCard from "./ProductCard";
import Swiper from "./Swiper";
import React from "react";

const ArticleContent = ({ article }: {article: AcfArticle}) => {// Function to replace shortcodes with components
	const renderContentWithComponents = (content: string, shortcodes?: Shortcode[]) => {
		const regex = /\[\[(.*?)]]/g; // Match [[tagname]]
		const elements = [];
		let lastIndex = 0;

		let match;
		while ((match = regex.exec(content)) !== null) {
			const [shortcode, tagName] = match;
			const startIndex = match.index;

			// Add the HTML content before the shortcode
			if (startIndex > lastIndex) {
				elements.push(content.substring(lastIndex, startIndex));
			}

			// Find the corresponding shortcode object
			const shortcodeData = shortcodes?.find((s: Shortcode) => s.shortcode === tagName);
			if (shortcodeData) {
				elements.push(
					<Swiper key={tagName}>
						{shortcodeData.products?.map((product) =>
							product && <ProductCard product={product} key={product.id} />
						)}
					</Swiper>
				);
			}

			lastIndex = regex.lastIndex;
		}

		// Add the remaining HTML content
		if (lastIndex < content.length) {
			elements.push(content.substring(lastIndex));
		}

		return elements;
	};

	return (
		<div>
			{renderContentWithComponents(article.content, article.acf.shortcodes).map((element, index) => (
				typeof element === "string" ? (
					<HtmlBlock
						key={index}
						html={element}
					/>
				) : (
					element
				)
			))}
		</div>
	);
}

export default ArticleContent