import type { NextApiRequest, NextApiResponse } from 'next'
import { PRODUCT_SUB_PATH } from '../../src/utils/endpoints'

/**
 * Rigenerazione ISR on-demand. Chiamato dal webhook WooCommerce al salvataggio/cambio
 * stock o prezzo di un prodotto: rigenera SOLO la pagina interessata (stock/prezzo
 * freschi) senza un rebuild completo. Protetto da secret.
 *
 * Query:
 *   ?secret=...  (obbligatorio) e UNO tra:
 *     - slug=<slug>&lang=<it|en>  -> rigenera la scheda prodotto (/products/<slug> o /en/products/<slug>)
 *     - path=<percorso>           -> rigenera un percorso arbitrario (es. /, /occhiali-da-sole)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (!process.env.REVALIDATE_SECRET || req.query.secret !== process.env.REVALIDATE_SECRET) {
		return res.status(401).json({ message: 'Invalid token' })
	}

	const slug = req.query.slug as string | undefined
	const lang = (req.query.lang as string | undefined) ?? 'it'
	const path = req.query.path as string | undefined
	const prefix = lang === 'it' ? '' : `/${lang}`

	const paths = path
		? [path]
		: slug
			? [`${prefix}/${PRODUCT_SUB_PATH}/${slug}`]
			: []

	if (!paths.length) {
		return res.status(400).json({ message: 'Provide "slug" (+lang) or "path"' })
	}

	// allSettled: una rigenerazione fallita non blocca le altre ne rompe il webhook.
	const results = await Promise.allSettled(paths.map((p) => res.revalidate(p)))
	const revalidated = paths.filter((_, i) => results[i].status === 'fulfilled')

	return res.json({ revalidated, failed: paths.filter((p) => !revalidated.includes(p)) })
}
