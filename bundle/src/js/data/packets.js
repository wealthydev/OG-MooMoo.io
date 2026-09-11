const itemData = [
        ["id", "A"], // setInitData
        ["d", "B"], // disconnect
        ["1", "C"], // setupGame
        ["2", "D"], // addPlayer
        ["4", "E"], // removePlayer
        ["33", "a"], // updatePlayers
        ["5", "G"], // updateLeaderboard
        ["6", "H"], // loadGameObject
        ["a", "I"], // loadAI
        ["aa", "J"], // animateAI
        ["7", "K"], // gatherAnimation
        ["8", "L"], // wiggleGameObject
        ["sp", "M"], // shootTurret
        ["9", "N"], // updatePlayerValue
        ["h", "O"], // updateHealth
        ["11", "P"], // killPlayer
        ["12", "Q"], // killObject
        ["13", "R"], // killObjects
        ["14", "S"], // updateItemCounts
        ["15", "T"], // updateAge
        ["16", "U"], // updateUpgrades
        ["17", "V"], // updateItems
        ["18", "X"], // addProjectile
        ["19", "Y"], // remProjectile
        ["20", "Z"], // serverShutdownNotice
        ["ac", "g"], // addAlliance
        ["ad", "1"], // deleteAlliance
        ["an", "2"], // allianceNotification
        ["st", "3"], // setPlayerTeam
        ["sa", "4"], // setAlliancePlayers
        ["us", "5"], // updateStoreItems
        ["ch", "6"], // receiveChat
        ["mm", "7"], // updateMinimap
        ["t", "8"], // showText
        ["p", "9"], // pingMap
        ["pp", "0"] // pingSocketResponse
    ]

    let packetData = [
        ["sp", `M`], // spawn
        ["2", "D"], // look
        ["c", "F"], // hit
        ["7", "K"], // hit continiously
        ["ch", "6"], // chat
        ["6", "H"], // choose item
        ["13c", "c"], // equip hat/tail
        ["5", "z"], // take weapon/build
        ["33", "9"], // walk
        ["pp", "0"], // ping update
        ["8", "L"], // create tribe
        ["9", "N"], // delete tribe
        ["10", "b"], // join tribe
        ["11", "P"], // accept
        ["12", "Q"], // kick from tribe
        ["14", "P"], // ping map
        ["rmd", "e"] // reset move dir
    ];

export { itemData, packetData}