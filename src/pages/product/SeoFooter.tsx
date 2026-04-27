import {Container, Divider} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import {Product, ProductCategory} from "../../types/woocommerce";

type SeoFooterProps = {
	category: ProductCategory
	product?: Product
}
const SeoFooter = ({category, product}: SeoFooterProps) => {
	return (
		<>
			{product?.bottomText && (
				<Container maxWidth="lg" sx={{ marginBottom: "40px" }}>
					<Divider sx={{ marginBottom: "40px" }} />
					<HtmlBlock html={product.bottomText} />
				</Container>
			)}
			<Container maxWidth="lg" sx={{ marginBottom: "40px", visibility: "hidden", height: 0, overflow: "hidden" }}>
				{category.bottomText && (
					<HtmlBlock html={category.bottomText}/>
				)}
			</Container>
		</>
	)
}

export default SeoFooter