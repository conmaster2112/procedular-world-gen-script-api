import { EasingType, GameMode, Player, system, TicksPerSecond, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { ClientChunk } from "./local-chunks";
import { SESSION_MANAGER } from "../world_gen/index";
import { delay, Vec3 } from "../utils";
import { DEFINITION_MANAGER } from "../definitions/index";

world.afterEvents.playerSpawn.subscribe(e=>{ playerInitialize(e.player).catch(e=>console.error(e,e.stack)); });
world.beforeEvents.playerLeave.subscribe(e=>{ ClientChunk.open(SESSION_MANAGER, e.player).stop(); })
world.beforeEvents.worldInitialize.subscribe(e=>{ for(const p of world.getPlayers()){ playerInitialize(p).catch(e=>console.error(e,e.stack)); } });

/**@param {Player} player  */
async function playerInitialize(player){
    await null;
    const local = ClientChunk.open(SESSION_MANAGER, player);
    local.start();
    const {x,z} = player.location;
    const y = local.currentGenerator.getHeight(x, z);
    const X = Math.ceil(x/16), Z = Math.ceil(z/16);
    
    const chunksToLoad = [
        {x:X+1,z:Z-1},
        {x:X+1,z:Z},
        {x:X+1,z:Z+1},

        {x:X,z:Z-1},
        {x:X,z:Z},
        {x:X,z:Z+1},

        {x:X-1,z:Z-1},
        {x:X-1,z:Z},
        {x:X-1,z:Z+1}
    ];
    player.teleport({x:x,y: y + 1,z:z}, {rotation: {x:-180,y:0}});
    player.addEffect("invisibility", 20*20, {showParticles:false});
    player.addEffect("resistance", 20*20, {showParticles:false});
    player.setGameMode(GameMode.spectator);
    player.onScreenDisplay.hideAllExcept();
    player.camera.fade({fadeTime: {fadeInTime:0,holdTime:1,fadeOutTime:4}});
    const cameraTime = 12;
    player.camera.setCamera("minecraft:free", {
        location: Vec3.add(player.location, {x:0,y:40,z:0}),
        facingLocation:player.location
    });
    player.teleport({x:x,y: y + 1,z:z}, {rotation: {x:0,y:0}});
    player.camera.setCamera("minecraft:free", {
        rotation: player.getRotation(),
        location: player.getHeadLocation(),
        easeOptions:{
            easeTime: cameraTime,
            easeType: EasingType.OutQuad
        }
    });
    const task = delay(cameraTime * TicksPerSecond - 40);
    await player.runCommandAsync("inputpermission set @s movement disabled");
    for(const {x,z} of chunksToLoad){
        const key = `${x};${z}`;
        do {
            await system.waitTick(3);
        } while(!local.currentGenerator.isGenerated(key))
    }
    await task;
    player.camera.fade({fadeTime: {fadeInTime:2,holdTime:1,fadeOutTime:2}});
    await delay(40);
    await player.runCommandAsync("inputpermission set @s movement enabled");
    player.camera.clear();
    player.teleport({x:x,y: y + 1,z:z});
    player.setGameMode(5);
    player.onScreenDisplay.resetHudElements();
    await delay(10);
    player.sendMessage("§7Type §r§l!debug§r§7 to show a debug stats.");
    /*
    player.camera.fade({fadeTime: {
        fadeInTime: 0,
        holdTime: 1,
        fadeOutTime: 3
    }, fadeColor: {blue:0,red:0,green:0}});
    player.addEffect("levitation", 10);
    player.addEffect("slow_falling", 5 * 9);
    if(!player.dimension.getBlock({x,y:y,z})?.isSolid) {
        while(player.dimension.getBlock({x,y:y,z})?.isSolid){
            player.addEffect("levitation", 8);
            player.addEffect("slow_falling", 5 * 9);
            player.camera.fade({fadeTime: {
                fadeInTime: 0,
                holdTime: 1,
                fadeOutTime: 3
            }, fadeColor: {blue:0,red:0,green:0}});
            await system.waitTick(8);
        }
    }
    await system.waitTick(5);
    while(!player.dimension.getBlock(player.location)?.isAir){
        player.teleport(Vec3.add(player.location, Vec3(0,1,0)));
        player.camera.fade({fadeTime: {
            fadeInTime: 0,
            holdTime: 1,
            fadeOutTime: 3
        }, fadeColor: {blue:0,red:0,green:0}});
        await system.waitTick(3);
    }
    player.camera.fade({fadeTime: {
        fadeInTime: 0,
        holdTime: 1,
        fadeOutTime: 3
    }, fadeColor: {blue:0,red:0,green:0}});
    player.addEffect("levitation", 15);
    await system.waitTick(30);*/
}

world.beforeEvents.chatSend.subscribe(async e=>{
    const msg = e.message.toLowerCase();
    const player = e.sender;
    if(msg === "!stats") {
        while(!player.isSneaking) await delay(1);
        const form = new ModalFormData();
        form.title("§t§lWorld Gen Settings");
        form.textField("\nSeed", Date.now() + "", "" + SESSION_MANAGER.seed);
        form.toggle("Precomputed Features", DEFINITION_MANAGER.IsPrecalculatedVariable);
        form.slider("Precomputed Samples", 5, 30, 1, DEFINITION_MANAGER.IsPrecalculatedSamplesVariable);
        const data = await form.show(player);
        if(!data.canceled){
            DEFINITION_MANAGER.IsPrecalculated = data.formValues[1];
            DEFINITION_MANAGER.PrecalculatedSamples = data.formValues[2];
            let newSeed = parseInt(data.formValues[0]);
            if(isFinite(newSeed)) world.setDynamicProperty("seed", newSeed);
            player.sendMessage("Successfully Updated\nRejoin to active these changes.");
        }
    }
    else if(msg === "!debug"){ player._debug = !player._debug; }
});

world.beforeEvents.worldInitialize.subscribe(()=>(async ()=>{
    await null;
    DEFINITION_MANAGER.triggerFinialize(SESSION_MANAGER.procedural);
})().catch(e=>console.error(e,e.stack)));