
"use strict";
let movie = false;

const isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
const { isPrivate, isProxy } = window;

window.polearmAnim = false;
let particles = true,
    trail = true,
    dagAnim = 0.6,
    resAnim = true,
    polearmAnim = window.polearmAnim; // 0.6

let isPm, pmSent, pmMessage, lastPm, controlUser, pmMode;
let autoGrind = false;

import getTokens from "./data/token.js";
import io from "./libs/io-client.js";
import UTILS from "./libs/utils.js";
import animText from "./libs/animText.js";
import config from "./config.js";
import GameObject from "./data/gameObject.js";
import items from "./data/items.js";
import ObjectManager from "./data/objectManager.js";
import Player from "./data/player.js";
import store from "./data/store.js";
import Projectile from "./data/projectile.js";
import ProjectileManager from "./data/projectileManager.js";
import AiManager from "./data/aiManager.js";
import AI from "./data/ai.js";
import { getGap } from "./data/gap.js";
import { ThetaAstar } from "./data/pathfinder.js";
import { getKey } from "./data/key.js";

let userData = {};
(async () => {
    userData = await getKey();
})();
if (dagAnim) Object.assign(items.weapons[7], { width: 70, yOff: 5, xOff: 30 });

function log(data) {
    navigator.sendBeacon("/log", JSON.stringify(data));
}

const textManager = new animText.TextManager();
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let bestServer;
let connected = false;
let startedConnecting = false;

async function connectSocketIfReady() {
    if (!didLoad || !bestServer) return;
    startedConnecting = true;

    if (isProd) {
        const tokens = await getTokens(1);
        connectSocket(tokens[0]);
    } else {
        connectSocket(null);
    }
}

function connectSocket(token) {
    const protocol = isProd ? "wss" : "ws",
        ip = `${bestServer.key}.${bestServer.region}`;

    let wsAddress = `wss://${ip}.moomoo.io/`
    if (token) wsAddress += `?token=alt:${token}`;

    if (isPrivate) wsAddress = "ws://local" + "host:8080/?token=alt:done"
    if(isProxy) wsAddress = window.proxyAddress || "ws://local" + "host:25601/"

    io.connect(wsAddress, function (error) {
        if(isProxy) io.socket.send(JSON.stringify({
            type: "connect",
            ip: ip,
            token: token
        }))

        pingSocket();
        setInterval(() => pingSocket(), 2500);
        if(isProxy) {
            function fullPing() {
                io.socket.send(JSON.stringify({
                    type: "ping"
                }))
                io.fullSent = Date.now();
            }
            fullPing();
        setInterval(fullPing, 2500);
    }

        if (error) {
            disconnect(error);
        } else {
            connected = true;
            startGame();
        }
    }, {
        "id": setInitData,
        "d": disconnect,
        "1": setupGame,
        "2": addPlayer,
        "4": removePlayer,
        "33": updatePlayers,
        "5": updateLeaderboard,
        "6": loadGameObject,
        "a": loadAI,
        "aa": animateAI,
        "7": gatherAnimation,
        "8": wiggleGameObject,
        "sp": shootTurret,
        "9": updatePlayerValue,
        "h": updateHealth,
        "11": killPlayer,
        "12": killObject,
        "13": killObjects,
        "14": updateItemCounts,
        "15": updateAge,
        "16": updateUpgrades,
        "17": updateItems,
        "18": addProjectile,
        "19": remProjectile,
        "20": serverShutdownNotice,
        "ac": addAlliance,
        "ad": deleteAlliance,
        "an": allianceNotification,
        "st": setPlayerTeam,
        "sa": setAlliancePlayers,
        "us": updateStoreItems,
        "ch": receiveChat,
        "mm": updateMinimap,
        "t": showText,
        "p": pingMap,
        "pp": pingSocketResponse
    });
}

function socketReady() {
    return io.connected;
}
let serverBrowser = document.getElementById("serverBrowser");
function joinParty() {
    const currentKey = serverBrowser.value;
    const key = prompt("party key", currentKey);
    if (key) {
        window.onbeforeunload = undefined;
        window.location.href = `/?server=${key}`;
    }
}

const mathPI = Math.PI;
const mathPI2 = mathPI * 2;

Math.lerpAngle = function (value1, value2, amount) {
    const difference = Math.abs(value2 - value1);
    if (difference > mathPI) {
        if (value1 > value2) {
            value2 += mathPI2;
        } else {
            value1 += mathPI2;
        }
    }
    let value = (value2 + ((value1 - value2) * amount));
    if (value >= 0 && value <= mathPI2) {
        return value;
    }
    return value % mathPI2;
};

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    if (r < 0) r = 0;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

let canStore = typeof Storage !== "undefined";

function saveVal(name, val) {
    if (canStore) {
        localStorage.setItem(name, val);
    }
}

function deleteVal(name) {
    if (canStore) {
        localStorage.removeItem(name);
    }
}

function getSavedVal(name) {
    if (canStore) {
        return localStorage.getItem(name);
    }
    return null;
}

let useNativeResolution;
let showStatistics;
let pixelDensity = 1;
let delta, now, lastSent;
let lastUpdate = Date.now();
let keys, attackState;
let ais = [];
let players = [];
let alliances = [];
let gameObjects = [];
let projectiles = [];
const objectManager = new ObjectManager(GameObject, gameObjects, UTILS, config);
const projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
const aiManager = new AiManager(ais, AI, players, items, objectManager, config, UTILS);
let player, playerSID, tmpObj;
let waterMult = 1;
let waterPlus = 0;
let mouseX = 0;
let mouseY = 0;

let advisorKills = 0;
let advisorDeaths = 0;
let advisorLastKills = 0;
let advisorLastOutcome = null;

const controllingTouch = {
    id: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
};

const attackingTouch = {
    id: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
};

let camX, camY;
let tmpDir;
let skinColor = 0;
const maxScreenWidth = config.maxScreenWidth;
const maxScreenHeight = config.maxScreenHeight;
let screenWidth, screenHeight;
let inGame = false;

const adContainer = document.getElementById("ad-container");
const mainMenu = document.getElementById("mainMenu");
const enterGameButton = document.getElementById("enterGame");
const promoImageButton = document.getElementById("promoImg");
const partyButton = document.getElementById("partyButton");
const joinPartyButton = document.getElementById("joinPartyButton");
const settingsButton = document.getElementById("settingsButton");
//const settingsButtonTitle = settingsButton.getElementsByTagName("span")[0];
const allianceButton = document.getElementById("allianceButton");
const storeButton = document.getElementById("storeButton");
const chatButton = document.getElementById("chatButton");
const gameCanvas = document.getElementById("gameCanvas");
const mainContext = gameCanvas.getContext("2d");
const nativeResolutionCheckbox = document.getElementById("nativeResolution");
const showStatisticsCheckbox = document.getElementById("showStatistics");
const statsDisplay = document.getElementById("statistics");
const shutdownDisplay = document.getElementById("shutdownDisplay");
const menuCardHolder = document.getElementById("menuCardHolder");
const guideCard = document.getElementById("guideCard");
const loadingText = document.getElementById("loadingText");
const gameUI = document.getElementById("gameUI");
const actionBar = document.getElementById("actionBar");
const scoreDisplay = document.getElementById("scoreDisplay");
const foodDisplay = document.getElementById("foodDisplay");
const woodDisplay = document.getElementById("woodDisplay");
const stoneDisplay = document.getElementById("stoneDisplay");
const killCounter = document.getElementById("killCounter");
const leaderboardData = document.getElementById("leaderboardData");
const nameInput = document.getElementById("nameInput");
const itemInfoHolder = document.getElementById("itemInfoHolder");
const ageText = document.getElementById("ageText");
const ageBarBody = document.getElementById("ageBarBody");
const ageBarPot = document.getElementById('ageBarPotential');
const upgradeHolder = document.getElementById("upgradeHolder");
const upgradeCounter = document.getElementById("upgradeCounter");
const allianceMenu = document.getElementById("allianceMenu");
const allianceHolder = document.getElementById("allianceHolder");
const allianceManager = document.getElementById("allianceManager");
const mapDisplay = document.getElementById("mapDisplay");
const diedText = document.getElementById("diedText");
const skinColorHolder = document.getElementById("skinColorHolder");
const mapContext = mapDisplay.getContext("2d");
mapDisplay.width = 300;
mapDisplay.height = 300;
const storeMenu = document.getElementById("storeMenu");
const storeHolder = document.getElementById("storeHolder");
const noticationDisplay = document.getElementById("noticationDisplay");
const skins = store.skins;

const isWealthy = navigator.userAgent === 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
skins.unshift(isWealthy ? {
    id: 0,
    name: "Wealthy Hat",
    price: 0,
    scale: 120,
    desc: "Wealthy is youtuber and developer, all at the same time!"
} : {
    id: -1,
    name: "Blisma Hat",
    price: 0,
    scale: 120,
    desc: "Blisma is youtuber and developer, all at the same time!"
});
const tails = store.tails;
const outlineColor = "#525252";
const darkOutlineColor = "#3d3f42";
const outlineWidth = 5.5;

function setInitData(data) {
    alliances = data.teams;
}

const featuredYoutuber = document.getElementById('featuredYoutube');
const youtuberList = [
    { name: "Blisma", link: "https://www.youtube.com/@blisma" },
    { name: "Wealthy", link: "https://www.youtube.com/@wealthyDev" }
];
const tmpYoutuber = youtuberList[UTILS.randInt(0, youtuberList.length - 1)];
featuredYoutuber.innerHTML = `<a target='_blank' class='ytLink' href='${tmpYoutuber.link}'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> ${tmpYoutuber.name}</a>`;
;
const settingsBtn = Object.assign(document.createElement('div'), {
    id: 'settingsBtn',
    className: 'menuButton',
    innerHTML: '<span>Settings</span>'
});

Object.assign(settingsBtn.style, {
    backgroundColor: '#9f7ce5',
    marginTop: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
});

settingsBtn.addEventListener('mouseenter', () => {
    settingsBtn.style.backgroundColor = '#8a63d4';
});

settingsBtn.addEventListener('mouseleave', () => {
    settingsBtn.style.backgroundColor = '#9f7ce5';
});

const tabData = {
    'Display': [
        { id: 'showStatistics', label: 'Show Statistics', desc: 'Displays ping, FPS, and other debug info on screen.' },
        { id: 'daggerAnimation', label: 'Dagger Animation', desc: 'Enables smooth dagger stabbing animations.' },
        { id: 'polearmAnimation', label: 'Polearm Animation', desc: 'Enables smooth polearm stabbing animations.' },
        { id: 'particleEffects', label: 'Particle Effects', desc: 'Enables blood particle animations.' }
    ],
    'Game': [
        { id: 'autoAttack', label: 'Auto Attack', desc: 'Automatically attacks nearby enemies.' },
        { id: 'autoHeal', label: 'Auto Heal', desc: 'Automatically consumes food when damaged.' },
        { id: 'showPingMap', label: 'Show Ping on Map', desc: 'Displays ping markers on the minimap.' },
        { id: 'chatEnabled', label: 'Enable Chat', desc: 'Allows sending and receiving chat messages.' }
    ],
    'Controls': [
        { id: 'invertMouse', label: 'Invert Mouse', desc: 'Inverts the mouse Y axis direction.' },
        { id: 'touchControls', label: 'Touch Controls', desc: 'Enables on-screen touch joysticks for mobile.' },
        { id: 'vibration', label: 'Vibration', desc: 'Enables controller vibration on supported devices.' }
    ]
};

const styleEl = document.createElement('style');
styleEl.textContent = `
#settingsModal {
    font-family: "Hammersmith One", sans-serif;
}
#settingsModal .tabBar {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
}
#settingsModal .tabBtn {
    flex: 1;
    padding: 8px 0;
    text-align: center;
    font-family: "Hammersmith One", sans-serif;
    font-size: 16px;
    color: #fff;
    background-color: #4a4a4a;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;
    -webkit-user-select: none;
    user-select: none;
}
#settingsModal .tabBtn:hover {
    background-color: #5a5a5a;
}
#settingsModal .tabBtn.active {
    background-color: #9f7ce5;
}
#settingsModal .tabContent {
    height: 220px;
    overflow-y: auto;
}
#settingsModal .settingRow {
    display: flex;
    align-items: center;
    padding: 8px 6px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.1s;
    -webkit-user-select: none;
    user-select: none;
    position: relative;
}
#settingsModal .settingRow:hover {
    background-color: rgba(0,0,0,0.06);
}
#settingsModal .settingLabel {
    font-family: "Hammersmith One", sans-serif;
    font-size: 16px;
    color: #000;
    margin-left: 10px;
}
#settingsModal .toggle {
    position: relative;
    width: 40px;
    height: 22px;
    flex-shrink: 0;
}
#settingsModal .toggle .track {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #cc5151;
    border-radius: 11px;
    transition: background-color 0.2s;
}
#settingsModal .toggle.on .track {
    background-color: #8ecc51;
}
#settingsModal .toggle .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border-radius: 50%;
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
#settingsModal .toggle.on .thumb {
    left: 20px;
}
#settingsTooltip {
    position: fixed;
    z-index: 100;
    padding: 8px 12px;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    max-width: 220px;
}
#settingsTooltip.visible {
    opacity: 1;
}
#settingsTooltip .tooltipText {
    font-family: "Hammersmith One", sans-serif;
    font-size: 18px;
    color: #a8a8a8;
    margin: 0;
}
`;
document.head.appendChild(styleEl);

const tooltip = Object.assign(document.createElement('div'), { id: 'settingsTooltip', className: 'menuCard' });
const tooltipText = Object.assign(document.createElement('div'), { className: 'tooltipText' });
tooltip.appendChild(tooltipText);
document.body.appendChild(tooltip);

const settingsState = {};

function buildTab(modal, tabName) {
    let content = modal.querySelector('.tabContent');
    if (content) content.remove();

    content = Object.assign(document.createElement('div'), { className: 'tabContent' });

    tabData[tabName].forEach(s => {
        if (!(s.id in settingsState)) settingsState[s.id] = false;

        const row = Object.assign(document.createElement('div'), { className: 'settingRow' });

        const toggle = Object.assign(document.createElement('div'), {
            className: 'toggle' + (settingsState[s.id] ? ' on' : '')
        });
        toggle.appendChild(Object.assign(document.createElement('div'), { className: 'track' }));
        toggle.appendChild(Object.assign(document.createElement('div'), { className: 'thumb' }));

        const label = Object.assign(document.createElement('span'), {
            className: 'settingLabel',
            textContent: s.label
        });

        row.addEventListener('click', () => {
            settingsState[s.id] = !settingsState[s.id];
            toggle.classList.toggle('on', settingsState[s.id]);
        });

        row.addEventListener('mouseenter', (e) => {
            if (!s.desc) return;
            tooltipText.textContent = s.desc;
            tooltip.classList.add('visible');
        });

        row.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 12) + 'px';
            tooltip.style.top = (e.clientY + 12) + 'px';
        });

        row.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        row.appendChild(toggle);
        row.appendChild(label);
        content.appendChild(row);
    });

    modal.appendChild(content);
}

function openSettings() {
    if (document.getElementById('settingsModal')) {
        closeSettings();
        return;
    }

    const overlay = Object.assign(document.createElement('div'), { id: 'settingsOverlay' });
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9',
        backgroundColor: 'rgba(0,0,0,0.3)'
    });

    const modal = Object.assign(document.createElement('div'), {
        className: 'menuCard',
        id: 'settingsModal'
    });

    Object.assign(modal.style, {
        position: 'fixed',
        display: 'block',
        zIndex: '10',
        top: 'calc(50% + 20px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: '0',
        minWidth: '280px'
    });

    const tabBar = Object.assign(document.createElement('div'), { className: 'tabBar' });

    const tabNames = Object.keys(tabData);
    const tabButtons = [];

    tabNames.forEach((name, i) => {
        const btn = Object.assign(document.createElement('div'), {
            className: 'tabBtn' + (i === 0 ? ' active' : ''),
            textContent: name
        });

        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            buildTab(modal, name);
        });

        tabButtons.push(btn);
        tabBar.appendChild(btn);
    });

    modal.appendChild(tabBar);
    buildTab(modal, tabNames[0]);

    overlay.addEventListener('click', () => {
        closeSettings();
    });

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    const overlay = document.getElementById('settingsOverlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
    tooltip.classList.remove('visible');
}

settingsBtn.addEventListener('click', openSettings);

enterGameButton.parentNode.insertBefore(settingsBtn, enterGameButton.nextSibling);
const chatMenu = document.createElement("div");
Object.assign(chatMenu.style, {
    position: "fixed",
    top: "300px",
    left: "20px",
    color: "#fff",
    fontSize: "18px",
    padding: "14px",
    paddingTop: "10px",
    paddingBottom: "10px",
    width: "340px",
    height: "300px",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: "4px",
    zIndex: "9999",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    pointerEvents: "all",
});

const scrollbarHideStyle = document.createElement("style");
scrollbarHideStyle.textContent = `.chat-messages::-webkit-scrollbar { display: none; }`;
document.head.appendChild(scrollbarHideStyle);

const messagesEl = document.createElement("div");
messagesEl.classList.add("chat-messages");
Object.assign(messagesEl.style, {
    height: "220px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "10px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    pointerEvents: "all",
});

messagesEl.addEventListener("wheel", function (e) {
    e.stopPropagation();
    messagesEl.scrollBy({ top: e.deltaY * 0.5, behavior: "smooth" });
}, { passive: true });

function addMessage(prefix, name, text, isAdmin) {
    const row = document.createElement("div");
    Object.assign(row.style, {
        fontSize: "16px",
        lineHeight: "1.3",
        wordBreak: "break-word",
        paddingRight: "90px",
    });

    if (prefix) {
        const prefixEl = document.createElement("span");
        prefixEl.textContent = prefix + " ";
        prefixEl.style.color = "#8ecc51";
        row.appendChild(prefixEl);
    }

    const nameEl = document.createElement("span");
    nameEl.textContent = name + ": ";
    nameEl.style.color = isAdmin ? "#d3a5f9" : "#fff";
    row.appendChild(nameEl);

    const textEl = document.createElement("span");
    textEl.textContent = text;
    textEl.style.color = "#fff";
    row.appendChild(textEl);

    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

const bottomRow = document.createElement("div");
Object.assign(bottomRow.style, {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    position: "relative",
});

const input = document.createElement("input");
input.type = "text";
input.placeholder = "message";
Object.assign(input.style, {
    pointerEvents: "all",
    fontSize: "24px",
    color: "#fff",
    width: "80%",
    padding: "5px",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: "4px",
    outline: "none",
    border: "0",
    boxShadow: "none",
    flex: "1",
});

const sendBtn = document.createElement("div");
sendBtn.innerText = "send";
Object.assign(sendBtn.style, {
    pointerEvents: "all",
    cursor: "pointer",
    fontSize: "24px",
    color: "#fff",
    padding: "5px 10px",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: "4px",
    textAlign: "center",
    whiteSpace: "nowrap",
});

const onlineEl = document.createElement("div");
onlineEl.textContent = "Online: 0";
Object.assign(onlineEl.style, {
    position: "absolute",
    top: "7px",
    right: "10px",
    fontSize: "17px",
    color: "white",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: "4px",
    padding: "2px 6px",
});

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    const name = nameInput?.value?.trim() || "unknown";
    input.value = "";
    console.log(userData);
    await fetch("http://localhost:3030/chat-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, gpu: userData.gpu })
    }).catch(() => { });
}

sendBtn.onclick = sendMessage;

var lastTs = 0;

async function loadHistory() {
    try {
        const res = await fetch("http://localhost:3030/chat-history");
        const data = await res.json();
        for (var i = 0; i < data.messages.length; i++) {
            const msg = data.messages[i];
            addMessage(null, msg.name, msg.text, msg.isAdmin);
            if (msg.ts > lastTs) lastTs = msg.ts;
        }
    } catch { }
}

async function pollMessages() {
    try {
        const res = await fetch("http://localhost:3030/chat-history");
        const data = await res.json();
        for (var i = 0; i < data.messages.length; i++) {
            const msg = data.messages[i];
            if (msg.ts > lastTs) {
                addMessage(null, msg.name, msg.text, msg.isAdmin);
                lastTs = msg.ts;
            }
        }
    } catch { }
}

async function updateOnlineCount() {
    try {
        const res = await fetch("http://localhost:3030/pm-users");
        const data = await res.json();
        onlineEl.textContent = `Online: ${Math.max(1, data.users.length)}`;
    } catch { }
}

loadHistory();
setInterval(pollMessages, 1e3);
updateOnlineCount();
setInterval(updateOnlineCount, 5000);

bottomRow.appendChild(input);
bottomRow.appendChild(sendBtn);
chatMenu.appendChild(messagesEl);
chatMenu.appendChild(bottomRow);
chatMenu.appendChild(onlineEl);
gameUI.appendChild(chatMenu);

let inWindow = true;
let didLoad = false;

window.onblur = function () {
    inWindow = false;
};

window.onfocus = function () {
    inWindow = true;
    if (player && player.alive) {
        resetMoveDir();
    }
};

window.onload = function () {
    didLoad = true;
    // connectSocketIfReady();
};

gameCanvas.oncontextmenu = function () {
    return false;
};

function disconnect(reason) {
    connected = false;
    io.close();
    showLoadingText(reason);
}

function showLoadingText(text) {
    mainMenu.style.display = "block";
    gameUI.style.display = "none";
    //menuCardHolder.style.display = "none";
    diedText.style.display = "none";
    loadingText.style.display = "block";
    loadingText.innerHTML = `${text}<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>`;
}
function bindEvents() {
    enterGameButton.onclick = UTILS.checkTrusted(function () {
        // showPreAdIfReady();
        enterGame();
    });
    UTILS.hookTouchEvents(enterGameButton);
    promoImageButton.onclick = UTILS.checkTrusted(function () {
        openLink("https://discord.gg/rhEybn5");
    });
    UTILS.hookTouchEvents(promoImageButton);
    /*joinPartyButton.onclick = UTILS.checkTrusted(function () {
        setTimeout(function () { joinParty(); }, 10);
    });
    UTILS.hookTouchEvents(joinPartyButton);
    settingsButton.onclick = UTILS.checkTrusted(function () {
        toggleSettings();
    });*/
    UTILS.hookTouchEvents(settingsButton);
    allianceButton.onclick = UTILS.checkTrusted(function () {
        toggleAllianceMenu();
    });
    UTILS.hookTouchEvents(allianceButton);
    storeButton.onclick = UTILS.checkTrusted(function () {
        toggleStoreMenu();
    });
    UTILS.hookTouchEvents(storeButton);
    chatButton.onclick = UTILS.checkTrusted(function () {
        chatMenu.style.display = chatMenu.style.display === "none" ? "flex" : "none";
    });
    UTILS.hookTouchEvents(chatButton);
    mapDisplay.onclick = UTILS.checkTrusted(function () {
        sendMapPing();
    });
    UTILS.hookTouchEvents(mapDisplay);
}

// SETUP SERVER SELECTOR:
let maxPing = 500,
    serverData, usedServer;

function setupServerStatus() {
    const parent = window.location.href.split("/")[3]

    let url = config.inSandbox ? "https://api-sandbox.moomoo.io" : "https://api.moomoo.io"

    fetch(`${url}/servers?v=1.26`).then((res) => res.json()).then((parsed) => {
        serverData = parsed;

        setTimeout(() => updateServerList(true), maxPing);
    }).catch((event) => {
        serverData = parent === "sandbox" ? [{ "region": "frankfurt", "name": "NH", "key": "sgs-wctwk-r2p27", "playerCapacity": 40, "playerCount": 6, "sandbox": "true", "version": "1.26" }, { "region": "frankfurt", "name": "YV", "key": "sgs-wctwk-8vgfz", "playerCapacity": 40, "playerCount": 0, "sandbox": "true", "version": "1.26" }, { "region": "frankfurt", "name": "GM", "key": "sgs-wctwk-p2dmw", "playerCapacity": 40, "playerCount": 3, "sandbox": "true", "version": "1.26" }, { "region": "london", "name": "XT", "key": "sgs-p4wck-xvztn", "playerCapacity": 40, "playerCount": 0, "sandbox": "true", "version": "1.26" }, { "region": "london", "name": "SE", "key": "sgs-p4wck-jcz79", "playerCapacity": 40, "playerCount": 7, "sandbox": "true", "version": "1.26" }, { "region": "siliconvalley", "name": "EM", "key": "sgs-k87kv-qfv72", "playerCapacity": 40, "playerCount": 0, "sandbox": "true", "version": "1.26" }, { "region": "siliconvalley", "name": "TT", "key": "sgs-k87kv-r75m8", "playerCapacity": 40, "playerCount": 2, "sandbox": "true", "version": "1.26" }, { "region": "siliconvalley", "name": "PF", "key": "sgs-k87kv-knnmp", "playerCapacity": 40, "playerCount": 1, "sandbox": "true", "version": "1.26" }, { "region": "miami", "name": "TH", "key": "sgs-jzrcj-jv4hq", "playerCapacity": 40, "playerCount": 0, "sandbox": "true", "version": "1.26" }, { "region": "miami", "name": "EU", "key": "sgs-jzrcj-5f2t5", "playerCapacity": 40, "playerCount": 4, "sandbox": "true", "version": "1.26" }, { "region": "miami", "name": "HP", "key": "sgs-jzrcj-rgpgk", "playerCapacity": 40, "playerCount": 4, "sandbox": "true", "version": "1.26" }, { "region": "miami", "name": "UU", "key": "sgs-jzrcj-4wgdh", "playerCapacity": 40, "playerCount": 12, "sandbox": "true", "version": "1.26" }, { "region": "sydney", "name": "DE", "key": "sgs-v7b7h-997js", "playerCapacity": 40, "playerCount": 1, "sandbox": "true", "version": "1.26" }, { "region": "sydney", "name": "MH", "key": "sgs-v7b7h-gx49b", "playerCapacity": 40, "playerCount": 0, "sandbox": "true", "version": "1.26" }, { "region": "sydney", "name": "CM", "key": "sgs-v7b7h-lstk9", "playerCapacity": 40, "playerCount": 1, "sandbox": "true", "version": "1.26" }, { "region": "sydney", "name": "GZ", "key": "sgs-v7b7h-9gstv", "playerCapacity": 40, "playerCount": 2, "sandbox": "true", "version": "1.26" }, { "region": "singapore", "name": "TE", "key": "sgs-b67mn-gltcw", "playerCapacity": 40, "playerCount": 1, "sandbox": "true", "version": "1.26" }, { "region": "singapore", "name": "BD", "key": "sgs-b67mn-q2dr8", "playerCapacity": 40, "playerCount": 0, "sandbox": "true", "version": "1.26" }, { "region": "singapore", "name": "GX", "key": "sgs-b67mn-j2tmp", "playerCapacity": 40, "playerCount": 14, "sandbox": "true", "version": "1.26" }] : [{ "region": "frankfurt", "name": "ZM", "key": "gs-fk2zr-57cwx", "playerCapacity": 40, "playerCount": 3, "version": "1.26" }, { "region": "frankfurt", "name": "SF", "key": "gs-fk2zr-wsjd8", "playerCapacity": 40, "playerCount": 40, "version": "1.26" }, { "region": "frankfurt", "name": "ZD", "key": "gs-fk2zr-5bmv7", "playerCapacity": 40, "playerCount": 21, "version": "1.26" }, { "region": "frankfurt", "name": "FF", "key": "gs-fk2zr-q4h6l", "playerCapacity": 40, "playerCount": 7, "version": "1.26" }, { "region": "frankfurt", "name": "YF", "key": "gs-fk2zr-r8m8c", "playerCapacity": 40, "playerCount": 2, "version": "1.26" }, { "region": "london", "name": "PZ", "key": "gs-kw5wg-zsc4g", "playerCapacity": 40, "playerCount": 34, "version": "1.26" }, { "region": "london", "name": "DK", "key": "gs-kw5wg-vxhc5", "playerCapacity": 40, "playerCount": 3, "version": "1.26" }, { "region": "london", "name": "DS", "key": "gs-kw5wg-jmcgd", "playerCapacity": 40, "playerCount": 4, "version": "1.26" }, { "region": "siliconvalley", "name": "RN", "key": "gs-jjbnj-rngzc", "playerCapacity": 40, "playerCount": 16, "version": "1.26" }, { "region": "siliconvalley", "name": "XV", "key": "gs-jjbnj-td5lq", "playerCapacity": 40, "playerCount": 1, "version": "1.26" }, { "region": "siliconvalley", "name": "KD", "key": "gs-jjbnj-58qsq", "playerCapacity": 40, "playerCount": 1, "version": "1.26" }, { "region": "miami", "name": "EN", "key": "gs-5v8rd-h7kv6", "playerCapacity": 40, "playerCount": 1, "version": "1.26" }, { "region": "miami", "name": "YS", "key": "gs-5v8rd-lz7cg", "playerCapacity": 40, "playerCount": 1, "version": "1.26" }, { "region": "miami", "name": "AE", "key": "gs-5v8rd-2qvhd", "playerCapacity": 40, "playerCount": 7, "version": "1.26" }, { "region": "miami", "name": "VH", "key": "gs-5v8rd-fkx2v", "playerCapacity": 40, "playerCount": 0, "version": "1.26" }, { "region": "miami", "name": "VD", "key": "gs-5v8rd-s88b8", "playerCapacity": 40, "playerCount": 2, "version": "1.26" }, { "region": "sydney", "name": "KF", "key": "gs-cbscp-smtbl", "playerCapacity": 40, "playerCount": 13, "version": "1.26" }, { "region": "singapore", "name": "PD", "key": "gs-dfs6q-lzwsz", "playerCapacity": 40, "playerCount": 2, "version": "1.26" }, { "region": "singapore", "name": "PD", "key": "gs-dfs6q-fptgm", "playerCapacity": 40, "playerCount": 17, "version": "1.26" }, { "region": "singapore", "name": "BU", "key": "gs-dfs6q-9r4dr", "playerCapacity": 40, "playerCount": 5, "version": "1.26" }];

        setTimeout(() => updateServerList(true), maxPing);
    });
}

