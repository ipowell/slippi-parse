import { readdirSync, writeFileSync } from 'fs';

import { SlippiGame, characters, stages, isTeching, FrameEntryType, FramesType, PlayerType } from "@slippi/slippi-js";
import { ClipFinder, printGame } from './utils';
import { allRestAttempts, hitRests, passIntoRests } from './rests';
import console = require('console');
import { Dolphin, createDolphinDataFromFrames, writeDolphinFile, getQueueData } from './dolphin';
import path = require('path');




require('dotenv').config();

const filename = "resources/doubles_puff.slp"

// const testFolder = '/mnt/hdd/Development/slippi-parse/resources/'
const testFolder = "/home/ian/hdd/games/recordings/Slippi/2022-11/"

// TODO: consider adding subdir support
const files = readdirSync(testFolder).map((file) => testFolder + file)
// const files = ["/home/ian/hdd/games/recordings/Slippi/2022-11/Game_20221105T041202.slp"]



const clipFinders: ClipFinder[] = [
    new ClipFinder(
        passIntoRests,
        "passes into rest",
        "pass_into_rest"
    ),
    new ClipFinder(
        allRestAttempts,
        "allRestAttempts",
        "allRestAttempts"
    ),
    new ClipFinder(
        hitRests,
        "hitRests",
        "hitRests"
    ),
]

let currentFileIndex = 1
const totalFiles = files.length

files.forEach((filename: string) => {
    console.log("(" + currentFileIndex++ + "/" + totalFiles + "): " + filename)
    const game = new SlippiGame(filename)
    clipFinders.forEach((clipFinder) => {
        clipFinder.parseGame(game)
    });
});

clipFinders.forEach((clipFinder) => {
    writeDolphinFile(createDolphinDataFromFrames(clipFinder.filename, clipFinder.clips), clipFinder.filename)
});

