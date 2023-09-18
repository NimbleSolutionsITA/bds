import {ListArticle} from "../types/woocommerce";
import Box from "@mui/material/Box";
import Image from "next/image";
import {Card, CardContent, Typography} from "@mui/material";
import blur from "../images/blur.jpg";
import Link from "./Link";
import {formatDistance} from "../utils/utils";
import {useRouter} from "next/router";
import {BLOG_POST_SUB_PATH} from "../utils/endpoints";
import {useTranslation} from "next-i18next";
import HtmlBlock from "./HtmlBlock";

type ArticleCardProps = {
	article: ListArticle
	isVertical?: boolean
}

const ArticleCardMini = ({article}: ArticleCardProps) => {
	const {locale} = useRouter()
	const formattedDate = formatDistance(new Date(article.date), locale as 'it'|'en');
	const { t } = useTranslation('common')
	return (
		<Card
			sx={{width: '100%', height: 'auto', display: 'flex', margin: '10px 0'}}
			elevation={0}
		>
			<Link href={`/${BLOG_POST_SUB_PATH}/${article.slug}`}>
				<Box sx={{
					width: '70px',
					height: '70px',
					position: 'relative',
				}}>
					<Image
						src={article.image.medium}
						alt={article.title}
						fill
						style={{objectFit: 'cover', objectPosition: 'center center'}}
						placeholder="blur"
						blurDataURL={blur.blurDataURL}
					/>
				</Box>
			</Link>
			<CardContent sx={{padding: '0 0 0 10px'}}>
				<Link href={`/${BLOG_POST_SUB_PATH}/${article.slug}`} sx={{textDecoration: 'none'}}>
					<HtmlBlock
						component={Typography}
						html={article.title}
						sx={{
							fontFamily: 'Ogg Roman',
							lineHeight: 1.2,
							fontSize: '16px',
							margin: '5px 0'
						}}
					/>
				</Link>
				<TextLine text={`By ${article.author.displayName}, ${formattedDate}`} />
			</CardContent>

		</Card>
	)
}

const TextLine = ({text}: {text: string}) => (
	<Typography
		sx={{
			fontFamily: 'Apercu',
			lineHeight: 1.2,
			fontSize: '13px',
			margin: '2px 0',
			fontStyle: 'italic'
		}}
	>
		{text}
	</Typography>
)

export default ArticleCardMini;