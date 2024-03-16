export const landingLagNormalFrames = 4;

// common aerial states
export const stateNair = "ATTACKAIRN";
export const stateFair = "ATTACKAIRF";
export const stateBair = "ATTACKAIRB";
export const stateUair = "ATTACKAIRHI";
export const stateDair = "ATTACKAIRLW";

// common movement names
export const nameSpotDodge = "spotDodge";
export const nameBackwardRoll = "backwardRoll";
export const nameForwardRoll = "forwardRoll";
export const nameAirDodge = "airDodge";

// these are the IDs for left and right side
export const stateForwardRoll = "ESCAPEF";
export const stateBackwardRoll = "ESCAPEB";
export const stateAirDodge = "ESCAPEAIR";

export const stateSpotDodgeLeft = "ESCAPE";
export const stateSpotDodgeRight = "ESCAPEN";

// air dodge into stage
export const stateLandingFallSpecial = "LANDINGFALLSPECIAL";

export enum AttackType {
  Ground,
  Aerial,
  Special,
}

type FrameGroups = [number, number][];

export interface Attack {
  name: string;
  type: AttackType;

  // TODO: figure out what these are
  // when you go into debug mode, move states have two values, and idk what they are
  // my initial guess is pre-frame and post-frame values
  stateLeft: number | string;
  stateRight: number | string;
  totalFrames: number;
  activeFrames: FrameGroups;
  iasaFrame: number;
  shieldStun: number;
  baseDamageHigh: number;
  baseDamageLow: number;
}

export interface Aerial extends Attack {
  framesLandingLag: number;
  framesLCancelLag: number;
  autoCancelWindows: FrameGroups;
}

interface Movement {
  name: string;
  stateLeft: number | string;
  stateRight: number | string;
  totalFrames: number;
  invincibleFrames: FrameGroups;
  landingLagFrames: number;
}

// interface MoveMap {
//   [index: string | number]: Move; // should this be id or name?
// }

// just taking data from meleeframedata.com
// idk if it will be useful but won't hurt to have
export interface CharacterDataType {
  id: number; // will be same ID as Character._, just here for ease
  attacks: (Attack | Aerial)[]; // better way to do this? also consider making a map
  movements: Movement[];
  weight: number;
  fastFallSpeed: number;
  dashSpeed: number;
  runSpeed: number;
  plaIntangibilityFrames: number; // I don't even know what this is
  jumpSquatFrames: number;
  wallJump: boolean;
}