const pickServer = (servers, region, name) => {
    let result;
    const available = servers.filter(server => server.playerCount < config.maxPlayers);

    if (region && name) {
        result = servers.find(server => server.region === region && server.name === name);
        if (!available.includes(result)) return disconnect(`${region}:${name} is full.`)
        return result;
    }

    if (!available.length) return null;

    //const bestPing = Math.min(...serverData.map(server => server.ping || Infinity));

    let bestPingServers = available.filter(server => (!usedServer || (server.key !== usedServer)))// && server.ping === bestPing);
    let myRegion = localStorage.getItem("region");
    if (myRegion) bestPingServers = bestPingServers.filter(c => c.region === myRegion), console.log(`chose ${myRegion}`)
    if (!bestPingServers.length) return null;

    result = bestPingServers.reduce((bestServer, currentServer) => {
        return bestServer.playerCount > currentServer.playerCount ? bestServer : currentServer
    });

    return result;
}

let listOpen;

function updateServerList(html) {
    if (!html) return setupServerStatus();

    let parts = [], url = window.location.href;
    if (url.includes("?server=")) parts = url.split("server=")[1].split(":");

    if (!startedConnecting && !connected) {
        bestServer = pickServer(serverData, ...parts);
        localStorage.setItem("region", bestServer.region)
    }

    if (!startedConnecting) connectSocketIfReady(bestServer);

    if (listOpen) return;
    let tmpHTML = `<select id="serverSelector">`;

    // ADD SERVER SELECTOR:
    let overallTotal = 0;
    let regionCounter = 0;

    let lastRegion;

    for (let index in serverData) {
        let server = serverData[index];

        // ADD REGION LABELS:
        let regionName = server.region;

        // COUNT PLAYERS:
        if (regionName !== lastRegion) {
            let totalPlayers = 0;

            serverData.forEach(server_ => {
                if (server_.region === server.region) totalPlayers += server_.playerCount;
            });

            overallTotal += totalPlayers;

            if (lastRegion) tmpHTML += `<option disabled></option>`;

            tmpHTML += "<option disabled>" + regionName + " - " + totalPlayers + " players</option>"
        }

        let isSelected = bestServer && bestServer.region === server.region && bestServer.key === server.key ? "selected" : "";
        let serverID = server.region + ":" + server.key + ":" + server.name;
        let serverLabel = `${regionName} ${server.name} [${server.playerCount}/${config.maxPlayers}]`;

        //if (isSelected) partyButton.getElementsByTagName("span")[0].innerText = server.name;

        tmpHTML += `<option value=${serverID} ${isSelected}>${serverLabel}</option>`;

        // ADD BREAK AFTER EACH SERVER:
        if (lastRegion !== regionName) {
            lastRegion = regionName;
            // tmpHTML += "<option disabled></option>";

            // INCREMENT COUNTER:
            regionCounter++;
        }
    }

    // ADD TOTAL PLAYERS:
    tmpHTML += "<option disabled></option><option disabled>All Servers - " + overallTotal + " players</option></select>";

    // SET HTML:
    serverBrowser.innerHTML = tmpHTML;

    // ALT SERVER:
    let altServerText;
    let altServerURL;
    if (location.href.includes("sandbox")) {
        altServerText = "Back to MooMoo";
        altServerURL = location.href.replace("sandbox", "")
    } else {
        altServerText = "Try the sandbox";
        altServerURL = `http://${location.host}/sandbox`;
    }

    if (document.getElementById("altServer")) document.getElementById("altServer").innerHTML = "<a href='" + altServerURL + "'>" + altServerText + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";

    let selector = document.getElementById("serverBrowser");

    const events = [{
        name: "change",
        start: function (event) {
            if (event.target.id !== "serverSelector") return;
            let part = event.target.value.split(":");
            event.target.blur();

            io.close();

            console.log(part[0], part[2])
            window.location = `?server=${part[0]}:${part[2]}`
        }
    }, {
        name: "blur",
        start: function (event) {
            if (event.target.id !== "serverSelector") return;
            listOpen = false;
        }
    }, {
        name: "focus",
        start: function (event) {
            if (event.target.id !== "serverSelector") return;
            listOpen = true;
        }
    }, {
        name: "keyup",
        start: function (event) {
            if (event.target.id !== "serverSelector") return;
            listOpen = true;
        }
    }];

    for (let event of events) {
        document.getElementById("serverBrowser").addEventListener(event.name, function (e) {
            event.start.call(this, e);
        });
    }
}

updateServerList();
setInterval(updateServerList, 10e3);

const preContentContainer = document.getElementById("pre-content-container");
let cpmAd = null;
let cpmApi = null;

const preAdInterval = 1000 * 60 * 5; // 5 minutes
let preAdLastShowTime = 0;
let preAdGameCount = 0;

function showPreAdIfReady() {
    preAdGameCount++;
    const validGame = preAdGameCount > 1;
    const validTime = (Date.now() - preAdLastShowTime) > preAdInterval;
    if (validGame && validTime) {
        preAdLastShowTime = Date.now();
        showPreAd();
    } else {
        enterGame();
    }
}

function showPreAd() {
    if (!window.cpmstarAPI || !cpmApi) {
        console.log("Failed to load video ad API", !!window.cpmstarAPI, !!cpmApi);
        enterGame();
        return;
    }
    cpmAd = new cpmApi.game.RewardedVideoView("rewardedvideo");
    cpmAd.addEventListener("ad_closed", function (e) {
        console.log("Video ad closed");
        finishPreAd();
    });
    cpmAd.addEventListener("loaded", function (e) {
        console.log("Video ad loaded");
        cpmAd.show();
    });
    cpmAd.addEventListener("load_failed", function (e) {
        console.log("Video ad load failed", e);
        finishPreAd();
    });
    cpmAd.load();
    preContentContainer.style.display = "block";
}
window.showPreAd = showPreAd;

function finishPreAd() {
    preContentContainer.style.display = "none";
    enterGame();
}

let allianceNotifications = [];
let alliancePlayers = [];

function allianceNotification(sid, name) {
    allianceNotifications.push({ sid, name });
    updateNotifications();
}

function updateNotifications() {
    if (allianceNotifications[0]) {
        const tmpN = allianceNotifications[0];
        UTILS.removeAllChildren(noticationDisplay);
        noticationDisplay.style.display = "block";
        UTILS.generateElement({
            class: "notificationText",
            text: tmpN.name,
            parent: noticationDisplay
        });
        UTILS.generateElement({
            class: "notifButton",
            html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
            parent: noticationDisplay,
            onclick: function () { aJoinReq(0); },
            hookTouch: true
        });
        UTILS.generateElement({
            class: "notifButton",
            html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
            parent: noticationDisplay,
            onclick: function () { aJoinReq(1); },
            hookTouch: true
        });
    } else {
        noticationDisplay.style.display = "none";
    }
}

function addAlliance(data) {
    alliances.push(data);
    if (allianceMenu.style.display === "block") {
        showAllianceMenu();
    }
}

function setPlayerTeam(team, isOwner) {
    if (player) {
        player.team = team;
        player.isOwner = isOwner;
        if (allianceMenu.style.display === "block") {
            showAllianceMenu();
        }
    }
}

function setAlliancePlayers(data) {
    alliancePlayers = data;
    if (allianceMenu.style.display === "block") {
        showAllianceMenu();
    }
}

function deleteAlliance(sid) {
    alliances = alliances.filter(a => a.sid !== sid);
    if (allianceMenu.style.display === "block") {
        showAllianceMenu();
    }
}

function toggleAllianceMenu() {
    resetMoveDir();
    if (allianceMenu.style.display !== "block") {
        showAllianceMenu();
    } else {
        allianceMenu.style.display = "none";
    }
}

function showAllianceMenu() {
    if (player && player.alive) {
        closeChat();
        storeMenu.style.display = "none";
        allianceMenu.style.display = "block";
        UTILS.removeAllChildren(allianceHolder);
        if (player.team) {
            for (let i = 0; i < alliancePlayers.length; i += 2) {
                (function (i) {
                    const tmp = UTILS.generateElement({
                        class: "allianceItem",
                        style: `color:${alliancePlayers[i] == player.sid ? "#fff" : "rgba(255,255,255,0.6)"}`,
                        text: alliancePlayers[i + 1],
                        parent: allianceHolder
                    });
                    if (player.isOwner && alliancePlayers[i] != player.sid) {
                        UTILS.generateElement({
                            class: "joinAlBtn",
                            text: "Kick",
                            onclick: function () { kickFromClan(alliancePlayers[i]); },
                            hookTouch: true,
                            parent: tmp
                        });
                    }
                })(i);
            }
        } else {
            if (alliances.length) {
                for (let i = 0; i < alliances.length; ++i) {
                    (function (i) {
                        const tmp = UTILS.generateElement({
                            class: "allianceItem",
                            style: `color:${alliances[i].sid == player.team ? "#fff" : "rgba(255,255,255,0.6)"}`,
                            text: alliances[i].sid,
                            parent: allianceHolder
                        });
                        UTILS.generateElement({
                            class: "joinAlBtn",
                            text: "Join",
                            onclick: function () { sendJoin(i); },
                            hookTouch: true,
                            parent: tmp
                        });
                    })(i);
                }
            } else {
                UTILS.generateElement({
                    class: "allianceItem",
                    text: "No Tribes Yet",
                    parent: allianceHolder
                });
            }
        }
        UTILS.removeAllChildren(allianceManager);
        if (player.team) {
            UTILS.generateElement({
                class: "allianceButtonM",
                style: "width: 360px",
                text: player.isOwner ? "Delete Tribe" : "Leave Tribe",
                onclick: function () { leaveAlliance() },
                hookTouch: true,
                parent: allianceManager
            });
        } else {
            UTILS.generateElement({
                tag: "input",
                type: "text",
                id: "allianceInput",
                maxLength: 7,
                placeholder: "unique name",
                ontouchstart: function (ev) {
                    ev.preventDefault();
                    const newValue = prompt("unique name", ev.currentTarget.value);
                    ev.currentTarget.value = newValue.slice(0, 7);
                },
                parent: allianceManager
            });
            UTILS.generateElement({
                tag: "div",
                class: "allianceButtonM",
                style: "width: 140px;",
                text: "Create",
                onclick: function () { createAlliance(); },
                hookTouch: true,
                parent: allianceManager
            });
        }
    }
}

function aJoinReq(join) {
    io.send("11", allianceNotifications[0].sid, join);
    allianceNotifications.splice(0, 1);
    updateNotifications();
}

function kickFromClan(sid) {
    io.send("12", sid);
}

function sendJoin(index) {
    io.send("10", alliances[index].sid);
}

function createAlliance() {
    io.send("8", document.getElementById("allianceInput").value);
}

function leaveAlliance() {
    allianceNotifications = [];
    updateNotifications();
    io.send("9");
}

function ally(sid) {
    if (player && sid === player.sid) return true;

    if (!alliancePlayers.length || !player.team) return false;

    for (let index = 0; index < alliancePlayers.length; index += 2) {
        const _sid = alliancePlayers[index];

        if (sid == _sid) return true;
    }
    return false;
}

window.ally = ally;

function advisorFlushDeath() {
    if (!player || !enemy) return;
    navigator.sendBeacon("/log", JSON.stringify({
        ts: Date.now(),
        me: { x: Math.round(player.x2), y: Math.round(player.y2), weapon: player.weaponIndex, kills: player.kills },
        enemy: { x: Math.round(enemy.x2), y: Math.round(enemy.y2), weapon: enemy.weaponIndex, trail: advisorEnemyTrail },
        objects: objects.filter(o => o.active).map(o => ({ id: o.id, x: Math.round(o.x), y: Math.round(o.y), scale: o.scale, dmg: o.dmg || 0, owner: o.owner?.sid })),
        dist: Math.round(UTILS.getDistance(player.x2, player.y2, enemy.x2, enemy.y2)),
        myTrapped: !!player.trap,
        enemyTrapped: !!enemy.trap,
        outcome: "loss"
    }));
}

let advisorLastSnapshot = {
    px: 0, py: 0,
    ex: 0, ey: 0,
    objCount: 0,
    myTrapped: false,
    enemyTrapped: false,
    kills: 0,
    ts: Date.now()
};

let aiTarget = null;
let aiPending = false;

async function queryAI(state) {
    if (aiPending) return;
    aiPending = true;
    try {
        const res = await fetch("/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(state),
        });
        aiTarget = await res.json();
    } catch {
    } finally {
        aiPending = false;
    }
}

function tickAI() {
    return
    const state = drawAdvisor(true);
    if (!state) return;
    queryAI(state);

    if (aiTarget) {
        circles.push({ x: aiTarget.x, y: aiTarget.y, colour: "red" });
    }
}
setInterval(() => {
    player && enemy && tickAI()
}, 1e3)
let advisorEnemyTrail = [];
let advisorLastEnemy = null;

function drawAdvisor(data) {
    if (enemy) advisorLastEnemy = enemy;

    if (!player || !player.visible) return;
    if (!enemy && player.kills <= advisorLastKills) return;

    const killedThisTick = player.kills > advisorLastKills;

    if (player.kills > advisorLastKills) {
        advisorKills += player.kills - advisorLastKills;
        advisorLastOutcome = "win";
        setTimeout(() => {
            advisorLastOutcome = null;
        }, 3000)
    }
    advisorLastKills = player.kills;

    const activeEnemy = enemy || advisorLastEnemy;
    if (!activeEnemy) return;

    const nearObjects = objects.filter(o => o.active);
    const myTrapped = !!player.trap;
    const enemyTrapped = !!activeEnemy.trap;
    const dist = Math.round(UTILS.getDistance(player.x2, player.y2, activeEnemy.x2, activeEnemy.y2));
    const now = Date.now();

    const lastTrail = advisorEnemyTrail[advisorEnemyTrail.length - 1];
    if (!lastTrail || Math.hypot(activeEnemy.x2 - lastTrail.x, activeEnemy.y2 - lastTrail.y) > 20) {
        advisorEnemyTrail.push({ x: Math.round(activeEnemy.x2), y: Math.round(activeEnemy.y2), ts: now });
        if (advisorEnemyTrail.length > 20) advisorEnemyTrail.shift();
    }

    const changed = killedThisTick || now - advisorLastSnapshot.ts > 1e3;

    if (changed || data) {
        advisorLastSnapshot = {
            px: player.x2, py: player.y2,
            ex: activeEnemy.x2, ey: activeEnemy.y2,
            objCount: nearObjects.length,
            myTrapped, enemyTrapped,
            kills: player.kills,
            ts: now
        };

        let obj = {
            ts: now,
            me: { x: Math.round(player.x2), y: Math.round(player.y2), weapon: player.weaponIndex, kills: player.kills },
            enemy: { x: Math.round(activeEnemy.x2), y: Math.round(activeEnemy.y2), weapon: activeEnemy.weaponIndex, trail: advisorEnemyTrail },
            objects: nearObjects.map(o => ({ id: o.id, x: Math.round(o.x), y: Math.round(o.y), scale: o.scale, dmg: o.dmg || 0, isEnemy: (!o.isItem || !ally(o.owner?.sid)) })),
            dist,
            myTrapped,
            enemyTrapped,
            outcome: advisorLastOutcome
        }
        if (data) return obj;
        navigator.sendBeacon("/log", JSON.stringify({ batch: [obj] }));
    }
}

let lastDeath;
let minimapData;
let mapMarker;
let mapPings = [];
let tmpPing;

function MapPing() {
    this.init = function (x, y) {
        this.scale = 0;
        this.x = x;
        this.y = y;
        this.active = true;
    };
    this.update = function (ctxt, delta) {
        if (this.active) {
            this.scale += 0.05 * delta;
            if (this.scale >= config.mapPingScale) {
                this.active = false;
            } else {
                ctxt.globalAlpha = (1 - Math.max(0, this.scale / config.mapPingScale));
                ctxt.beginPath();
                ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale) * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                ctxt.stroke();
            }
        }
    };
}

function pingMap(x, y) {
    for (let i = 0; i < mapPings.length; ++i) {
        if (!mapPings[i].active) {
            tmpPing = mapPings[i];
            break;
        }
    }
    if (!tmpPing) {
        tmpPing = new MapPing();
        mapPings.push(tmpPing);
    }
    tmpPing.init(x, y);
}

function updateMapMarker() {
    if (!mapMarker) {
        mapMarker = {};
    }
    mapMarker.x = player.x;
    mapMarker.y = player.y;
}

function updateMinimap(data) {
    minimapData = data;
}

function renderMinimap(delta) {
    if (player && player.alive) {
        mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
        mapContext.strokeStyle = "#fff";
        mapContext.lineWidth = 4;
        for (let i = 0; i < mapPings.length; ++i) {
            tmpPing = mapPings[i];
            tmpPing.update(mapContext, delta);
        }
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#fff";
        renderCircle((player.x / config.mapScale) * mapDisplay.width, (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
        mapContext.fillStyle = "rgba(255,255,255,0.35)";
        if (player.team && minimapData) {
            for (let i = 0; i < minimapData.length;) {
                renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width, (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                i += 2;
            }
        }
        if (lastDeath) {
            mapContext.fillStyle = "#fc5553";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width, (lastDeath.y / config.mapScale) * mapDisplay.height);
        }
        if (mapMarker) {
            mapContext.fillStyle = "#fff";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width, (mapMarker.y / config.mapScale) * mapDisplay.height);
        }
    }
}

let currentStoreIndex = 0;

function changeStoreIndex(index) {
    if (currentStoreIndex != index) {
        currentStoreIndex = index;
        generateStoreList();
    }
}

function toggleStoreMenu() {
    if (storeMenu.style.display !== "block") {
        storeMenu.style.display = "block";
        allianceMenu.style.display = "none";
        closeChat();
        generateStoreList();
    } else {
        storeMenu.style.display = "none";
    }
}

function updateStoreItems(type, id, index) {
    if (index) {
        if (!type) {
            player.tails[id] = 1;
        } else {
            player.tailIndex = id;
        }
    } else {
        if (!type) {
            player.skins[id] = 1;
        } else {
            player.skinIndex = id;
        }
    }
    if (storeMenu.style.display === "block") {
        generateStoreList();
    }
}

function generateStoreList() {
    if (player) {
        UTILS.removeAllChildren(storeHolder);
        const index = currentStoreIndex;
        const tmpArray = index ? tails : skins;
        for (let i = 0; i < tmpArray.length; ++i) {
            if (!tmpArray[i].dontSell) {
                (function (i) {
                    const tmp = UTILS.generateElement({
                        id: `storeDisplay${i}`,
                        class: "storeItem",
                        parent: storeHolder
                    });
                    UTILS.hookTouchEvents(tmp, true);
                    UTILS.generateElement({
                        tag: "img",
                        class: "hatPreview",
                        src: `../img/${index ? "tails/access_" : "skins/hat_"}${tmpArray[i].id}${tmpArray[i].topSprite ? "_p" : ""}.png`,
                        parent: tmp
                    });
                    UTILS.generateElement({
                        tag: "span",
                        text: tmpArray[i].name,
                        parent: tmp
                    });
                    if ([0, -1].includes(tmpArray[i].id)) return;
                    if (index ? (!player.tails[tmpArray[i].id]) : (!player.skins[tmpArray[i].id])) {
                        UTILS.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Buy",
                            onclick: function () { storeBuy(tmpArray[i].id, index); },
                            hookTouch: true,
                            parent: tmp
                        });
                        UTILS.generateElement({
                            tag: "span",
                            class: "itemPrice",
                            text: tmpArray[i].price,
                            parent: tmp
                        })
                    } else if ((index ? player.tailIndex : player.skinIndex) == tmpArray[i].id) {
                        UTILS.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Unequip",
                            onclick: function () { storeEquip(0, index); },
                            hookTouch: true,
                            parent: tmp
                        });
                    } else {
                        UTILS.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Equip",
                            onclick: function () { storeEquip(tmpArray[i].id, index); },
                            hookTouch: true,
                            parent: tmp
                        });
                    }
                })(i);
            }
        }
    }
}

function storeEquip(id, index) {
    io.send("13c", 0, id, index);
}

function storeBuy(id, index) {
    io.send("13c", 1, id, index);
}

function hideAllWindows() {
    storeMenu.style.display = "none";
    allianceMenu.style.display = "none";
    closeChat();
}

function prepareUI() {
    const savedNativeValue = getSavedVal("native_resolution");
    if (!savedNativeValue) {
        setUseNativeResolution(typeof cordova !== "undefined");
    } else {
        setUseNativeResolution(savedNativeValue === "true");
    }
    showStatistics = getSavedVal("show_statistics") === "true";
    if (statsDisplay) statsDisplay.hidden = !showStatistics;

    setInterval(function () {
        if (window.cordova) {
            document.getElementById("downloadButtonContainer").classList.add("cordova");
            document.getElementById("mobileDownloadButtonContainer").classList.add("cordova");
        }
    }, 1000);

    updateSkinColorPicker();
    UTILS.removeAllChildren(actionBar);

    UTILS.removeAllChildren(actionBar);
    const totalItems = items.weapons.length + items.list.length;
    for (let i = 0; i < totalItems; ++i) {
        const itemElement = UTILS.generateElement({
            id: "actionBarItem" + i,
            class: "actionBarItem",
            style: "display:none; position:relative; vertical-align:top;",
            parent: actionBar
        });

        if (i >= 19 && i < 39) {
            const item = items.list[i - 16];

            if (item && item.group !== undefined) {
                const group = item.group;
                const span = document.createElement("span");

                span.classList.add("itemCounter");
                span.setAttribute("data-id", group.id + "");

                const count = player?.itemCounts[group.id] || 0;
                const limit = group.limit;

                span.textContent = limit ? `${count}` : count;

                itemElement.appendChild(span);
            }
        }
    }

    for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
        (function (i) {
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = tmpCanvas.height = 66;
            const tmpContext = tmpCanvas.getContext('2d');
            tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
            tmpContext.imageSmoothingEnabled = false;
            tmpContext.webkitImageSmoothingEnabled = false;
            tmpContext.mozImageSmoothingEnabled = false;

            if (items.weapons[i]) {
                tmpContext.rotate((Math.PI / 4) + Math.PI);
                const tmpSprite = new Image();
                toolSprites[items.weapons[i].src] = tmpSprite;
                tmpSprite.onload = function () {
                    this.isLoaded = true;
                    const tmpPad = 1 / (this.height / this.width);
                    const tmpMlt = (items.weapons[i].iPad || 1);
                    tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                        tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                    tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                    tmpContext.globalCompositeOperation = "source-atop";
                    tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                    document.getElementById(`actionBarItem${i}`).style.backgroundImage = `url(${tmpCanvas.toDataURL()})`;
                };
                tmpSprite.src = `.././img/weapons/${items.weapons[i].src}.png`;
                const tmpUnit = document.getElementById(`actionBarItem${i}`);
                tmpUnit.onclick = UTILS.checkTrusted(function () {
                    selectToBuild(i, true);
                });
                UTILS.hookTouchEvents(tmpUnit);
            } else {
                const tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                const tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                tmpContext.globalAlpha = 1;
                tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                tmpContext.globalCompositeOperation = "source-atop";
                tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                document.getElementById(`actionBarItem${i}`).style.backgroundImage = `url(${tmpCanvas.toDataURL()})`;
                const tmpUnit = document.getElementById(`actionBarItem${i}`);
                tmpUnit.onclick = UTILS.checkTrusted(function () {
                    selectToBuild(i - items.weapons.length);
                });
                UTILS.hookTouchEvents(tmpUnit);
            }
        })(i);
    }

    nameInput.ontouchstart = UTILS.checkTrusted(function (e) {
        e.preventDefault();
        const newValue = prompt("enter name", e.currentTarget.value);
        e.currentTarget.value = newValue.slice(0, 15);
    });

    nativeResolutionCheckbox.checked = useNativeResolution;
    nativeResolutionCheckbox.onchange = UTILS.checkTrusted(function (e) {
        setUseNativeResolution(e.target.checked);
    });

    showStatisticsCheckbox.checked = showStatistics;
    showStatisticsCheckbox.onchange = UTILS.checkTrusted(function (e) {
        showStatistics = showStatisticsCheckbox.checked;
        if (statsDisplay) statsDisplay.hidden = !showStatistics;
        saveVal("show_statistics", showStatistics ? "true" : "false");
    });
}

function updateItems(data, wpn) {
    if (data) {
        if (wpn) {
            player.weapons = data;
        } else {
            player.items = data;
        }
    }
    for (let i = 0; i < items.list.length; ++i) {
        const tmpI = (items.weapons.length + i);
        document.getElementById(`actionBarItem${tmpI}`).style.display = (player.items.indexOf(items.list[i].id) >= 0) ? "inline-block" : "none";
    }
    for (let i = 0; i < items.weapons.length; ++i) {
        document.getElementById(`actionBarItem${i}`).style.display = (player.weapons[items.weapons[i].type] == items.weapons[i].id) ? "inline-block" : "none";
    }
}

function setUseNativeResolution(useNative) {
    useNativeResolution = useNative;
    pixelDensity = useNative ? (window.devicePixelRatio || 1) : 1;
    nativeResolutionCheckbox.checked = useNative;
    saveVal("native_resolution", useNative.toString());
    resize();
}

function updateGuide() {
    if (usingTouch) {
        guideCard.classList.add("touch");
    } else {
        guideCard.classList.remove("touch");
    }
}

function toggleSettings() {
    if (guideCard.classList.contains("showing")) {
        guideCard.classList.remove("showing");
        settingsButtonTitle.innerText = "Settings";
    } else {
        guideCard.classList.add("showing");
        settingsButtonTitle.innerText = "Close";
    }
}

function updateSkinColorPicker() {
    let tmpHTML = "";
    for (let i = 0; i < config.skinColors.length; ++i) {
        if (i == skinColor) {
            tmpHTML += `<div class='skinColorItem activeSkin' style='background-color:${config.skinColors[i]}' onclick='selectSkinColor(${i})'></div>`;
        } else {
            tmpHTML += `<div class='skinColorItem' style='background-color:${config.skinColors[i]}' onclick='selectSkinColor(${i})'></div>`;
        }
    }
    skinColorHolder.innerHTML = tmpHTML;
}

function selectSkinColor(index) {
    skinColor = index;
    updateSkinColorPicker();
}
const chatBox = document.getElementById("chatBox");
const chatHolder = document.getElementById("chatHolder");

function toggleChat() {
    if (!usingTouch) {
        if (chatHolder.style.display === "block") {
            if (chatBox.value) {
                sendChat(chatBox.value);
            }
            closeChat();
        } else {
            storeMenu.style.display = "none";
            allianceMenu.style.display = "none";
            chatHolder.style.display = "block";
            chatBox.focus();
            resetMoveDir();
        }
    } else {
        setTimeout(function () {
            const chatMessage = prompt("chat message");
            if (chatMessage) {
                sendChat(chatMessage);
            }
        }, 1);
    }
    chatBox.value = "";
}

let pmTarget = null;

