import {Dispatch, SetStateAction} from "react";
import ErrorDialog from "../../components/ErrorDialog";

const PaymentErrorDialog = ({ error, setError}: {error?: string, setError: Dispatch<SetStateAction<string|undefined>>}) => (
	<ErrorDialog
		open={!!error}
		message={error}
		onClose={() => setError(undefined)}
	/>
)

export default PaymentErrorDialog
