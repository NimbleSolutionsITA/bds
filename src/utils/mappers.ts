import {Article, ListArticle, WPArticle} from "../types/woocommerce";

export const mapArticle = ({id, image, slug, title, content, translations, link, acf, date, categories_data, tags_data, author_data, excerpt, minutes_read, lang}: WPArticle): Article => ({
	id,
	slug,
	translations,
	link,
	acf,
	title: title.rendered,
	content: content.rendered,
	categories: categories_data,
	tags: tags_data,
	author: {
		displayName: author_data.display_name,
		url: author_data.url ?? '',
	},
	date,
	excerpt: excerpt.rendered,
	image,
	minutesRead: minutes_read,
	lang
})

// Lightweight version for listings: drops heavy `content`, `acf`, `tags`, `link`, `translations`, `lang`
export const mapArticleToListArticle = (article: Article): ListArticle => ({
	id: article.id,
	slug: article.slug,
	title: article.title,
	excerpt: article.excerpt,
	date: article.date,
	minutesRead: article.minutesRead,
	categories: article.categories,
	image: article.image,
	author: article.author,
})