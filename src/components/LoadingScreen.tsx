import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const variants = {
    initial: {
        opacity: 0,
    },
    hover: {
        pathLength: [0, 0.75],
        pathOffset: [0, 0.2],
        opacity: [0, 1, 1],
        transition: {
            duration: 1,
            ease: 'easeInOut',
        },
    },
};

export default function LoadingScreen({
    started,
    onStartClick,
}: {
    started: boolean;
    onStartClick: () => void;
}) {
    const divRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
    });

    useEffect(() => {
        if (!divRef.current) return;

        const { width, height, top, left } = divRef.current.getBoundingClientRect();

        setDimensions({ width, height, top, left });
    }, []);

    if (started) return null;
    return (
        <motion.div
            key="container"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
        >
            <motion.div
                ref={divRef}
                className="intro"
                whileHover="hover"
                initial="initial"
                onClick={onStartClick}
            >
                <motion.svg
                    className="intro__svg"
                    width={dimensions.width + 100}
                    height={dimensions.height + 100}
                    viewBox={`0 0 ${dimensions.width + 100} ${dimensions.height + 100}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter
                            id="filter-neon"
                            filterUnits="userSpaceOnUse"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                        >
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur20" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur50" />

                            <feMerge result="blur-merged">
                                <feMergeNode in="blur10" />
                                <feMergeNode in="blur20" />
                                <feMergeNode in="blur30" />
                                <feMergeNode in="blur50" />
                            </feMerge>

                            <feColorMatrix
                                result="red-blur"
                                in="blur-merged"
                                type="matrix"
                                values="0 0 0 0 0
                                        0 0.06 0 0 0
                                        0 0 0.44 0 0
                                        0 0 0 1 0"
                            />
                            <feMerge>
                                <feMergeNode in="red-blur" />
                                <feMergeNode in="blur5" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <svg className="intro__svg-neon" x={50} y={50}>
                        <motion.path
                            d={`M 0 0 h ${dimensions.width} v ${dimensions.height} h -${dimensions.width} v -${dimensions.height}`}
                            stroke="white"
                            strokeWidth="3"
                            variants={variants}
                        />
                    </svg>
                </motion.svg>
                <motion.p whileHover={{ scale: 1.1 }} className="intro__text">
                    DISCOVER WHAT LIES BENEATH MACHINE MIND
                </motion.p>
            </motion.div>
        </motion.div>
    );
}