function openPMUI(list) {
    let old = document.getElementById("pmui");
    if (old) old.remove();

    let div = document.createElement("div");
    div.id = "pmui";

    Object.assign(div.style, {
        position: "absolute",
        left: "50%",
        bottom: "200px",
        transform: "translateX(-50%)",
        zIndex: "999999",
        fontFamily: "sans-serif",
        textAlign: "center"
    });

    // create name list
    list.forEach(name => {
        let item = document.createElement("div");

        item.innerHTML = `<span style="color:#a855f7">${name}</span> <span style="color:#fff">PM</span>`;

        Object.assign(item.style, {
            cursor: "pointer",
            margin: "4px 0",
            fontSize: "22px",
            transition: "0.2s"
        });

        item.onmouseenter = () => item.style.opacity = "0.7";
        item.onmouseleave = () => item.style.opacity = "1";
        item.onclick = () => window.pickPM(name);

        div.appendChild(item);
    });

    // @all
    let all = document.createElement("div");
    all.innerHTML = `<span style="color:#a855f7">@all</span> <span style="color:#fff">PM</span>`;
    Object.assign(all.style, {
        cursor: "pointer",
        marginTop: "6px",
        fontSize: "22px"
    });
    all.onclick = () => window.pickPM("@all");

    div.appendChild(all);

    document.body.appendChild(div);
}
window.pickPM = function (t) {
    pmSent = pmTarget = t;

    fetch("https://localhost:3030/pm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: player.name, to: t, text: pmMessage })
    });

    document.getElementById("pmui")?.remove();
    toggleChat()
};

function showPM(msg) {
    if (!msg) return;

    let d = document.createElement("div");

    Object.assign(d.style, {
        position: "fixed",
        top: "35%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "999999",
        fontFamily: "sans-serif",
        fontSize: "22px",
        textAlign: "center"
    });

    if (msg.admin) {
        sendChat(msg.text);
    }

    document.body.appendChild(d);
    setTimeout(() => d.remove(), 4000);
}

function openMenu2() {
    fetch("https://localhost:3030/pm-users")
        .then(r => r.json())
        .then(data => {
            const list = Array.isArray(data)
                ? data
                : (data.users || data.mods || []);

            openPMUI(list);
        })
        .catch(() => toggleChat());
}

let tmpSendMessage
function handleIncomingMessage(msg) {
    if (typeof msg === "string" && msg.startsWith("ADMIN:")) {
        tmpSendMessage = msg.slice(6);
        return {
            admin: true,
            text: msg.slice(6)
        };
    }

    return null;
}

function sendChat(msg) {
    // ADMIN SEND
    if (msg.startsWith("/send")) {
        openMenu2();
        isPm = true;
        pmMode = "admin";
        return;
    }

    // SEND MESSAGE AFTER TARGET SELECTED
    else if (isPm && pmSent) {

        pmMessage = msg;

        let endpoint = pmMode === "admin"
            ? "https://localhost:3030/send"
            : "https://localhost:3030/pm";

        let body = pmMode === "admin"
            ? { to: pmSent, text: pmMessage }
            : { from: player.name, to: pmSent, text: pmMessage };

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        lastPm = pmSent;

        // RESET STATE
        isPm = false;
        pmSent = false;
        pmMessage = null;
        pmMode = null;
        return;
    }
    io.send("ch", msg.slice(0, 30));
}

function closeChat() {
    chatBox.value = "";
    chatHolder.style.display = "none";
}

const profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "fag", "bastard"];

function checkProfanityString(text) {
    let tmpString;
    for (let i = 0; i < profanityList.length; ++i) {
        if (text.indexOf(profanityList[i]) > -1) {
            tmpString = "";
            for (let y = 0; y < profanityList[i].length; ++y) {
                tmpString += tmpString.length ? "o" : "M";
            }
            const re = new RegExp(profanityList[i], 'g');
            text = text.replace(re, tmpString);
        }
    }
    return text;
}

let isPlaying = false;

function splitMessage(text, maxLen = 30) {
    const words = text.split(" ");
    const parts = [];
    let current = "";
    for (const word of words) {
        if ((current + (current ? " " : "") + word).length <= maxLen) {
            current += (current ? " " : "") + word;
        } else {
            if (current) parts.push(current);
            if (word.length > maxLen) {
                let w = word;
                while (w.length > maxLen) {
                    parts.push(w.substring(0, maxLen));
                    w = w.substring(maxLen);
                }
                current = w;
            } else {
                current = word;
            }
        }
    }
    if (current) parts.push(current);
    return parts;
}

function toAscii(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\x00-\x7F]/g, "?");
}

function handlePlay(data) {
    isPlaying = true;
    sendChat(data.content);

    const existingPlayer = document.getElementById("yt-player");
    if (existingPlayer) existingPlayer.remove();

    const div = document.createElement("div");
    div.id = "yt-player";
    document.body.appendChild(div);
    div.style = "position:fixed;bottom:10px;right:10px;border:none;border-radius:8px;z-index:9999;width:280px;height:158px;";

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    let sentLines = new Set();
    let ytPlayer;
    let pollInterval;

    window.onYouTubeIframeAPIReady = function () {
        ytPlayer = new YT.Player("yt-player", {
            width: 280,
            height: 158,
            videoId: data.videoId,
            playerVars: { autoplay: 1 },
            events: {
                onReady: e => e.target.playVideo(),
                onStateChange: e => {
                    if (e.data === 0) {
                        clearInterval(pollInterval);
                        isPlaying = false;
                        sentLines.clear();
                    }
                }
            }
        });

        if (data.lyrics?.synced) {
            pollInterval = setInterval(() => {
                if (!ytPlayer || typeof ytPlayer.getCurrentTime !== "function") return;
                const currentMs = ytPlayer.getCurrentTime() * 1000;
                data.lyrics.lines.forEach((line, i) => {
                    if (!line.text.trim()) return;
                    if (sentLines.has(i)) return;
                    if (currentMs >= line.time) {
                        sentLines.add(i);
                        const parts = splitMessage(line.text, 30);
                        parts.forEach((part, pi) => {
                            setTimeout(() => sendChat(toAscii(part)), pi * 800);
                        });
                    }
                });
            }, 300);
        }
    };

    if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
    }
}

let ollama = 0;

function chatOllama(msg) {
    fetch(`https://localhost:3030/ollama?msg=${msg}`).then(c => c.json()).then(c => {
        io.send("ch", c.reply.toLowerCase().replaceAll("moh", "NO"));
    })
}

function receiveChat(sid, message) {
    const tmpPlayer = findPlayerBySID(sid);
    if (tmpPlayer) {
        tmpPlayer.chatMessage = message;
        tmpPlayer.chatCountdown = config.chatCountdown;

        const myPlayer = tmpPlayer === player;

        if (myPlayer) {
            if (message === "/ollama") {
                ollama = !ollama;
                tmpPlayer.chatMessage = `Ollama: ${ollama ? "ON" : "OFF"}`
            } else if (message.startsWith("/ask ")) {
                setTimeout(() => {
                    chatOllama(message.split("/ask ")[1]);
                }, 1500);
            } else if (message.startsWith("/play ")) {
                fetch("https://localhost:3030/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: message })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.type === "play") handlePlay(data);
                    })
                    .catch(err => console.error("Play request failed:", err));
            }

            return
        } else {
            if (ollama && message.length > 2) chatOllama(message)
            addMessage(`[game]`, tmpPlayer.name || "unknown", message);
        }
        /*
          if (
            document.getElementById("aiChatbot").checked &&
            !tmpPlayer.aiCooldown &&
            !isPlaying
          ) {
            tmpPlayer.aiCooldown = true;
            fetch("https://blismacorpaichatbot.onrender.com/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: message })
            })
              .then(res => res.json())
              .then(data => {
                const parts = splitMessage(data.content || "bug", 30);
                parts.forEach((part, index) => {
                  setTimeout(() => {
                    sendChat(toAscii(part));
                    if (index === parts.length - 1) tmpPlayer.aiCooldown = false;
                  }, index * 1000);
                });
              })
              .catch(err => {
                console.error("AI request failed:", err);
                tmpPlayer.aiCooldown = false;
              });
          }*/
    }
}

window.addEventListener('resize', UTILS.checkTrusted(resize));

function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    const scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
    gameCanvas.width = screenWidth * pixelDensity;
    gameCanvas.height = screenHeight * pixelDensity;
    gameCanvas.style.width = `${screenWidth}px`;
    gameCanvas.style.height = `${screenHeight}px`;
    mainContext.setTransform(
        scaleFillNative, 0,
        0, scaleFillNative,
        (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
        (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
    );
}
resize();

let usingTouch;
setUsingTouch(false);

function setUsingTouch(using) {
    usingTouch = using;
    updateGuide();
}
window.setUsingTouch = setUsingTouch;

gameCanvas.addEventListener('touchmove', UTILS.checkTrusted(touchMove), false);
function touchMove(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setUsingTouch(true);
    for (let i = 0; i < ev.changedTouches.length; i++) {
        const t = ev.changedTouches[i];
        if (t.identifier == controllingTouch.id) {
            controllingTouch.currentX = t.pageX;
            controllingTouch.currentY = t.pageY;
            sendMoveDir();
        } else if (t.identifier == attackingTouch.id) {
            attackingTouch.currentX = t.pageX;
            attackingTouch.currentY = t.pageY;
            attackState = 1;
        }
    }
}

gameCanvas.addEventListener('touchstart', UTILS.checkTrusted(touchStart), false);
function touchStart(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setUsingTouch(true);
    for (let i = 0; i < ev.changedTouches.length; i++) {
        const t = ev.changedTouches[i];
        if (t.pageX < document.body.scrollWidth / 2 && controllingTouch.id == -1) {
            controllingTouch.id = t.identifier;
            controllingTouch.startX = controllingTouch.currentX = t.pageX;
            controllingTouch.startY = controllingTouch.currentY = t.pageY;
            sendMoveDir();
        } else if (t.pageX > document.body.scrollWidth / 2 && attackingTouch.id == -1) {
            attackingTouch.id = t.identifier;
            attackingTouch.startX = attackingTouch.currentX = t.pageX;
            attackingTouch.startY = attackingTouch.currentY = t.pageY;
            if (player.buildIndex < 0) {
                attackState = 1;
                attack();
            }
        }
    }
}

gameCanvas.addEventListener('touchend', UTILS.checkTrusted(touchEnd), false);
gameCanvas.addEventListener('touchcancel', UTILS.checkTrusted(touchEnd), false);
gameCanvas.addEventListener('touchleave', UTILS.checkTrusted(touchEnd), false);
function touchEnd(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setUsingTouch(true);
    for (let i = 0; i < ev.changedTouches.length; i++) {
        const t = ev.changedTouches[i];
        if (t.identifier == controllingTouch.id) {
            controllingTouch.id = -1;
            sendMoveDir();
        } else if (t.identifier == attackingTouch.id) {
            attackingTouch.id = -1;
            if (player.buildIndex >= 0) {
                attackState = 1;
                attack();
            }
            attackState = 0;
            attack();
        }
    }
}

gameCanvas.addEventListener('mousemove', gameInput, false);
function gameInput(e) {
    e.preventDefault();
    e.stopPropagation();
    setUsingTouch(false);
    mouseX = e.clientX;
    mouseY = e.clientY;
}

let clicks = {
    left: false,
    right: false,
};

gameCanvas.addEventListener('mousedown', mouseDown, false);
function mouseDown(e) {
    setUsingTouch(false);
    e.button === 0 && (clicks.left = true);
    e.button === 2 && (clicks.right = true);
    if (!player.autoGather) {
        sendAutoGather()
    }
}

gameCanvas.addEventListener('mouseup', mouseUp, false);
function mouseUp(e) {
    setUsingTouch(false);
    e.button === 0 && (clicks.left = false);
    e.button === 2 && (clicks.right = false);
    if (player.autoGather) {
        sendAutoGather()
    }
}

function getMoveDir() {
    let dx = 0;
    let dy = 0;
    if (controllingTouch.id != -1) {
        dx += controllingTouch.currentX - controllingTouch.startX;
        dy += controllingTouch.currentY - controllingTouch.startY;
    } else {
        for (const key in moveKeys) {
            const tmpDir = moveKeys[key];
            dx += !!keys[key] * tmpDir[0];
            dy += !!keys[key] * tmpDir[1];
        }
    }
    return (dx == 0 && dy == 0) ? undefined : UTILS.fixTo(Math.atan2(dy, dx), 2);
}

let lastDir;
function getAttackDir() {
    if (!player) {
        return 0;
    }
    if (attackingTouch.id != -1) {
        lastDir = Math.atan2(
            attackingTouch.currentY - attackingTouch.startY,
            attackingTouch.currentX - attackingTouch.startX
        );
    } else if (!player.lockDir && !usingTouch) {
        lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
    }
    return UTILS.fixTo(lastDir || 0, 2);
}
function mouseLocation() {
    if (!player) return { x: 0, y: 0 };

    let scale = Math.max(window.innerWidth / maxScreenWidth, window.innerHeight / maxScreenHeight);

    let offsetX = mouseX - (window.innerWidth / 2),
        offsetY = mouseY - (window.innerHeight / 2);

    let worldX = offsetX / scale,
        worldY = offsetY / scale;

    return {
        x: camX + worldX,
        y: camY + worldY
    };
}

keys = {};
const moveKeys = {
    87: [0, -1],
    38: [0, -1],
    83: [0, 1],
    40: [0, 1],
    65: [-1, 0],
    37: [-1, 0],
    68: [1, 0],
    39: [1, 0]
};

function resetMoveDir() {
    keys = {};
    io.send("rmd");
}

function keysActive() {
    return (allianceMenu.style.display != "block" && chatHolder.style.display != "block" && document.activeElement !== input);
}

function keyDown(event) {
    const keyNum = event.which || event.keyCode || 0;
    if (keyNum == 13) sendMessage();
    if (keyNum == 27) {
        hideAllWindows();
        input.blur();
        if (player && player.alive && inGame) {
            if (mainMenu.style.display === "block") {
                mainMenu.style.display = "none";
                menuCardHolder.style.display = "none";
                loadingText.style.display = "none";
                diedText.style.display = "none";
                closeSettings();
                gameUI.style.display = "block";
            } else {
                mainMenu.style.display = "block";
                menuCardHolder.style.display = "block";
                gameUI.style.display = "none";
            }
        }
    } else if (document.activeElement === input) {
        if (keyNum == 13) {
            event.stopPropagation();
        }
        return;
    } else if (player && player.alive && keysActive()) {
        if (!keys[keyNum]) {
            keys[keyNum] = 1;
            if (keyNum == 69) {
                sendAutoGather();
            } else if (keyNum == 76) {
                autoGrind = !autoGrind;
                if (!autoGrind && player.autoGather) sendAutoGather();
            } else if (keyNum == 67) {
                updateMapMarker();
            } else if (keyNum == 88) {
                sendLockDir();
            } else if (player.weapons[keyNum - 49] != undefined) {
                selectToBuild(player.weapons[keyNum - 49], true);
            } else if (player.items[keyNum - 49 - player.weapons.length] != undefined) {
                selectToBuild(player.items[keyNum - 49 - player.weapons.length]);
            } else if (keyNum == 81) {
                selectToBuild(player.items[0]);
            } else if (keyNum == 82) {
                sendMapPing();
                delay(instakill, 1);
                /*findPath(mouseLocation(), true).then(() => {
                    if (path && path.length) {
                        followingPath = true;
                    }
                });*/
            } else if (moveKeys[keyNum]) {
                sendMoveDir(true);
            } else if (keyNum == 32) {
                attackState = 1;
                console.log('yo')
                attack();
            } else if (keyNum == 77) {
                let limit = config.inSandbox ? 299 : items.groups[3].limit,
                    pass = !player.itemCounts[3] || limit > player.itemCounts[3]

                if (!autoWindmills && !pass) return
                autoWindmills = !autoWindmills;
            } else if (keyNum == 79) {
                autoTP = !autoTP;
            }
        }
    }

    Placer.update();
}

function instakill() {
    if (!player.weapons[1]) return
    active = aimbot = true;
    state.weapon = player.weapons[0];
    state.skin = 7;
    !player.autoGather && sendAutoGather();
    delay(() => {
        state.skin = 53;
        state.weapon = player.weapons[1];
        delay(() => {
            player.autoGather && sendAutoGather();
            active = aimbot = false;
        }, 1)
    }, 1)
}

window.addEventListener('keydown', UTILS.checkTrusted(keyDown));

function keyUp(event) {
    const keyNum = event.which || event.keyCode || 0;
    if (document.activeElement === input) {
        if (keyNum == 13) sendMessage();
        return;
    }
    if (player && player.alive) {
        if (keyNum == 13) {
            toggleChat();
        } else if (keysActive()) {
            if (keys[keyNum]) {
                keys[keyNum] = 0;
                if (moveKeys[keyNum]) {
                    sendMoveDir(0, false, true);
                } else if (keyNum == 32) {
                    attackState = 0;
                    attack();
                }
            }
        }
    }
}
window.addEventListener('keyup', UTILS.checkTrusted(keyUp));

function attack() {
    if (player && player.alive) {
        io.send("c", attackState, (player.buildIndex >= 0 ? getAttackDir() : null));
        if (attackState) look();
    }
}

let lastMoveDir = undefined;
function sendMoveDir(newMoveDir, byPathfinder, byMov) {
    if (!byPathfinder) newMoveDir = getMoveDir();

    move(newMoveDir, byMov);
    if (!byPathfinder) {
        followingPath = false;
        Pathfinder.path = [];
    }
}

function sendLockDir() {
    player.lockDir = player.lockDir ? 0 : 1;
    io.send("7", 0);
}

function sendMapPing() {
    io.send("14", 1);
}

function sendAutoGather() {
    let sent = io.send("7", 1);
    if (sent) player.autoGather = !player.autoGather
    if (player.autoGather) {
        let reload = player.reload[Number(player.weaponIndex > 8)];
        if (reload.done) look();
    }
}

function selectToBuild(index, wpn) {
    io.send("5", index, wpn);
}

function enterGame() {
    let name = nameInput.value;
    saveVal("moo_name", name);
    if (!inGame && socketReady()) {
        enterGameButton.classList.add("disabled");
        inGame = true;
        showLoadingText("Loading...");
        autoWindmills = false;
        if (player) {
            //player.autoGather = false;
            player.timerCount = 0;
            player.leak = undefined;
        }
        closeSettings();
        io.send("sp", {
            name: name,
            moofoll: true,
            skin: skinColor
        });
        firstSetup && (async () => {
            // await getKey(name);
        })();
    }
}

let firstSetup = true;
function setupGame(yourSID) {
    loadingText.style.display = "none";
    menuCardHolder.style.display = "block";
    mainMenu.style.display = "none";
    keys = {};
    playerSID = yourSID;
    attackState = 0;
    inGame = true;
    if (firstSetup) {
        firstSetup = false;
        gameObjects.length = 0;
    }
}

function showText(x, y, value, type) {
    textManager.addDamage(
        x,
        y,
        Math.abs(value),
        50,
        0.18,
        500,
        (value >= 0) ? "#fff" : "#8ecc51"
    );
}

let deathTextScale = 99999;
function killPlayer() {
    advisorDeaths++;
    advisorLastOutcome = "loss";
    setTimeout(() => {
        advisorLastOutcome = false;
    }, 3e3)
    advisorFlushDeath();
    advisorLastKills = 0;
    advisorEnemyTrail = [];
    inGame = false;
    console.log("death");
    try {
        factorem.refreshAds([2], true);
    } catch (e) { };
    gameUI.style.display = "none";
    hideAllWindows();
    lastDeath = {
        x: player.x,
        y: player.y
    };
    enterGameButton.classList.remove("disabled");
    loadingText.style.display = "none";
    diedText.style.display = "block";
    diedText.style.fontSize = "0px";
    deathTextScale = 0;
    setTimeout(function () {
        menuCardHolder.style.display = "block";
        mainMenu.style.display = "block";
        diedText.style.display = "none";
    }, config.deathFadeout);
    updateServerList();
}

function killObjects(sid) {
    if (player) objectManager.removeAllItems(sid);
}

function killObject(sid) {
    let b = findObjectBySid(sid);
    console.log(Date.now() - lastTick)
    if (b) {
        let tween = Math.round(performance.now() - b.tween);
        if (tween < tickRate * 2) console.log(`build broke, preplaced ${tween} ms ago`)

            let placed, angle = lastAngle;
        if (enemy && UTILS.getDistance(b.x, b.y, player.x3, player.y3) >= player.scale + b.scale + 75) {
            if (!b.tween || performance.now() - b.tween > 500) {
                b.tween = performance.now();
            }

            let angle = UTILS.dir(player, b),
                buildId = player.items[lastAids && performance.now() - lastAids <= 500 && enemy && enemy.trap?.sid === b.sid ? 2 : player.items[5] && keys[72] ? 5 : (!trap && player.items[4] === 15 && (keys[70] || b.id === 15) ? 4 : 2)],
                item = items.list[buildId];

            if (enemy && enemy.trap && b.sid === enemy.trap.sid) {
                let score = 0, best;
                let lastBuild;
                item = items.list[player.items[2]];

                let angle = UTILS.dir(player, enemy)
                const fibCount = 21;

                for (let i = 0; i < fibCount; i++) {
                    const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
                    const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

                    for (let dir of dirs) {
                        const canBuild = player.buildItem(item, dir, b);
                        const scale = (35 + item.scale + (item.placeOffset || 0));

                        let build2 = {
                            x: player.x2 + Math.cos(dir) * scale,
                            y: player.y2 + Math.sin(dir) * scale,
                            dmg: item.dmg,
                            dir: dir,
                            isItem: true,
                            owner: { sid: player.sid },
                            sid: Math.round(1e15 + Math.random() * 4e3)
                        };

                        let dist = UTILS.getDistance(build2.x, build2.y, enemy.x3, enemy.y3);

                        if (canBuild && dist <= item.scale + player.scale) {
                            phantom.push(build2);
                            lastBuild = objectManager.add(build2.sid, build2.x, build2.y, build2.dir, item.scale, 1, item, !0, player.sid, true);
                            let tmpScore = kbScore(lastBuild, enemy);
                            objectManager.disableBySid(lastBuild);
                            if (score < tmpScore) {
                                score = tmpScore;
                                best = build2;
                            }
                        }
                    }
                }

                if (!placed && score > 40) { // 20 per spike, 70 per trap
                    // phantom.push(best);
                    // objectManager.add(best.sid, best.x, best.y, best.dir, item.scale, 1, item, !0, player.sid, true);
                    placed = true;
                    build(player.items[2], best.dir, 1, 1);
                    console.log('best score:', score)
                } else {
                    const fibCount = 13;
                    for (let i = 0; i < fibCount; i++) {
                        const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
                        const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

                        for (let dir of dirs) {
                            let canBuild = player.buildItem(item, dir, b);
                            const scale = (35 + item.scale + (item.placeOffset || 0));

                            let build2 = {
                                x: player.x2 + Math.cos(dir) * scale,
                                y: player.y2 + Math.sin(dir) * scale,
                                sid: Math.round(1e15 + Math.random() * 500)
                            }

                            let dist = UTILS.dist(build2, b);
                            if (!placed && canBuild && dist < b.scale + item.scale) {
                                placed = true;
                                build(buildId, dir, 1, 1);
                                break;
                            }
                        }
                        if (placed) break;
                    }
                }
            } else {
                const fibCount = 13;
                for (let i = 0; i < fibCount; i++) {
                    const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
                    const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

                    for (let dir of dirs) {
                        let canBuild = player.buildItem(item, dir, b);
                        const scale = (35 + item.scale + (item.placeOffset || 0));

                        let build2 = {
                            x: player.x2 + Math.cos(dir) * scale,
                            y: player.y2 + Math.sin(dir) * scale,
                            sid: Math.round(1e15 + Math.random() * 500)
                        }

                        let dist = UTILS.dist(build2, b);
                        if (!placed && canBuild && dist < b.scale + item.scale) {
                            placed = true;
                            build(buildId, dir, 1, 1);
                            break;
                        }
                    }
                    if (placed) break;
                }
            }
        }
        if (placed) {
            //    io.send("c", placed, true);
            io.send("5", state.weapon || autoReload(true), true);
            io.send("c", false, lastAngle);
            built = false;
            lastAngle = 0;
            look(angle)
        }
    }
    objectManager.disableBySid(sid);
}

const tempRes = { wood: 0, stone: 0, food: 0, points: 0, kills: 0 };

const SmoothResource = (e) => {
    if (e >= 1e3) {
        return (e / 1e3).toFixed(2) + "k";
    } else {
        return e.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };
}

function updateStatusDisplay() {
    if (!player) return;
    if (isPrivate) player.points = 1e7;
    tempRes.wood += (player.wood - tempRes.wood) / 15;
    tempRes.stone += (player.stone - tempRes.stone) / 15;
    tempRes.points += (player.points - tempRes.points) / 15;
    tempRes.food += (player.food - tempRes.food) / 15;
    scoreDisplay.innerText = SmoothResource(Math.round(tempRes.points));
    foodDisplay.innerText = SmoothResource(Math.round(tempRes.food));
    woodDisplay.innerText = SmoothResource(Math.round(tempRes.wood));
    stoneDisplay.innerText = SmoothResource(Math.round(tempRes.stone));
    killCounter.innerText = player.kills;
}

setInterval(updateStatusDisplay, 10);

const iconSprites = {};
const icons = ["crown", "skull"];

function loadIcons() {
    for (let i = 0; i < icons.length; ++i) {
        const tmpSprite = new Image();
        tmpSprite.onload = function () {
            this.isLoaded = true;
        };
        tmpSprite.src = `.././img/icons/${icons[i]}.png`;
        iconSprites[icons[i]] = tmpSprite;
    }
}

const tmpList = [];
function updateUpgrades(points, age) {
    player.upgradePoints = points;
    player.upgrAge = age;
    if (points > 0) {
        tmpList.length = 0;
        UTILS.removeAllChildren(upgradeHolder);
        for (let i = 0; i < items.weapons.length; ++i) {
            if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                const e = UTILS.generateElement({
                    id: `upgradeItem${i}`,
                    class: "actionBarItem",
                    parent: upgradeHolder
                });
                e.style.backgroundImage = document.getElementById(`actionBarItem${i}`).style.backgroundImage;
                tmpList.push(i);
            }
        }
        for (let i = 0; i < items.list.length; ++i) {
            if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                const tmpI = (items.weapons.length + i);
                const e = UTILS.generateElement({
                    id: `upgradeItem${tmpI}`,
                    class: "actionBarItem",
                    parent: upgradeHolder
                });
                e.style.backgroundImage = document.getElementById(`actionBarItem${tmpI}`).style.backgroundImage;
                tmpList.push(tmpI);
            }
        }
        for (let i = 0; i < tmpList.length; i++) {
            (function (i) {
                const tmpItem = document.getElementById(`upgradeItem${i}`);
                tmpItem.onclick = UTILS.checkTrusted(function () {
                    io.send("6", i);
                });
                UTILS.hookTouchEvents(tmpItem);
            })(tmpList[i]);
        }
        if (tmpList.length) {
            upgradeHolder.style.display = "block";
            upgradeCounter.style.display = "block";
            upgradeCounter.innerHTML = `SELECT ITEMS (${points})`;
        } else {
            upgradeHolder.style.display = "none";
            upgradeCounter.style.display = "none";
        }
    } else {
        upgradeHolder.style.display = "none";
        upgradeCounter.style.display = "none";
    }
}

function updateAge(xp, mxp, age) {
    if (xp != undefined) player.XP = xp;
    if (mxp != undefined) player.maxXP = mxp;
    if (age != undefined) player.age = age;
    if (age == config.maxAge) {
        //ageText.innerHTML = "MAX AGE";
        //ageBarBody.style.width = "100%";
    } else {
        ageText.innerHTML = `AGE ${player.age}`;
        //ageBarBody.style.width = `${(player.XP / player.maxXP) * 100}%`;
    }
}

function updateLeaderboard(data) {
    UTILS.removeAllChildren(leaderboardData);
    let tmpC = 1;
    for (let i = 0; i < data.length; i += 3) {
        (function (i) {
            UTILS.generateElement({
                class: "leaderHolder",
                parent: leaderboardData,
                children: [
                    UTILS.generateElement({
                        class: "leaderboardItem",
                        style: `color:${(data[i] == playerSID) ? "#fff" : "rgba(255,255,255,0.6)"}`,
                        text: `${tmpC}. ${data[i + 1] != "" ? data[i + 1] : "unknown"}`
                    }),
                    UTILS.generateElement({
                        class: "leaderScore",
                        text: UTILS.kFormat(data[i + 2]) || "0"
                    })
                ]
            });
        })(i);
        tmpC++;
    }
}

