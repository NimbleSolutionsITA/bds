import useAuth from "../../utils/useAuth";
import {useForm} from "react-hook-form";
import {Button, CircularProgress, Container, FormControlLabel, Switch, TextField} from "@mui/material";
import Loading from "../../components/Loading";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ProfileForm() {
	const { customer, updateCustomer, isUpdating: loading } = useAuth();
	const onValid = (data: any) => {
		let { editPassword, passwordConfirm, password, ...customerData } = data
		if (editPassword && password && password === passwordConfirm) {
			customerData.password = password
		}
		updateCustomer(customerData)
	}
	return customer ? <Form customer={customer} onValid={onValid} loading={loading} /> : <Loading />
}

function Form({customer, onValid, loading}: {customer: any, onValid: any, loading: boolean}) {
	const { t } = useTranslation('common')
	const profileForm = useForm(
		{
			defaultValues: {
				first_name: customer?.first_name,
				last_name: customer?.last_name,
				email: customer?.email,
				editPassword: false,
				password: '',
				passwordConfirm: '',
			}
		}
	)
	return (
		<Container maxWidth="xs">
			<form
				onSubmit={profileForm.handleSubmit(onValid)}
				style={{display: 'flex', flexDirection: 'column', maxWidth: '550px', margin: '20px auto'}}
			>
				<TextField
					fullWidth
					variant="outlined"
					label={"First Name"}
					type="text"
					autoComplete="given-name"
					required
					sx={{mt: '20px'}}
					{...profileForm.register('first_name')}
				/>
				<TextField
					fullWidth
					variant="outlined"
					label={"Last Name"}
					type="text"
					autoComplete="family-name"
					required
					sx={{mt: '20px'}}
					{...profileForm.register('last_name')}
				/>
				<TextField
					fullWidth
					variant="outlined"
					label={"Email"}
					type="email"
					autoComplete="username"
					required
					sx={{mt: '20px'}}
					{...profileForm.register('email')}
				/>
				<FormControlLabel
					sx={{ m: '20px 0 20px auto' }}
					control={<Switch {...profileForm.register('editPassword')} />}
					label="Edit password"
					labelPlacement={"start"}
				/>
				{profileForm.watch('editPassword') && (
					<>
						<TextField
							fullWidth
							variant="outlined"
							label={"Password"}
							type="password"
							autoComplete="new-password"
							required
							sx={{m: '20px 0 10px'}}
							{...profileForm.register('password')}
						/>
						<TextField
							fullWidth
							variant="outlined"
							label={"Confirm password"}
							type="password"
							autoComplete="new-password"
							required
							sx={{m: '20px 0 30px'}}
							{...profileForm.register('passwordConfirm')}
						/>
					</>
				)}
				<Button
					endIcon={loading ? <CircularProgress size="20px" /> : undefined}
					sx={{mt: '20px'}}
					fullWidth
					type="submit"
					disabled={loading}
				>
					{t('save')}
				</Button>
			</form>
		</Container>
	);
}