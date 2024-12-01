import {WooProductCategory} from "../../types/woocommerce";
import {Container, TextField} from "@mui/material";
import {useState} from "react";
import CategoryListBox from "../../components/CategoryListBox";
import {useTranslation} from "next-i18next";

type DesignersListProps = {
	designers: WooProductCategory[]
	subpath?: string
}
const DesignersList = ({ designers, subpath }: DesignersListProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { t } = useTranslation('common');
	const showCompactView = designers.length > 5;
	return (
		<>
			{showCompactView && (
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
			<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
				{designers.filter((category) => {
					const pattern = new RegExp(searchTerm, 'i');
					return pattern.test(category.name);
				}).map((designer, index) =>
					<CategoryListBox
						key={designer.id}
						category={designer}
						index={index}
						subpath={subpath}
						showCompactView={showCompactView}
					/>
				)}
			</div>
		</>
	)
}

export default DesignersList