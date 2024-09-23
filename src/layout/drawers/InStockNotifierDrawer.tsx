import {
	Button,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	SwipeableDrawer,
	TextField,
	Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeInStockNotifierDrawer} from "../../redux/layoutSlice";
import {RootState} from "../../redux/store";
import Link from "../../components/Link";
import {CloseSharp} from "@mui/icons-material";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import MarkEmailReadSharpIcon from '@mui/icons-material/MarkEmailReadSharp';
import { Trans, useTranslation } from 'react-i18next';

type Inputs = {
	name: string,
	email: string
};

const InStockNotifierDrawer = () => {
	const { inStockNotifierDrawer: { open, variationId, productId, name, category, attributes } } = useSelector((state: RootState) => state.layout);
	const { t } = useTranslation('common');
	const { control, handleSubmit, formState: { errors } } = useForm<Inputs>({
		defaultValues: {
			name: '',
			email: ''
		},
		reValidateMode: 'onSubmit'
	});

	const {isPending: isLoading, isError, error, isSuccess, mutate, reset} = useMutation({
		mutationKey: ['inStockNotifier', productId, variationId],
		mutationFn: async (data: Inputs) => {
			const response = await fetch(NEXT_API_ENDPOINT + '/in-stock-notifier?' + new URLSearchParams({
				product_id: productId ? productId.toString() : '',
				variation_id: variationId?.toString() ?? '',
				subscriber_name: data.name,
				email: data.email
			})).then(response => response.json());
			if (response.data?.status) {
				throw new Error(response.message ?? 'Server error');
			}
			return response;
		}
	});

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		mutate(data);
	}
	const dispatch = useDispatch()

	const handleClose = () => {
		dispatch(closeInStockNotifierDrawer())
		reset()
	}
	return (
		<SwipeableDrawer
			anchor="right"
			PaperProps={{
				sx: {
					padding: '20px 0',
					height: 'auto',
					top: {
						xs: 0,
						md: '10%'
					},
					right: {
						xs: 0,
						md: '24px'
					},
					width: '400px',
					maxWidth: '100%',
					backgroundColor: '#f1f1f1',
				}
			}}
			open={open}
			onClose={handleClose}
			onOpen={() => {}}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<IconButton onClick={handleClose} sx={{position: 'absolute', right: '20px', top: '2px', padding: '4px'}}>
					<CloseSharp />
				</IconButton>
				<Typography sx={{fontFamily: 'Ogg Roman', fontSize: '22px'}}>
					{category}{category && <br/>}
					{name} {attributes && `(${attributes})`}
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
							{t('notifier.success')}
						</Typography>
					</div>
				) : (
					<>
						<Typography sx={{margin: '25px 0'}}>
							{t('notifier.title')}
						</Typography>
						<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<Controller
								control={control}
								name="name"
								rules={{ required: t('validation.nameRequired') }}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										variant="outlined"
										label={t('name')}
										helperText={errors.name?.message ?? ''}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} md={12}>
							<Controller
								control={control}
								name="email"
								rules={{ required: t('validation.emailRequired'), pattern: {value: /\S+@\S+\.\S+/, message: t('validation.emailValid')} }}
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
								<Trans i18nKey="notifier.consentText" components={[<Link key={0} href="/privacy-policy" />]} />
							</Typography>
						</Grid>
						<Grid item xs={12}>
							{isError && error ? (
								<Typography color="error" sx={{marginTop: '10px'}}>
									{
										// @ts-ignore
										error.message ?? t('error')
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
								{t('notify-me')}
							</Button>
						</Grid>
					</Grid>
				</form>
					</>
				)}
			</Container>
		</SwipeableDrawer>
	)
}

export default InStockNotifierDrawer