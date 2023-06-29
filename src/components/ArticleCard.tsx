import {ListArticle} from "../types/woocommerce";
import Box from "@mui/material/Box";
import Image from "next/image";
import {Card, CardContent, Typography} from "@mui/material";
import placeholder from "../images/placeholder.jpg";
import blur from "../images/blur.jpg";
import Link from "./Link";
import {formatDistance} from "../utils/utils";
import {useRouter} from "next/router";

type ArticleCardProps = {
	article: ListArticle
	isVertical?: boolean
}

const ArticleCard = ({article, isVertical}: ArticleCardProps) => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	};
	const {locale} = useRouter()
	const formattedDate = formatDistance(new Date(article.date), locale as 'it'|'en');

	return (
		<Card
			sx={{width: '100%', height: 'auto'}}
			elevation={0}
		>
			<Link href={`/dentro-diaries/${article.slug}`}>
				<Box sx={{
					width: '100%',
					paddingBottom: {
						xs: isVertical ?  '100%' : '75%',
						md: isVertical ?  '150%' : '75%',
						lg: isVertical ?  '132%' : '75%',
					},
					position: 'relative'
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
			<CardContent sx={{textAlign: 'center', padding: '16px 0'}}>
				<Typography
					sx={{
						fontFamily: 'Apercu',
						lineHeight: 1.2,
						fontSize: '13px',
					}}
				>
					{article.categories.map(c => c.name.toUpperCase()).join(' | ')}
				</Typography>
				<Link href={`/dentro-diaries/${article.slug}`} sx={{textDecoration: 'none'}}>
					<Typography
						sx={{
							fontFamily: 'Ogg Roman',
							lineHeight: 1.2,
							fontSize: {
								xs: '18px',
								md: isVertical ? '36px' : '22px'
							},
							margin: '5px 0'
						}}
					>
						{article.title}
					</Typography>
				</Link>
				<TextLine text={`By ${article.author.displayName}, ${formattedDate}`} />
				<TextLine text={`${article.minutesRead} minutes read`} />
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

export default ArticleCard;