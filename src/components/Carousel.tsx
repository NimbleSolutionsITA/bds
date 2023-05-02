// Carousel.tsx
import React, {useCallback, useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material'
import Bullet from "./Bullet";

interface CarouselProps {
    images: string[]
    height?: string
    autoplay?: boolean
    interval?: number
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

const variants = {
    enter: {
        opacity: 0
    },
    center: {
        zIndex: 1,
        opacity: 1
    },
    exit: {
        zIndex: 0,
        opacity: 0
    }
};

const Carousel: React.FC<CarouselProps> = ({ images, height = '55%', autoplay = true, interval = 5000 }) => {
    const [page, setPage] = useState(0);

    const changePage = useCallback((newPage: number) => {
        if (newPage >= images.length)
            setPage(0)
        else if (newPage <= 0)
            setPage(images.length -1)
        else
            setPage(newPage)
    }, [images.length])

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        if (autoplay) {
            timeout = setTimeout(() => {
                changePage(page + 1)
            }, interval);
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [page, changePage, autoplay, interval]);


    return (
        <>
            <Box position="relative" width="100%" paddingBottom={height} margin="0 auto">
                <AnimatePresence>
                    <motion.div
                        key={page}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                changePage(page + 1)
                            } else if (swipe > swipeConfidenceThreshold) {
                                changePage(page - 1)
                            }
                        }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            paddingBottom: height,
                            backgroundImage: `url(${images[page]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                </AnimatePresence>
                <Box position="absolute" width="100%" display="flex" justifyContent="center" alignItems="center" py={2} bottom={0} zIndex={1}>
                    {images.map((_, index) => (
                        <Bullet
                            key={index}
                            className={page === index ? 'active' : ''}
                            onClick={() => index !== page && setPage(index)}
                        />
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default Carousel;
