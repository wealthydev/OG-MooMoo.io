let { isPrivate } = window;

const maxScreenWidth = 1920;
const maxScreenHeight = 1080;

const serverUpdateRate = 9;
const maxPlayers = 50;
const maxPlayersHard = 50;
const collisionDepth = 6;
const minimapRate = 3000;

const colGrid = 10;

const clientSendRate = 5;

const healthBarWidth = 50;
const healthBarPad = 4.5;
const iconPadding = 15;
const iconPad = 0.9;
const deathFadeout = 3000;
const crownIconScale = 60;
const crownPad = 35;

const chatCountdown = 3000;
const chatCooldown = 500;

const inSandbox = location.href.includes("sandbox");

const maxAge = 100;
const gatherAngle = Math.PI / 2.6;
const gatherWiggle = 10;
const hitReturnRatio = 0.25;
const hitAngle = Math.PI / 3;
const playerScale = 35;
const playerSpeed = 0.0016;
const playerDecel = 0.993;
const nameY = 34;

const skinColors = ["#bf8f54", "#cbb091", "#896c4b",
    "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
    "#8bc373"];

const animalCount = 7;
const aiTurnRandom = 0.06;
const cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper",
    "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"];

const shieldAngle = Math.PI / 3;
const weaponVariants = [{
    id: 0,
    src: "",
    xp: 0,
    val: 1
}, {
    id: 1,
    src: "_g",
    xp: 3000,
    val: 1.1
}, {
    id: 2,
    src: "_d",
    xp: 7000,
    val: 1.18
}, {
    id: 3,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18
}, {
    id: 4,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18
}];

const fetchVariant = function(player) {
    var tmpXP = player.weaponXP[player.weaponIndex] || 0;
    for (var i = weaponVariants.length - 1; i >= 0; --i) {
        if (tmpXP >= weaponVariants[i].xp)
            return weaponVariants[i];
    }
};

const resourceTypes = ["wood", "food", "stone", "points"];
const areaCount = 7;
const treesPerArea = 9;
const bushesPerArea = 3;
const totalRocks = 32;
const goldOres = 7;
const riverWidth = isPrivate ? 0 : 724;
const riverPadding = 114;
const waterCurrent = 0.0011;
const waveSpeed = 0.0001;
const waveMax = 1.3;
const treeScales = [150, 160, 165, 175];
const bushScales = [80, 85, 95];
const rockScales = [80, 85, 90];

const snowBiomeTop = isPrivate ? 0 : 2400;
const snowSpeed = 0.75;

const maxNameLength = 15;

const mapScale = isPrivate ? 1440 * 2 : 14400;
const mapPingScale = 40;
const mapPingTime = 2200;


const volcanoScale = 320;
const innerVolcanoScale = 100;
const volcanoAnimalStrength = 2;
const volcanoAnimationDuration = 3200;
const volcanoAggressionRadius = isPrivate ? 0 : 1440;
const volcanoAggressionPercentage = 0.2;
const volcanoDamagePerSecond = -1;
const volcanoLocationX = mapScale - volcanoScale - 120;
const volcanoLocationY = mapScale - volcanoScale - 120;

export default {
    maxScreenWidth,
    maxScreenHeight,
    serverUpdateRate,
    maxPlayers,
    maxPlayersHard,
    collisionDepth,
    minimapRate,
    colGrid,
    clientSendRate,
    healthBarWidth,
    healthBarPad,
    iconPadding,
    iconPad,
    deathFadeout,
    crownIconScale,
    crownPad,
    chatCountdown,
    chatCooldown,
    inSandbox,
    maxAge,
    gatherAngle,
    gatherWiggle,
    hitReturnRatio,
    hitAngle,
    playerScale,
    playerSpeed,
    playerDecel,
    nameY,
    skinColors,
    animalCount,
    aiTurnRandom,
    cowNames,
    shieldAngle,
    weaponVariants,
    fetchVariant,
    resourceTypes,
    areaCount,
    treesPerArea,
    bushesPerArea,
    totalRocks,
    goldOres,
    riverWidth,
    riverPadding,
    waterCurrent,
    waveSpeed,
    waveMax,
    treeScales,
    bushScales,
    rockScales,
    snowBiomeTop,
    snowSpeed,
    maxNameLength,
    mapScale,
    mapPingScale,
    mapPingTime,
    volcanoScale,
    innerVolcanoScale,
    volcanoAnimalStrength,
    volcanoAnimationDuration,
    volcanoAggressionRadius,
    volcanoAggressionPercentage,
    volcanoDamagePerSecond,
    volcanoLocationX,
    volcanoLocationY,
};