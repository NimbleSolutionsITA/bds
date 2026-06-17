import {Container} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import {ProductCategory} from "../../types/woocommerce";

type SeoFooterProps = {
	category: ProductCategory
}
const SeoFooter = ({category}: SeoFooterProps) => {
	// Testo SEO in fondo alla scheda prodotto: ora VISIBILE (prima era reso ma
	// nascosto via CSS, quindi inutile per la SEO). Renderizza solo se c'e' testo.
	if (!category.bottomText) return null;
	return (
		<Container maxWidth="lg" sx={{ marginBottom: "40px" }}>
			<HtmlBlock html={category.bottomText}/>
		</Container>
	)
}

export default SeoFooter