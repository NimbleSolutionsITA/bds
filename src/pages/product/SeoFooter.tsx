import {Container} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import {ProductCategory} from "../../types/woocommerce";

type SeoFooterProps = {
	category: ProductCategory
}
const SeoFooter = ({category}: SeoFooterProps) => {
	return (
		<Container maxWidth="lg" sx={{marginBottom: '40px'}}>
			{category.bottomText && (
				<HtmlBlock html={category.bottomText}/>
			)}
		</Container>
	)
}

export default SeoFooter