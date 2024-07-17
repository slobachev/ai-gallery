import { Image, Text, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useRef, useState } from 'react';
import { Euler, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import getUuid from 'uuid-by-string';
import { useRoute } from 'wouter';
import { GOLDENRATIO, PICTURES_PATH } from '../constants';

type FrameProps = models.Picture;

export default function Frame({ url, description, position, rotation }: FrameProps) {
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
                font={'https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvgUI.woff'}
            >
                {text}
            </Text>
        </group>
    );
}
