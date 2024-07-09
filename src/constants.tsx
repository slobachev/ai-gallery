import { getImagePathById } from './utils';

export const GOLDENRATIO = 1.61803398875;
export const BASE_PATH = '/ai-gallery/';
export const PICTURES_PATH = `${BASE_PATH}pictures/:id`;

export const PICTURES: models.Picture[] = [
    // Front
    {
        position: [0, 0, 1.5],
        rotation: [0, 0, 0],
        url: getImagePathById(1),
        description: `Clock's hands softly move\nSpiral staircase whispers tales\nInnovation blooms`,
    },
    // Back
    {
        position: [-1, 0, -0.8],
        rotation: [0, 0, 0],
        url: getImagePathById(2),
        description: `Majestic tower stands\nMetal structure reaching high\nParisian beauty`,
    },
    {
        position: [1, 0, -0.8],
        rotation: [0, 0, 0],
        url: getImagePathById(3),
        description: `In a building tall\nA tree grows by a round window\nNature meets man's wall`,
    },
    // Left
    {
        position: [-2, 0, 0.2],
        rotation: [0, Math.PI / 2.5, 0],
        url: getImagePathById(4),
        description: `Shadows and light dance\nSkylight illuminates room\nArchitecture's grace.`,
    },
    {
        position: [-2.7, 0, 1.8],
        rotation: [0, Math.PI / 2.5, 0],
        url: getImagePathById(5),
        description: `Towering spiral roof\nGlass and steel reach for the sky\nModern beauty shines`,
    },
    {
        position: [-2.25, 0, 3.2],
        rotation: [0, Math.PI / 2.5, 0],
        url: getImagePathById(6),
        description: `Urban rhythm flows\nSilent steps on pavement gray\nCity whispers low`,
    },
    // Right
    {
        position: [2, 0, 0.2],
        rotation: [0, -Math.PI / 2.5, 0],
        url: getImagePathById(7),
        description: `A clock on the wall\nModern building stands so tall\nTime passes, light falls`,
    },
    {
        position: [2.7, 0, 1.8],
        rotation: [0, -Math.PI / 2.5, 0],
        url: getImagePathById(8),
        description: `A touch of greenery\nSpiral beauty in the light\nStairway to the sky`,
    },
    {
        position: [2.25, 0, 3.2],
        rotation: [0, -Math.PI / 2.5, 0],
        url: getImagePathById(9),
        description: `In her hand she holds\nA crystal ball reflecting\nSkyscraper's grandeur`,
    },
];
