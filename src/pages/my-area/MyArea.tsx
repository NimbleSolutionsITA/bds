import React, {useEffect} from "react";
import {Box, Container, Tab, Tabs, Typography} from "@mui/material";
import {TabPanelProps} from "@mui/base";
import ProfileForm from "./ProfileForm";
import {ShippingForm, BillingForm} from "./AddressesForm";
import OrderList from "./OrderList";
import { useSearchParams } from 'next/navigation';

import {Country} from "../../types/woocommerce";

const MyArea = ({countries}: {countries: Country[]}) => {
	const panels = [
		{ label: 'Profile', component: <ProfileForm /> },
		{ label: 'Billing', component: <BillingForm countries={countries} /> },
		{ label: 'Shipping', component: <ShippingForm countries={countries} /> },
		{ label: 'Orders', component: <OrderList /> },
	]
	const params = useSearchParams()
	const tab = params.get('tab') ?? '0'
	const [value, setValue] = React.useState(Number(tab))

	function a11yProps(index: number) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `members-tabpanel-${index}`,
		};
	}
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	useEffect(() => {
		setValue(Number(tab))
	}, [tab]);


	return (
		<React.Fragment>
			<Container sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'divider', display: 'flex', justifyContent: 'center' }}>
				<Tabs value={value} onChange={handleChange} aria-label="member tabs">
					{panels.map((panel, index) => (
						<Tab key={panel.label} label={panel.label} {...a11yProps(index)} />
					))}
				</Tabs>
			</Container>
			{panels.map(({label, component}, index) => (
				<TabPanel key={label} index={index} value={value}>
					{component}
				</TabPanel>
			))}
		</React.Fragment>
	)
}

function TabPanel(props: TabPanelProps & { index: number }) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`members-tabpanel-${index}`}
			aria-labelledby={`member-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					{children}
				</Box>
			)}
		</div>
	);
}

export default MyArea