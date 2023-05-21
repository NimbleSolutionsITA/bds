import {
	Button,
	Grid,
	TextField,
	Typography,
	CircularProgress
} from "@mui/material";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import {useMutation} from "@tanstack/react-query";
import MarkEmailReadSharpIcon from '@mui/icons-material/MarkEmailReadSharp';
import Link from "../../components/Link";

type InStockNotifierProps = {
	productId: number
	variationId?: number
}

type Inputs = {
	name: string,
	email: string
};
const InStockNotifier = ({ productId, variationId }: InStockNotifierProps) => {
	const { control, handleSubmit, formState: { errors } } = useForm<Inputs>({
		defaultValues: {
			name: '',
			email: ''
		},
		reValidateMode: 'onSubmit'
	});

	const {isLoading, isError, error, isSuccess, mutate} = useMutation(
		async (data: Inputs) => {
			const response = await fetch(NEXT_API_ENDPOINT + '/in-stock-notifier?' + new URLSearchParams({
				product_id: productId.toString(),
				variation_id: variationId?.toString() ?? '',
				subscriber_name: data.name,
				email: data.email
			})).then(response => response.json());
			if (response.data?.status) {
				throw new Error(response.message ?? 'Server error');
			}
			return response;
		}
	);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		mutate(data);
	}

	return (
		<div>
			<Typography sx={{margin: '20px 0'}}>
				Se lo desideri, possiamo ordinarlo per te e avvisarti quando sarà di nuovo disponibile
			</Typography>

			{isSuccess ? (
				<div style={{
					width: '100%',
					display: 'flex',
					textAlign: 'center',
					flexDirection: 'column',
					padding: '10px 0'
				}}>
					<MarkEmailReadSharpIcon sx={{fontSize: '80px', margin: '0 auto'}} />
					<Typography sx={{
						fontStyle: 'italic',
						fontSize: '12px',
						lineHeight: '1.2'
					}}>
						Richiesta inviata con succcesso,<br />
						riceverai un messaggio appena il prodotto sarà di nuovo disponibile
					</Typography>
				</div>
				) : (
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Controller
								control={control}
								name="name"
								rules={{ required: 'Name is required' }}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										variant="outlined"
										label="Nome"
										helperText={errors.name?.message ?? ''}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller
								control={control}
								name="email"
								rules={{ required: 'Email Address is required', pattern: {value: /\S+@\S+\.\S+/, message: 'Entered a valid email'} }}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										variant="outlined"
										label="Email"
										helperText={errors.email?.message ?? ''}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography sx={{fontStyle: 'italic'}}>
								Con questa richiesta, confermi di aver letto la <Link href="/privacy-plicy" >Privacy Policy</Link> e acconsenti al trattamento dei tuoi dati personali per finalità di marketing.
							</Typography>
						</Grid>
						<Grid item xs={12}>
							{isError && error ? (
								<Typography color="error" sx={{marginTop: '10px'}}>
									{
										// @ts-ignore
										error.message ?? 'Errore'
									}
								</Typography>
							) : null}
							<Button
								startIcon={isLoading && <CircularProgress thickness={10} size={20} />}
								disabled={isLoading}
								fullWidth
								type="submit"
								sx={{marginTop: '20px'}}
							>
								Avisami
							</Button>
						</Grid>
					</Grid>
				</form>
			)}
		</div>
    )
}

export default InStockNotifier