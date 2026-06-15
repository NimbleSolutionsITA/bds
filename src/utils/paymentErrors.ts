/**
 * Traduce gli errori di pagamento PayPal (codici tecnici come INSTRUMENT_DECLINED,
 * messaggi grezzi, oggetti errore del SDK Card Fields) in messaggi leggibili e
 * localizzati per l'utente, con un fallback generico.
 */

// Codice issue PayPal (uppercase) -> chiave i18n sotto "checkout.errors".
const PAYPAL_ERROR_KEYS: { code: string; key: string }[] = [
	// Errori token/validazione Google Pay (es. token non decifrabile o 3DS step-up
	// non completato): la carta puo essere valida, quindi NON mostrare "carta non valida".
	{ code: 'GOOGLE_PAY', key: 'not_authorized' },
	{ code: 'INSTRUMENT_DECLINED', key: 'instrument_declined' },
	{ code: 'INSUFFICIENT_FUNDS', key: 'insufficient_funds' },
	{ code: 'CARD_EXPIRED', key: 'card_expired' },
	{ code: 'EXPIRED_CARD', key: 'card_expired' },
	{ code: 'INVALID_SECURITY_CODE', key: 'invalid_card' },
	{ code: 'INVALID_NUMBER', key: 'invalid_card' },
	{ code: 'VALIDATION_ERROR', key: 'invalid_card' },
	{ code: 'PAYER_ACTION_REQUIRED', key: 'authentication_failed' },
	{ code: 'AUTHENTICATION', key: 'authentication_failed' }, // 3DS: AUTHENTICATION_FAILURE/REQUIRED
	{ code: 'PAYER_CANNOT_PAY', key: 'transaction_refused' },
	{ code: 'TRANSACTION_REFUSED', key: 'transaction_refused' },
	{ code: 'PAYMENT_DENIED', key: 'transaction_refused' },
	{ code: 'DECLINED', key: 'instrument_declined' }, // capture status DECLINED
	{ code: 'FORM_INVALID', key: 'form_invalid' },
];

/**
 * Estrae una stringa "ricercabile" dalle varie forme con cui arrivano gli errori
 * PayPal: stringa pura, Error.message, error.code, error.details[].issue.
 */
const extractErrorCode = (error: unknown): string => {
	if (!error) return '';
	if (typeof error === 'string') return error;
	const e = error as Record<string, any>;
	const issue = Array.isArray(e.details) ? e.details.map((d: any) => d?.issue).join(' ') : '';
	return [e.code, e.name, e.message, issue].filter(Boolean).join(' ');
};

export const getPaymentErrorMessage = (
	error: unknown,
	t: (key: string) => string
): string => {
	const haystack = extractErrorCode(error).toUpperCase();
	const match = PAYPAL_ERROR_KEYS.find(({ code }) => haystack.includes(code));
	return t(`checkout.errors.${match ? match.key : 'generic'}`);
};

export default getPaymentErrorMessage;
