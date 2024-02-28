import {useQuery} from "@tanstack/react-query";
import useAuth from "../../utils/useAuth";
import useMyArea from "./useMyArea";
import {useForm} from "react-hook-form";
import {Button, Container, FormControlLabel, Switch, TextField} from "@mui/material";
import Loading from "../../components/Loading";

export default function ProfileForm() {
	const { customer, updateCustomer } = useMyArea();
	const onValid = (data: any) => {
		const { editPassword, passwordConfirm, ...customerData } = data
		updateCustomer(customerData)
	}
	return customer ? <Form customer={customer} onValid={onValid} /> : <Loading />
}

function Form({customer, onValid}: {customer: any, onValid: any}) {
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
				<Button type="submit">Save</Button>
			</form>
		</Container>
	);
}