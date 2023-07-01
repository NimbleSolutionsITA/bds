import {Attribute, Category} from "../../types/woocommerce";
import ExpansionPanel from "../../components/ExpansionPanel";
import Chip from "../../components/Chip";
type TagPanelProps = {
	title: string
	list: Attribute[] | Category[] | {name: string, slug: string}[]
	isActive: (slug: string) => boolean
	onClick: (slug: string) => void
}
const FilterTextPanel = ({title, list, onClick, isActive}: TagPanelProps) => (
	<ExpansionPanel title={title} fontSize="12px">
		<div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '10px 0'}}>
			{list.map(item => (
				<Chip
					key={item.slug}
					tag={{name: item.name}}
					onClick={() => onClick(item.slug)}
					isActive={isActive(item.slug)}
				/>
			))}
		</div>
	</ExpansionPanel>
)

export default FilterTextPanel