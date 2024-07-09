import { Environment, Image, MeshReflectorMaterial, Text, useCursor } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Euler, Group, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three';
import getUuid from 'uuid-by-string';
import { useLocation, useRoute } from 'wouter';
import './App.css';

const GOLDENRATIO = 1.61803398875;
const BASE_PATH = '/ai-gallery/';
const PICTURES_PATH = `${BASE_PATH}pictures/:id`;

type Picture = {
    position: number[];
    rotation: number[];
    url: string;
    description: string;
};

const path = (id: number) => `./images/${id}.jpg`;

const pictures: Picture[] = [
    // Front
    {
        position: [0, 0, 1.5],
        rotation: [0, 0, 0],
        url: path(1),
        description: `Clock's hands softly move\nSpiral staircase whispers tales\nInnovation blooms`,
    },
    // Back
    {
        position: [-1, 0, -0.8],
        rotation: [0, 0, 0],
        url: path(2),
        description: `Majestic tower stands\nMetal structure reaching high\nParisian beauty`,
    },
    {
        position: [1, 0, -0.8],
        rotation: [0, 0, 0],
        url: path(3),
        description: `In a building tall\nA tree grows by a round window\nNature meets man's wall`,
    },
    // Left
    {
        position: [-2, 0, 0.2],
        rotation: [0, Math.PI / 2.5, 0],
        url: path(4),
        description: `Shadows and light dance\nSkylight illuminates room\nArchitecture's grace.`,
    },
    {
        position: [-2.7, 0, 1.8],
        rotation: [0, Math.PI / 2.5, 0],
        url: path(5),
        description: `Towering spiral roof\nGlass and steel reach for the sky\nModern beauty shines`,
    },
    {
        position: [-2.25, 0, 3.2],
        rotation: [0, Math.PI / 2.5, 0],
        url: path(6),
        description: `Urban rhythm flows\nSilent steps on pavement gray\nCity whispers low`,
    },
    // Right
    {
        position: [2, 0, 0.2],
        rotation: [0, -Math.PI / 2.5, 0],
        url: path(7),
        description: `A clock on the wall\nModern building stands so tall\nTime passes, light falls`,
    },
    {
        position: [2.7, 0, 1.8],
        rotation: [0, -Math.PI / 2.5, 0],
        url: path(8),
        description: `A touch of greenery\nSpiral beauty in the light\nStairway to the sky`,
    },
    {
        position: [2.25, 0, 3.2],
        rotation: [0, -Math.PI / 2.5, 0],
        url: path(9),
        description: `In her hand she holds\nA crystal ball reflecting\nSkyscraper's grandeur`,
    },
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
    const ref = useRef<Group>(null);
    const [q, p] = useMemo(() => [new Quaternion(), new Vector3()], []);
    const clicked = useRef<Object3D | undefined>(null!);
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
                    setLocation(
                        clicked.current === e.object ? BASE_PATH : BASE_PATH + 'pictures/' + e.object.name
                    );
            }}
            onPointerMissed={() => setLocation(BASE_PATH)}
        >
            {pictures.map((picture) => (
                <Frame key={picture.url} {...picture} />
            ))}
        </group>
    );
}

type FrameProps = Picture;

function Frame({ url, description, position, rotation }: FrameProps) {
    const image = useRef<Mesh>(null!);
    const frame = useRef<Mesh>(null!);
    const name = getUuid(url);
    const [, params] = useRoute(PICTURES_PATH);
    const [hovered, setHovered] = useState(false);
    const isActive = name === params?.id;
    const [rnd] = useState(() => Math.random());
    const [text, setText] = useState('');
    const [desciptionText, setDT] = useState(description);

    useCursor(hovered);
    useFrame((state, dt) => {
        (image.current.material as JSX.IntrinsicElements['imageMaterial']).zoom =
            1.5 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
        easing.damp3(
            image.current.scale,
            [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1],
            0.1,
            dt
        );
        easing.dampC(
            (frame.current.material as MeshStandardMaterial).color,
            hovered ? '#FFF' : '#d4d4d4',
            0.1,
            dt
        );
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
        <group position={new Vector3(...position)} rotation={new Euler(...rotation)}>
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
                mirror={0}
            />
        </mesh>
    );
}

export default App;
