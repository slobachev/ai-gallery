import { useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Sound({ url }: { url: string }) {
    const sound = useRef<THREE.PositionalAudio>(null!);
    const [listener] = useState(() => new THREE.AudioListener());
    const buffer = useLoader(THREE.AudioLoader, url);
    useEffect(() => {
        sound.current.setBuffer(buffer);
        sound.current.setRefDistance(1);
        sound.current.setLoop(true);
        sound.current.play();
    }, [buffer, listener, sound]);
    return <positionalAudio ref={sound} args={[listener]} />;
}
