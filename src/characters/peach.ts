import { Character } from "@slippi/slippi-js";
import {
  CharacterDataType,
  AttackType,
  landingLagNormalFrames,
  nameAirDodge,
  stateBair,
  stateDair,
  stateFair,
  stateNair,
  stateUair,
  stateAirDodge,
} from "../characterUtils";

export const nameFloat = "float";
export const nameFloatNair = "floatNair";
export const nameFloatFair = "floatFair";
export const nameFloatBair = "floatBair";
export const nameFloatUair = "floatUair";
export const nameFloatDair = "floatDair";

export const stateFloat = 341;
export const stateFloatNair = 344;
export const stateFloatFair = 345;
export const stateFloatBair = 346;
export const stateFloatUair = 347;
export const stateFloatDair = 348;

// parasol ascending left state - 363 310, 40 frames
// parasol opening state - 369 316, 15 frames
// parasol descending slow state - 370 317
// if parasol active when landing, 30 frames lag
// otherwise 4 frames lag

export const peachCharacterData: CharacterDataType = {
  id: Character.PEACH,
  attacks: [
    {
      name: nameFloatNair,
      type: AttackType.Aerial,
      stateLeft: stateFloatNair,
      stateRight: stateNair,
      totalFrames: 49,
      activeFrames: [[3, 23]],
      iasaFrame: 42,
      shieldStun: 8,
      baseDamageHigh: 14,
      baseDamageLow: 9,
      framesLandingLag: landingLagNormalFrames,
      framesLCancelLag: landingLagNormalFrames,
      autoCancelWindows: [[0, 49]],
    },
    {
      name: nameFloatFair,
      type: AttackType.Aerial,
      stateLeft: stateFloatFair,
      stateRight: stateFair,
      totalFrames: 54,
      activeFrames: [[16, 20]],
      iasaFrame: 51,
      shieldStun: 8,
      baseDamageHigh: 15,
      baseDamageLow: 15,
      framesLandingLag: landingLagNormalFrames,
      framesLCancelLag: landingLagNormalFrames,
      autoCancelWindows: [[0, 54]],
    },
    {
      name: nameFloatBair,
      type: AttackType.Aerial,
      stateLeft: stateFloatBair,
      stateRight: stateBair,
      totalFrames: 44,
      activeFrames: [[6, 22]],
      iasaFrame: 38,
      shieldStun: 8,
      baseDamageHigh: 14,
      baseDamageLow: 10,
      framesLandingLag: landingLagNormalFrames,
      framesLCancelLag: landingLagNormalFrames,
      autoCancelWindows: [[0, 44]],
    },
    {
      name: nameFloatBair,
      type: AttackType.Aerial,
      stateLeft: stateFloatBair,
      stateRight: stateUair,
      totalFrames: 44,
      activeFrames: [[6, 22]],
      iasaFrame: 38,
      shieldStun: 8,
      baseDamageHigh: 14,
      baseDamageLow: 10,
      framesLandingLag: landingLagNormalFrames,
      framesLCancelLag: landingLagNormalFrames,
      autoCancelWindows: [[0, 44]],
    },
    {
      name: nameFloatUair,
      type: AttackType.Aerial,
      stateLeft: stateFloatUair,
      stateRight: stateUair,
      totalFrames: 35,
      activeFrames: [[7, 11]],
      iasaFrame: 34,
      shieldStun: 8,
      baseDamageHigh: 14,
      baseDamageLow: 11,
      framesLandingLag: landingLagNormalFrames,
      framesLCancelLag: landingLagNormalFrames,
      autoCancelWindows: [[0, 35]],
    },
    {
      name: nameFloatDair,
      type: AttackType.Aerial,
      stateLeft: stateFloatDair,
      stateRight: stateDair,
      totalFrames: 44,
      activeFrames: [
        [12, 13],
        [18, 19],
        [24, 25],
        [30, 31],
        [36, 37],
      ],
      iasaFrame: 38,
      shieldStun: 8,
      baseDamageHigh: 3, // per hit, idk what to do with this. I think not actually useful
      baseDamageLow: 3, // per hit
      framesLandingLag: landingLagNormalFrames,
      framesLCancelLag: landingLagNormalFrames,
      autoCancelWindows: [[0, 44]],
    },
  ],

  movements: [
    {
      name: nameFloat,
      stateLeft: stateFloat,
      stateRight: 295,
      totalFrames: 150,
      invincibleFrames: [],
      landingLagFrames: landingLagNormalFrames,
    },
    {
      name: nameAirDodge,
      stateLeft: stateAirDodge,
      stateRight: stateAirDodge,
      totalFrames: 49,
      invincibleFrames: [[4, 19]],
      landingLagFrames: 10,
    },
  ],

  weight: 90,
  fastFallSpeed: 1.5,
  dashSpeed: 1.2,
  runSpeed: 1.3,
  plaIntangibilityFrames: 0,
  jumpSquatFrames: 5,
  wallJump: false,
};
