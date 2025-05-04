import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import './app.scss';
import Frames from './components/Frames';
import LoadingScreen from './components/LoadingScreen';
import Reflections from './components/Reflections';
import Sound from './components/Sound';
import { PICTURES } from './constants';
import { AnimatePresence } from 'framer-motion';
import playIcon from './assets/play.png';
import pauseIcon from './assets/pause.png';

function App() {
    const [started, setStarted] = useState(false);
    const [muted, setMuted] = useState(false);
    const [soundPlaying, setSoundPlaying] = useState(false);
    return (
        <>
            <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
                <color attach="background" args={['#191920']} />
                <fog attach="fog" args={['#191920', 0, 15]} />
                <group position={[0, -0.5, 0]}>
                    <Frames pictures={PICTURES} started={started} />
                    <Reflections />
                </group>
                <Environment preset="city" />
                <ambientLight intensity={0.1} />
                <directionalLight color="white" position={[0, 0, 5]} />
                <Sound url="theme.mp3" isPlaying={soundPlaying} />
            </Canvas>
            <AnimatePresence>
                {!started && (
                    <LoadingScreen
                        started={started}
                        muted={muted}
                        setMuted={setMuted}
                        onStartClick={() => (setStarted(true), setSoundPlaying(!muted))}
                    />
                )}
            </AnimatePresence>
            {started && (
                <div className="audio-controls" onClick={() => setSoundPlaying((s) => !s)}>
                    <img src={soundPlaying ? pauseIcon : playIcon} />
                </div>
            )}
        </>
    );
}

export default App;
