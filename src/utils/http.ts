/**
 * Piccolo client HTTP basato su fetch che imita la superficie di axios usata nel
 * progetto: ritorna `{ data, status, headers }` in caso di successo e lancia un
 * errore con `.response = { data, status }` su risposte non-2xx (così la gestione
 * errori esistente che legge `error.response.data` continua a funzionare).
 * Sostituisce la dipendenza axios.
 */

export type HttpRequestConfig = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	url: string;
	headers?: Record<string, string>;
	data?: any;
	auth?: { username: string; password: string };
	// Accettati per compatibilità con i vecchi config axios, ma ignorati.
	responseType?: string;
	responseEncoding?: string;
};

export type HttpResponse<T = any> = {
	data: T;
	status: number;
	headers: Headers;
};

export async function httpRequest<T = any>(
	config: HttpRequestConfig
): Promise<HttpResponse<T>> {
	const headers: Record<string, string> = { ...(config.headers ?? {}) };

	if (config.auth) {
		headers["Authorization"] =
			"Basic " + btoa(`${config.auth.username}:${config.auth.password}`);
	}

	const hasBody = config.data !== undefined && config.data !== null;
	if (hasBody && !headers["Content-Type"]) {
		headers["Content-Type"] = "application/json";
	}

	const response = await fetch(config.url, {
		method: config.method ?? "GET",
		headers,
		...(hasBody
			? { body: typeof config.data === "string" ? config.data : JSON.stringify(config.data) }
			: {}),
	});

	const text = await response.text();
	let data: any = null;
	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			data = text;
		}
	}

	if (!response.ok) {
		const error: any = new Error(data?.message ?? response.statusText);
		error.response = { data, status: response.status, headers: response.headers };
		error.code = data?.code;
		throw error;
	}

	return { data, status: response.status, headers: response.headers };
}

export default httpRequest;
