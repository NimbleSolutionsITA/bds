import {WooProductCategory} from "../../types/woocommerce";
import CategoryListBox from "../../components/CategoryListBox";
import {PROFUMUM_ROMA_CATEGORY} from "../../utils/utils";
import {LIQUIDES_IMAGINAIRES_SUB_PATH, PROFUMUM_ROMA_SUB_PATH} from "../../utils/endpoints";

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
				subpath={[PROFUMUM_ROMA_CATEGORY.it, PROFUMUM_ROMA_CATEGORY.en].includes(fragrance.parent ?? 0) ? PROFUMUM_ROMA_SUB_PATH : LIQUIDES_IMAGINAIRES_SUB_PATH}
			/>
		)}
	</>
)

export default FragrancesList