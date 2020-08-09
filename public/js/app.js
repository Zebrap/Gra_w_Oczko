"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var cardsContatiner = [document.getElementById("cards1"), document.getElementById("cards2"), document.getElementById("cards3")];
var pointsContainer = [document.getElementById("p1"), document.getElementById("p2"), document.getElementById("p3")];
var playersContainer = [document.getElementById("player1"), document.getElementById("player2"), document.getElementById("player3")];
var btnDraw = document.getElementById("btnDraw");
var btnPass = document.getElementById("btnPass");
var summaryContainer = document.getElementById("summary");
var playerNumbers;
var playersInGame;
var deck_id;
var playerTurn = 0;
var playerPoints;
var botOpponent;
// Get new deck id
var getDeck = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, deck;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, data.json()];
            case 2:
                deck = _a.sent();
                deck_id = deck.deck_id;
                return [2 /*return*/];
        }
    });
}); };
// reshuffle your deck
var reshuffleDeck = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://deckofcardsapi.com/api/deck/" + deck_id + "/shuffle/")];
            case 1:
                data = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// draw a card from deck
var drawCard = function (count) { return __awaiter(void 0, void 0, void 0, function () {
    var data, jsonCards, arrayMyCards, ace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://deckofcardsapi.com/api/deck/" + deck_id + "/draw/?count=" + count)];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, data.json()];
            case 2:
                jsonCards = _a.sent();
                return [4 /*yield*/, jsonCards.cards];
            case 3:
                arrayMyCards = _a.sent();
                ace = false;
                arrayMyCards.forEach(function (card) {
                    var myCard = {
                        value: card.value,
                        suit: card.suit,
                        image: card.image,
                        code: card.code
                    };
                    addCardToContainer(myCard);
                    if (card.value == "ACE") {
                        if (ace) {
                            playerWinOczko();
                        }
                        else {
                            ace = true;
                            calcValueCards(card.value);
                        }
                    }
                    else {
                        calcValueCards(card.value);
                    }
                });
                if (botOpponent && playerTurn == 1) {
                    if (playerPoints[playerTurn - 1] < playerPoints[playerTurn] || playerPoints[playerTurn - 1] > 21) {
                        pass();
                    }
                    else {
                        drawCard(1);
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
// Show card on board
var addCardToContainer = function (card) {
    var output = "\n      <div class=\"card\">\n          <img src=" + card.image + " alt=" + card.code + " />\n      </div>\n    ";
    cardsContatiner[playerTurn].innerHTML += output;
};
var startMultiplayerGame = function () {
    playerNumbers = 3;
    botOpponent = false;
    playersInGame = playerNumbers;
    startGame();
};
var startSoloGame = function () {
    playerNumbers = 2;
    botOpponent = true;
    playersInGame = playerNumbers;
    startGame();
};
var startGame = function () {
    resetBoard();
    playersContainer[playerTurn].setAttribute("style", "color: red");
    playerDraw();
};
var resetBoard = function () {
    btnDraw.style.display = "inline-block";
    btnPass.style.display = "inline-block";
    reshuffleDeck();
    playerPoints = new Array();
    for (var i = 0; i < playerNumbers; i++) {
        playerPoints.push(0);
    }
    cardsContatiner.forEach(function (element, index) {
        element.innerHTML = "";
        show_hide_Player(element, index);
    });
    pointsContainer.forEach(function (element, index) {
        element.innerHTML = "0";
        show_hide_Player(element, index);
    });
    playersContainer.forEach(function (element, index) {
        element.innerHTML = "Gracz " + (index + 1);
        element.setAttribute("style", "color: #f8d020");
        show_hide_Player(element, index);
    });
    summaryContainer.innerHTML = "";
    playerTurn = 0;
};
var show_hide_Player = function (element, index) {
    if (index >= playerNumbers) {
        element.style.display = "none";
    }
    else {
        element.style.display = "block";
    }
};
var playerDraw = function () {
    if (playerPoints[playerTurn] == 0) {
        drawCard(2);
    }
    else {
        drawCard(1);
    }
};
var pass = function () {
    playersContainer[playerTurn].setAttribute("style", "color: #f8d020");
    playerTurn++;
    if (botOpponent && playerTurn == 1) {
        disableBtn();
    }
    if (playerTurn >= playerNumbers || playersInGame <= 1) {
        showSummary();
    }
    else if (playerPoints[playerTurn] == 0) {
        playersContainer[playerTurn].setAttribute("style", "color: red");
        playerDraw();
    }
};
var calcValueCards = function (value) {
    switch (value) {
        case 'JACK': {
            playerPoints[playerTurn] += 2;
            break;
        }
        case 'QUEEN': {
            playerPoints[playerTurn] += 3;
            break;
        }
        case 'KING': {
            playerPoints[playerTurn] += 4;
            break;
        }
        case 'ACE': {
            playerPoints[playerTurn] += 11;
            break;
        }
        default: {
            playerPoints[playerTurn] += Number(value);
            break;
        }
    }
    pointsContainer[playerTurn].innerHTML = playerPoints[playerTurn];
    if (playerPoints[playerTurn] == 21) {
        pass();
    }
    else if (playerPoints[playerTurn] >= 22) {
        playerLose();
    }
};
var showSummary = function () {
    disableBtn();
    var maxValue = -1;
    var winers = new Array();
    playerPoints.forEach(function (element) {
        if (element > maxValue && element < 22) {
            maxValue = element;
        }
    });
    playerPoints.forEach(function (element, index) {
        if (element == maxValue) {
            winers.push(index + 1);
        }
    });
    var output;
    // chack if many players have the same score, draw
    if (winers.length > 1) {
        output = "Remis, wygrywaja Gracze: ";
        winers.forEach(function (element, index) {
            output += element + " ";
            if (winers.length > index + 1) {
                output += "i ";
            }
        });
        output += "uzyzkuj\u0105c " + maxValue + " puknt\u00F3w";
    }
    else {
        output = "\n      Wygrywa gacz " + winers[0] + " uzyskuj\u0105c " + maxValue + " puknt\u00F3w\n    ";
    }
    summaryContainer.innerHTML = output;
};
var playerWinOczko = function () {
    disableBtn();
    var output = "\n     Wygrywa gacz " + (playerTurn + 1) + " - Oczko \n  ";
    summaryContainer.innerHTML = output;
    pointsContainer[playerTurn].innerHTML = "Oczko";
};
var playerLose = function () {
    playersInGame--;
    var output = "\n    Przegrywasz\n  ";
    playersContainer[playerTurn].innerHTML += output;
    pass();
};
var disableBtn = function () {
    btnDraw.style.display = "none";
    btnPass.style.display = "none";
};
getDeck();