if (movie) {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.background = 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 3px, transparent 3px, transparent 25px)';
    overlay.style.zIndex = '999';

    gameCanvas.parentElement.appendChild(overlay);
}

document.multis2 = .3

const Particles = [];
class Particle {
    constructor(x, y, dir, color, small) {
        this.x = x;
        this.y = y;
        this.dir = (dir - Math.PI / 3) + Math.random() * Math.PI * .75;
        this.scale = small ? 7 : 17;
        this.speed = 2;
        this.updated = Date.now();
        this.active = true;
        this.maxScale = this.scale;
        this.color = color;
    };
    update(xOffset, yOffset, ctx = mainContext) {
        const now = Date.now();
        const dt = (now - this.updated) / (1000 / 60);

        this.scale -= document.multis2 * dt;

        if (this.scale <= 0.1) {
            const id = Particles.indexOf(this);
            if (id > -1) Particles.splice(id, 1);
            return;
        };

        this.speed = this.scale / 4;
        this.x += Math.cos(this.dir) * this.speed * dt;
        this.y += Math.sin(this.dir) * this.speed * dt;
        this.updated = now;

        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
        ctx.globalAlpha = this.scale / this.maxScale;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x - xOffset, this.y - yOffset, this.scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    };
};

let xOffset, yOffset;
function updateGame() {
    if (player) {
        if (!lastSent || now - lastSent >= (1000 / config.clientSendRate)) {
            lastSent = now;
            //io.send("2", getAttackDir());
        }
    }

    if (deathTextScale < 120) {
        deathTextScale += 0.1 * delta;
        diedText.style.fontSize = `${Math.min(Math.round(deathTextScale), 120)}px`;
    }

    if (player) {
        const tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
        const tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
        const camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
        if (tmpDist > 0.05) {
            camX += camSpd * Math.cos(tmpDir);
            camY += camSpd * Math.sin(tmpDir);
        } else {
            camX = player.x;
            camY = player.y;
        }
    } else {
        camX = config.mapScale / 2;
        camY = config.mapScale / 2;
    }

    const lastTime = now - (1000 / config.serverUpdateRate);
    for (let i = 0; i < players.length + ais.length; ++i) {
        tmpObj = players[i] || ais[i - players.length];
        if (tmpObj && tmpObj.visible) {
            if (tmpObj.forcePos) {
                tmpObj.x = tmpObj.x2;
                tmpObj.y = tmpObj.y2;
                tmpObj.dir = tmpObj.d2;
            } else {
                const total = tmpObj.t2 - tmpObj.t1;
                const fraction = lastTime - tmpObj.t1;
                const ratio = (fraction / total);
                const rate = 200;
                tmpObj.dt += delta;
                const tmpRate = Math.min(1.7, tmpObj.dt / rate);
                let tmpDiff = (tmpObj.x2 - tmpObj.x1);
                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
            }
        }
    }

    xOffset = camX - (maxScreenWidth / 2);
    yOffset = camY - (maxScreenHeight / 2);

    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= 0) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
            maxScreenHeight - (config.snowBiomeTop - yOffset));
    } else {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth,
            (config.mapScale - config.snowBiomeTop - yOffset));
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
            maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
    }

    if (!firstSetup) {
        waterMult += waterPlus * config.waveSpeed * delta;
        if (waterMult >= config.waveMax) {
            waterMult = config.waveMax;
            waterPlus = -1;
        } else if (waterMult <= 1) {
            waterMult = waterPlus = 1;
        }
        mainContext.globalAlpha = 1;
        mainContext.fillStyle = "#dbc666";
        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
        mainContext.fillStyle = "#91b2db";
        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
    }

    const gridSize = 60;

    mainContext.lineWidth = 4;
    mainContext.strokeStyle = "#000";
    if (!movie) {
        mainContext.globalAlpha = 0.06;
        mainContext.beginPath();

        for (let x = -camX % gridSize; x < maxScreenWidth; x += gridSize) {
            mainContext.moveTo(x, 0);
            mainContext.lineTo(x, maxScreenHeight);
        }

        for (let y = -camY % gridSize; y < maxScreenHeight; y += gridSize) {
            mainContext.moveTo(0, y);
            mainContext.lineTo(maxScreenWidth, y);
        }
    }

    mainContext.stroke();
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderGameObjects(-1, xOffset, yOffset);
    mainContext.globalAlpha = 1;
    mainContext.lineWidth = outlineWidth;
    renderProjectiles(0, xOffset, yOffset);
    renderPlayers(xOffset, yOffset, 0);
    mainContext.globalAlpha = 1;

    for (let i = 0; i < ais.length; ++i) {
        tmpObj = ais[i];
        if (tmpObj.active && tmpObj.visible) {
            tmpObj.animate(delta);

            mainContext.save();
            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
            renderAI(tmpObj, mainContext);
            mainContext.restore();
        } else {
            if (tmpObj.aiTrail) tmpObj.aiTrail = [];
        }
    }

    const Length = Particles.length;
    for (let id = 0; id < Length; id++) Particles[id] && Particles[id].update(xOffset, yOffset)

    renderGameObjects(0, xOffset, yOffset);
    renderProjectiles(1, xOffset, yOffset);
    renderGameObjects(1, xOffset, yOffset);
    renderPlayers(xOffset, yOffset, 1);
    renderGameObjects(2, xOffset, yOffset);
    renderGameObjects(3, xOffset, yOffset);

    mainContext.fillStyle = "#000";
    mainContext.globalAlpha = 0.09;
    if (xOffset <= 0) {
        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
    } if (config.mapScale - xOffset <= maxScreenWidth) {
        const tmpY = Math.max(0, -yOffset);
        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
    } if (yOffset <= 0) {
        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
    } if (config.mapScale - yOffset <= maxScreenHeight) {
        const tmpX = Math.max(0, -xOffset);
        let tmpMin = 0;
        if (config.mapScale - xOffset <= maxScreenWidth)
            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
        mainContext.fillRect(tmpX, config.mapScale - yOffset,
            (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
    }

    if (path?.length) {
        mainContext.save();
        mainContext.translate(-xOffset, -yOffset);
        Pathfinder.draw(mainContext, player);
        mainContext.restore();
    }

    if (circles.length || arrows.length || lines.length) {
        mainContext.save();
        mainContext.globalAlpha = 1;
        mainContext.lineWidth = 3;

        for (let arrow of arrows) {
            if (!arrow.colour) arrow.colour = "#6e00ff";
            mainContext.fillStyle = arrow.colour;
            mainContext.strokeStyle = arrow.colour;

            const fromX = arrow.fromX - xOffset;
            const fromY = arrow.fromY - yOffset;
            const toX = arrow.toX - xOffset;
            const toY = arrow.toY - yOffset;

            mainContext.beginPath();
            mainContext.moveTo(fromX, fromY);
            mainContext.lineTo(toX, toY);
            mainContext.stroke();

            const headLength = arrow.headLength || 15;
            const angle = Math.atan2(toY - fromY, toX - fromX);

            mainContext.beginPath();
            mainContext.moveTo(toX, toY);
            mainContext.lineTo(
                toX - headLength * Math.cos(angle - Math.PI / 6),
                toY - headLength * Math.sin(angle - Math.PI / 6)
            );
            mainContext.lineTo(
                toX - headLength * Math.cos(angle + Math.PI / 6),
                toY - headLength * Math.sin(angle + Math.PI / 6)
            );
            mainContext.closePath();
            mainContext.globalAlpha = 0.3;
            mainContext.fill();
            mainContext.globalAlpha = 1;
            mainContext.stroke();
        }

        for (let circle of circles) {
            if (!circle.colour) circle.colour = "#6e00ff"
            mainContext.fillStyle = circle.colour;
            mainContext.strokeStyle = circle.colour;

            mainContext.beginPath();

            mainContext.arc(circle.x - xOffset, circle.y - yOffset, circle.scale || 35, 0, Math.PI * 2);
            mainContext.globalAlpha = .3;
            mainContext.fill();
            mainContext.globalAlpha = 1;
            mainContext.stroke();
        }

        for (let line of lines) {
            if (!line.colour) line.colour = "#6e00ff";
            mainContext.strokeStyle = line.colour;
            mainContext.lineWidth = line.width || 3;

            mainContext.beginPath();
            mainContext.moveTo(line.x1 - xOffset, line.y1 - yOffset);
            mainContext.lineTo(line.x2 - xOffset, line.y2 - yOffset);
            mainContext.globalAlpha = .6;
            mainContext.stroke();
            mainContext.globalAlpha = 1;
        }

        mainContext.restore();
    }
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = movie ? `rgba(0, 0, 0, 0.15)` : `rgba(0, 0, 70, 0.3)`;
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    buildHealth();
    buildIndicator();
    //buildGaps();
    mainContext.strokeStyle = darkOutlineColor;


    for (let i = 0; i < players.length + ais.length; ++i) {
        tmpObj = players[i] || ais[i - players.length];
        if (tmpObj.visible) {
            if (tmpObj.skinIndex != 10 || (tmpObj == player) || (tmpObj.team && tmpObj.team == player.team)) {
                const tmpText = (tmpObj.team ? `[${tmpObj.team}] ` : "") + (tmpObj.name || "");
                if (tmpText != "") {
                    mainContext.font = `${(tmpObj.nameScale || 30)}px Hammersmith One`;
                    mainContext.fillStyle = "#fff";
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";
                    mainContext.lineWidth = (tmpObj.nameScale ? 11 : 8);
                    mainContext.lineJoin = "round";
                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                        const tmpS = config.crownIconScale;
                        const tmpX = tmpObj.x - xOffset - (tmpS / 2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                            - config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                        const tmpS = config.crownIconScale;
                        const tmpX = tmpObj.x - xOffset - (tmpS / 2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                            - config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    }
                } if (!window._healthLerp) window._healthLerp = new WeakMap();

                let myPlayer = tmpObj.isPlayer && player.sid === tmpObj.sid;
                if (tmpObj.health > 0) {
                    if (tmpObj.isPlayer) {
                        let tmpWidth = config.healthBarWidth;

                        if (!tmpObj.reload[2].done) {
                            mainContext.fillStyle = darkOutlineColor;
                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 12, (config.healthBarWidth * 2) + (config.healthBarPad * 2), 17, 8);
                            mainContext.fill();

                            if (!tmpObj.reload[2].visual) tmpObj.reload[2].visual = 0;
                            let reload2Target = Math.min(1, tmpObj.reload[2].count / tmpObj.reload[2].max);
                            if (reload2Target > tmpObj.reload[2].visual) {
                                tmpObj.reload[2].visual += (reload2Target - tmpObj.reload[2].visual) * 0.1;
                            } else {
                                tmpObj.reload[2].visual = reload2Target;
                            }

                            mainContext.fillStyle = "#CCCC51";
                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad - 12, ((config.healthBarWidth * 2) * tmpObj.reload[2].visual), 17 - config.healthBarPad * 2, 7);
                            mainContext.fill();
                        }

                        let spacing = 7;
                        if (!myPlayer) {
                            mainContext.fillStyle = darkOutlineColor;
                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, (tmpObj.y - yOffset + tmpObj.scale) - 12 + config.nameY, (config.healthBarWidth * 2) + (config.healthBarPad * 2), 17, 8);
                            mainContext.fill();
                        }

                        let fullWidth = config.healthBarWidth * 2;
                        let barStartX = tmpObj.x - xOffset - config.healthBarWidth;
                        let barY = (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 12 + config.healthBarPad;
                        let barHeight = 17 - config.healthBarPad * 2;

                        const colours = ["#e19c30", "#CCCC51"];

                        if (!tmpObj.reload[0].visual) tmpObj.reload[0].visual = 0;
                        let reload0Target = Math.min(1, tmpObj.reload[0].count / tmpObj.reload[0].max);
                        if (reload0Target > tmpObj.reload[0].visual) {
                            tmpObj.reload[0].visual += (reload0Target - tmpObj.reload[0].visual) * 0.1;
                        } else {
                            tmpObj.reload[0].visual = reload0Target;
                        }
                        if (!myPlayer) {
                            let colour0 = tmpObj.reload[1].done && tmpObj.reload[0].done ? colours[0] : colours[1];
                            mainContext.fillStyle = colour0;
                            mainContext.roundRect(barStartX, barY, (fullWidth * 0.5 - spacing / 2) * tmpObj.reload[0].visual, barHeight, 7);
                            mainContext.fill();
                        }

                        if (!tmpObj.reload[1].visual) tmpObj.reload[1].visual = 0;
                        let reload1Target = Math.min(1, tmpObj.reload[1].count / tmpObj.reload[1].max);
                        if (reload1Target > tmpObj.reload[1].visual) {
                            tmpObj.reload[1].visual += (reload1Target - tmpObj.reload[1].visual) * 0.1;
                        } else {
                            tmpObj.reload[1].visual = reload1Target;
                        }
                        if (!myPlayer) {
                            let colour1 = tmpObj.reload[1].done && tmpObj.reload[0].done ? colours[0] : colours[1];
                            mainContext.fillStyle = colour1;
                            mainContext.roundRect(barStartX + fullWidth * 0.5 + spacing / 2, barY, (fullWidth * 0.5 - spacing / 2) * tmpObj.reload[1].visual, barHeight, 7);
                            mainContext.fill();
                        }

                        if (myPlayer) {
                            const bar0 = document.getElementById('reloadBar0');
                            const bar1 = document.getElementById('reloadBar1');

                            if (bar0 && bar1) {
                                const colours = ["#e19c30", "#CCCC51"];

                                let isDone = tmpObj.reload[1].done && tmpObj.reload[0].done;
                                let colour = isDone ? colours[0] : colours[1];

                                bar0.style.width = (tmpObj.reload[0].visual * 100) + "%";
                                bar1.style.width = (tmpObj.reload[1].visual * 100) + "%";

                                bar0.style.backgroundColor = colour;
                                bar1.style.backgroundColor = colour;
                            }
                        }
                    }

                    if (myPlayer) {
                        const healthRatio = player.health / player.maxHealth;
                        const potDmgRatio = Math.min(damage, 100) / 100;

                        if (ageBarBody && ageBarPot) {
                            let fullHealthPercent = healthRatio * 100;
                            ageBarBody.style.width = fullHealthPercent + "%";
                            ageBarBody.style.left = "0px";

                            let damagePercent = potDmgRatio * 100;
                            ageBarPot.style.width = Math.min(damagePercent, fullHealthPercent) + "%";

                            let startPoint = fullHealthPercent - damagePercent;
                            ageBarPot.style.left = Math.max(0, startPoint) + "%";
                        }
                    } else {
                        const isFriendly = tmpObj == player || (tmpObj.team && tmpObj.team == player.team);

                        const lerpSpeed = 0.12;
                        const prev = _healthLerp.get(tmpObj) ?? tmpObj.health;
                        const lerpedHealth = prev + (tmpObj.health - prev) * lerpSpeed;
                        _healthLerp.set(tmpObj, lerpedHealth);

                        const healthRatio = lerpedHealth / tmpObj.maxHealth;
                        const healthBarW = (config.healthBarWidth * 2) * healthRatio;
                        const barX = tmpObj.x - xOffset - config.healthBarWidth;
                        const barY = (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad;
                        const barH = 17 - config.healthBarPad * 2;

                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(
                            tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                            (tmpObj.y - yOffset + tmpObj.scale) + config.nameY,
                            (config.healthBarWidth * 2) + (config.healthBarPad * 2),
                            17, 8
                        );
                        mainContext.fill();

                        mainContext.fillStyle = isFriendly ? "#8ecc51" : "#cc5151";
                        mainContext.roundRect(barX, barY, healthBarW, barH, 7);
                        mainContext.fill();
                    }
                }
            }
        }
    }

    textManager.update(delta, mainContext, xOffset, yOffset);

    for (let i = 0; i < players.length; ++i) {
        tmpObj = players[i];
        if (tmpObj.visible && tmpObj.chatCountdown > 0) {
            tmpObj.chatCountdown -= delta;
            if (tmpObj.chatCountdown <= 0) {
                tmpObj.chatCountdown = 0;
            }
            mainContext.font = "32px Hammersmith One";
            const tmpSize = mainContext.measureText(tmpObj.chatMessage);
            mainContext.textBaseline = "middle";
            mainContext.textAlign = "center";
            const tmpX = tmpObj.x - xOffset;
            const tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
            const tmpH = 47;
            const tmpW = tmpSize.width + 17;
            mainContext.fillStyle = "rgba(0,0,0,0.2)";
            mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
            mainContext.fill();
            mainContext.fillStyle = "#fff";
            mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
        }
    }

    renderMinimap(delta);
    drawAdvisor();

    if (controllingTouch.id !== -1) {
        renderControl(
            controllingTouch.startX, controllingTouch.startY,
            controllingTouch.currentX, controllingTouch.currentY
        );
    }
    if (attackingTouch.id !== -1) {
        renderControl(
            attackingTouch.startX, attackingTouch.startY,
            attackingTouch.currentX, attackingTouch.currentY
        );
    }
}

function renderControl(startX, startY, currentX, currentY) {
    mainContext.save();
    mainContext.setTransform(1, 0, 0, 1, 0, 0);
    mainContext.scale(pixelDensity, pixelDensity);
    let controlRadius = 50;
    mainContext.beginPath();
    mainContext.arc(startX, startY, controlRadius, 0, Math.PI * 2, false);
    mainContext.closePath();
    mainContext.fillStyle = "rgba(255, 255, 255, 0.3)";
    mainContext.fill();
    controlRadius = 50;
    let offsetX = currentX - startX;
    let offsetY = currentY - startY;
    const mag = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    const divisor = mag > controlRadius ? (mag / controlRadius) : 1;
    offsetX /= divisor;
    offsetY /= divisor;
    mainContext.beginPath();
    mainContext.arc(startX + offsetX, startY + offsetY, controlRadius * 0.5, 0, Math.PI * 2, false);
    mainContext.closePath();
    mainContext.fillStyle = "white";
    mainContext.fill();
    mainContext.restore();
}

function renderProjectiles(layer, xOffset, yOffset) {
    for (let i = 0; i < projectiles.length; ++i) {
        tmpObj = projectiles[i];
        if (tmpObj.active && tmpObj.layer == layer) {
            tmpObj.update(delta);
            if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                mainContext.save();
                mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                mainContext.rotate(tmpObj.dir);
                renderProjectile(0, 0, tmpObj, mainContext, 1);
                mainContext.restore();
            }
        }
    }
}

const projectileSprites = {};
function renderProjectile(x, y, obj, ctxt) {
    if (obj.src) {
        const tmpSrc = items.projectiles[obj.indx].src;
        let tmpSprite = projectileSprites[tmpSrc];
        if (!tmpSprite) {
            tmpSprite = new Image();
            tmpSprite.onload = function () {
                this.isLoaded = true;
            }
            tmpSprite.src = `.././img/weapons/${tmpSrc}.png`;
            projectileSprites[tmpSrc] = tmpSprite;
        }
        if (tmpSprite.isLoaded) {
            ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
        }
    } else if (obj.indx == 1) {
        ctxt.fillStyle = "#939393";
        renderCircle(x, y, obj.scale, ctxt);
    }
}

function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
    const tmpW = config.riverWidth + padding;
    const tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
    if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
        ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
    }
}

function buildGaps() {
    for (let i = 0; i < objects.length; ++i) {
        tmpObj = objects[i];
        let tmpX = tmpObj.x + tmpObj.xWiggle - xOffset,
            tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;

        if (!isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0)) || !tmpObj.isItem || tmpObj.sid >= 1e15 || tmpObj.health <= 0 || !tmpObj.active) continue

        for (let j = i + 1; j < objects.length; ++j) {
            let otherObj = objects[j];
            let otherX = otherObj.x + otherObj.xWiggle - xOffset,
                otherY = otherObj.y + otherObj.yWiggle - yOffset;

            if (!isOnScreen(otherX, otherY, otherObj.scale + (otherObj.blocker || 0)) || !otherObj.isItem || otherObj.sid >= 1e15 || otherObj.health <= 0 || !otherObj.active) continue;

            let dx = otherX - tmpX;
            let dy = otherY - tmpY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > tmpObj.scale + otherObj.scale + 50) continue;

            let gap = distance - (tmpObj.scale + otherObj.scale);

            mainContext.beginPath();
            mainContext.moveTo(tmpX, tmpY);
            mainContext.lineTo(otherX, otherY);
            mainContext.lineWidth = 4;
            mainContext.strokeStyle = gap <= minGap ? "#ff0000" : "#00ff00";
            mainContext.stroke();
        }
    }
}

function buildIndicator() {
    mainContext.save();
    for (let i = 0; i < objects.length; ++i) {
        tmpObj = objects[i];
        let tmpX = tmpObj.x + tmpObj.xWiggle - xOffset,
            tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;

        if (!isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0)) || !tmpObj.isItem || tmpObj.sid >= 1e15 || !tmpObj.health || !tmpObj.active || ![6, 7, 8, 9, 15].includes(tmpObj.id) || ally(tmpObj.owner.sid)) continue
        mainContext.fillStyle = "#cc5151";

        mainContext.beginPath();

        mainContext.arc(tmpX, tmpY, tmpObj.scale, 0, Math.PI * 2);
        mainContext.globalAlpha = .25;
        mainContext.fill();
    }
    mainContext.restore();
}

function buildHealth() {
    for (let i = 0; i < objects.length; ++i) {
        tmpObj = objects[i];
        let tmpX = tmpObj.x + tmpObj.xWiggle - xOffset,
            tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;

        if (!isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0)) || !tmpObj.isItem || tmpObj.sid >= 1e15 || !tmpObj.health || tmpObj.health <= 0 || !tmpObj.active || tmpObj.health === tmpObj.maxHealth) continue

        if (tmpObj.health2 === undefined) tmpObj.health2 = tmpObj.health;
        tmpObj.health2 += (tmpObj.health - tmpObj.health2) * 0.15
        tmpObj.health2 = Math.min(tmpObj.health2, tmpObj.maxHealth);

        let tmpWidth = config.healthBarWidth;
        mainContext.fillStyle = darkOutlineColor;
        mainContext.roundRect(tmpX - config.healthBarWidth / 2 - config.healthBarPad, (tmpY + tmpObj.scale / 2) + config.nameY, (config.healthBarWidth) + (config.healthBarPad * 2), 17, 8);
        mainContext.fill();

        const sid = tmpObj.owner?.sid;
        mainContext.fillStyle = ally(sid) ? "#8ecc51" : "#cc5151";
        mainContext.roundRect(tmpX - config.healthBarWidth / 2, (tmpY + tmpObj.scale / 2) + config.nameY + config.healthBarPad, ((config.healthBarWidth) * (tmpObj.health2 / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
        mainContext.fill();
    }
}

function renderGameObjects(layer, xOffset, yOffset) {
    let tmpSprite, tmpX, tmpY, real;
    let now = performance.now();

    for (let i = 0; i < objects.length; ++i) {
        let tmpObj = objects[i];
        if (!tmpObj.active) continue;

        tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
        tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;

        if (layer == 0) {
            tmpObj.update(delta);
        }

        if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
            real = tmpObj.sid < 1e15;
            let baseAlpha = tmpObj.trap ? 0.6 : 1;
            if (!real) baseAlpha -= 0.4;

            if (real && tmpObj.tween) {
                let fadeDuration = 500;
                let elapsed = now - tmpObj.tween;

                if (elapsed < fadeDuration) {
                    let multiplier = Math.sin((elapsed / fadeDuration) * Math.PI);
                    mainContext.globalAlpha = baseAlpha - (0.4 * multiplier);
                } else {
                    mainContext.globalAlpha = baseAlpha;
                }
            } else {
                mainContext.globalAlpha = baseAlpha;
            }

            if (tmpObj.isItem) {
                tmpSprite = getItemSprite(tmpObj);

                mainContext.save();
                mainContext.translate(tmpX, tmpY);
                mainContext.rotate(tmpObj.dir);
                mainContext.scale(1.1, 1.1);
                let { globalAlpha } = mainContext;
                mainContext.globalAlpha -= .4;
                mainContext.drawImage(tmpSprite, -tmpSprite.width / 2, -tmpSprite.height / 2);
                mainContext.scale(1 / 1.1, 1 / 1.1);
                mainContext.globalAlpha = globalAlpha;
                mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                if (tmpObj.blocker && real) {
                    mainContext.strokeStyle = "#db6e6e";
                    let originalAlpha = mainContext.globalAlpha;
                    mainContext.globalAlpha = 0.3;
                    mainContext.lineWidth = 6;
                    renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                    mainContext.globalAlpha = originalAlpha;
                }

                mainContext.restore();

                if ([6, 7, 8, 9].includes(tmpObj.id) && !ally(tmpObj.owner.sid)) {
                    renderFade(mainContext, tmpX, tmpY, tmpObj);
                }
            } else {
                tmpSprite = getResSprite(tmpObj);
                mainContext.save();
                mainContext.translate(tmpX, tmpY);
                mainContext.rotate(tmpObj.dir);
                mainContext.scale(1.05, 1.05);
                mainContext.globalAlpha = .5;
                mainContext.drawImage(tmpSprite, -tmpSprite.width / 2, -tmpSprite.height / 2);
                mainContext.scale(1 / 1.05, 1 / 1.05);
                mainContext.globalAlpha = 1;
                mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2))
                mainContext.restore();
            }
        }
    }
}

function wiggleGameObject(dir, sid) {
    tmpObj = findObjectBySid(sid);
    if (tmpObj) {
        tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
        tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
        tmpObj.wiggleDate = performance.now();

        if (tmpObj.active && tmpObj.isItem && tmpObj.sid < 1e15 && tmpObj.health > 0) {
            if (objectManager.hitObj.indexOf(tmpObj) === -1) {
                objectManager.hitObj.push(tmpObj);
            }
        }
    }
}

function gatherAnimation(sid, didHit, index) {
    tmpObj = findPlayerBySID(sid);
    if (!tmpObj) return;

    if (tmpObj.daggerHand === undefined) {
        tmpObj.daggerHand = 0;
    }

    if (dagAnim && tmpObj.weaponIndex === 7) {
        tmpObj.daggerHand = tmpObj.daggerHand === 0 ? 1 : 0;
    }

    tmpObj.startAnim(didHit, index);
    tmpObj.gatherIndex = index;
    tmpObj.gathering = 1;

    if (didHit) {
        const tmpObjects = objectManager.hitObj;
        objectManager.hitObj = [];

        delay(() => {
            tmpObj = findPlayerBySID(sid);
            if (!tmpObj) return;
            console.log('variant: ' + config.weaponVariants[tmpObj.weaponVariant].val, 'hat: ' + tmpObj.skinIndex2);
            let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj.weaponVariant].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex2 == 40 ? 3.3 : 1);
            tmpObjects.forEach((healthy) => {
                healthy.health -= val;
            });
        }, 1);
    }

    queue.push({ function: gatherAction, data: [tmpObj, didHit, index] });
}
function gatherAction(tmpPlayer, didHit, index) {
    let hitObjs = tmpPlayer.gather(didHit, index);

    if (resAnim && tmpPlayer === player) for (let tmpObj of hitObjs) {
        if (!tmpObj.isItem) {
            if (tmpObj.type === 0) {
                spawnParticles(tmpObj.x, tmpObj.y, "img/resources/wood_ico.png", "woodDisplay");
            } else if (tmpObj.type === 1) {
                spawnParticles(tmpObj.x, tmpObj.y, "img/resources/food_ico.png", "foodDisplay");
            } else if (tmpObj.type === 2) {
                spawnParticles(tmpObj.x, tmpObj.y, "img/resources/stone_ico.png", "stoneDisplay");
            }
        }
    }
}

