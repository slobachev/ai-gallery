import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Object3D, Quaternion, Vector3 } from 'three';
import { useLocation, useRoute } from 'wouter';
import { BASE_PATH, GOLDENRATIO, PICTURES_PATH } from '../constants';
import Frame from './Frame';

type FramesProps = {
    pictures: models.Picture[];
    started: boolean;
};

export default function Frames({ pictures, started }: FramesProps) {
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
        if (started) {
            easing.damp3(state.camera.position, p, 0.4, dt);
            easing.dampQ(state.camera.quaternion, q, 0.4, dt);
        }
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
