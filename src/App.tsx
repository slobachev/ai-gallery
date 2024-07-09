import { Environment, Image, MeshReflectorMaterial, Text, useCursor } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import getUuid from 'uuid-by-string';
import { useLocation, useRoute } from 'wouter';
import './App.css';

const GOLDENRATIO = 1.61803398875;
const PICTURES_PATH = '/pictures/:id';

type Picture = {
    position: number[];
    rotation: number[];
    url: string;
    description: string;
};

const path = (id: number) => `src/assets/images/${id}.jpg`;

const pictures: Picture[] = [
    // Front
    {
        position: [0, 0, 1.5],
        rotation: [0, 0, 0],
        url: path(1),
        description: `Towering spiral roof\nGlass and steel reach for the sky \nModern beauty shines`,
    },
    // Back
    { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: path(2), description: '' },
    { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: path(2), description: '' },
    // Left
    { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: path(2), description: '' },
    { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: path(2), description: '' },
    { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: path(2), description: '' },
    // Right
    { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: path(2), description: '' },
    { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: path(2), description: '' },
    { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: path(2), description: '' },
];
function App() {
    return (
        <>
            <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
                <color attach="background" args={['#191920']} />
                <fog attach="fog" args={['#191920', 0, 15]} />
                <group position={[0, -0.5, 0]}>
                    <Frames pictures={pictures} />
                    <Reflections />
                </group>
                <Environment preset="city" />
                <ambientLight intensity={0.1} />
                <directionalLight color="white" position={[0, 0, 5]} />
            </Canvas>
        </>
    );
}

type FramesProps = {
    pictures: Picture[];
};

function Frames({ pictures }: FramesProps) {
    const ref = useRef<THREE.Object3D>();
    const [q, p] = useMemo(() => [new THREE.Quaternion(), new THREE.Vector3()], []);
    const clicked = useRef<THREE.Object3D | undefined>(null!);
    const [, params] = useRoute(PICTURES_PATH);
    const [, setLocation] = useLocation();

    useEffect(() => {
        clicked.current = params?.id ? ref.current?.getObjectByName(params?.id) : undefined;

        if (clicked.current?.parent) {
            clicked.current.parent.updateWorldMatrix(true, true);
            clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
            clicked.current.parent.getWorldQuaternion(q);
        } else {
            p.set(0, 0, 5.5);
            q.identity();
        }
    });

    useFrame((state, dt) => {
        easing.damp3(state.camera.position, p, 0.4, dt);
        easing.dampQ(state.camera.quaternion, q, 0.4, dt);
    });

    return (
        <group
            ref={ref}
            onClick={(e) => {
                e.stopPropagation(),
                    setLocation(clicked.current === e.object ? '/' : '/pictures/' + e.object.name);
            }}
            onPointerMissed={() => setLocation('')}
        >
            {pictures.map((picture) => (
                <Frame key={picture.url} {...picture} />
            ))}
        </group>
    );
}

type FrameProps = Picture & {
    c: THREE.Color;
};

function Frame({ url, description, ...rest }: FrameProps) {
    const image = useRef<THREE.Mesh>(null!);
    const frame = useRef(null!);
    const name = getUuid(url);
    const [, params] = useRoute(PICTURES_PATH);
    const [hovered, setHovered] = useState(false);
    const isActive = name === params?.id;
    const [rnd] = useState(() => Math.random());
    const [text, setText] = useState('');
    const [desciptionText, setDT] = useState(description);

    useCursor(hovered);
    useFrame((state, dt) => {
        image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
        easing.damp3(
            image.current.scale,
            [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1],
            0.1,
            dt
        );
        easing.dampC(frame.current.material.color, hovered ? '#abcded' : 'white', 0.1, dt);
    });

    useEffect(() => {
        let interval = 0;
        if (isActive && !interval) {
            interval = setInterval(() => {
                setText((st) => st + desciptionText.charAt(0));
                setDT(desciptionText.slice(1));
            }, 25);
        }

        if (!isActive) {
            setText('');
            setDT(description);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [desciptionText, description, isActive]);

    return (
        <group {...rest}>
            {/* Picture box */}
            <mesh
                name={name}
                scale={[1, GOLDENRATIO, 0.05]}
                position={[0, GOLDENRATIO / 2, 0]}
                onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry />
                <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
                <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
                    <boxGeometry />
                    <meshStandardMaterial toneMapped={false} fog={false} />
                </mesh>
                <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
            </mesh>
            {/* Text */}
            <Text
                maxWidth={0.8}
                anchorX="left"
                anchorY="top"
                position={[0.55, GOLDENRATIO, 0]}
                fontSize={0.05}
            >
                {text}
            </Text>
        </group>
    );
}

function Reflections() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={2048}
                color="#050505"
                metalness={0.5}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                roughness={1}
                mixStrength={80}
                mixBlur={1}
            />
        </mesh>
    );
}

export default App;
