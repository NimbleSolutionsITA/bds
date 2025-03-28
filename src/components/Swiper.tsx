import {ReactNode} from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

type SwiperProps = {
	children: ReactNode[];
	noPagination?: boolean;
}

export default function SwiperMulti({ children, noPagination }: SwiperProps) {
	return (
		<>
			<Swiper
				slidesPerView={1}
				spaceBetween={20}
				breakpoints={{
					0: { slidesPerView: 2 },
					900: { slidesPerView: children.length > 2 ? 3 : 2 },
					1536: { slidesPerView: children.length > 3 ? 4 : children.length },
				}}
				pagination={{
					clickable: true,

				}}
				loop
				modules={noPagination ? [] : [Pagination]}
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
