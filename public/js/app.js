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
var playerPoints = [0, 0, 0];
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
                console.log("new deck id: " + deck_id);
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
                return [2 /*return*/];
        }
    });
}); };
// Show card on board
var addCardToContainer = function (card) {
    var output = "\n      <div class=\"card\">\n          <img src=" + card.image + " alt=" + card.code + " />\n      </div>\n    ";
    cardsContatiner[playerTurn].innerHTML += output;
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
    playerPoints.forEach(function (element, index, array) {
        array[index] = 0;
    });
    cardsContatiner.forEach(function (element) {
        element.innerHTML = "";
    });
    pointsContainer.forEach(function (element) {
        element.innerHTML = "0";
    });
    playersContainer.forEach(function (element, index) {
        element.innerHTML = "Gracz " + (index + 1);
        element.setAttribute("style", "color: #f8d020");
    });
    summaryContainer.innerHTML = "";
    playerTurn = 0;
};
var startMultiplayerGame = function () {
    playerNumbers = 3;
    playersInGame = playerNumbers;
    startGame();
};
var startSoloGame = function () {
    playerNumbers = 1;
    playersInGame = playerNumbers;
    startGame();
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
    if (playersInGame <= 1) {
        showSummary();
    }
    playersContainer[playerTurn].setAttribute("style", "color: #f8d020");
    playerTurn++;
    if (playerTurn == playerNumbers) {
        showSummary();
    }
    if (playerTurn >= playerNumbers) {
        playerTurn = 0;
    }
    playersContainer[playerTurn].setAttribute("style", "color: red");
    if (playerPoints[playerTurn] == 0) {
        playerDraw();
    }
    else if (playerPoints[playerTurn] >= 22) {
        pass();
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
    if (playerPoints[playerTurn] >= 22) {
        playerLose();
    }
};
var showSummary = function () {
    disableBtn();
    var maxValue = 0;
    var indexPlayer = -1;
    playerPoints.forEach(function (element, index) {
        if (element > maxValue && element < 22) {
            maxValue = element;
            indexPlayer = index;
        }
    });
    var output;
    if (indexPlayer == -1) {
        output = "\n      Przegrana\n    ";
    }
    else {
        indexPlayer++;
        output = "\n      Wygrywa gacz " + indexPlayer + " uzyskuj\u0105c " + maxValue + " puknt\u00F3w\n    ";
    }
    summaryContainer.innerHTML = output;
};
var playerWinOczko = function () {
    disableBtn();
    var output = "\n     Wygrywa gacz " + (playerTurn + 1) + " - Oczko \n  ";
    summaryContainer.innerHTML = output;
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
