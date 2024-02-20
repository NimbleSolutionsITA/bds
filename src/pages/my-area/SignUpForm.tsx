import { useMutation, gql } from "@apollo/client";
import Link from "next/link";
import {TextField, Typography, Button, CircularProgress} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";

const REGISTER_USER = gql`
    mutation registerUser(
        $email: String!
        $firstName: String!
        $lastName: String!
    ) {
        registerUser(
            input: {
                username: $email
                email: $email
                firstName: $firstName
                lastName: $lastName
            }
        ) {
            user {
                databaseId
            }
        }
    }
`;

export default function SignUpForm() {
	const [register, { data, loading, error }] = useMutation(REGISTER_USER);
	const wasSignUpSuccessful = Boolean(data?.registerUser?.user?.databaseId);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const values = Object.fromEntries(data);
		register({
			variables: values,
		}).catch(error => {
			console.error(error);
		});
	}

	if (wasSignUpSuccessful) {
		return (
			<p>
				Thanks! Check your email – an account confirmation link has been sent to you.
			</p>
		)
	}

	return (
		<form method="post" onSubmit={handleSubmit} style={{padding: '40px 0'}}>
			<Typography textAlign="center" variant="h2" sx={{mt: '20px', fontWeight: 'bold'}}>Registrati</Typography>
			<fieldset disabled={loading} aria-busy={loading} style={{border: 'none', padding: 0}}>
				<TextField
					fullWidth
					variant="outlined"
					label={"First Name"}
					type="text"
					name="firstName"
					autoComplete="given-name"
					required
					sx={{mt: '20px'}}
				/>
				<TextField
					fullWidth
					variant="outlined"
					label={"Last Name"}
					type="text"
					name="lastName"
					autoComplete="family-name"
					required
					sx={{mt: '20px'}}
				/>
				<TextField
					fullWidth
					variant="outlined"
					label={"Email"}
					type="email"
					name="email"
					autoComplete="username"
					required
					sx={{mt: '20px'}}
				/>
				{error ? (
					(error.message.includes('wp-login.php') ? (
						<Typography color="red">
							You&#39;re already signed up! <Link href="/my-area">Log in</Link>
						</Typography>
					) : (
						<HtmlBlock html={error.message} sx={{color: 'red'}} />
					))
				) : null}
				<Button
					type="submit"
					fullWidth
					disabled={loading} sx={{m: '20px 0'}}
					endIcon={loading ? <CircularProgress size="20px" /> : undefined}
				>
					{loading ? 'Signing up...' : 'Sign up'}
				</Button>
			</fieldset>
			<p>
				Already have an account? <Link href="/my-area">Log in</Link>
			</p>
		</form>
	);
}