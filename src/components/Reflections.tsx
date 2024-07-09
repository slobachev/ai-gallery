import { MeshReflectorMaterial } from '@react-three/drei';

export default function Reflections() {
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