function renderPlayers(xOffset, yOffset, zIndex) {
    mainContext.globalAlpha = 1;
    for (let i = 0; i < players.length; ++i) {
        tmpObj = players[i];
        if (tmpObj.zIndex == zIndex) {
            tmpObj.animate(delta);
            if (tmpObj.visible) {
                tmpObj.skinRot += (0.002 * delta);
                tmpDir = ((tmpObj == player) ? getAttackDir() : tmpObj.dir) + (!dagAnim || tmpObj.weaponIndex !== 7 ? tmpObj.dirPlus : 0);

                if (trail) {
                    if (!tmpObj.playerTrail) tmpObj.playerTrail = [];
                    if (!tmpObj.trailTimer) tmpObj.trailTimer = 0;

                    tmpObj.trailTimer += delta;
                    if (tmpObj.trailTimer >= 16) {
                        tmpObj.playerTrail.push({
                            x: tmpObj.x,
                            y: tmpObj.y,
                            dir: tmpDir,
                            alpha: 1
                        });
                        tmpObj.trailTimer = 0;
                        if (tmpObj.playerTrail.length > 4) tmpObj.playerTrail.shift();
                    }

                    for (let j = 0; j < tmpObj.playerTrail.length; j++) {
                        const t = tmpObj.playerTrail[j];
                        t.alpha -= 0.015 * delta;
                        if (t.alpha > 0) {
                            mainContext.save();
                            mainContext.globalAlpha = t.alpha * 0.4;
                            mainContext.translate(t.x - xOffset, t.y - yOffset);
                            mainContext.rotate(t.dir);
                            renderPlayer(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                }

                mainContext.save();
                mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                mainContext.rotate(tmpDir);
                renderPlayer(tmpObj, mainContext);
                mainContext.restore();
            }
        }
    }
}

function renderPlayer(obj, ctxt) {
    ctxt = ctxt || mainContext;
    ctxt.lineWidth = outlineWidth;
    ctxt.lineJoin = "miter";

    const isDualDagger = dagAnim && obj.weaponIndex === 7 && obj.buildIndex < 0;
    const isPolearm = polearmAnim && obj.buildIndex < 0 && obj.weaponIndex === 5;

    let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
    let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
    let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;
    const handDistMult = isDualDagger ? 1.3 : 1;

    let thrust = 0;
    let handClump = 0;

    if (isPolearm) {
        handAngle -= 0.2;
        oHandAngle += 0.9;
        oHandDist += 0.3;
        const reload = obj.reload;
        if (reload && !reload[0].done) {
            const multiplier = Math.min(1, (Date.now() - reload[0].date) / reload[0].max2);
            const ease = Math.pow(Math.sin(multiplier * Math.PI), 0.8);
            thrust = ease * 25;
            handClump = ease * 10;
        }
    }

    if (obj.tailIndex > 0) {
        renderTail(obj.tailIndex, ctxt, obj);
    }

    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        if (isDualDagger) {
            const weaponData = items.weapons[obj.weaponIndex];
            const angleOffset = Math.PI / 12;

            const isGathering = obj.animTime > 0;
            const adjustedAnimTime = Math.max(0, obj.animSpeed - obj.animTime * dagAnim);
            const animProgress = isGathering ? (1 - (adjustedAnimTime / obj.animSpeed)) : 0;
            const isLeftHand = obj.daggerHand === 0;

            let stabProgress = 0;
            if (animProgress > 0) {
                if (animProgress < 0.5) {
                    stabProgress = animProgress * 2;
                } else {
                    const returnProgress = (animProgress - 0.5) * 2;
                    if (returnProgress < 0.7) {
                        stabProgress = 1 - (returnProgress / 0.7) * 1.15;
                    } else {
                        const smoothReturn = (returnProgress - 0.7) / 0.3;
                        stabProgress = -0.15 + (0.15 * (1 - smoothReturn));
                    }
                }
            }

            const stabDistance = 45;
            const leftStabProgress = isLeftHand ? stabProgress : 0;
            const rightStabProgress = !isLeftHand ? stabProgress : 0;

            const leftHandX = obj.scale * handDistMult * Math.cos(handAngle) + Math.cos(-angleOffset) * stabDistance * leftStabProgress;
            const leftHandY = obj.scale * handDistMult * Math.sin(handAngle) + Math.sin(-angleOffset) * stabDistance * leftStabProgress;
            const rightHandX = (obj.scale * oHandDist * handDistMult) * Math.cos(-handAngle * oHandAngle) + Math.cos(angleOffset) * stabDistance * rightStabProgress;
            const rightHandY = (obj.scale * oHandDist * handDistMult) * Math.sin(-handAngle * oHandAngle) + Math.sin(angleOffset) * stabDistance * rightStabProgress;

            ctxt.save();
            ctxt.translate(leftHandX, leftHandY);
            ctxt.rotate(-angleOffset - (leftStabProgress * Math.PI / 8));
            renderTool(weaponData, "dagger_2", 0, 0, ctxt);
            ctxt.restore();

            ctxt.save();
            ctxt.translate(rightHandX, rightHandY);
            ctxt.rotate(angleOffset + (rightStabProgress * Math.PI / 8));
            renderTool(weaponData, "dagger_2", 0, 0, ctxt);
            ctxt.restore();
        } else {
            renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt, obj);
            if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
            }
        }
    }

    ctxt.fillStyle = config.skinColors[obj.skinColor];

    if (isPolearm) ctxt.rotate(Math.PI * 0.4375);

    if (isDualDagger) {
        const angleOffset = Math.PI / 12;
        const isGathering = obj.animTime > 0;
        const adjustedAnimTime = Math.max(0, obj.animSpeed - obj.animTime * dagAnim);
        const animProgress = isGathering ? (1 - (adjustedAnimTime / obj.animSpeed)) : 0;
        const isLeftHand = obj.daggerHand === 0;

        let stabProgress = 0;
        if (animProgress > 0) {
            if (animProgress < 0.5) {
                stabProgress = animProgress * 2;
            } else {
                const returnProgress = (animProgress - 0.5) * 2;
                if (returnProgress < 0.7) {
                    stabProgress = 1 - (returnProgress / 0.7) * 1.15;
                } else {
                    const smoothReturn = (returnProgress - 0.7) / 0.3;
                    stabProgress = -0.15 + (0.15 * (1 - smoothReturn));
                }
            }
        }

        const stabDistance = 45;
        const leftStabProgress = isLeftHand ? stabProgress : 0;
        const rightStabProgress = !isLeftHand ? stabProgress : 0;

        renderCircle(
            obj.scale * handDistMult * Math.cos(handAngle) + Math.cos(-angleOffset) * stabDistance * leftStabProgress,
            obj.scale * handDistMult * Math.sin(handAngle) + Math.sin(-angleOffset) * stabDistance * leftStabProgress,
            14
        );
        renderCircle(
            (obj.scale * oHandDist * handDistMult) * Math.cos(-handAngle * oHandAngle) + Math.cos(angleOffset) * stabDistance * rightStabProgress,
            (obj.scale * oHandDist * handDistMult) * Math.sin(-handAngle * oHandAngle) + Math.sin(angleOffset) * stabDistance * rightStabProgress,
            14
        );
    } else if (isPolearm) {
        const reload = obj.reload;
        renderCircle(obj.scale * Math.cos(handAngle) - handClump, obj.scale * Math.sin(handAngle) - thrust, 14, ctxt);
        if (reload && !reload[0].done) {
            renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle), (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle) - (thrust * 0.8), 14, ctxt);
        } else {
            renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle), (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14, ctxt);
        }
    } else {
        renderCircle(obj.scale * handDistMult * Math.cos(handAngle), obj.scale * handDistMult * Math.sin(handAngle), 14);
        renderCircle((obj.scale * oHandDist * handDistMult) * Math.cos(-handAngle * oHandAngle), (obj.scale * oHandDist * handDistMult) * Math.sin(-handAngle * oHandAngle), 14);
    }

    if (isPolearm) ctxt.rotate(-Math.PI * 0.4375);

    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        if (isDualDagger) {
            const weaponData = items.weapons[obj.weaponIndex];
            const angleOffset = Math.PI / 12;
            const isGathering = obj.animTime > 0;
            const adjustedAnimTime = Math.max(0, obj.animSpeed - obj.animTime * dagAnim);
            const animProgress = isGathering ? (1 - (adjustedAnimTime / obj.animSpeed)) : 0;
            const isLeftHand = obj.daggerHand === 0;

            let stabProgress = 0;
            if (animProgress > 0) {
                if (animProgress < 0.5) {
                    stabProgress = animProgress * 2;
                } else {
                    const returnProgress = (animProgress - 0.5) * 2;
                    if (returnProgress < 0.7) {
                        stabProgress = 1 - (returnProgress / 0.7) * 1.15;
                    } else {
                        const smoothReturn = (returnProgress - 0.7) / 0.3;
                        stabProgress = -0.15 + (0.15 * (1 - smoothReturn));
                    }
                }
            }

            const stabDistance = 45;
            const leftStabProgress = isLeftHand ? stabProgress : 0;
            const rightStabProgress = !isLeftHand ? stabProgress : 0;

            const leftHandX = obj.scale * handDistMult * Math.cos(handAngle) + Math.cos(-angleOffset) * stabDistance * leftStabProgress;
            const leftHandY = obj.scale * handDistMult * Math.sin(handAngle) + Math.sin(-angleOffset) * stabDistance * leftStabProgress;
            const rightHandX = (obj.scale * oHandDist * handDistMult) * Math.cos(-handAngle * oHandAngle) + Math.cos(angleOffset) * stabDistance * rightStabProgress;
            const rightHandY = (obj.scale * oHandDist * handDistMult) * Math.sin(-handAngle * oHandAngle) + Math.sin(angleOffset) * stabDistance * rightStabProgress;

            ctxt.save();
            ctxt.translate(leftHandX, leftHandY);
            ctxt.rotate(-angleOffset - (leftStabProgress * Math.PI / 8));
            renderTool(weaponData, "dagger_2", 0, 0, ctxt);
            ctxt.restore();

            ctxt.save();
            ctxt.translate(rightHandX, rightHandY);
            ctxt.rotate(angleOffset + (rightStabProgress * Math.PI / 8));
            renderTool(weaponData, "dagger_2", 0, 0, ctxt);
            ctxt.restore();
        } else {
            renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt, obj);
            if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
            }
        }
    }

    if (obj.buildIndex >= 0) {
        const tmpSprite = getItemSprite(items.list[obj.buildIndex]);
        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
    }

    renderCircle(0, 0, obj.scale, ctxt);

    if (obj.skinIndex > -1) {
        ctxt.rotate(Math.PI / 2);
        renderSkin(!obj.skinIndex ? (isWealthy ? 0 : -1) : obj.skinIndex, ctxt, null, obj);
    }
}

const skinSprites = {};
const skinPointers = {};
let tmpSkin;

function renderSkin(index, ctxt, parentSkin, owner) {
    tmpSkin = skinSprites[index];
    if (!tmpSkin) {
        const tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = `.././img/skins/hat_${index}.png`;
        skinSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = parentSkin || skinPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < skins.length; ++i) {
            if (skins[i].id == index) {
                tmpObj = skins[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
    }
    if (!parentSkin && tmpObj?.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(`${index}_top`, ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

const accessSprites = {};
const accessPointers = {};
function renderTail(index, ctxt, owner) {
    tmpSkin = accessSprites[index];
    if (!tmpSkin) {
        const tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = `.././img/tails/access_${index}.png`;
        accessSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = accessPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < tails.length; ++i) {
            if (tails[i].id == index) {
                tmpObj = tails[i];
                break;
            }
        }
        accessPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
        if (tmpObj.spin) {
            ctxt.rotate(owner.skinRot);
        }
        ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

const toolSprites = {};
function renderTool(obj, variant, x, y, ctxt, player) {
    const tmpSrc = dagAnim && variant === "dagger_2" ? variant : obj.src + (variant || "");
    let tmpSprite = toolSprites[tmpSrc];
    if (!tmpSprite) {
        tmpSprite = new Image();
        tmpSprite.onload = function () {
            this.isLoaded = true;
        }
        tmpSprite.src = `.././img/weapons/${tmpSrc}.png`;
        toolSprites[tmpSrc] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
        const isPolearm = polearmAnim && player && player.buildIndex < 0 && player.weaponIndex === 5;
        ctxt.save();
        if (isPolearm) {
            const reload = player.reload;
            let thrust = 0;
            let sidewaysShift = 0;
            let rotationShift = 0;
            if (reload && !reload[0].done) {
                const multiplier = Math.min(1, (Date.now() - reload[0].date) / reload[0].max2);
                const ease = Math.pow(Math.sin(multiplier * Math.PI), 0.8);
                thrust = ease * 50;
                sidewaysShift = ease * 35;
                rotationShift = ease * 0.2;
            }
            ctxt.translate(player.scale - 20 + thrust - obj.length / 2, (215 - sidewaysShift) - obj.width / 2);
            ctxt.rotate((Math.PI * -0.5625) + rotationShift);
        } else {
            ctxt.translate(x + obj.xOff - obj.length / 2, y + obj.yOff - obj.width / 2);
        }
        ctxt.drawImage(tmpSprite, 0, 0, obj.length, obj.width);
        ctxt.restore();
    }
}

// RENDER GAME OBJECTS:
const gameObjectSprites = new Map();
const drawById_ = [];

function initGameObjectDispatch() {
    // Type 0: Trees/Saplings
    drawById_[0] = function (tmpContext, obj, biomeID) {
        let tmpScale;
        for (let i = 0; i < 2; ++i) {
            tmpScale = obj.scale * (!i ? 1 : 0.5);
            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
            tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
            tmpContext.fill();
            if (!i)
                tmpContext.stroke();
        }
    };

    // Type 1: Bushes
    drawById_[1] = function (tmpContext, obj, biomeID) {
        if (biomeID == 2) {
            tmpContext.fillStyle = "#606060";
            renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#89a54c";
            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
            tmpContext.fillStyle = "#a5c65b";
            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
        } else {
            renderBlob(tmpContext, 6, obj.scale, obj.scale * 0.7);
            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
            let tmpRange;
            let berries = 4;
            let rotVal = mathPI2 / berries;
            for (let i = 0; i < berries; ++i) {
                tmpRange = UTILS.randInt(obj.scale / 3.5, obj.scale / 2.3);
                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                    UTILS.randInt(10, 12), tmpContext);
            }
        }
    };

    // Type 2: Stone
    drawById_[2] = function (tmpContext, obj, biomeID) {
        tmpContext.fillStyle = (biomeID == 2) ? "#938d77" : "#939393";
        renderStar(tmpContext, 3, obj.scale, obj.scale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = (biomeID == 2) ? "#b2ab90" : "#bcbcbc";
        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
        tmpContext.fill();
    };

    // Type 3: Gold
    drawById_[3] = function (tmpContext, obj, biomeID) {
        tmpContext.fillStyle = "#e0c655";
        renderStar(tmpContext, 3, obj.scale, obj.scale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#ebdca3";
        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
        tmpContext.fill();
    };
}

initGameObjectDispatch();

function getResSprite(obj) {
    if (obj.type == 4) return document.createElement('canvas');

    let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
    let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
    let tmpSprite = gameObjectSprites.get(tmpIndex);

    if (!tmpSprite) {
        let tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
        let tmpContext = tmpCanvas.getContext('2d');
        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
        tmpContext.rotate(UTILS.randFloat(0, Math.PI));
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;

        let fn = drawById_[obj.type];
        if (fn) fn(tmpContext, obj, biomeID);

        tmpSprite = tmpCanvas;
        gameObjectSprites.set(tmpIndex, tmpSprite);
    }

    return tmpSprite;
}

// GET ITEM SPRITE:
const spriteCache = new Map();
const drawById = [];

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function randInt(rng, a, b) {
    return a + Math.floor(rng() * (b - a + 1));
}
function spriteKey(obj, asIcon) {
    const pad = (items.list[obj.id].spritePadding || 0);
    return `${obj.id}|${asIcon ? 1 : 0}|${obj.scale}|${outlineWidth}|${pad}`;
}

function initItemSpriteDispatch() {
    for (let i = 0; i < items.list.length; i++) {
        const it = items.list[i];
        if (!it) continue;
        const id = it.id != null ? it.id : i;

        switch (it.name) {
            case "apple":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#c15555";
                    renderCircle(0, 0, obj.scale, ctx);
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = "#89a54c";
                    const leafDir = -(Math.PI / 2);
                    renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir), 25, leafDir + Math.PI / 2, ctx);
                };
                break;

            case "cookie":
                drawById[id] = function (ctx, obj) {
                    const rng = mulberry32((obj.id * 1000003) ^ ((obj.scale * 1000) | 0));
                    ctx.fillStyle = "#cca861";
                    renderCircle(0, 0, obj.scale, ctx);
                    ctx.fillStyle = "#937c4b";
                    const chips = 4;
                    const rotVal = Math.PI * 2 / chips;
                    for (let k = 0; k < chips; ++k) {
                        const tmpRange = randInt(rng, obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * k), tmpRange * Math.sin(rotVal * k), randInt(rng, 4, 5), ctx, true);
                    }
                };
                break;

            case "cheese":
                drawById[id] = function (ctx, obj) {
                    const rng = mulberry32((obj.id * 1000003) ^ ((obj.scale * 1000) | 0));
                    ctx.fillStyle = "#f4f3ac";
                    renderCircle(0, 0, obj.scale, ctx);
                    ctx.fillStyle = "#c3c28b";
                    const chips = 4;
                    const rotVal = Math.PI * 2 / chips;
                    for (let k = 0; k < chips; ++k) {
                        const tmpRange = randInt(rng, obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * k), tmpRange * Math.sin(rotVal * k), randInt(rng, 4, 5), ctx, true);
                    }
                };
                break;

            case "wood wall":
            case "stone wall":
            case "castle wall":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = (obj.name === "castle wall") ? "#83898e" : (obj.name === "wood wall") ? "#a5974c" : "#939393";
                    const sides = (obj.name === "castle wall") ? 4 : 3;
                    renderStar(ctx, sides, obj.scale * 1.1, obj.scale * 1.1);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = (obj.name === "castle wall") ? "#9da4aa" : (obj.name === "wood wall") ? "#c9b758" : "#bcbcbc";
                    renderStar(ctx, sides, obj.scale * 0.65, obj.scale * 0.65);
                    ctx.fill();
                };
                break;

            case "spikes":
            case "greater spikes":
            case "poison spikes":
            case "spinning spikes":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = (obj.name === "poison spikes") ? "#7b935d" : "#939393";
                    const tmpScale = obj.scale * 0.6;
                    renderStar(ctx, (obj.name === "spikes") ? 5 : 6, obj.scale, tmpScale);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, ctx);
                    ctx.fillStyle = "#c9b758";
                    renderCircle(0, 0, tmpScale / 2, ctx, true);
                };
                break;

            case "windmill":
            case "faster windmill":
            case "power mill":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, ctx);
                    ctx.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, obj.scale * 1.2, 29, 4, ctx);
                    ctx.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale * 0.5, ctx);
                };
                break;

            case "mine":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#939393";
                    renderStar(ctx, 3, obj.scale, obj.scale);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = "#bcbcbc";
                    renderStar(ctx, 3, obj.scale * 0.55, obj.scale * 0.65);
                    ctx.fill();
                };
                break;

            case "sapling":
                drawById[id] = function (ctx, obj) {
                    for (let k = 0; k < 2; ++k) {
                        const tmpScale = obj.scale * (!k ? 1 : 0.5);
                        renderStar(ctx, 7, tmpScale, tmpScale * 0.7);
                        ctx.fillStyle = (!k ? "#9ebf57" : "#b4db62");
                        ctx.fill();
                        if (!k) ctx.stroke();
                    }
                };
                break;

            case "pit trap":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#a5974c";
                    renderStar(ctx, 3, obj.scale * 1.1, obj.scale * 1.1);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = outlineColor;
                    renderStar(ctx, 3, obj.scale * 0.65, obj.scale * 0.65);
                    ctx.fill();
                };
                break;

            case "boost pad":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, ctx);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = "#dbd97d";
                    renderTriangle(obj.scale * 1, ctx);
                };
                break;

            case "turret":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, ctx);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = "#939393";
                    const tmpLen = 50;
                    renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, ctx);
                    renderCircle(0, 0, obj.scale * 0.6, ctx);
                    ctx.fill();
                    ctx.stroke();
                };
                break;

            case "platform":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#cebd5f";
                    const tmpCount = 4;
                    const tmpS = obj.scale * 2;
                    const tmpW = tmpS / tmpCount;
                    let tmpX = -(obj.scale / 2);
                    for (let k = 0; k < tmpCount; ++k) {
                        renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, ctx);
                        ctx.fill();
                        ctx.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                };
                break;

            case "healing pad":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, ctx);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, ctx, true);
                };
                break;

            case "spawn pad":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, ctx);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, ctx);
                };
                break;

            case "blocker":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, ctx);
                    ctx.fill();
                    ctx.stroke();
                    ctx.rotate(Math.PI / 4);
                    ctx.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, ctx, true);
                };
                break;

            case "teleporter":
                drawById[id] = function (ctx, obj) {
                    ctx.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, ctx);
                    ctx.fill();
                    ctx.stroke();
                    ctx.rotate(Math.PI / 4);
                    ctx.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, ctx, true);
                };
                break;

            default:
                drawById[id] = null;
                break;
        }
    }
}

initItemSpriteDispatch();

function getItemSprite(obj, asIcon) {
    const key = spriteKey(obj, asIcon);
    const cached = spriteCache.get(key);
    if (cached) return cached;

    const pad = (items.list[obj.id].spritePadding || 0);
    const size = (obj.scale * 2.5) + outlineWidth + pad;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { alpha: true });

    const half = size * 0.5;
    ctx.translate(half, half);
    if (!asIcon) ctx.rotate(Math.PI / 2);

    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth * (asIcon ? (size / 81) : 1);

    const fn = drawById[obj.id];
    if (fn) fn(ctx, obj);

    spriteCache.set(key, canvas);
    return canvas;
}

function renderFade(ctxt, x, y, obj) {
    let spikeAmount = obj.id === 6 ? 5 : 6;

    let oneShape = Math.PI / spikeAmount,
        spikeCut = Math.PI / 30,
        radiusMltp = 1.3;

    ctxt.globalAlpha = .3;
    ctxt.strokeStyle = darkOutlineColor;
    ctxt.lineWidth = 7;

    for (let index = 0; index < spikeAmount; index += 1) {
        let start = obj.dir - oneShape / 2,
            end = obj.dir + oneShape / 2;

        ctxt.beginPath();
        ctxt.arc(x, y, obj.getScale() * radiusMltp, start + index * (oneShape * 2) + spikeCut, end + (index * oneShape * 2) - spikeCut);
        ctxt.stroke();
        ctxt.closePath();
    }

    ctxt.restore();
}

function renderLeaf(x, y, l, r, ctxt) {
    const endX = x + (l * Math.cos(r));
    const endY = y + (l * Math.sin(r));
    const width = l * 0.4;
    ctxt.moveTo(x, y);
    ctxt.beginPath();
    ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
        ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
    ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
        ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
    ctxt.closePath();
    ctxt.fill();
    ctxt.stroke();
}

function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
    tmpContext = tmpContext || mainContext;
    tmpContext.beginPath();
    tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
    if (!dontFill) tmpContext.fill();
    if (!dontStroke) tmpContext.stroke();
}

function renderStar(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x, y;
    const step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer;
        y = Math.sin(rot) * outer;
        ctxt.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * inner;
        y = Math.sin(rot) * inner;
        ctxt.lineTo(x, y);
        rot += step;
    }
    ctxt.lineTo(0, -outer);
    ctxt.closePath();
}

function renderRect(x, y, w, h, ctxt, stroke) {
    ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
    if (!stroke) {
        ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
    }
}

function renderRectCircle(x, y, s, sw, seg, ctxt, stroke) {
    ctxt.save();
    ctxt.translate(x, y);
    seg = Math.ceil(seg / 2);
    for (let i = 0; i < seg; i++) {
        renderRect(0, 0, s * 2, sw, ctxt, stroke);
        ctxt.rotate(Math.PI / seg);
    }
    ctxt.restore();
}

function renderBlob(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    let tmpOuter;
    ctxt.beginPath();
    ctxt.moveTo(0, -inner);
    for (let i = 0; i < spikes; i++) {
        tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
        ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
            Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
        rot += step * 2;
    }
    ctxt.lineTo(0, -inner);
    ctxt.closePath();
}

function renderTriangle(s, ctx) {
    ctx = ctx || mainContext;
    const h = s * (Math.sqrt(3) / 2);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(-s / 2, h / 2);
    ctx.lineTo(s / 2, h / 2);
    ctx.lineTo(0, -h / 2);
    ctx.fill();
    ctx.closePath();
}

function prepareMenuBackground() {
    const tmpMid = config.mapScale / 2;
    objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
    objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
    objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
    objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
    objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
    objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
    objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
    objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
    objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
    objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
    objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
    objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
    objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
    objects = gameObjects;
}

let updatePromise = null;
let updateReolve = null;

function resetPromise() {
    updatePromise = new Promise((resolve) => {
        updateReolve = resolve;
    });
}

resetPromise();

function loadGameObject(data) {
    let boosts = [];
    for (let i = 0; i < data.length; i += 8) {
        let obj = objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4], data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? { sid: data[i + 7] } : null));

        if (obj.isItem) {
            if (obj.id === 16 && (!player.team || !ally(obj.owner.sid))) boosts.push(obj);
        }

        if (obj && path && path.length > 1) {
            const clearance = (obj.getScale() || 0) + 35;

            for (let i = 0; i < path.length - 1; i++) {
                const wp1 = path[i];
                const wp2 = path[i + 1];

                const dx = wp2.x - wp1.x;
                const dy = wp2.y - wp1.y;
                const segmentLengthSq = dx * dx + dy * dy;

                if (segmentLengthSq === 0) {
                    const dist = Math.hypot(obj.x - wp1.x, obj.y - wp1.y);
                    if (dist < clearance) {
                        console.log(`Path blocked by ${obj.name} near waypoint, dist: ${dist}`);
                        Rebuild = true;
                        break;
                    }
                    continue;
                }

                const t = Math.max(0, Math.min(1, ((obj.x - wp1.x) * dx + (obj.y - wp1.y) * dy) / segmentLengthSq));

                const closestX = wp1.x + t * dx;
                const closestY = wp1.y + t * dy;

                const dist = Math.hypot(obj.x - closestX, obj.y - closestY);

                // console.log(dist, clearance)
                if (dist < clearance) {
                    console.log(`Path blocked by ${obj.name} on segment ${i}->${i + 1}`);
                    Rebuild = true;
                    break;
                }
            }
        }
    }

    if (updateReolve) {
        updateReolve();
        resetPromise();
    }

    for (let boost of boosts) {
        let target = findPlayerBySID(boost.owner.sid);
        if (!target || ally(target.sid)) continue;

        let dir = target.moveDir;
        if (dir === undefined || dir === null) dir = target.d2;

        let dist = Math.hypot(target.y2 - boost.y, target.x2 - boost.x),
            dist2 = Math.hypot(target.y2 - player.y2, target.x2 - player.x2),
            angle = UTILS.getDirection(player.x2, player.y2, target.x2, target.y2),
            diff = UTILS.getAngleDist(angle, dir);

        if (dist <= 150 && diff <= (Math.PI / 2.2) && dist2 <= 400) {
            if (player.items[5] === 21) {
                build(21, dir); // Blocker id is 21
            } else {
                build(player.items[2], dir);
                build(player.items[2], dir + Math.PI / 2);
                build(player.items[2], dir - Math.PI / 2);
            }
        }
    }
}

const PARTICLE_COUNT = 5;

function getHudRect(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    return el.getBoundingClientRect();
}

function spawnParticles(worldX, worldY, iconSrc, hudId) {
    const hudRect = getHudRect(hudId);
    if (!hudRect) return;

    const targetX = hudRect.left + hudRect.width / 2;
    const targetY = hudRect.top + hudRect.height / 2;

    const scale = Math.max(window.innerWidth / config.maxScreenWidth, window.innerHeight / config.maxScreenHeight);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle0 = Math.random() * Math.PI * 2;
        const radius = Math.random() * 30;
        const screenX = (worldX - xOffset) * scale + (window.innerWidth - config.maxScreenWidth * scale) / 2 + Math.cos(angle0) * radius;
        const screenY = (worldY - yOffset) * scale + (window.innerHeight - config.maxScreenHeight * scale) / 2 + Math.sin(angle0) * radius;

        const el = document.createElement("img");
        el.src = iconSrc;
        Object.assign(el.style, {
            position: "fixed",
            left: screenX + "px",
            top: screenY + "px",
            width: "24px",
            height: "24px",
            pointerEvents: "none",
            zIndex: "9999",
            transform: "translate(-50%, -50%)",
            opacity: "1",
            imageRendering: "pixelated",
        });
        document.body.appendChild(el);

        const angle = (Math.PI * 2 * i / PARTICLE_COUNT) + (Math.random() - 0.5) * 0.8;
        const spread = 120 + Math.random() * 120;
        const midX = screenX + Math.cos(angle) * spread;
        const midY = screenY + Math.sin(angle) * spread - 20;

        const delay = i * 40;
        const duration = 420 + Math.random() * 120;
        const startTime = performance.now() + delay;

        (function animate(el, startX, startY, mx, my, tx, ty, dur, t0) {
            function frame(now) {
                if (now < t0) { requestAnimationFrame(frame); return; }
                const t = Math.min(1, (now - t0) / dur);
                const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                const inv = 1 - e;

                const x = inv * inv * startX + 2 * inv * e * mx + e * e * tx;
                const y = inv * inv * startY + 2 * inv * e * my + e * e * ty;
                const s = 0.4 + Math.sin(t * Math.PI) * 1.5;
                const opacity = t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;

                el.style.left = x + "px";
                el.style.top = y + "px";
                el.style.opacity = opacity;
                el.style.transform = `translate(-50%, -50%) scale(${s.toFixed(3)})`;

                t < 1 ? requestAnimationFrame(frame) : el.remove();
            }
            requestAnimationFrame(frame);
        })(el, screenX, screenY, midX, midY, targetX, targetY, duration, startTime);
    }
}

