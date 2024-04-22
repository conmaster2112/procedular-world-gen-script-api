import { world } from "@minecraft/server";
import { SessionManager } from "./session-manager";
export * from "./session-manager";
export * from "./generator";

let seed = world.getDynamicProperty("seed");
if(!seed){
    seed = Math.ceil(Date.now() * Math.random() * 2);
    world.setDynamicProperty("seed", seed);
}
export const SESSION_MANAGER = new SessionManager(seed);