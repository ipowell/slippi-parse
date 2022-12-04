import { Dirent, readdirSync } from 'fs';

import { Character, MoveLandedType, SlippiGame } from "@slippi/slippi-js";
import { ClipFinder, GameParser, getPlayerWithConnectCode, playerIsCaptainFalcon, playerIsJigglypuff, printGame } from './utils';
// import { allRestAttempts, hitRests, tmiRestPasses, twigFairs, twigRests } from './rests';
import console = require('console');
import { createDolphinDataFromFrames, writeDolphinFile } from './dolphin';
import { ComboType } from '@slippi/slippi-js';


require('dotenv').config();

// const testFolder = '/mnt/hdd/Development/slippi-parse/resources/'
const slippiFolder = "/home/ian/hdd/games/recordings/Slippi"
const novemberGames = "/home/ian/hdd/games/recordings/Slippi/2022-10"

// TODO: consider adding subdir support
const slippiFiles = getSlippiFilesFromDirectory(slippiFolder)
// const slippiFiles = ["/home/ian/hdd/games/recordings/Slippi/2022-10/Game_20221001T155512.slp"]


function getSlippiFilesFromDirectory(directory: string): string[] {
    const contents = readdirSync(directory, { withFileTypes: true })
    let slippiFiles = contents.filter(
        (ent: Dirent) => ent.isFile() && ent.name.endsWith(".slp")).map(
            (ent) => directory + "/" + ent.name)
    contents.filter((ent: Dirent) => ent.isDirectory()).forEach((dir: Dirent) => {
        slippiFiles = slippiFiles.concat(getSlippiFilesFromDirectory(directory + "/" + dir.name))
    })
    return slippiFiles
}

const twigTeamKills: GameParser = (game: SlippiGame) => {
    const codeTwig = "TWIG#619"
    const codeHotsauce = "HOTS#532"
    const twig = getPlayerWithConnectCode(game, codeTwig)
    const hotsauce = getPlayerWithConnectCode(game, codeHotsauce)
    if (twig == null || hotsauce == null) {
        return []
    }
    if (!game.getSettings().isTeams || (twig.teamId != hotsauce.teamId)) {
        return []
    }
    const combos = game.getStats().combos
    const kills = combos.filter((combo: ComboType) => {
        if (combo.playerIndex == hotsauce.playerIndex || combo.playerIndex == twig.playerIndex || !combo.didKill) {
            return false
        }
        if (combo.moves.length < 4) {
            return false
        }
        const attackers = combo.moves.map((move) => move.playerIndex)
        const attackersInvolved = new Set(attackers)
        return attackersInvolved.has(twig.playerIndex) && attackersInvolved.has(hotsauce.playerIndex)
    })

    const frames = kills.map<[number, number]>((combo: ComboType) => [combo.startFrame, combo.endFrame])
    if (frames.length > 0) {
        console.log("Found " + frames.length + " clips.")
    }
    return frames
}

const peachCombos: GameParser = (game: SlippiGame) => {
    // if (!game.getSettings().isTeams) {
    //     return []
    // }

    const codeHotsauce = "HOTS#532"
    const hotsauce = getPlayerWithConnectCode(game, codeHotsauce)
    if (hotsauce == null || hotsauce.characterId != Character.PEACH.valueOf()) {
        return []
    }

    const combos = game.getStats().combos
    // combos.forEach((combo) => console.log(combo.moves.length))
    const teamKills = combos.filter((combo) => {
        // if (!combo.didKill) {
        //     return false
        // }
        if (combo.endPercent - combo.startPercent < 70) {
            return false
        }
        if (combo.moves.length < 4) {
            return false
        }
        if (game.getSettings().players[combo.playerIndex].teamId == hotsauce.teamId) {
            return false
        }
        let peachHits = 0;
        combo.moves.forEach((move) => {
            if (move.playerIndex == hotsauce.playerIndex) {
                peachHits += 1
            }
        });
        return peachHits > 2;
        // return (combo.moves.some()
    })
    const frames = teamKills.map<[number, number]>((combo: ComboType) => [combo.startFrame, combo.endFrame])

    return frames
}

const testFinder: GameParser = (game: SlippiGame) => {
    if (!game.getSettings().isTeams) {
        return []
    }
    const combos = game.getStats().combos
    // combos.forEach((combo) => console.log(combo.moves.length))
    const teamKills = combos.filter((combo) => {
        // if (!combo.didKill) {
        //     return false
        // }
        if (combo.endPercent - combo.startPercent < 50) {
            return false
        }
        if (combo.moves.length < 8) {
            return false
        }
        const attackers = combo.moves.map((move) => move.playerIndex)
        const attackersInvolved = new Set(attackers)
        const multipleAttackers = attackersInvolved.size > 1
        return multipleAttackers
    })
    const frames = teamKills.map<[number, number]>((combo: ComboType) => [combo.startFrame, combo.endFrame])

    return frames
}

const clipFinders: ClipFinder[] = [
    // new ClipFinder(testFinder, "tf", 60, 0)
    new ClipFinder(
        peachCombos,
        "allPeachCombos",
        120,
        120
    )
    // new ClipFinder(
    //     twigRests,
    //     "twigRests"
    // ),
    // new ClipFinder(
    //     twigFairs,
    //     "twig_fairs",
    //     90,
    //     59
    // )
]



let currentFileIndex = 1
const totalFiles = slippiFiles.length

slippiFiles.forEach((filename: string) => {
    console.log("(" + currentFileIndex++ + "/" + totalFiles + "): " + filename)
    const game = new SlippiGame(filename)

    // printGame(game)
    clipFinders.forEach((clipFinder) => {
        clipFinder.parseGame(game)
    });
});

clipFinders.forEach((clipFinder) => {
    writeDolphinFile(createDolphinDataFromFrames(clipFinder.filename, clipFinder.clips), clipFinder.filename)
});