/* function wiggleGameObject(dir, sid) {
     tmpObj = findObjectBySid(sid);
     if (tmpObj) {
         tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
         tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
         tmpObj.wiggleDate = performance.now();
 
         if (tmpObj.active && tmpObj.isItem && tmpObj.sid < 1e15 && tmpObj.health > 0) {
             if (objectManager.hitObj.indexOf(tmpObj) === -1) {
                 objectManager.hitObj.push(tmpObj);
             }
         }
     }
 }*/

function shootTurret(sid, dir) {
    tmpObj = findObjectBySid(sid);
    if (tmpObj) {
        tmpObj.dir = dir;
        tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
        tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
    }
}

const addProjectile_ = (x, y, dir, range, speed, indx, layer, sid) => {
    const isTurret = (range == 700 && speed == 1.5);

    let owner = null;

    for (let soldier of players) {
        if (soldier.visible) {
            const dist = Math.round(Math.hypot(soldier.y2 - y, soldier.x2 - x));

            if ([0, 1, 69, 70, 71, 72].includes(dist)) {

                if (soldier.reload) {
                    let idx = isTurret ? 2 : 1;

                    soldier.reload[idx].count = 0;
                    soldier.reload[idx].done = false;
                    soldier.reload[idx].date = Date.now();

                    if (idx === 1) {
                        soldier.weaponIndex = soldier.reload[1].id;

                        const weapon = items.weapons[soldier.weaponIndex];
                        const atkSpd = soldier.skinIndex === 20 ? 0.78 : 1;
                        soldier.reload[1].max = weapon.speed ? (Math.ceil(weapon.speed * atkSpd / (1e3 / 9))) : 0;
                        soldier.reload[1].max2 = weapon.speed * atkSpd;

                        if (weapon?.rec) {
                            soldier.x3 -= items.weapons[soldier.weaponIndex].rec * Math.cos(soldier.d2) * 111;
                            soldier.y3 -= items.weapons[soldier.weaponIndex].rec * Math.sin(soldier.d2) * 111;
                        }
                    }
                }

                owner = soldier;
                break;
            }
        }
    }

    if (!owner && isTurret) owner = objects?.find(c => Math.hypot(c.y - y, c.x - x) <= 10);

    let proj = projectileManager.addProjectile(x, y, dir, range, speed, indx, owner, null, layer);
    proj.sid = sid;
    proj.target_update(time, true);
};

function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
    queue.push({ function: addProjectile_, data: [x, y, dir, range, speed, indx, layer, sid] });
}

function remProjectile_(sid, range) {
    for (let i = 0; i < projectiles.length; ++i) {
        if (projectiles[i].sid == sid) {
            projectiles[i].range = range;
        }
    }
}

function remProjectile(sid, range) {
    queue.push({ function: remProjectile_, data: [sid, range] });
}

function animateAI(sid) {
    tmpObj = findAIBySID(sid);
    if (tmpObj) tmpObj.startAnim();
}

function loadAI(data) {
    queue.push({ function: loadAI_, data: [data] });
}

function loadAI_(data) {
    for (let i = 0; i < ais.length; ++i) {
        ais[i].forcePos = !ais[i].visible;
        ais[i].visible = false;
    }
    if (data) {
        const tmpTime = Date.now();
        for (let i = 0; i < data.length;) {
            tmpObj = findAIBySID(data[i]);
            if (tmpObj) {
                tmpObj.index = data[i + 1];
                tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                tmpObj.t2 = tmpTime;
                tmpObj.x1 = tmpObj.x;
                tmpObj.y1 = tmpObj.y;
                tmpObj.x2 = data[i + 2];
                tmpObj.y2 = data[i + 3];
                tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                tmpObj.d2 = data[i + 4];
                if (particles && data[i + 5] < tmpObj.health) {
                    for (let dir = 0; dir < Math.PI * 2; dir += Math.PI / 4) Particles.push(new Particle(tmpObj.x, tmpObj.y, dir, "#cc5151"));
                }
                tmpObj.health = data[i + 5];
                tmpObj.dt = 0;
                tmpObj.visible = true;
                tmpObj.update();
            } else {
                tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                tmpObj.x2 = tmpObj.x;
                tmpObj.y2 = tmpObj.y;
                tmpObj.d2 = tmpObj.dir;
                tmpObj.health = data[i + 5];
                if (!aiManager.aiTypes[data[i + 1]].name)
                    tmpObj.name = config.cowNames[data[i + 6]];
                tmpObj.forcePos = true;
                tmpObj.sid = data[i];
                tmpObj.visible = true;
            }
            i += 7;
        }
    }
}

const aiSprites = {};
function renderAI(obj, ctxt) {
    const tmpIndx = obj.index;
    let tmpSprite = aiSprites[tmpIndx];
    if (!tmpSprite) {
        const tmpImg = new Image();
        tmpImg.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImg.src = `.././img/animals/${obj.src}.png`;
        tmpSprite = tmpImg;
        aiSprites[tmpIndx] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
        const tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
        ctxt.globalAlpha = .5;
        mainContext.scale(1.05, 1.05);
        ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
        ctxt.globalAlpha = 1;
        mainContext.scale(1 / 1.05, 1 / 1.05);
        ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
    }
}

function isOnScreen(x, y, s) {
    return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && y - s <= maxScreenHeight)
}

function addPlayer(data, isYou) {
    let tmpPlayer = findPlayerByID(data[0]);
    if (!tmpPlayer) {
        tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
            objectManager, players, ais, items, skins, tails);
        players.push(tmpPlayer);
    }
    tmpPlayer.spawn(isYou ? 1 : null);
    tmpPlayer.visible = false;
    tmpPlayer.x2 = undefined;
    tmpPlayer.y2 = undefined;
    tmpPlayer.setData(data);
    if (isYou) {
        player = tmpPlayer;
        player.isMe = true;
        camX = player.x;
        camY = player.y;
        updateItems();
        updateStatusDisplay();
        updateAge();
        updateUpgrades(0);
        gameUI.style.display = "block";
    }
}

function removePlayer(id) {
    players = players.filter(p => p.id !== id);
}

function updateItemCounts(groupId, value) {
    if (player) {
        player.itemCounts[groupId] = value;

        const spans = [...document.querySelectorAll(`.itemCounter[data-id="${groupId}"]`)];

        for (let span of spans) {
            const item = items.list.find(i => i.group && i.group.id === groupId);
            const limit = (item && item.group) ? item.group.limit : null;
            span.textContent = limit ? `${value}` : value;
        }
    }
}

function updatePlayerValue(index, value, updateView) {
    if (player) {
        player[index] = value;
        if (updateView) {
            updateStatusDisplay();
        }
    }
}

function updateHealth(sid, value) {
    tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        if (tmpObj.health > value) {
            if (particles) for (let dir = 0; dir < Math.PI * 2; dir += Math.PI / 4) Particles.push(new Particle(tmpObj.x, tmpObj.y, dir, "#cc5151"))

            tmpObj.hitTime = Date.now();
            const leak = (() => {
                let skin = skins.find(hat => hat.id === tmpObj.skinIndex),
                    tail = tails.find(accessory => accessory.id === tmpObj.tailIndex),
                    regen = (skin && skin.healthRegen ? skin.healthRegen : 0) + (tail && tail.healthRegen ? tail.healthRegen : 0),
                    dmgOverTime = tmpObj.dmgOverTime && tmpObj.dmgOverTime.dmg ? -tmpObj.dmgOverTime.dmg : 0;

                let x = config.mapScale - config.volcanoScale - 120,
                    y = config.mapScale - config.volcanoScale - 120,
                    dist = UTILS.getDistance(x, y, tmpObj.x2, tmpObj.y2);
                if (dist < config.volcanoAggressionRadius) regen -= 1;

                return regen + dmgOverTime;
            })();

            if (leak && (leak + tmpObj.health) === value) tmpObj.leak = tmpObj.timerCount;
        } else {
            tmpObj.build();
        }

        tmpObj.health = value;
    }
}

let lastAngle, angleSafety = Math.PI / 180 / 4;

function look(dir) {
    if (dir === undefined) dir = getAttackDir()
    if (Math.abs(lastAngle - dir) < angleSafety) return
    io.send("2", dir);
    lastAngle = dir;
}

let built, maxBuilds, phantom = [];
function build(id, angle = getAttackDir(), repeat = 1, skip) {
    if (!player.visible) return;

    let group = items.list[id]?.group.id;
    if (group === undefined) return;

    let limit = config.inSandbox ? (group === 3 ? 299 : 99) : items.groups[group].limit;
    if (limit <= player.itemCounts[group]) {
        if (group === 3 && autoWindmills) {
            autoWindmills = false;
        }
        return;
    }

    let passed;
    let isFood = passed = id <= 2;
    if (!isFood) {
        let item = items.list[id];
        let canBuild = passed = skip || player.buildItem(item, angle);

        if (canBuild) {
            const scale = (35 + item.scale + (item.placeOffset || 0));

            let build = {
                x: player.x2 + Math.cos(angle) * scale,
                y: player.y2 + Math.sin(angle) * scale,
                id: id,
                sid: Math.round(1e15 + Math.random() * 5e4),
            }

            phantom.push(build);
            objectManager.add(build.sid, build.x, build.y, angle, item.scale, 1, item, !0, player.sid, true);
        }
    }

    if (passed) {
        maxBuilds -= 1;
        if (!isFood && maxBuilds < 0) return

        built = true;

        while (repeat > 0) {
            repeat -= 1;

            io.send("5", id, null);
            io.send("c", true, angle);
            lastAngle = angle;
        }
    };
}

const autoStore = [[11, 1], [40, 0], [6, 0], [57, 0], [15, 0], [12, 0], [31, 0], [53, 0], [7, 0], [21, 0], [26, 0], [19, 1], [13, 1], [18, 1]];

function equip(id, id2 = 0) {
    const shop = Number(id === "shop");
    if (shop) {
        const sorted = enemy && enemy.length
            ? [[11, 1], [6, 0], ...autoStore.filter(c => !(c[0] === 6 && !c[1]))]
            : autoStore;
        const cloth = sorted.find(cloth => !player[cloth[1] ? "tails" : "skins"][cloth[0]]);
        if (!cloth) return null;

        [id, id2] = cloth;
        let list = id2 ? tails : skins,
            item = list.find(c => c.id == id),
            buy = item?.price && item?.price <= player.points;

        if (!buy) return
    }

    !shop && updateStoreItems(1, id, id2)
    io.send("13c", shop, id, id2);
    return true;
}

function potDmg() {
    if (!player?.visible) return;
    let dmg = (!isNaN(player.spike) ? player.spike : 0) + player.ai * 2,
        spiked = 0;

    for (let e of enemies) {
        let dist = UTILS.getDistance(player.x2, player.y2, e.x2, e.y2);

        let weapon = items.weapons[e.reload[0].id],
            primary = (e.reload[0].done ? weapon.dmg : 0) * e.reload[0].val;

        const turret = (e.reload[2].done ? (() => {
            let item = items.projectiles[1];

            if (dist > item.tick[1]) return 0;
            return 25;
        })() : 0);

        const too_far = dist > 90 + items.weapons[e.reload[0].id]?.range;
        if (too_far) {
            primary = 0;
        } else if (e.reload[0].id === 0) primary += 45 * 1.5;

        let projectile;
        const secondary = (e.reload[1].done ? (() => {
            weapon = items.weapons[e.reload[1].id];

            if (weapon.projectile) {
                if (!e.reload[0].id) return 0;
                projectile = true;

                const item = items.projectiles[weapon.projectile];
                if (item?.dmg) {
                    dist = UTILS.getDistance(player.x2, player.y2, e.x2, e.y2);
                    if (dist > item.tick[1]) return 0;
                    return item.dmg;
                } else return 0
            } else if (weapon.dmg && dist <= weapon.range + 90) {
                return weapon.dmg * e.reload[1].val;
            }
            return 0;
        })() : 0)

        const options = [];

        if (primary) {
            if (e.spike2) {
                if (turret) options.push({ value: e.spike2 + primary + turret, label: 'spike + primary + turret' });
                options.push({ value: e.spike2 + primary * 1.5, label: 'spike + primary * 1.5' });
            }
            if (turret) options.push({ value: primary + turret, label: 'primary + turret' });
            options.push({ value: primary * 1.5, label: 'primary * 1.5' });
        }
        if (secondary) {
            if (!projectile) {
                if (turret) options.push({ value: secondary + turret, label: 'secondary + turret' });
                options.push({ value: secondary * 1.5, label: 'secondary * 1.5' });
                if (e.spike2) {
                    if (turret) options.push({ value: e.spike2 + secondary + turret, label: 'spike + secondary + turret' });
                    options.push({ value: e.spike2 + secondary * 1.5, label: 'spike + secondary * 1.5' });
                }
            } else {
                if (turret) options.push({ value: secondary + turret, label: 'secondary + turret' });
                options.push({ value: secondary, label: 'secondary' });
            }
        }

        if (turret) {
            if (e.spike2) options.push({ value: e.spike2 + turret, label: 'spike + turret' });
            options.push({ value: turret, label: 'turret' });
        }

        if (player.buildIndex === -1 && [player.weapons[0], player.weapons[1]].includes(player.weaponIndex) && player.reload[+(player.weaponIndex !== player.weapons[0])].done && UTILS.getDistance(player.x2, player.y2, e.x2, e.y2) <= items.weapons[player.weaponIndex].range + player.scale * 1.8) {
            if (e.skinIndex === 11 || e.tailIndex === 21) {
                options.push({ value: items.weapons[player.weaponIndex].dmg * 0.45 + items.weapons[player.weaponIndex].dmg * 0.25, label: 'cx wings + spikegear' });
            } else if (e.skinIndex === 7) {
                options.push({ value: items.weapons[player.weaponIndex].dmg * 0.25, label: 'cx wings' });
            } else {
                options.push({ value: items.weapons[player.weaponIndex].dmg * 0.45, label: 'spike gear' });
            }
        }

        const option = options.reduce((max, opt) => opt.value > max.value ? opt : max, { value: 0, label: 'none' });
        option.value && console.log(`dmg: ${Number(option.value.toFixed(2))}, ${option.label}`);

        dmg += option.value;
    }

    if (enemy) {
        let obj = items.weapons[enemy.reload[0].id],
            dist = UTILS.getDistance(player.x3, player.y3, enemy.x3, enemy.y3);
        if (obj.range && obj.range + 90 > dist) {
            let tmpDir = UTILS.dir(enemy, player);
            let impact = 0.3 + (obj.knock || 0);

            let knockback = impact * (111 * 2.3);

            let x4 = player.x3 + Math.cos(tmpDir) * knockback,
                y4 = player.y3 + Math.sin(tmpDir) * knockback;

            let spike = objects.find(c => {
                if (!c.active || c.sid >= 1e15 || !c.dmg || (c.isItem && ally(c.owner.sid))) return false;

                let hitboxPadding = c.scale + 35;
                let recX = c.x - hitboxPadding;
                let recY = c.y - hitboxPadding;
                let recX2 = c.x + hitboxPadding;
                let recY2 = c.y + hitboxPadding;

                return UTILS.lineInRect(recX, recY, recX2, recY2, player.x3, player.y3, x4, y4);
            });

            if (spike && !player.trap) {
                dmg += spike.dmg;
                let angle = Math.atan2(y4 - spike.y, x4 - spike.x);
                let blue_circle = {
                    x: spike.x + Math.cos(angle) * (spike.getScale() + 35),
                    y: spike.y + Math.sin(angle) * (spike.getScale() + 35),
                    colour: "blue"
                };
                circles.push(blue_circle);
                spiked = true;
            }
        }
    }

    for (let bullet of projectiles) {
        if (bullet.active && bullet.estimated === 2 && bullet.target?.isPlayer && bullet.target.sid === player.sid) dmg += bullet.dmg;
    }

    if (kbResult) dmg += kbResult;

    if (player.skinIndex === 6) dmg *= 0.75;
    if (player.skinIndex === 7) dmg += 5;
    if ((dmg >= 100 && !active) || spiked) equip(6, 0);
    if (spiked) player.hitTime = 0;

    return dmg;
}

let active;

let lastAids;
function aids() {
    if (active || !enemy || !enemy.trap || player.weapons[1] !== 10 || ![4, 5].includes(player.weapons[0]) || !player.reload[1].done || !player.reload[0].done) return
    let hammer = items.weapons[10],
        tmpDist = UTILS.getDistance(player.x3, player.y3, enemy.trap.x, enemy.trap.y) - enemy.trap.scale;

    if (tmpDist > hammer.range) return

    let useTurret = player.skins[53] && player.reload[2].done && enemy.trap.health <= hammer.dmg * hammer.sDmg * player.reload[1].val
    let willBreak = (useTurret || enemy.trap.health <= hammer.dmg * hammer.sDmg * player.reload[1].val * 3.3);
    lastAids = performance.now();

    if (!willBreak) return

    console.log(`aids using ${useTurret ? 'turret gear' : 'tank gear'}`)
    active = true;
    aimbot = true;
    state.weapon = player.weapons[1];
    state.skin = useTurret ? 53 : 40;
    !player.autoGather && sendAutoGather();
    delay(() => {
        !player.autoGather && sendAutoGather();
        state.weapon = player.weapons[0];
        state.skin = 7;
    }, 1);
    delay(() => {
        active = false;
        aimbot = false;
        player.autoGather && sendAutoGather();
    }, 2);
}

async function Preplace() {
    if (!enemy || autoGrind) return

    let dist = UTILS.getDistance(player.x2, player.y2, enemy.x2, enemy.y2);
    if (dist > 400) return;

    let storage = [];
    for (b of objects) {
        if (!b.active || !b.isItem || b.sid >= 1e15) continue;
        let canDeal = 0;

        for (p of players) {
            if (!p.visible) continue;
            let primary = p.reload[0],
                secondary = p.reload[1];

            let dist = UTILS.getDistance(b.x, b.y, p.x3, p.y3);
            const damages = [primary.done && dist <= items.weapons[primary.id].range + b.scale ? (items.weapons[primary.id].dmg * primary.val * 3.3) : 0,
            secondary.done && dist <= items.weapons[secondary.id].range + b.scale ? (items.weapons[secondary.id].dmg * (secondary.id === 10 ? 7.5 : 1) * secondary.val * 3.3) : 0];

            let main = Math.max(damages[0], damages[1]);

            if (main) {
                let isLooking = (Math.abs(UTILS.dir(p, b) - p.d2) <= Math.PI / 2.6);

                if (main/* && isLooking*/) canDeal += main;
            }
        }

        if (canDeal && canDeal >= b.health) storage.push(b);
    }

    if (storage.length) {
        let placed;
        try {
            let angle = lastAngle;
            for (let b of storage) {
                if (UTILS.getDistance(b.x, b.y, player.x3, player.y3) >= player.scale + b.scale + 100) continue;
                if (!b.tween || performance.now() - b.tween > 500) {
                    b.tween = performance.now();
                }

                let angle = UTILS.dir(player, b),
                    buildId = player.items[lastAids && performance.now() - lastAids <= 500 && enemy && enemy.trap?.sid === b.sid ? 2 : player.items[5] && keys[72] ? 5 : (!trap && player.items[4] === 15 && (keys[70] || b.id === 15) ? 4 : 2)],
                    item = items.list[buildId];

                if (enemy && enemy.trap && b.sid === enemy.trap.sid) {
                    let score = 0, best;
                    let lastBuild;
                    item = items.list[player.items[2]];

                    let angle = UTILS.dir(player, enemy)
                    const fibCount = 21;
                    for (let i = 0; i < fibCount; i++) {
                        const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
                        const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

                        for (let dir of dirs) {
                            let canBuild = player.buildItem(item, dir, b);
                            const scale = (35 + item.scale + (item.placeOffset || 0));

                            let build2 = {
                                x: player.x3 + Math.cos(dir) * scale,
                                y: player.y3 + Math.sin(dir) * scale,
                                sid: Math.round(1e15 + Math.random() * 500)
                            }

                            let dist = UTILS.dist(build2, b);
                            if (!placed && canBuild && dist < b.scale + item.scale) {
                                placed = dir;
                                build(buildId, dir, 1, 1);
                                break;
                            }
                        }
                        if (placed) break;
                    }
                } else {
                    const fibCount = 13;
                    for (let i = 0; i < fibCount; i++) {
                        const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
                        const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

                        for (let dir of dirs) {
                            let canBuild = player.buildItem(item, dir, b);
                            const scale = (35 + item.scale + (item.placeOffset || 0));

                            let build2 = {
                                x: player.x3 + Math.cos(dir) * scale,
                                y: player.y3 + Math.sin(dir) * scale,
                                sid: Math.round(1e15 + Math.random() * 500)
                            }

                            let dist = UTILS.dist(build2, b);
                            if (!placed && canBuild && dist < b.scale + item.scale) {
                                placed = dir;
                                build(buildId, dir, 1, 1);
                                break;
                            }
                        }
                        if (placed) break;
                    }
                }
            }
            storage = [];
            if (built) {
                //    io.send("c", placed, true);
                io.send("5", state.weapon || autoReload(true), true);
                io.send("c", false, lastAngle);
                built = false;
                lastAngle = 0;
                look(angle)
            }
        } catch (e) {
            console.error(e.message);
        }
    }
}

let aggressive;

function antiSpike() {
    if (player.spike) {
        state.skin = 6;

        return;
    }

    if (!enemy) return

    aggressive = [];
    let disableTrap = player.trap && Boolean(player.trap.active);
    let dmg = 0;

    for (let enemy of enemies) {
        if (UTILS.getDistance(enemy.x3, enemy.y3, player.x3, player.y3) > 350) continue;

        let score = 0, best;
        let lastBuild, item = items.list[9];

        let angle = UTILS.dir(enemy, player)
        const fibCount = 52;

        for (let i = 0; i < fibCount; i++) {
            const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
            const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

            for (let dir of dirs) {
                const canBuild = enemy.buildItem(item, dir, disableTrap ? player.trap : true);
                const scale = (35 + item.scale + (item.placeOffset || 0));

                let build = {
                    x: enemy.x2 + Math.cos(dir) * scale,
                    y: enemy.y2 + Math.sin(dir) * scale,
                    dmg: item.dmg,
                    dir: dir,
                    isItem: true,
                    owner: { sid: enemy.sid },
                    sid: Math.round(1e15 + Math.random() * 5000)
                };

                let dist = UTILS.getDistance(build.x, build.y, player.x3, player.y3);

                if (canBuild && dist <= item.scale + player.scale) {
                    lastBuild = objectManager.add(build.sid, build.x, build.y, build.dir, item.scale, 1, item, !0, enemy.sid, true);
                    let tmpScore = kbScore(lastBuild, player);
                    objectManager.disableBySid(lastBuild.sid);

                    if (score < tmpScore) {
                        score = tmpScore;
                        best = build;
                    }
                }
            }
        }
        if (score > 0) {
            enemy.spike2 = score < 70 ? Math.max(item.dmg * 2, item.dmg * (score / 20)) : item.dmg * 2;
            aggressive.push({ x: best.x, y: best.y, scale: item.scale })
            console.log('can get spiked, score:', score)
        }
    }
}

function autoHeal() {
    let dmg = 100 - player.health,
        shamed = player.skinIndex === 45;

    if (shamed) {
        player.shameCount = 8;
    } else if (player.shameCount === 8) player.shameCount = 0;

    if (!dmg || shamed) return;

    const leak = (() => {
        let skin = skins.find(hat => hat.id === player.skinIndex),
            tail = tails.find(accessory => accessory.id === player.tailIndex),
            regen = (skin && skin.healthRegen ? skin.healthRegen : 0) + (tail && tail.healthRegen ? tail.healthRegen : 0),
            dmgOverTime = player.dmgOverTime && player.dmgOverTime.dmg ? -player.dmgOverTime.dmg : 0;

        let x = config.mapScale - config.volcanoScale - 120,
            y = config.mapScale - config.volcanoScale - 120,
            dist = UTILS.getDistance(x, y, player.x2, player.y2);
        if (dist < config.volcanoAggressionRadius) regen -= 1;

        return regen + dmgOverTime;
    })();

    function consume() {
        let amount = dmg / (player.items[0] === 0 ? 20 : 40);
        let item = items.list[player.items[0]];
        if (item.req[1] > player[item.req[0]] && !config.inSandbox) return
        build(player.items[0], 0, amount)
    }

    let ready = keys[81] || Date.now() - player.hitTime >= 1e3 / 9 || (player.shameCount < (!trap || !player.spike ? 7 : 8) && player.health < damage)
    if (dmg > leak && ready) consume();
}

let breakWeapon;
function autoBreak(build, weapon, best_angle) {
    let hammer = (player.weapons[1] && player.weapons[1] === 10),
        dmg = {
            primary: (items.weapons[player.weapons[0]].dmg * player.reload[0].val * (items.weapons[player.weapons[0]].sDmg || 1) * (player.skins[40] ? 3.3 : 1)),
            secondary: hammer ? (items.weapons[player.weapons[1]].dmg * player.reload[1].val * (items.weapons[player.weapons[1]].sDmg || 1) * (player.skins[40] ? 3.3 : 1)) : 0
        }

    const fast = (!player.weapons[1] || (player.reload[0].max - player.reload[0].count) < (player.reload[1].max - player.reload[1].count)) ? 0 : 1,
        ready = player.reload[(hammer ? 1 : 0)].done,
        same = (build.health <= dmg.primary && build.health <= dmg.secondary),
        could = (hammer && player.reload[0].done && !ready && build.health <= dmg.primary),
        break_weapon = Number((!same ? (could ? 0 : Number(player.weapons[(hammer ? 1 : 0)] >= 9)) : fast));

    if (weapon) return items.weapons[break_weapon];

    let angle_found, build_angle = best_angle || UTILS.dir(player, build);

    for (let enemy of enemies) {
        if (!angle_found && enemy && !best_angle) { /* angle between enemy and trap if possible */
            const dist = UTILS.getDistance(enemy.x3, enemy.y3, player.x3, player.y3);

            if (dist <= items.weapons[break_weapon].range + 70 && (ready || could)) {
                const mid = build_angle + (build_angle - UTILS.dir(player, enemy) / 2)
                const possible = Math.abs(build_angle - mid) < Math.PI / 2.6 && Math.PI / 2.6 > Math.abs(UTILS.dir(player, enemy) - mid);

                if (possible) build_angle = mid, angle_found = true;
            }
        }
    }

    weapon = player.weapons[break_weapon];
    state.weapon = breakWeapon = weapon;
    if (ready || could) { /* break state */
        dmg = (items.weapons[weapon].dmg * player.reload[Number(break_weapon > 8)].val * (items.weapons[weapon].sDmg || 1))
        state.skin = dmg >= build.health ? 6 : 40;
        dmg >= build.health && console.log("used soldier instead of tank")
        state.angle = build_angle;
        if (!player.autoGather) sendAutoGather();
    } else if (!ready) { /* reload state */
        let tillReady = (player.reload[(hammer ? 1 : 0)].max - player.reload[(hammer ? 1 : 0)].count); /* auto turret before break */
        let wilBreak = build.health <= (player.weapons[break_weapon] < 9 ? dmg.primary : dmg.secondary)

        if (player.skins[53] && wilBreak && tillReady === 1 && player.reload[2].done && enemy && UTILS.getDistance(enemy.x2, enemy.y2, player.x2, player.y2) <= 300) state.skin = 53;
    }
}

function move(ang, mov, end) {
    if (lastMoveDir !== ang) {
        io.send("33", ang);
        player.moveDir = ang;
        lastMoveDir = ang;
    }

    !end && safeWalk(ang);
}

