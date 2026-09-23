import { MockWalkRepository } from "./mock-walk-repository";
import type { WalkRepository } from "./walk-repository";

/**
 * The walk repository the whole app uses.
 * Swap this for a database-backed implementation later. No page needs to change.
 */
export const walkRepository: WalkRepository = new MockWalkRepository();

export type { WalkRepository } from "./walk-repository";
