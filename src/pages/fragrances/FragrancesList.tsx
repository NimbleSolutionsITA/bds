import {WooProductCategory} from "../../types/woocommerce";
import CategoryListBox from "../../components/CategoryListBox";

type FragrancesListProps = {
	fragrances: WooProductCategory[]
}
const FragrancesList = ({ fragrances }: FragrancesListProps) => (
	<>
		{fragrances.map((fragrance, index) =>
			<CategoryListBox
				key={fragrance.id}
				category={fragrance}
				index={index}
			/>
		)}
	</>
)

export default FragrancesList