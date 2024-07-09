import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import './App.css';
import Frames from './components/Frames';
import Reflections from './components/Reflections';
import { PICTURES } from './constants';

function App() {
    return (
        <>
            <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
                <color attach="background" args={['#191920']} />
                <fog attach="fog" args={['#191920', 0, 15]} />
                <group position={[0, -0.5, 0]}>
                    <Frames pictures={PICTURES} />
                    <Reflections />
                </group>
                <Environment preset="city" />
                <ambientLight intensity={0.1} />
                <directionalLight color="white" position={[0, 0, 5]} />
            </Canvas>
        </>
    );
}

export default App;
