import {ProductTag} from "../../types/woocommerce";
import React, {Dispatch, SetStateAction} from "react";
import {Divider} from "@mui/material";
import ExpansionPanel from "../../components/ExpansionPanel";
import FilterChip from "./FilterChip";
import {SearchParams} from "./ShopLayout";

type TagPanelProps = {
	tags: ProductTag[]
	params: string | string[] | undefined,
	setSearchParams: Dispatch<SetStateAction<SearchParams>>,
	title: string
	name: 'genders' | 'styles' | 'materials' | 'colors'
}
const TagPanel = ({tags, params, setSearchParams, title, name}: TagPanelProps) => {
	return (
		<>
			<Divider light sx={{margin: '5px 0'}} />
			<ExpansionPanel title={title}>
				<div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '10px 0'}}>
					{tags.map(tag => (
						<FilterChip
							key={tag.slug}
							tag={tag}
							onClick={() => {
								const array = Array.isArray(params) ?
									params : [params].filter(v => v !== undefined) as string[]
								if (array.includes(tag.slug)) {
									setSearchParams(params => ({
										...params,
										[name]: array.filter(v => v !== tag.slug)
									}))
								}
								else {
									setSearchParams(params => ({
										...params,
										[name]: [...array, tag.slug]
									}))
								}
							}}
							isActive={params?.includes(tag.slug) ?? false}
						/>
					))}
				</div>
			</ExpansionPanel>
		</>
	)
}

export default TagPanel