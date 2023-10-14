import {ReactNode} from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

type SwiperProps = {
	children: ReactNode[];
}

export default function SwiperMulti({ children }: SwiperProps) {
	return (
		<>
			<Swiper
				slidesPerView={1}
				spaceBetween={20}
				breakpoints={{
					600: { slidesPerView: 2 },
					900: { slidesPerView: 3 },
					1536: { slidesPerView: 4 },
				}}
				pagination={{
					clickable: true,

				}}
				loop
				modules={[Pagination]}
				className="mySwiper"
			>
				{children.map((child, index) => (
					<SwiperSlide key={index}>
						{child}
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
}