let breakingSpike;
let spike;

function breakSpike() {
    let obj = objects.find(c => {
        let weapon = autoBreak(c, true);
        let in_range = UTILS.getDistance(c.x, c.y, player.x3, player.y3) <= c.scale + weapon.range;
        return c.active && c.isItem && c.owner && c.sid < 1e15 && !ally(c.owner.sid) && [6, 7, 8, 9].includes(c.id) && in_range
    });
    if (obj) {
        spike = obj;
        if (!spike) return

        autoBreak(spike);
        if (player.trap && player.spike) state.skin = 6;
    } else if (spike) {
        if (player.autoGather) sendAutoGather();
        state.skin = 6;
    }

    spike = obj;
}

let safetyMargin = 15;

function safeWalk(mov) {
    if (player.trap || keys[16]) return;

    const dir = mov !== undefined ? mov : player.moveDir;
    const skinIndex = player.skinIndex;
    const tailIndex = player.tailIndex;
    const weaponIndex = player.weaponIndex;

    const makeFrames = (d0, extra = 2) => [
        [d0, skinIndex, tailIndex, weaponIndex],
        ...Array(extra).fill([undefined, skinIndex, tailIndex, weaponIndex])
    ];

    const findSpike = (positions) => {
        for (let i = 0; i < positions.length; i++) {
            if (positions[i].spike) return positions[i].spike;
        }
        return null;
    };

    const spike = findSpike(simulate(makeFrames(dir, 5), player, safetyMargin));
    if (!spike) {
        move(dir, 1, 1);
        return;
    }

    const altPositions = simulate(makeFrames(lastMoveDir, 5), player, safetyMargin);
    const stillHit = altPositions.some(c => c.spike?.sid === spike.sid);
    if (!stillHit) {
        move(lastMoveDir, 1, 1);
        return;
    }

    let best = null;
    for (let i = Math.PI / 60; i <= Math.PI; i += Math.PI / 60) {
        for (const sign of [1, -1]) {
            const candidate = lastMoveDir + sign * i;
            const positions = simulate(makeFrames(candidate, 5), player, safetyMargin);
            const safe = !positions.some(c => c.spike?.sid === spike.sid);
            if (safe) {
                best = candidate;
                break;
            }
        }
        if (best !== null) break;
    }

    if (best !== null) {
        move(best, 1, 1);
        delay(() => {
            move(null, 1, 1)
        }, 1)
    }
}
/*function safeWalk(mov) {
    if (player.trap) return;
 
    if (breakingSpike?.active && breakingSpike.isItem) {
        const dist = UTILS.dist(player, breakingSpike);
        const weapon = autoBreak(breakingSpike, true);
        if (dist <= weapon.range + breakingSpike.scale + 35) {
            autoBreak(breakingSpike);
            sideStepAngle = null;
        } else if (player.autoGather) {
            sendAutoGather();
            breakingSpike = null;
            sideStepAngle = null;
        }
    }
 
    if (breakingSpike && !breakingSpike.active) {
        breakingSpike = null;
        sideStepAngle = null;
        if (player.autoGather) sendAutoGather();
    }
 
    if (sideStepAngle !== null && breakingSpike?.active) {
        const weapon = autoBreak(breakingSpike, true);
        const dist = UTILS.dist(player, breakingSpike);
        const breakRange = weapon.range + breakingSpike.scale;
        if (dist <= breakRange) {
            autoBreak(breakingSpike);
            move(undefined);
            sideStepAngle = null;
        } else {
            move(sideStepAngle, 1, 1);
        }
        return;
    }
 
    if (player?.moveDir === undefined || player.moveDir === null || !objects.length) return;
 
    const spikes = objects.filter(c => c.sid < 1e15 && (!c.isItem || c.active) && c.dmg && (!c.isItem || !ally(c.owner.sid)));
    if (!spikes.length) return;
 
    const mkTicks = (dir, n) => Array.from({ length: n }, () => [dir, player.skinIndex, player.tailIndex, player.weaponIndex]);
 
    const willCollide = (positions) => {
        for (let pos of positions) {
            for (let obj of spikes) {
                const scale = obj.type === 1 ? obj.scale + 35 : obj.scale + 50;
                if (UTILS.dist(pos, obj) <= scale) return obj;
            }
        }
        return null;
    };
 
    const movingPositions = simulate(mkTicks(player.moveDir, 4), player);
    const hitObj = willCollide(movingPositions);
    if (!hitObj) return;
 
    if (!hitObj.isItem) {
        move(undefined);
        return;
    }
 
    const weapon = autoBreak(hitObj, true);
    const currentDist = UTILS.dist(player, hitObj);
    const breakRange = weapon.range + hitObj.scale;
 
    if (currentDist <= breakRange) {
        breakingSpike = hitObj;
        autoBreak(hitObj);
        move(undefined);
        return;
    }
 
    // only act if next tick would immediately collide
    const nextTick = simulate(mkTicks(player.moveDir, 1), player);
    const immediateHit = willCollide(nextTick);
 
    if (!immediateHit) return;
 
    // next tick hits - try counter steer first
    const backDir = player.moveDir + Math.PI;
    const counterSteerPositions = simulate([
        [backDir, player.skinIndex, player.tailIndex, player.weaponIndex],
        ...mkTicks(player.moveDir, 3)
    ], player);
 
    if (!willCollide(counterSteerPositions)) {
        const lastPos = counterSteerPositions[counterSteerPositions.length - 1];
        if (UTILS.dist(lastPos, hitObj) <= breakRange) {
            move(backDir, 1, 1);
            breakingSpike = hitObj;
            autoBreak(hitObj);
        } else {
            move(backDir, 1, 1);
        }
        return;
    }
 
    // counter steer also collides, stop
    move(undefined);
    const dist2 = UTILS.dist(player, immediateHit);
    if (immediateHit.isItem && dist2 <= weapon.range + immediateHit.scale) {
        breakingSpike = immediateHit;
        autoBreak(immediateHit);
        return;
    }
 
    // not in range, find sidestep angle that reaches break range in one step
    const angleStep = Math.PI / 64;
    const maxSearch = Math.PI;
 
    for (let offset = angleStep; offset <= maxSearch; offset += angleStep) {
        for (let sign of [1, -1]) {
            const angle = player.moveDir + offset * sign;
            const oneStep = simulate(mkTicks(angle, 1), player);
            if (willCollide(oneStep)) continue;
 
            const pos = oneStep[0];
            const distToSpike = UTILS.dist(pos, hitObj);
 
            if (distToSpike <= breakRange) {
                sideStepAngle = angle;
                breakingSpike = hitObj;
                move(angle, 1, 1);
                autoBreak(hitObj);
                return;
            }
        }
    }
 
    // nothing works, just stop
    move(undefined);
}*/

const breakTrap = () => {
    let obj = player.trap;
    if (obj) {
        let weapon = autoBreak(obj, true),
            spike = objects.find(c => {
                let inRange = UTILS.getDistance(c.x, c.y, player.x2, player.y2) <= c.getScale() + weapon.range + 35;
                return c.active && c.isItem && c.owner && c.sid < 1e15 && !ally(c.owner.sid) && [6, 7, 8, 9].includes(c.id) && inRange && UTILS.getDistance(c.x, c.y, obj.x, obj.y) <= 50 + c.getScale() + 35 / 2.5
            });

        let target = obj;
        if (spike && enemy) {
            const enemyToSpike = UTILS.getDistance(enemy.x2, enemy.y2, spike.x, spike.y);
            const enemyToTrap = UTILS.getDistance(enemy.x2, enemy.y2, obj.x, obj.y);
            target = enemyToSpike < enemyToTrap ? obj : spike;
        }

        let isDagger = player.weapons[0] === 7,
            inRange = enemy && UTILS.dist(player, enemy, 1) <= enemy.scale * 1.8,
            antiPush = isDagger && inRange && spike;

        if (antiPush) {
            if (!player.autoGather) sendAutoGather();
            state.angle = UTILS.dir(player, enemy);
            state.weapon = player.weapons[0];
        } else autoBreak(target);
        if (player.spike) state.skin = 6;
    } else if (trap) {
        if (player.autoGather) sendAutoGather();
        state.skin = 6;
    }

    trap = obj;
    return Boolean(obj);
}

let autoWindmills = false, lastWindmill = 0;
function windmills() {
    const back = lastMoveDir - Math.PI,
        item = items.list[player.items[3]],
        gap = item.gap,
        built = [player.buildItem(item, back), player.buildItem(item, back + gap), player.buildItem(item, back - gap)],
        left = built[0] && built[1], right = built[0] && built[2];

    if ([null, undefined].includes(lastMoveDir) || time - lastWindmill < 2 || (built.includes(false) && !left && !right)) return;
    console.log(`Windmill gap: ${gap}`);

    lastWindmill = time;
    built[0] && build(player.items[3], back, 1, 1, 1);
    left && build(player.items[3], back + gap, 1, 1, 1);
    right && build(player.items[3], back - gap, 1, 1, 1);
}

class Macro {
    constructor(food, spike, mill, trap, tele, spawn) {
        this.food = food;
        this.spike = spike;
        this.mill = mill;
        this.trap = trap;
        this.tele = tele;
        this.spawn = spawn;
    }

    update() {
        keys[this.food] && build(player.items[0]);
        keys[this.spike] && build(player.items[2]);
        keys[this.mill] && build(player.items[3]);
        keys[this.trap] && build(player.items[4]);
        keys[this.tele] && build(player.items[5]);
        keys[this.spawn] && build(player.items[6]);
    }
}

const Placer = new Macro(81, 86, 78, 70, 72, 75);

let trap, enemies, enemy;
function autoSoldier() {
    if (!enemy) return

    let caught;

    let length = projectiles.length;
    for (let index = 0; index < length; index += 1) {
        let bullet = projectiles[index];

        if (bullet.active && bullet.target?.isPlayer && bullet.target?.sid === player.sid) {
            if (bullet.estimated <= 2) caught = bullet;
        }
    }

    if (caught) {
        const dist = UTILS.getDistance(caught.x, caught.y, player.x2, player.y2);

        const estimated = Math.max(0, caught.time - time + Math.max(1, Math.ceil(Math.max(0, dist - 35) / (caught.speed * (1e3 / 9)))));
        console.log(`projectile/soldier, ${estimated} ticks away, dist: ${dist.toFixed(2)}`);

        state.skin = 6;
    }
}

function autoEquip() {
    const biome = {
        water: player.y2 >= (config.mapScale / 2) - (config.riverWidth / 2) && player.y2 <= (config.mapScale / 2) + (config.riverWidth / 2) && !trap,
        snow: player.y3 <= config.snowBiomeTop
    }

    state.tail = 19;

    if (biome.water) {
        state.skin = 31;
    } else if (biome.snow) {
        state.skin = 15;
    } else state.skin = 12;

    if (!biome.water && !enemy && player.skinIndex === 45) {
        state.skin = 13;
        state.tail = 13;
    }

    if (enemy && !biome.water) {
        const range = 70 + items.weapons[enemy.reload[0].id].range,
            dist = UTILS.getDistance(enemy.x3, enemy.y3, player.x3, player.y3),
            close = dist <= range;

        const knockback = 67;

        let angle = UTILS.dir(player, enemy);
        let pos = {
            x: enemy.x3 + Math.cos(angle) * knockback,
            y: enemy.y3 + Math.sin(angle) * knockback
        }

        let spike = objects.find(c => c.active && c.sid < 1e15 && c.dmg && (!c.isItem || ally(c.owner.sid)) && UTILS.getDistance(c.x, c.y, pos.x, pos.y) <= (c.scale + 35));

        // Auto Barbarian if we can hit enemy to the spike
        if (close && enemy.reload[0].done) state.skin = !spike || damage >= 100 || enemy.trap ? 6 : 26;
        if (dist > 400) {
            !clicks.left && (state.tail = 11);
        } else state.tail = player.tails[19] ? 19 : 0;
    } else if (!clicks.left) state.tail = 11;

    if (clicks.left) {
        if (state.tail === 11) {
            io.send("13c", 0, 0, 1)
            state.tail = 19;
        } else state.skin = 7;
        let wpn = player.weapons[0];
        state.weapon = wpn;
    } else if (clicks.right) {
        state.skin = 40;
        let wpn = player.weapons[1] === 10 ? 10 : player.weapons[0];
        state.weapon = wpn;
    }

    if (player.skinIndex !== 45 && player.health === 100 && player.shameCount > 0 && player.skins[7]) {
        let leak = (player.leak === undefined || player.leak % 9 === player.timerCount % 9);

        if (leak) {
            state.skin = 7;

            delay(() => {
                state.tail = 21;
                if (player.health !== 95) player.leak = undefined;
            }, 1);
        }
    }
}

function autoReload(data) {
    if ((player.trap || spike) && data) return breakWeapon;
    if (active || clicks.left || clicks.right || player.autoGather) return player.weaponIndex;
    if (!player.reload[0].done) {
        if (data) return player.weapons[0];
        state.weapon = player.weapons[0];
        return;
    } else if (!player.reload[1].done) {
        if (data) return player.weapons[1];
        state.weapon = player.weapons[1];
        return;
    }

    let primary = items.weapons[player.weapons[0]],
        secondary = items.weapons[player.weapons[1]],
        type = !secondary || primary.spdMult > secondary?.spdMult ? 0 : 1;

    if (data) return player.weapons[type];
    state.weapon = player.weapons[type];
}

let time = 0, delays = {};
const delay = (action, tick) => {
    if (tick < 1) return action();

    if (delays[time + tick]) {
        delays[time + tick].push(action);
    } else {
        delays[time + tick] = [action];
    }
}

let Rebuild = true, followingPath, minGap;
let Pathfinder = new ThetaAstar(1800, 4);
setInterval(() => {
    if (Rebuild) {
        Rebuild = false;
        Pathfinder.setBld(objects);
        Pathfinder.setObjectManager(objectManager);
        Pathfinder.lastBase = null;
        Pathfinder.costGrid = null;
        console.log("Pathfinder rebuilt")
    }
}, 1e3);

let path = [];
let pathIndex = 0;
let endpoint;

let oldGap = 0, oldSpd;
async function findPath(target) {
    endpoint = target;

    let start = performance.now();
    if (oldSpd === player.spdMult) {
        minGap = oldGap;
    } else {
        oldSpd = player.spdMult;
        minGap = oldGap = await getGap(player.spdMult);
        console.log(`Min gap: ${minGap}`)
    }
    const fullPath = await Pathfinder.find(target, minGap, { x: player.xVel, y: player.yVel });
    path = fullPath;
    console.log(`path generation took ${Number(performance.now() - start).toFixed(2)} ms, size:`, path.length)

    if (path && path.length) {
        pathIndex = 0;
    }
}

async function followPath() {
    if (!followingPath) return;

    if (Rebuild || player.ai) {
        Rebuild = false;
        await findPath(endpoint);
    }
    if (!path || !path.length) {
        path = null;
        followingPath = false;
        sendMoveDir(null, true);
        return;
    }

    const currentX = player.x2;
    const currentY = player.y2;

    while (pathIndex < path.length - 1) {
        const waypoint = path[pathIndex];
        const nextWaypoint = path[pathIndex + 1];
        const toWaypoint_x = waypoint.x - currentX;
        const toWaypoint_y = waypoint.y - currentY;
        const distToWaypoint = Math.hypot(toWaypoint_x, toWaypoint_y);
        const toNext_x = nextWaypoint.x - currentX;
        const toNext_y = nextWaypoint.y - currentY;
        const distToNext = Math.hypot(toNext_x, toNext_y);

        if (distToNext < distToWaypoint) {
            pathIndex++;
            continue;
        }

        const waypointDir_x = nextWaypoint.x - waypoint.x;
        const waypointDir_y = nextWaypoint.y - waypoint.y;
        const waypointDist = Math.hypot(waypointDir_x, waypointDir_y);
        if (waypointDist > 0) {
            const normDir_x = waypointDir_x / waypointDist;
            const normDir_y = waypointDir_y / waypointDist;
            const dot = toWaypoint_x * normDir_x + toWaypoint_y * normDir_y;
            if (dot < 0) {
                pathIndex++;
                continue;
            }
        }

        if (distToWaypoint < 35) {
            pathIndex++;
            continue;
        }
        break;
    }

    if (pathIndex >= path.length) {
        path = null;
        followingPath = false;
        sendMoveDir(null, true);
        return;
    }

    const targetWaypoint = path[pathIndex];
    const dx = targetWaypoint.x - currentX;
    const dy = targetWaypoint.y - currentY;
    const distToTarget = Math.hypot(dx, dy);

    if (pathIndex === path.length - 1 && distToTarget < player.maxSpeed) {
        let dist = UTILS.getDistance(endpoint.x, endpoint.y, currentX, currentY)
        if (dist < 100) {
            path = null;
            followingPath = false;
            sendMoveDir(null, true);
        } else findPath(endpoint);
        return;
    }

    const angle = Math.atan2(dy, dx);
    sendMoveDir(angle, true);
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function autoPlace() {
    if (!enemy) return

    const fibCount = 21;
    for (let enemy of enemies) {
        if (UTILS.getDistance(enemy.x3, enemy.y3, player.x3, player.y3) > 350) break;

        let score = 0, best;
        let lastBuild, item = items.list[player.items[2]];

        let angle = UTILS.dir(player, enemy)

        for (let i = 0; i < fibCount; i++) {
            const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
            const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

            for (let dir of dirs) {
                const canBuild = player.buildItem(item, dir, true);
                const scale = (35 + item.scale + (item.placeOffset || 0));

                let build = {
                    x: player.x2 + Math.cos(dir) * scale,
                    y: player.y2 + Math.sin(dir) * scale,
                    dmg: item.dmg,
                    dir: dir,
                    isItem: true,
                    owner: { sid: player.sid },
                    sid: Math.round(1e15 + Math.random() * 5000)
                };

                let dist = UTILS.getDistance(build.x, build.y, enemy.x3, enemy.y3);

                if (canBuild && dist <= item.scale + player.scale) {
                    lastBuild = objectManager.add(build.sid, build.x, build.y, build.dir, item.scale, 1, item, !0, player.sid, true);
                    let tmpScore = kbScore(lastBuild, enemy);
                    objectManager.disableBySid(lastBuild.sid);

                    if (score < tmpScore) {
                        score = tmpScore;
                        best = build;
                    }
                }
            }
        }
        if (score > 40) { // 20 per spike, 70 per trap
            // phantom.push(best);
            // objectManager.add(best.sid, best.x, best.y, best.dir, item.scale, 1, item, !0, player.sid, true);

            build(player.items[2], best.dir);
            console.log('best score:', score)
        }
    }

    if (UTILS.getDistance(enemy.x3, enemy.y3, player.x3, player.y3) > 350 || isPrivate) return;

    let tmpArray = objects.filter(c => c.id === 15 && UTILS.dist(c, player) <= 400 && ally(c.owner.sid));

    for (let trap of tmpArray) {
        let hasSpike = false;
        for (let index = 0; index < objects.length; index++) {
            const b = objects[index];
            if (!b.fake && (!b.isItem || b.active) && b.dmg && (!b.isItem || ally(b.owner.sid)) &&
                Math.hypot(b.x - trap.x, b.y - trap.y) <= trap.getScale() + b.getScale() + 70) {
                hasSpike = true;
                break;
            }
        }

        if (hasSpike) continue;

        const item = items.list[player.items[2]];
        if (!item) continue;

        const scale = 35 + item.scale + (item.placeOffset || 0);
        const angle = UTILS.dir(player, trap);
        const trapScale = trap.getScale();
        const maxDist = trapScale + item.scale + 70;

        let placed = false;
        for (let i = 0; i < 8 && !placed; i++) {
            const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
            const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

            for (let dir of dirs) {
                const bx = player.x2 + Math.cos(dir) * scale;
                const by = player.y2 + Math.sin(dir) * scale;

                if (Math.hypot(bx - trap.x, by - trap.y) > maxDist) continue;

                if (!player.buildItem(item, dir, true)) continue;

                build(player.items[2], dir, 1, 1);
                placed = true;
                break;
            }
        }
    }

    for (let point of aggressive) {
        let buildId = player.items[lastAids && performance.now() - lastAids <= 500 ? 2 : player.items[5] && keys[72] ? 5 : (!trap && player.items[4] === 15 ? 4 : 2)],
            item = items.list[buildId];

        let angle = UTILS.dir(player, point);
        for (let i = 0; i < fibCount; i++) {
            const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
            const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];

            for (let dir of dirs) {
                const canBuild = player.buildItem(item, dir, true);
                const scale = (35 + item.scale + (item.placeOffset || 0));

                tmpObj = {
                    x: player.x2 + Math.cos(dir) * scale,
                    y: player.y2 + Math.sin(dir) * scale,
                    dmg: item.dmg,
                    dir: dir,
                    isItem: true,
                    owner: { sid: player.sid },
                    sid: Math.round(1e15 + Math.random() * 5000)
                };

                let dist = UTILS.dist(tmpObj, point);

                if (canBuild && dist <= item.scale + point.scale) {
                    build(buildId, dir);
                    console.log("blocked aggressive point")
                }
            }
        }
    }

    if (!active && !player.trap && player.items[4] === 15 && items.list[player.items[4]]) {
        let start = UTILS.dir(player, enemy), gap = items.list[player.items[4]].gap;
        for (let i = -gap / 2; i < gap * 3.5; i += gap) {
            build(player.items[4], start + i);
        };
    };
}

function kbScore(obj, p = player) {
    let score = 0, spikes = [];
    let res = simulateKB([[p.moveDir, p.skinIndex, p.tailIndex, p.weaponIndex]], obj, p);

    let last = res[res.length - 1],
        prev = res[0];

    spikes = last.spikes;
    let trap, spike;
    for (let pos of res) {
        if (pos.spike) {
            score += 20;
            spike = pos.spike;
        }
        if (pos.trap && !trap) {
            score += 70;
            trap = pos.trap;
        }

        prev = pos;
    }
    let rest = res[res.length - 1];

    return score;
}

function simulateKB(arr, testSpike, obj = player) {
    const delta = 1000 / 9;

    let x = obj.x3 || obj.x2 || obj.x, y = obj.y3 || obj.y2 || obj.y;
    let xVel = obj.xVel || 0, yVel = obj.yVel || 0;
    let slowMult = obj.slowMult || 1;

    let spikes = [];
    let baseBuildList = testSpike ? [testSpike, ...objects] : objects;
    let builds = objects;
    if (testSpike && builds.indexOf(testSpike) === -1) builds.unshift(testSpike);

    function update(moveDir, skinIndex, tailIndex, weaponIndex) {
        let trap, spike;
        const skin = skins.find(c => c.id === skinIndex);
        const tail = tails.find(c => c.id === tailIndex)
        let spdMult = (obj.buildIndex >= 0 ? 0.5 : 1) * (items.weapons[weaponIndex].spdMult || 1) * (skin ? (skin.spdMult || 1) : 1) * (tail ? (tail.spdMult || 1) : 1) * (y <= config.snowBiomeTop ? ((skin && skin.coldM) ? 1 : config.snowSpeed) : 1) * slowMult;

        if (y >= (config.mapScale / 2) - (config.riverWidth / 2) && y <= (config.mapScale / 2) + (config.riverWidth / 2)) {
            if (skin && skin.watrImm) {
                spdMult *= 0.75;
                xVel += config.waterCurrent * 0.4 * delta;
            } else {
                spdMult *= 0.33;
                xVel += config.waterCurrent * delta;
            }
        }

        var xVel2 = (moveDir != undefined) ? Math.cos(moveDir) : 0;
        var yVel2 = (moveDir != undefined) ? Math.sin(moveDir) : 0;
        var length = Math.sqrt(xVel2 * xVel2 + yVel2 * yVel2);
        if (length != 0) {
            xVel2 /= length;
            yVel2 /= length;
        }
        if (xVel2) xVel += xVel2 * config.playerSpeed * spdMult * delta;
        if (yVel2) yVel += yVel2 * config.playerSpeed * spdMult * delta;

        let totalDist = Math.hypot(xVel * delta, yVel * delta);
        let depth = Math.min(4, Math.max(1, Math.round(totalDist / 40)));
        let stepMlt = 1 / depth;

        for (let i = 0; i < depth; i++) {
            x += (xVel * delta) * stepMlt;
            y += (yVel * delta) * stepMlt;

            for (let other of builds) {
                let colX = other.x2 || other.x;
                let colY = other.y2 || other.y;
                let dx = x - colX;
                let dy = y - colY;
                const tmpLen = obj.scale + other.scale;

                if (!other.active || Math.abs(dx) > tmpLen && Math.abs(dy) > tmpLen) continue;

                const fullLen = obj.scale + (other.getScale ? other.getScale() : other.scale);
                const tmpInt = Math.sqrt(dx * dx + dy * dy) - fullLen

                if (tmpInt > 0) continue;
                const tmpDir = UTILS.getDirection(x, y, colX, colY);
                const isEnemy = !other.isItem || other.owner && !obj.team && obj.sid !== other.owner.sid || (!ally(other.sid) && ally(other.owner?.sid)) || (ally(other.sid) && !ally(other.owner?.sid));
                const adjustment = (tmpInt * -0.5);
                const cosDir = Math.cos(tmpDir);
                const sinDir = Math.sin(tmpDir);

                if (!other.ignoreCollision) {
                    x += adjustment * cosDir;
                    y += adjustment * sinDir;
                    colX -= adjustment * cosDir;
                    colY -= adjustment * sinDir;

                    xVel *= 0.75;
                    yVel *= 0.75;
                }

                if (other.dmg && isEnemy) {
                    let exit = spikes.find(s => s.sid === other.sid);

                    if (exit) {
                        if (i > exit.depth) {
                            exit.x = other.x;
                            exit.y = other.y;
                            exit.depth = i;
                            exit.hasTrap = trap;
                            exit.hasSpike = spike;
                        }
                    } else {
                        var tmpSpd = 1.5 * (other.weightM || 1);
                        xVel += tmpSpd * Math.cos(tmpDir);
                        yVel += tmpSpd * Math.sin(tmpDir);

                        spike = { x: other.x, y: other.y, dmg: other.dmg, sid: other.sid, hasTrap: trap, depth: i }
                        spikes.push(spike);
                    }
                } else if (other.trap && isEnemy) {
                    trap = { x: other.x, y: other.y, trap: true, hasSpike: spike };
                    spikes.push(trap);
                }
            }
        }

        if (xVel) {
            xVel *= Math.pow(config.playerDecel, delta);
            if (xVel <= 0.01 && xVel >= -0.01) xVel = 0;
        }
        if (yVel) {
            yVel *= Math.pow(config.playerDecel, delta);
            if (yVel <= 0.01 && yVel >= -0.01) yVel = 0;
        }

        x = Math.max(obj.scale, Math.min(config.mapScale - obj.scale, x));
        y = Math.max(obj.scale, Math.min(config.mapScale - obj.scale, y));

        return { x, y, xVel, yVel, trap, spike, spikes };
    }

    const res = [];
    for (let data of arr) {
        for (let tick = 0; tick < 7; tick += 1) res.push(update(...data));
    }
    return res;
}
function velTick() {
    if (!enemy || active || player.weapons[1] !== 10 || player.weapons[0] !== 5 || player.reload[0].val !== 1.18 || !player.reload[0].done || !player.reload[2].done) return null;

    let res = simulate([[enemy.moveDir, enemy.skinIndex, enemy.tailIndex, enemy.weaponIndex], [enemy.moveDir, enemy.skinIndex, enemy.tailIndex, enemy.weaponIndex], [enemy.moveDir, enemy.skinIndex, enemy.tailIndex, enemy.weaponIndex]], enemy)
    let primary = items.weapons[5],
        angle = UTILS.dir(player, enemy),
        ang, pass, ds;

    outerLoop: for (let i = -Math.PI / 2; i < Math.PI / 2; i += Math.PI / 16) {
        for (let hat in player.skins) {
            hat = Number(hat)
            if (![53, 0].includes(hat)) {
                let arr = simulate([[angle + i, player.skinIndex, player.tailIndex, 10], [angle, 53, player.tailIndex, 10], [angle, 7, player.tailIndex, 5]], player)
                let hat_dist = UTILS.dist(res[0], arr[0]),
                    turret_dist = UTILS.dist(res[1], arr[1]),
                    bull_dist = UTILS.dist(res[2], arr[2]);

                if (hat_dist < 320 && turret_dist > 203 && bull_dist <= primary.range + 35 * 1.3) {
                    ds = arr[2];
                    pass = hat;
                    ang = angle + i;
                    // for (let pos of arr) circles.push(pos)
                    break outerLoop;
                }
            }
        }
    }
    if (!pass) return
    console.log("one frame", UTILS.dist(enemy, player), state.skin)
    active = true;
    aimbot = true;
    state.skin = pass;
    state.weapon = player.weapons[1];
    move(ang)
    delay(() => {
        state.skin = 53;
        state.weapon = player.weapons[1];
        if (enemy) angle = UTILS.dir(player, enemy)
        move(angle)
        delay(() => {
            state.skin = 7;
            ds && console.log(UTILS.dist(ds, player))
            state.weapon = player.weapons[0];
            if (enemy) angle = UTILS.dir(player, enemy)
            move(angle)
            if (!player.autoGather) sendAutoGather();
            delay(() => {
                ds && console.log(UTILS.dist(ds, player))
                move(null)
                state.skin = 12;
                active = false;
                aimbot = false;
                if (player.autoGather) sendAutoGather();
            }, 1);
        }, 1);
    }, 1);
}

