import {useTranslation} from "next-i18next";
import {Box} from "@mui/material";

const WhatsAppButton = () => {
	const { t } = useTranslation();
	return (
		<Box sx={{position: "fixed", zIndex: 999999, bottom: '30px', right: '15px'}}>
			<a id="wa__widget_simple" className="wa__stt wa__stt_online" target="_blank"
			   href="https://api.whatsapp.com/send?phone=393496393775" rel="nofollow noopener noreferrer">
				<Box
					sx={{
						position: "relative",
						display: 'block',
						background: '#2db742',
						height: '49px',
						width: '49px',
						borderRadius: '50%',
						WebkitBorderRadius: '50%',
						MozBorderRadius: '50%',
						boxShadow: '0 6px 8px 2px rgba(0, 0, 0, .14)',
						WebkitBoxShadow: '0 6px 8px 2px rgba(0, 0, 0, .14)',
						MozBoxShadow: '0 6px 8px 2px rgba(0, 0, 0, .14)',
						'&::before': {
							content: '""',
							height: '100%',
							left: 0,
							position: 'absolute',
							top: 0,
							transition: '.4s',
							WebkitTransition: '.4s',
							MozTransition: '.4s,',
							width: '100%',
							background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NzguMTY1IDQ3OC4xNjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3OC4xNjUgNDc4LjE2NSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiPjxwYXRoIGQ9Ik00NzguMTY1IDIzMi45NDZjMCAxMjguNTY3LTEwNS4wNTcgMjMyLjk2Ni0yMzQuNjc5IDIzMi45NjYtNDEuMTAyIDAtNzkuODE0LTEwLjU5OS0xMTMuNDQ1LTI4Ljk2OUwwIDQ3OC4xNjVsNDIuNDM3LTEyNS4wNGMtMjEuNDM4LTM1LjA2NS0zMy43Ny03Ni4yMDctMzMuNzctMTIwLjE1OUM4LjY2NyAxMDQuMzQgMTEzLjc2MyAwIDI0My40ODUgMGMxMjkuNjIzIDAgMjM0LjY4IDEwNC4zNCAyMzQuNjggMjMyLjk0NnpNMjQzLjQ4NSAzNy4wOThjLTEwOC44MDIgMC0xOTcuNDIyIDg3LjgwMy0xOTcuNDIyIDE5NS44NjggMCA0Mi45MTUgMTMuOTg2IDgyLjYwMyAzNy41NzYgMTE0Ljg3OWwtMjQuNTg2IDcyLjU0MiA3NS44NDktMjMuOTY4YzMxLjEyMSAyMC40ODEgNjguNDU3IDMyLjI5NiAxMDguNTgzIDMyLjI5NiAxMDguNzIzIDAgMTk3LjMyMy04Ny44NDMgMTk3LjMyMy0xOTUuOTA4IDAtMTA3Ljg4Ni04OC42LTE5NS43MDktMTk3LjMyMy0xOTUuNzA5ek0zNjEuOTMxIDI4Ni42MmMtMS4zOTUtMi4zMzEtNS4yMi0zLjc0Ni0xMC44OTgtNi44MTQtNS45MTctMi44NDktMzQuMDg5LTE2LjQ5Ny0zOS41MDgtMTguMzctNS4xNi0xLjkxMy04Ljk4Ni0yLjg0OS0xMi44MTEgMi44MjktNC4wMDUgNS42MzgtMTQuOTAzIDE4LjYyOS0xOC4yMyAyMi4zNTQtMy41NDYgMy43ODUtNi44NTQgNC4yNjQtMTIuNTUyIDEuNDM1LTUuNjE4LTIuODA5LTI0LjI2Ny04Ljg2Ni00Ni4yMDMtMjguMzkxLTE3LjA1NS0xNS4wNDItMjguNjctMzMuNzExLTMxLjk5Ny0zOS41MDgtMy40MjctNS43NTgtLjM5OC04LjgyNiAyLjQ3MS0xMS42MzUgMi42OS0yLjU5IDUuNzc4LTYuNzM0IDguNjI3LTEwLjA0MSAyLjk2OS0zLjI4NyAzLjkwNS01LjYzOCA1Ljc5OC05LjQyNCAxLjkxMy0zLjkwNS45MzYtNy4xOTItLjQ3OC0xMC4xNDEtMS40MTUtMi44NDktMTMuMDEtMzAuODgxLTE3Ljc1Mi00Mi4zMzctNC44NDEtMTEuNDE2LTkuNTQzLTkuNTIzLTEyLjg3MS05LjUyMy0zLjQ2NyAwLTcuMjEyLS40NzgtMTEuMTE3LS40NzgtMy43ODUgMC0xMC4wNDEgMS4zOTUtMTUuMzgxIDcuMTkyLTUuMiA1LjY1OC0yMC4xMjMgMTkuNDY1LTIwLjEyMyA0Ny41OTcgMCAyOC4wNTIgMjAuNjAxIDU1LjMwOCAyMy41NSA1OS4wNTMgMi44NjkgMy43ODUgMzkuNzQ3IDYzLjE5NyA5OC4zMDMgODYuMDcgNTguNDc2IDIyLjg3MiA1OC40NzYgMTUuMzIxIDY5LjExNSAxNC4zNjUgMTAuMzgtLjk1NiAzNC4wNjktMTMuODY3IDM4LjgxMS0yNy4wOTYgNC42Ni0xMy40NSA0LjY2LTI0Ljc2NiAzLjI0Ni0yNy4xMzd6IiBmaWxsPSIjRkZGIi8+PC9zdmc+) 50%/30px auto no-repeat',
							WebkitBackgroundSize: '26px auto',
							MozBackgroundSize: '26px auto',
						},
						'&::after': {
							content: '""',
							height: '100%',
							left: 0,
							position: 'absolute',
							top: 0,
							transition: '.4s',
							WebkitTransition: '.4s',
							MozTransition: '.4s,',
							width: '100%',
							background: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTguNjU5IDYuOTk4IDUtNWExLjE3NyAxLjE3NyAwIDAgMCAwLTEuNjU3IDEuMTc3IDEuMTc3IDAgMCAwLTEuNjU3IDBsLTUgNS01LTVBMS4xNzIgMS4xNzIgMCAwIDAgLjM0NSAxLjk5OGw1IDUtNSA1YTEuMTcyIDEuMTcyIDAgMCAwIDAgMS42NTcgMS4xNzcgMS4xNzcgMCAwIDAgMS42NTcgMGw1LTUgNSA1YTEuMTc3IDEuMTc3IDAgMCAwIDEuNjU3IDAgMS4xNzcgMS4xNzcgMCAwIDAgMC0xLjY1N2wtNS01eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==) 50%/14px auto no-repeat',
							WebkitBackgroundSize: '14px auto',
							MozBackgroundSize: '14px auto',
							opacity: 0,
							MsTransform: 'scale(0) rotate(-1turn)',
							transform: 'scale(0) rotate(-1turn)',
							WebkitTransform: 'scale(0) rotate(-1turn)',
							MozTransform: 'scale(0) rotate(-1turn)',
							zIndex: 3
						}
					}}
				/>
			</a>
		</Box>
	)
}

export default WhatsAppButton;