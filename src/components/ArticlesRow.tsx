import {Article, WPArticle} from "../types/woocommerce";
import SectionTitle from "./SectionTitle";
import ArticleCard from "./ArticleCard";
import {Grid} from "@mui/material";
import {useRouter} from "next/router";
import {WORDPRESS_API_ENDPOINT} from "../utils/endpoints";
import {mapArticle} from "../utils/mappers";
import {useState, useEffect} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";

type ArticlesRowProps = {
	postsByCategory: {
		type: string
		id: number
		posts: Article[]
	}
}

const ArticlesRow = ({ postsByCategory }: ArticlesRowProps) => {
	const {locale} = useRouter()
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const queryClient = useQueryClient();

	const fetchPosts = (page: number) => {
		return fetch(`${ WORDPRESS_API_ENDPOINT}/posts?lang=${locale}&page=${page}&per_page=4&categories=${postsByCategory.id}`)
			.then(response => response.json())
			.then(data => {
				if (data.length === 0) {
					setTotalPages(page - 1);
				}
				else if (data.length < 4) {

					setTotalPages(page);
				}
				return data.map(mapArticle);
			})
			.catch((error) => {
				// If we get an error (which means the page is too large), we set totalPages to the current page
				setTotalPages(page - 1);
				return []
			});
	};

	const {
		isLoading,
		isError,
		error,
		data,
		isFetching,
		isPreviousData
	} = useQuery(['posts', postsByCategory.id, page], () => fetchPosts(page), {
		keepPreviousData: true,
		initialData: postsByCategory.posts,
	});

	// Prefetch the next page and check if it's the last page!
	useEffect(() => {
		if (data) {
			queryClient.prefetchQuery(['posts', postsByCategory.id, page + 1], () => fetchPosts(page + 1))
		}
	}, [data, page, postsByCategory.id, queryClient, locale]);

	return (
		<div style={{marginTop: '20px'}}>
			<SectionTitle
				title={postsByCategory.type}
				onPrev={() => setPage(old => Math.max(old - 1, 0))}
				disablePrev={page === 1}
				onNext={() => {
					if (!isPreviousData) {
						setPage(old => old + 1)
					}
				}}
				disableNext={totalPages ? page >= totalPages : false}
				isLoading={!isPreviousData && isFetching}
			/>
			<Grid container spacing={2}>
				{data?.map((post:  Article) => (
					<Grid key={post.id} item xs={6} md={3}>
						<ArticleCard key={post.id} article={post} />
					</Grid>
				))}
			</Grid>
		</div>
	)
}

export default ArticlesRow;