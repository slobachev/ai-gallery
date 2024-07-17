import { useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Sound({ url, isPlaying }: { url: string; isPlaying: boolean }) {
    const sound = useRef<THREE.PositionalAudio>(null!);
    const [listener] = useState(() => new THREE.AudioListener());
    const buffer = useLoader(THREE.AudioLoader, url);

    useEffect(() => {
        if (!sound.current) return;
        sound.current.setBuffer(buffer);
        sound.current.setRefDistance(1);
        sound.current.setLoop(true);
    }, [buffer, listener, sound]);

    useEffect(() => {
        if (sound.current && isPlaying) sound.current.play();
        else sound.current.pause();
    }, [isPlaying, sound]);

    return <positionalAudio ref={sound} args={[listener]} />;
}
