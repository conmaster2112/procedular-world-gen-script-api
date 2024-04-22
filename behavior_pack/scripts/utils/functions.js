import { system } from "@minecraft/server";

/**@type {(n: number)=>Promise<void>} */
export const delay = system.waitTick.bind(system);