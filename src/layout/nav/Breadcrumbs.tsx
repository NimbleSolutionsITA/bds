import Link from "../../components/Link";
import {BreadCrumb} from "../../types/settings";
import {Breadcrumbs as MuiBreadcrumbs, Link as MuiLink} from "@mui/material";

type BreadcrumbsProps = {
	breadcrumbs: BreadCrumb[]
}
const Breadcrumbs = ({breadcrumbs}: BreadcrumbsProps) => (
	<div>
		<MuiBreadcrumbs separator=">" aria-label="breadcrumb">
			{breadcrumbs.map(({name, href}, index) => (
				<MuiLink
					underline="hover"
					key={href}
					component={Link}
					href={href}
					color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
				>
					{name}
				</MuiLink>
			))}
		</MuiBreadcrumbs>
	</div>
)

export default Breadcrumbs