import {useRouter} from "next/router";
import {Button} from "@mui/material";
import React from "react";

type LanguageButtonProps = {
	onClick?: () => void
	color?: string
}
const LanguageButton = ({onClick, color = 'black'}: LanguageButtonProps) => {
	const {locale, locales, push, asPath} = useRouter()
	const setLanguage = (language: string) => {
		document.cookie = `NEXT_LOCALE=${language}; max-age=31536000; path=/`
		return push(asPath, asPath, {locale: language})
	}
	return (<>
		{locales?.filter(l => l !== locale).map((language) => (
			<Button
				key={language}
				onClick={async () => {
					onClick && onClick()
					await setLanguage(language)
				}}
				sx={{
					minWidth: 0,
					color,
					lineHeight: '12px',
					borderRight: '1px solid black',
				}}
				size="small"
				variant="text"
			>
				{language}
			</Button>
		))}
	</>)
}

export default LanguageButton;