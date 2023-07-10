import {WooProductCategory} from "../../types/woocommerce";
import {Container, TextField} from "@mui/material";
import {useState} from "react";
import CategoryListBox from "../../components/CategoryListBox";
import {useTranslation} from "next-i18next";

type DesignersListProps = {
	designers: WooProductCategory[]
}
const DesignersList = ({ designers }: DesignersListProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { t } = useTranslation('common');
	return (
		<>
			{designers.length > 5 && (
				<Container maxWidth="md" sx={{textAlign: 'center', padding: '24px 0 64px'}}>
					<TextField
						label={t('search')}
						placeholder={t('search-designer')}
						color="primary"
						variant="standard"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</Container>
			)}
			{designers.filter((category) => {
				const pattern = new RegExp(searchTerm, 'i');
				return pattern.test(category.name);
			}).map((designer, index) =>
				<CategoryListBox
					key={designer.id}
					category={designer}
					index={index}
				/>
			)}
		</>
	)
}

export default DesignersList