import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookMessengerIcon,
	FacebookMessengerShareButton,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton
} from "react-share";

type SocialShareProps = {
	facebookUrl: string
	facebookMessengerAppId: string
	facebookMessengerUrl: string
	whatsappUrl: string
	telegramUrl: string
	twitterUrl: string
	emailUrl: string
}

const SocialShare = ({
	facebookUrl,
	facebookMessengerUrl,
	facebookMessengerAppId,
	emailUrl,
	twitterUrl,
	telegramUrl,
	whatsappUrl
}: SocialShareProps) => {
	return (
		<div style={{display: 'flex', marginTop: '30px', gap: '4px' }}>
			<FacebookShareButton url={facebookUrl}>
				<FacebookIcon
					size={32}
					round={false}
					iconFillColor="#000"
					bgStyle={{fill: 'transparent'}}
				/>
			</FacebookShareButton>
			<FacebookMessengerShareButton appId={facebookMessengerAppId} url={facebookMessengerUrl}>
				<FacebookMessengerIcon
					size={32}
					round={false}
					iconFillColor="#000"
					bgStyle={{fill: 'transparent'}}
				/>
			</FacebookMessengerShareButton>
			<WhatsappShareButton url={whatsappUrl}>
				<WhatsappIcon
					size={32}
					round={false}
					iconFillColor="#000"
					bgStyle={{fill: 'transparent'}}
				/>
			</WhatsappShareButton>
			<TelegramShareButton url={telegramUrl}>
				<TelegramIcon
					size={32}
					round={false}
					iconFillColor="#000"
					bgStyle={{fill: 'transparent'}}
				/>
			</TelegramShareButton>
			<TwitterShareButton url={twitterUrl}>
				<TwitterIcon
					size={32}
					round={false}
					iconFillColor="#000"
					bgStyle={{fill: 'transparent'}}
				/>
			</TwitterShareButton>
			<EmailShareButton url={emailUrl}>
				<EmailIcon
					size={32}
					round={false}
					iconFillColor="#000"
					bgStyle={{fill: 'transparent'}}
				/>
			</EmailShareButton>
		</div>
	)
}

export default SocialShare