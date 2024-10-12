import {Button, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useFormContext} from "react-hook-form";
import {FormFields} from "./CheckoutGrid";
import usePayPalCheckout from "../../components/PayPalCheckoutProvider";

const CartAddressRecap = () => {
	const { watch, setValue } = useFormContext<FormFields>();
	const { billing, shipping, has_shipping } = watch()

	const shippingAddress = getAddressString(has_shipping ? shipping : billing);
	const billingAddress = getAddressString(billing);
	const { t } = useTranslation('common')

	return (
		<TableContainer sx={{padding: '10px 20px', border: '1px solid rgba(0,0,0,0.1)'}}>
			<Table>
				<TableBody sx={{
					'& td': { padding: '8px 0' },
					'& tr:last-child td': { border: 0 }
				}}>
					<RecapRow
						label={t('checkout.contact')}
						value={`${billing.email}`}
						edit={() => {
							setValue('addressTab', 0)
							setValue('step', 'ADDRESS')
						}}
					/>
					<RecapRow
						label={t('checkout.ship-to')}
						value={shippingAddress ?? billingAddress}
						edit={() => {
							setValue('addressTab', shippingAddress ? 1 : 0)
							setValue('step', 'ADDRESS')
						}}
					/>
					{shippingAddress && (
						<RecapRow
							label={t('checkout.bill-to')}
							value={billingAddress}
							edit={() => {
								setValue('addressTab', 0)
								setValue('step', 'ADDRESS')
							}}
						/>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export const getAddressString = (address: any) => {
	return `${address.address_1}, ${address.postcode}, ${address.city} ${address.state}, ${address.country}`
}

const EditButton = ({onClick}: {onClick: () => void}) => {
	const {isPaying} = usePayPalCheckout()
	const { t } = useTranslation('common')
	return (
		<Button
			sx={{textTransform: 'none', textDecoration: 'underline', padding: 0, minWidth: 0, fontWeight: 300}}
			size="small"
			variant="text"
			color="primary"
			onClick={onClick}
			disabled={isPaying}
		>
			{t('edit')}
		</Button>
	)
}

const RecapRow = ({label, value, edit}: {label: string, value: string, edit: () => void}) => (
	<TableRow>
		<TableCell sx={{color: 'rgba(0,0,0,0.4)', width: '80px'}}>{label}</TableCell>
		<TableCell sx={{fontWeight: 300}}>
			{value}
		</TableCell>
		<TableCell sx={{width: '80px'}} align="right"><EditButton onClick={edit} /></TableCell>
	</TableRow>
)

export default CartAddressRecap