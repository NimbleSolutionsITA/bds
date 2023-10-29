import Link from "../../components/Link";
import {BreadCrumb} from "../../types/settings";
import {Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";

type BreadcrumbsProps = {
	breadcrumbs: BreadCrumb[]
}
const Breadcrumbs = ({breadcrumbs}: BreadcrumbsProps) => (
	<div style={{overflow: 'hidden'}}>
		<MuiBreadcrumbs separator=">" aria-label="breadcrumb" >
			{breadcrumbs.map(({name, href}, index) => (
				<MuiLink
					underline={index === breadcrumbs.length - 1 ? 'none' : "hover"}
					key={href}
					href={index === breadcrumbs.length - 1 ? undefined : href}
					color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
					component={index === breadcrumbs.length - 1 ? 'span' : Link}
					noWrap
				>
					<HtmlBlock html={name} component="span" />
				</MuiLink>
			))}
		</MuiBreadcrumbs>
	</div>
)

export default Breadcrumbs