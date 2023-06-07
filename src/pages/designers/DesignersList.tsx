import {WooProductCategory} from "../../types/woocommerce";
import {Container, TextField} from "@mui/material";
import {useState} from "react";
import CategoryListBox from "../../components/CategoryListBox";

type DesignersListProps = {
	designers: WooProductCategory[]
}
const DesignersList = ({ designers }: DesignersListProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	return (
		<>
			<Container maxWidth="md" sx={{textAlign: 'center', padding: '24px 0 64px'}}>
				<TextField
					label="Cerca"
					placeholder="Cerca un designer"
					color="primary"
					variant="standard"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Container>
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