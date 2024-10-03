import {Container, Modal} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {closeSearchDrawer, openSearchDrawer} from "../../redux/layoutSlice";
import React from "react";
import {useTranslation} from "next-i18next";
import {WooProductCategory} from "../../types/woocommerce";
import SearchLayout from "../../pages/search/SearchLayout";

type SearchDrawerProps = {
	categories: WooProductCategory[],
}

const SearchModal = ({ categories }: SearchDrawerProps) => {
	const { searchDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	const { t } = useTranslation('common')
	return (
		<Modal
			open={searchDrawerOpen}
			onClose={() => dispatch(closeSearchDrawer())}
			sx={{
				backgroundColor: '#f1f1f1',
				width: '100%',
				top: {
					xs: '70px',
					md: '140px'
				},
				height: {
					xs: 'calc(100% - 70px)',
					md: 'calc(100% - 140px)'
				},
				zIndex: (theme) => theme.zIndex.appBar - 1,
				overflowY: 'scroll',
			}}
			hideBackdrop
		>
			<Container sx={{display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', padding: '40px'}}>
				<SearchLayout categories={categories} />
			</Container>
		</Modal>
	)
}
export default SearchModal