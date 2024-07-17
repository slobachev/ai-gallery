import { SetStateAction, useEffect } from 'react';
import { motion } from 'framer-motion';

const variants = {
    hover: {
        width: '100%',
        transition: {
            duration: 0.7,
        },
    },
};

export default function LoadingScreen({
    started,
    onStartClick,
}: {
    started: boolean;
    onStartClick: (value: SetStateAction<boolean>) => void;
}) {
    if (started) return null;
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                background: '#191920',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <motion.div
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => onStartClick(true)}
                whileHover="hover"
            >
                <motion.div className="intro__dot" style={{ top: 0 }} variants={variants} />
                <motion.div className="intro__dot" style={{ top: 0, right: 0 }} variants={variants} />

                <p className="intro__text">DISCOVER WHAT LIES BENEATH MACHINE MIND</p>
                <motion.div className="intro__dot" style={{ bottom: 0 }} variants={variants} />
                <motion.div className="intro__dot" style={{ bottom: 0, right: 0 }} variants={variants} />
            </motion.div>
        </div>
    );
}
