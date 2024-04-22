import { BlockPermutation } from "@minecraft/server";
import { BiomeDefinition } from "../definitions/definition-biome";
import { DEFINITION_MANAGER } from "../definitions/index";
import { PalettedBrush } from "../utils";
import { CuttedSpruceTreeDefinition, PillarTreeDefinition, SpruceTreeDefinition, TreePalette } from "../definitions/definition-tree";

DEFINITION_MANAGER.biomeManager.addBiome(
    new BiomeDefinition("con:grassy_land")
    .setGroundPalette(
        new PalettedBrush()
        .add("grass", 2)
        .add("moss_block", 3)
    )
    .setUnderGroundPalette(
        new PalettedBrush()
        .add("stone", 2)
        .add("cobblestone", 3)
        .add("mossy_cobblestone", 4)
    )
    .setVegetationPalette(
        new PalettedBrush()
        .add("short_grass", 4)
        .add("poppy")
        .add("cornflower")
    )
    .setTemperature(0, 0.5)
    .setHumidity(0, 0.5)
    .setTrees(
        new TreePalette()
        .add(new SpruceTreeDefinition(), 5)
        .add(new SpruceTreeDefinition().setHeight(3,12).setLeavesPaletted("oak_leaves"))
    )
);
DEFINITION_MANAGER.biomeManager.addBiome(
    new BiomeDefinition("con:deep_forest")
    .setGroundPalette(
        new PalettedBrush()
        .add("mossy_cobblestone", 1)
        .add("moss_block", 3)
    )
    .setUnderGroundPalette(
        new PalettedBrush()
        .add("stone", 2)
        .add("cobblestone", 3)
        .add("mossy_cobblestone", 4)
    )
    .setVegetationChance(0.4)
    .setVegetationPalette(
        new PalettedBrush()
        .add("short_grass", 10)
        .add("cornflower")
    )
    .setTemperature(0,0.5)
    .setHumidity(0.5,1)
    .setTreesChance(0.04)
    .setTreesAreaChance(1)
    .setTrees(
        new TreePalette()
        //.add(new SpruceTreeDefinition().setHeight(15, 45).setOffSet(10,15), 3)
        .add(new SpruceTreeDefinition().setHeight(6, 12).setOffSet(5,8), 12)
        .add(new CuttedSpruceTreeDefinition().setHeight(1, 3))
    )
);
DEFINITION_MANAGER.biomeManager.addBiome(
    new BiomeDefinition("con:hot_dry_land")
    .setGroundPalette(
        new PalettedBrush()
        .add("dirt", 3)
        .add("dirt_with_roots", 2)
        .add(BlockPermutation.resolve("dirt", {dirt_type: "coarse"}), 1)
    )
    .setUnderGroundPalette(
        new PalettedBrush()
        .add("stone", 3)
        .add("cobblestone", 2)
        .add("mossy_cobblestone", 1)
    )
    .setVegetationChance(0.03)
    .setVegetationPalette(
        new PalettedBrush()
        .add("deadbush", 20)
        .add("hay_block")
        .add(BlockPermutation.resolve("stone_block_slab", {stone_slab_type:"cobblestone"}))
    )
    .setTemperature(0.5,1)
    .setHumidity(0,0.5)

);
DEFINITION_MANAGER.biomeManager.addBiome(
    new BiomeDefinition("con:desert")
    .setGroundPalette(
        new PalettedBrush()
        .add("sand", 3)
        .add("sandstone", 1)
    )
    .setUnderGroundPalette(
        new PalettedBrush()
        .add("sandstone")
    )
    .setVegetationChance(0.02)
    .setVegetationPalette("deadbush")
    .setTemperature(0.5,1)
    .setHumidity(0,0.5)
    .setTreesChance(0.015)
    .setTrees(
        new TreePalette()
        .add(
            new PillarTreeDefinition()
            .setHeight(2,4)
            .setLogPaletted("cactus")
            .setCanPlaceValidator((loc)=>{
                return loc.dimension.getBlock(loc)?.canPlace("cactus");
            })
        )
    )
);