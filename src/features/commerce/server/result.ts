/**
 * What a commerce service returns: the data, or an HTTP status and a short
 * error code for the client. The same shape as Hidden Pubs' ServiceResult, so
 * the routes can use the shared `toResponse` helper.
 */
export type { ServiceResult } from "@/features/pub-game/server/game-service";
import type { ServiceResult } from "@/features/pub-game/server/game-service";

export const ok = <T>(data: T): ServiceResult<T> => ({ ok: true, data });
export const fail = (status: number, error: string): ServiceResult<never> => ({ ok: false, status, error });