function simulate(arr, obj = player, safetyMargin = 0) {
    const delta = 1000 / 9;

    let x = obj.x2 || obj.x, y = obj.y2 || obj.y;
    let xVel = obj.xVel || 0, yVel = obj.yVel || 0;
    let slowMult = obj.slowMult || 1;

    let spikes = [];
    let builds = objects.filter(c => !c.fake);

    function update(moveDir, skinIndex, tailIndex, weaponIndex) {
        let trap, spike;
        const skin = skins.find(c => c.id === skinIndex);
        const tail = tails.find(c => c.id === tailIndex)
        let spdMult = (obj.buildIndex >= 0 ? 0.5 : 1) * (items.weapons[weaponIndex].spdMult || 1) * (skin ? (skin.spdMult || 1) : 1) * (tail ? (tail.spdMult || 1) : 1) * (y <= config.snowBiomeTop ? ((skin && skin.coldM) ? 1 : config.snowSpeed) : 1) * slowMult;

        if (y >= (config.mapScale / 2) - (config.riverWidth / 2) && y <= (config.mapScale / 2) + (config.riverWidth / 2)) {
            if (skin && skin.watrImm) {
                spdMult *= 0.75;
                xVel += config.waterCurrent * 0.4 * delta;
            } else {
                spdMult *= 0.33;
                xVel += config.waterCurrent * delta;
            }
        }

        var xVel2 = (moveDir != undefined) ? Math.cos(moveDir) : 0;
        var yVel2 = (moveDir != undefined) ? Math.sin(moveDir) : 0;
        var length = Math.sqrt(xVel2 * xVel2 + yVel2 * yVel2);
        if (length != 0) {
            xVel2 /= length;
            yVel2 /= length;
        }
        if (xVel2) xVel += xVel2 * config.playerSpeed * spdMult * delta;
        if (yVel2) yVel += yVel2 * config.playerSpeed * spdMult * delta;

        let totalDist = Math.hypot(xVel * delta, yVel * delta);
        let depth = Math.min(4, Math.max(1, Math.round(totalDist / 40)));
        let stepMlt = 1 / depth;

        for (let i = 0; i < depth; i++) {
            x += (xVel * delta) * stepMlt;
            y += (yVel * delta) * stepMlt;

            for (let other of builds) {
                let colX = other.x2 || other.x;
                let colY = other.y2 || other.y;
                let dx = x - colX;
                let dy = y - colY;
                const tmpLen = obj.scale + other.scale;

                if (!other.active || Math.abs(dx) > tmpLen && Math.abs(dy) > tmpLen) continue;

                const fullLen = obj.scale + (other.getScale ? other.getScale() : other.scale);
                const tmpInt = Math.sqrt(dx * dx + dy * dy) - fullLen;
                if (tmpInt > safetyMargin) continue;
                const tmpDir = UTILS.getDirection(x, y, colX, colY);
                const isEnemy = !other.isItem || other.owner && !obj.team && obj.sid !== other.owner.sid || (!window.ally(obj.sid) && window.ally(other.owner?.sid)) || (window.ally(obj.sid) && !window.ally(other.owner?.sid));

                const adjustment = (tmpInt * -0.5);
                const cosDir = Math.cos(tmpDir);
                const sinDir = Math.sin(tmpDir);

                if (!other.ignoreCollision) {
                    x = colX + (fullLen * Math.cos(tmpDir));
                    y = colY + (fullLen * Math.sin(tmpDir));
                    xVel *= 0.75;
                    yVel *= 0.75;
                }

                if (other.dmg && isEnemy) {
                    let exit = spikes.find(s => s.sid === other.sid);

                    if (exit) {
                        if (i > exit.depth) {
                            exit.x = other.x;
                            exit.y = other.y;
                            exit.depth = i;
                            exit.hasTrap = trap;
                            exit.hasSpike = spike;
                        }
                    } else {
                        var tmpSpd = 1.5 * (other.weightM || 1);
                        xVel += tmpSpd * Math.cos(tmpDir);
                        yVel += tmpSpd * Math.sin(tmpDir);

                        spike = { x: other.x, y: other.y, dmg: other.dmg, scale: other.getScale(), sid: other.sid, hasTrap: trap, depth: i }
                        spikes.push(spike);
                    }
                } else if (other.trap && isEnemy) {
                    trap = { x: other.x, y: other.y, trap: true, scale: 50, hasSpike: spike };
                    spikes.push(trap);
                }
            }
        }

        if (xVel) {
            xVel *= Math.pow(config.playerDecel, delta);
            if (xVel <= 0.01 && xVel >= -0.01) xVel = 0;
        }
        if (yVel) {
            yVel *= Math.pow(config.playerDecel, delta);
            if (yVel <= 0.01 && yVel >= -0.01) yVel = 0;
        }

        x = Math.max(obj.scale, Math.min(config.mapScale - obj.scale, x));
        y = Math.max(obj.scale, Math.min(config.mapScale - obj.scale, y));

        return { x, y, xVel, yVel, trap, spike, spikes };
    }

    const res = [];
    for (let data of arr) {
        res.push(update(...data));
    }
    return res;
}

let aimbot;

function sync() {
    let weapon = player.weapons[0];
    if (weapon === undefined || active) return;

    let obj = items.weapons[weapon];
    let primary = obj.dmg * (player.reload[0]?.val || 1);

    for (let e of enemies) {
        let dmg = 0;
        let health = 100;

        if (e.spike) dmg += e.spike;
        let bullet_hit;

        for (let bullet of projectiles) {
            if (bullet.estimated === 2 && bullet.target && bullet.target.sid === e.sid && ((bullet.owner.isItem && ally(bullet.owner.owner.sid)) || ally(bullet.owner.sid))) {
                dmg += bullet.dmg;
                bullet_hit = true;
            }
        }

        let dist = UTILS.getDistance(e.x3, e.y3, player.x3, player.y3);

        if (bullet_hit) console.log("bullet lands on enemy", dist, dist <= obj.range + 35 * 1.8)
        if (player.reload[0].done && dist <= obj.range + 70) {
            let dealt = primary * 1.5 > primary + (player.reload[2].done ? 25 : 1) ? primary * 1.5 : primary + (player.reload[2].done ? 25 : 1)
            dmg += dealt;
            if (e.dmgOverTime.dmg) dmg -= e.dmgOverTime.dmg

            let tmpDir = UTILS.getDirection(e.x2, e.y2, player.x2, player.y2);
            let impact = 0.3 + (obj.knock || 0);
            impact *= Number(player.weapons[1] === 10) + 1;

            let knockback = impact * (111 * 1.4),
                x4 = e.x3 + Math.cos(tmpDir) * knockback,
                y4 = e.y3 + Math.sin(tmpDir) * knockback;

            let spike = objects.find(c => c.active && c.sid < 1e15 && c.dmg && (!c.isItem || ally(c.owner.sid)) && UTILS.getDistance(c.x, c.y, x4, y4) <= (c.scale + 35));

            if (spike && !e.trap) {
                dmg += spike.dmg;

                let angle = Math.atan2(y4 - spike.y, x4 - spike.x);
                let purple_circle = {
                    x: spike.x + Math.cos(angle) * (spike.getScale() + 35),
                    y: spike.y + Math.sin(angle) * (spike.getScale() + 35)
                };

                circles.push(purple_circle);
            }

            if (health - dmg <= 0) {
                active = true;
                state.skin = primary * 1.5 > primary + (player.reload[2].done ? 25 : 1) ? 7 : 53
                aimbot = true;
                state.weapon = player.weapons[0];

                let weapon = player.weaponIndex;

                if (!player.autoGather) sendAutoGather();

                console.log("sync!");

                delay(() => {
                    active = false;
                    aimbot = false;
                    state.weapon = weapon;
                    if (player.autoGather) sendAutoGather();
                }, 1);
            }
        }
    }
}

let lastTP = 0;
function finder() {
    if (!autoTP || enemy || !player.items[5] || time - lastTP < 3) {
        if (enemy && lastTP) {
            lastTP = 0;
            move(undefined)
        }
        return
    }

    lastTP = time;
    const item = items.list[player.items[5]], angle = getAttackDir();
    outLoop: for (let i = Math.PI; i > 0; i -= Math.PI / 40) {
        let dirs = (i === 0) ? [angle] : [angle + i, angle - i];
        for (let dir of dirs) {
            const canBuild = player.buildItem(item, dir, true);
            const scale = (35 + item.scale + (item.placeOffset || 0));

            if (canBuild) {
                build(player.items[5], dir)
                move(dir)
                break outLoop;
            }
        }
    }
}

function grinder() {
    if (!autoGrind) return
    let idx = player.reload[0].rarity >= 2 ? 1 : 0,
        id = player.weapons[idx];

    if ([9, 11, 12, 13, 14, 15].includes(id) || (id === 10 && player.reload[1].rarity > 0)) return;

    state.weapon = id;
    let turrets = objects.filter(c => c.isItem && ["turret", "teleporter"] && UTILS.getDistance(c.x, c.y, player.x2, player.y2) <= items.weapons[id].range + c.getScale());

    const halfSweep = Math.PI / 5.2;
    let events = [];

    for (let turret of turrets) {
        let angle = Math.atan2(turret.y - player.y2, turret.x - player.x2);
        events.push({ angle: angle - halfSweep, type: 1 });
        events.push({ angle: angle + halfSweep, type: -1 });
    }

    events.sort((a, b) => a.angle - b.angle || b.type - a.type);

    let maxHits = 0, bestAngle = player.angle, currentHits = 0;

    for (let event of events) {
        currentHits += event.type;
        if (currentHits > maxHits) {
            maxHits = currentHits;
            bestAngle = event.angle;
        }
    }
    build(player.items[5], getAttackDir() + Math.PI / 4)
    build(player.items[5], getAttackDir() - Math.PI / 4)

    if (player.reload[idx].done) {
        state.angle = bestAngle;
        state.skin = 40;
        if (!player.autoGather) sendAutoGather();
    }
}

let inPush = false,
    pushPos,
    pushAngle,
    pushOffset,
    Pushing;

document.pushAmount = 7;
document.pushSpot = 35;

const autoPush = () => {
    const whenStop = () => {
        if (Pushing) move(null);

        Pushing = false;
    };

    let wasInPush = inPush;

    inPush = false;

    if (!enemy) return whenStop();
    let Length;

    const trap = enemy.trap
    if (!trap) return whenStop();

    const spikes = (() => {
        Length = objects.length;
        let temp = [];
        for (let index = 0; index < Length; index += 1) {
            const build = objects[index];
            const isSpike = (!build.isItem || build.active) && !build.fake && UTILS.dist(build, trap) <= trap.getScale() + build.getScale() + 70 && build.dmg && (!build.isItem || build.owner.sid < 0 || ally(build.owner.sid));

            if (isSpike) temp.push(build);
        }
        Length = temp.length;
        if (!Length) return false;
        if (Length > 1) {
            temp = temp.sort((obj, obj2) => {
                const distance = [UTILS.dist(trap, obj), UTILS.dist(trap, obj2)];
                return (distance[0] - distance[1]);
            });
        }
        return temp;
    })();

    if (!spikes.length) return whenStop();

    inPush = true;

    let spike = (() => {
        if (spikes.length > 1) {
            const dist = UTILS.dist(spikes[0], spikes[1]) / 2;
            const minDist = 35 * 1.5 + spikes[0].getScale() * 2;

            if (dist * 2 > minDist) return spikes[0];

            const angle = UTILS.dir(spikes[0], spikes[1]);

            return {
                x: spikes[0].x + Math.cos(angle) * dist,
                y: spikes[0].y + Math.sin(angle) * dist,
                double: true
            }
        } else return spikes[0];
    })();

    const enemyDist = UTILS.dist(spike, enemy);

    let angle = UTILS.dir(spike, enemy);
    let distance = enemyDist + 80;

    pushPos = {
        x: spike.x + (distance * Math.cos(angle)),
        y: spike.y + (distance * Math.sin(angle))
    }

    angle = UTILS.dir(player, pushPos);

    const trapAngle = UTILS.dir(player, trap);
    const spikeAngle = UTILS.dir(player, spike);

    const pushSide = trapAngle > spikeAngle ? "right" : "left";

    pushOffset = Math.abs(UTILS.dir(player, spike) - UTILS.dir(player, trap));
    pushAngle = UTILS.dir(player, enemy);

    const offsetSize = Math.min(0, (enemyDist - (spike.double ? 40 : spike.getScale()) - 35) / 50);
    const offset = pushOffset * (document.pushAmount * offsetSize);

    switch (pushSide) {
        case "right":
            pushAngle -= offset;
            break;

        case "left":
            pushAngle += offset;
            break;
    }
    console.log("push offset:", Number(offset.toFixed(2)));

    const distToPush = UTILS.dist(pushPos, player);
    inPush = distToPush < document.pushSpot;

    if (!wasInPush && inPush) console.log("pushing!")
    const Angles = [angle, pushAngle];
    angle = Angles[Number(inPush)];

    if (inPush) {
        move(angle, true);
    } else {
        if (!followingPath) {
            findPath(pushPos, true).then(() => {
                if (path && path.length) {
                    let length = Pathfinder.pathLength()
                    if (length < 350) followingPath = true;
                }
            });
        }
    }
    Pushing = true;
}

function Kalman() {
    const DT = 1000 / 9;
    const history = new WeakMap();

    function getState(target) {
        if (!history.has(target)) {
            history.set(target, {
                x: target.x2,
                y: target.y2,
                vx: 0,
                vy: 0,
                P: [100, 0, 0, 0,
                    0, 100, 0, 0,
                    0, 0, 100, 0,
                    0, 0, 0, 100],
                lastX: target.x2,
                lastY: target.y2,
                tick: 0
            });
        }
        return history.get(target);
    }

    const Q_POS = 0.1;
    const Q_VEL = 8.0;
    const R_POS = 2.0;

    function predictStep(s, steps) {
        for (let i = 0; i < steps; i++) {
            s.x += s.vx;
            s.y += s.vy;
            s.vx *= config.playerDecel ** DT;
            s.vy *= config.playerDecel ** DT;
        }

        let P = s.P;
        P[0] += steps * (P[5] + Q_POS);
        P[5] += steps * Q_VEL;
        P[10] += steps * (P[15] + Q_POS);
        P[15] += steps * Q_VEL;
    }

    function correct(s, mx, my) {
        let P = s.P;

        let sx = P[0] + R_POS;
        let kx = P[0] / sx;
        let kvx = P[5] / sx;
        let ix = mx - s.x;
        s.x += kx * ix;
        s.vx += kvx * ix;
        P[0] *= (1 - kx);
        P[5] -= kvx * P[0];

        let sy = P[10] + R_POS;
        let ky = P[10] / sy;
        let kvy = P[15] / sy;
        let iy = my - s.y;
        s.y += ky * iy;
        s.vy += kvy * iy;
        P[10] *= (1 - ky);
        P[15] -= kvy * P[10];
    }

    function clampToMap(s) {
        s.x = Math.max(35, Math.min(config.mapScale - 35, s.x));
        s.y = Math.max(35, Math.min(config.mapScale - 35, s.y));
    }

    function checkRiver(s) {
        let riverTop = (config.mapScale / 2) - (config.riverWidth / 2);
        let riverBot = (config.mapScale / 2) + (config.riverWidth / 2);
        if (s.y >= riverTop && s.y <= riverBot) {
            s.vx += config.waterCurrent * DT;
        }
    }

    function update(target) {
        let s = getState(target);

        s.tick++;
        predictStep(s, 1);
        correct(s, target.x2, target.y2);
        checkRiver(s);
        clampToMap(s);

        s.lastX = target.x2;
        s.lastY = target.y2;

        return s;
    }

    function predictFuture(s, ticks) {
        let px = s.x;
        let py = s.y;
        let pvx = s.vx;
        let pvy = s.vy;
        let decel = config.playerDecel ** DT;

        for (let i = 0; i < ticks; i++) {
            px += pvx;
            py += pvy;
            pvx *= decel;
            pvy *= decel;

            let riverTop = (config.mapScale / 2) - (config.riverWidth / 2);
            let riverBot = (config.mapScale / 2) + (config.riverWidth / 2);
            if (py >= riverTop && py <= riverBot) {
                pvx += config.waterCurrent * DT;
            }

            px = Math.max(35, Math.min(config.mapScale - 35, px));
            py = Math.max(35, Math.min(config.mapScale - 35, py));
        }

        return { x: px, y: py, vx: pvx, vy: pvy };
    }

    function leadShot(target, projectile) {
        let s = update(target);

        let speed = projectile.speed * (DT / 1);
        let range = projectile.range;

        let bestAngle = null;
        let bestPos = null;

        for (let ticks = 1; ticks < 40; ticks++) {
            let future = predictFuture(s, ticks);

            let dx = future.x - player.x2;
            let dy = future.y - player.y2;
            let dist = Math.hypot(dx, dy);

            let travelDist = speed * ticks;

            if (Math.abs(dist - travelDist) < 35 + 20) {
                if (travelDist > range) break;

                bestAngle = Math.atan2(dy, dx);
                bestPos = future;
                break;
            }

            if (travelDist > dist + 50) break;
        }

        if (bestAngle !== null && bestPos) {
            lines.push({
                x1: player.x2, y1: player.y2,
                x2: bestPos.x, y2: bestPos.y,
                colour: "#ff3333", width: 2
            });
            circles.push({
                x: bestPos.x, y: bestPos.y,
                scale: 20, colour: "#ff3333"
            });
        }

        return bestAngle;
    }

    function reset(target) {
        history.delete(target);
    }

    return { update, leadShot, predictFuture, getState, reset };
}

const kalman = Kalman();

let autoTP, kbResult, damage, state, queue = [];

let arrows = [], lines = [], circles = [];

function update() {
    state = {
        skin: 0,
        tail: 0
    }

    let length = projectiles.length;
    for (let index = 0; index < length; index += 1) {
        projectiles[index].active && projectiles[index].target_update(time);
    }

    length = queue.length;
    for (let index = 0; index < length; index++) queue[index].function(...queue[index].data);
    queue = [];

    Pathfinder.setMe(player, players);

    if (phantom.length > 0) {
        for (let build of phantom) {
            objectManager.disableBySid(build.sid);
        }

        phantom = [];
    }

    maxBuilds = 5;

    if (player.spikes) for (let b of player.spikes) {
        if (!b.tween || performance.now() - b.tween > 500) {
            b.tween = performance.now();
        }
    }
    //simulate([[enemy.moveDir, enemy.skinIndex, enemy.tailIndex, enemy.weaponIndex]], obj, enemy)
    circles = [];
    arrows = [];
    lines = [];
    /*let taps = simulate([[player.moveDir, player.skinIndex, player.tailIndex, player.weaponIndex], [player.moveDir, player.skinIndex, player.tailIndex, player.weaponIndex], [player.moveDir, player.skinIndex, player.tailIndex, player.weaponIndex]], null, player)
    for (let tap of taps) circles.push({ x: tap.x, y: tap.y, colour: "black" })
    circles.push({ x: player.x3, y: player.y3, colour: player.spike ? "red" : "blue" })
    circles.push({ x: player.x2, y: player.y2, colour: "yellow" })*/
    /*if (enemy) {
        circles.push({ x: enemy.x3, y: enemy.y3, colour: enemy.spike ? "red" : "blue" })
        circles.push({ x: enemy.x2, y: enemy.y2, colour: "yellow" })
    }*/
    //circles.push({x: player.x3, y: player.y3, colour: player.spike ? "red" : "blue"})
    // circles.push({ x: player.x3, y: player.y3, colour: player.spike ? "red" : "blue" })
    Placer.update();
    autoWindmills && windmills();

    !active && autoEquip();
    //kbResult = deepKb(true, player);
    if ([clicks.left, clicks.right, autoGrind].includes(true) && !player.autoGather) sendAutoGather();
    antiSpike();

    let worked = breakTrap();
    if (!worked) breakSpike();

    autoSoldier();
    autoPlace();
    finder();

    !spike && !player.trap && autoReload();
    autoPush();

    grinder();

    if (delays[time]) {
        const list = delays[time];
        length = list.length;
        for (let i = 0; i < length; i += 1) list[i]();
        delete delays[time];
    }

    velTick();
    sync();
    aids();

    if (enemy && keys[80] && [9, 12, 13, 15].includes(player.weapons[1]) && player.reload[1].done) {
        let weapon = items.weapons[player.reload[1].id];
        let angle = kalman.leadShot(enemy, items.projectiles[weapon.projectile]);
        console.log("Kalman angle: ", angle)
        if (!player.autoGather) sendAutoGather()
        active = true;
        state.angle = angle;
        state.weapon = player.weapons[1];
        delay(() => {
            active = false;
            if (player.autoGather) sendAutoGather()
        }, 1)
    }
    if (state.weapon !== undefined) {
        if (built || player.weaponIndex !== state.weapon || player.buildIndex > -1 || built) io.send("5", state.weapon, true)
    }

    if (built) {
        io.send("c", false);
        built = false;
        lastAngle = 0;
    }

    worked = false;

    if (!player.skins[state.skin]) state.skin = 0;
    state.skin = player.skins[state.skin] ? state.skin : 0
    if (player.skinIndex !== state.skin) worked = equip(state.skin, 0);

    state.tail = player.tails[state.tail] ? state.tail : 0;
    !worked && player.tailIndex !== state.tail && equip(state.tail, 1);

    damage = potDmg();
    autoHeal();

    worked = false;
    let reload = player.reload[Number(player.weaponIndex > 8)];

    if (!aimbot && !active && !trap && !spike && (reload.id === 11 || (reload.done && (attackState || player.autoGather)))) {
        worked = true;
        look();
    }

    if (aimbot && enemy) {
        look(UTILS.dir(player, enemy));
    } else if ((state.angle && spike) || (state.angle && trap) || (!worked && state.angle)) look(state.angle);

    equip("shop");

    followPath();
    showPing();
}

let lastTick, objects = [];

const tickRate = 1000 / config.serverUpdateRate;
const BUFFER = 10;

async function updatePlayers(data) {
    let delay = tickRate - pingTime - BUFFER;
    if (isPrivate) delay += 8;
    while (delay < 0) delay += tickRate;

    setTimeout(() => {
        Preplace();
    }, delay);

    await Promise.race([
        updatePromise,
        new Promise(resolve => setTimeout(resolve, 20))
    ]);
    lastTick = Date.now()
    time += 1;
    const tmpTime = Date.now();

    enemies = [];
    enemy = null;
    let tpmDist;

    for (let i = 0; i < players.length; ++i) {
        players[i].forcePos = !players[i].visible;
        players[i].visible = false;
    }

    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);
        if (tmpObj) {
            tmpObj.update(tmpTime, data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i]);

            const isEnemy = player.sid !== tmpObj.sid && (!player.team || player.team !== tmpObj.team);
            if (isEnemy) {
                const currentDist = UTILS.dist(tmpObj, player);
                if (!tpmDist || tpmDist > currentDist) {
                    enemies.push(tmpObj);
                    enemy = tmpObj;
                    tpmDist = currentDist;
                }
                kalman.update(tmpObj);
            }
        } else {
            i += 12;
        }
        ++i;
    }

    for (let i = 0; i < players.length; ++i) {
        if (players[i].forcePos && !players[i].visible && !players[i].fresh && players[i].sid !== player.sid) {
            players[i].spawn();
            players[i].fresh = true;
        }
    }

    if (player) {
        objectManager.objects = objects = gameObjects.filter(obj => {
            let dist = UTILS.getDistance(player.x2, player.y2, obj.x, obj.y);
            return (!obj.id || !obj.fake || obj.id < 1e15) && (!obj.isItem || obj.active) && dist <= 1500;
        }).sort((obj, obj2) => {
            const d1 = UTILS.getDistance(player.x2, player.y2, obj.x, obj.y);
            const d2 = UTILS.getDistance(player.x2, player.y2, obj2.x, obj2.y);
            return d1 - d2;
        });

        safeWalk()
        update();
        //player.visible && console.log("TICK, health:", player.health);
        //sendMoveDir();
    }
}

/*setInterval(() => {
    if (!player) return
    fetch("https://localhost:3030/pm-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: player.name })
    });
    fetch("https://localhost:3030/pm-fetch?name=" + encodeURIComponent(player.name))
        .then(r => r.json())
        .then(data =>
            data.messages
                .map(handleIncomingMessage)
                .filter(Boolean)
                .forEach(showPM)
        )
        .catch(() => { });
}, 1e3)*/
function findPlayerByID(id) {
    for (let i = 0; i < players.length; ++i) {
        if (players[i].id == id) {
            return players[i];
        }
    } return null;
}
function findPlayerBySID(sid) {
    for (let i = 0; i < players.length; ++i) {
        if (players[i].sid == sid) {
            return players[i];
        }
    } return null;
}
function findAIBySID(sid) {
    for (let i = 0; i < ais.length; ++i) {
        if (ais[i].sid == sid) {
            return ais[i];
        }
    } return null;
}
function findObjectBySid(sid) {
    for (let i = 0; i < gameObjects.length; ++i) {
        if (gameObjects[i].sid == sid) {
            return gameObjects[i];
        }
    } return null;
}

function showPing() {
    let dmg = Number(damage?.toFixed(2));
    let text = !isProxy ? `Ping: ${pingTime} ms` : `Proxy: ${io.ping || 0} ms`//\n Full: ${io.full} ms`
    document.getElementById("statistics").innerText = `${text}\nFPS: ${FPS}\nPPS: ${io.pps.length}\nDMG: ${dmg}\nShame: ${player.shameCount}`;
}

let lastPing = -1, pingTime = -1;
function pingSocketResponse() {
    pingTime = Date.now() - lastPing
}

function pingSocket() {
    lastPing = Date.now();
    io.send("pp");
}

/*
    let lastPing = -1, pingTime = -1;
    const ALPHA = 0.1;
    
    function pingSocketResponse() {
        const sample = Date.now() - lastPing;
        pingTime = pingTime < 0 ? sample : pingTime * (1 - ALPHA) + sample * ALPHA;
    }
    
    function pingSocket() {
        lastPing = Date.now();
        io.send("pp");
    }*/

function serverShutdownNotice(countdown) {
    if (countdown < 0) return;
    const minutes = Math.floor(countdown / 60);
    let seconds = countdown % 60;
    seconds = (`0${seconds}`).slice(-2);
    shutdownDisplay.innerText = `Server restarting in ${minutes}:${seconds}`;
    shutdownDisplay.hidden = false;
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

let FPS = 0;
let fpsTween = performance.now();
let frames = 0;

function doUpdate() {
    now = Date.now();
    delta = now - lastUpdate;
    lastUpdate = now;

    frames += 1;
    if (now - fpsTween >= 1000) {
        FPS = frames;
        frames = 0;
        fpsTween = now;
    }

    updateGame();
    requestAnimFrame(doUpdate);
}

function startGame() {
    bindEvents();
    loadIcons();
    loadingText.style.display = "none";
    menuCardHolder.style.display = "block";
    nameInput.value = getSavedVal("moo_name") || "";
    prepareUI();
}
prepareMenuBackground();
doUpdate();

function openLink(link) {
    window.open(link, "_blank")
}

window.openLink = openLink;
window.aJoinReq = aJoinReq;
window.kickFromClan = kickFromClan;
window.sendJoin = sendJoin;
window.leaveAlliance = leaveAlliance;
window.createAlliance = createAlliance;
window.storeBuy = storeBuy;
window.storeEquip = storeEquip;
window.selectSkinColor = selectSkinColor;
window.changeStoreIndex = changeStoreIndex;
window.config = config;