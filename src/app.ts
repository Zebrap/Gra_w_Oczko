const cardsContatiner: HTMLElement[] | any[] = [document.getElementById("cards1"),document.getElementById("cards2"),document.getElementById("cards3")];
const pointsContainer: HTMLElement[] | any[] = [document.getElementById("p1"),document.getElementById("p2"),document.getElementById("p3")];
const playersContainer: HTMLElement[] | any[] = [document.getElementById("player1"),document.getElementById("player2"),document.getElementById("player3")];
const btnDraw: HTMLElement | any = document.getElementById("btnDraw");
const btnPass: HTMLElement | any = document.getElementById("btnPass");
const summaryContainer: HTMLElement | any = document.getElementById("summary");
let playerNumbers : number;
let playersInGame : number;
let deck_id : string;
let playerTurn : number = 0;
let playerPoints : number[];
let botOpponent : boolean;

interface ICard {
  value: string;
  suit: string;
  image: string;
  code: string;
}

  // Get new deck id
  const getDeck = async(): Promise<void> => {
      const data: Response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
      const deck: any = await data.json();
      deck_id = deck.deck_id;
  };

  // reshuffle your deck
  const reshuffleDeck = async(): Promise<void> => {
    const data: Response = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`);
  };

  // draw a card from deck
  const drawCard = async(count: number): Promise<void> => {
    const data: Response = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`);
    const jsonCards: any = await data.json();
    const arrayMyCards: any[] = await jsonCards.cards;
    let ace : boolean = false;
    arrayMyCards.forEach(function(card){ 
      const myCard = {
        value: card.value,
        suit: card.suit,
        image: card.image,
        code: card.code
      }
      addCardToContainer(myCard);
      if(card.value == "ACE"){
        if(ace){
          playerWinOczko();
        }else{
          ace = true;
          calcValueCards(card.value);
        }
      }else{
        calcValueCards(card.value);
      }
    });

    if(botOpponent && playerTurn == 1){
      if(playerPoints[playerTurn-1] < playerPoints[playerTurn] || playerPoints[playerTurn-1] >21){
        pass();
      }
      else{
        drawCard(1);
      }
    }
    
  }

  // Show card on board
  const addCardToContainer = (card: ICard):void =>{
      let output: string = `
      <div class="card">
          <img src=${card.image} alt=${card.code} />
      </div>
    `;
    cardsContatiner[playerTurn].innerHTML+=output;
  }

  const startMultiplayerGame = ():void =>{
    playerNumbers = 3;
    botOpponent = false;
    playersInGame = playerNumbers;
    startGame();
  }

  const startSoloGame = ():void =>{
    playerNumbers = 2;
    botOpponent = true;
    playersInGame = playerNumbers;
    startGame();
  }

  const startGame = ():void =>{
    resetBoard();
    playersContainer[playerTurn].setAttribute("style", "color: red");
    playerDraw();
  }

  const resetBoard = ():void =>{
    btnDraw.style.display = "inline-block";
    btnPass.style.display = "inline-block";
    reshuffleDeck();
    playerPoints = new Array();
    for(let i = 0; i<playerNumbers; i++){
      playerPoints.push(0);
    }
    cardsContatiner.forEach(function(element, index) {
      element.innerHTML= ``;
      show_hide_Player(element,index);
    });
    pointsContainer.forEach(function(element, index){
      element.innerHTML= `0`;
      show_hide_Player(element,index);
    });
    playersContainer.forEach(function(element, index){
      element.innerHTML=`Gracz ${index+1}`;
      element.setAttribute("style", "color: #f8d020");
      show_hide_Player(element,index);
    })
    summaryContainer.innerHTML = ``;
    playerTurn = 0;
  }

  const show_hide_Player = (element : HTMLElement, index : number):void => {
    if(index>=playerNumbers){
      element.style.display = "none";
    }else{
      element.style.display = "block";
    }
  }

  const playerDraw = ():void =>{
    if(playerPoints[playerTurn]==0){
      drawCard(2);
    }else{
      drawCard(1);
    }
  }

 const pass = ():void =>{
    playersContainer[playerTurn].setAttribute("style", "color: #f8d020");
    playerTurn++;
    if(botOpponent && playerTurn == 1){
      disableBtn();
    }
    
    if(playerTurn>=playerNumbers || playersInGame <= 1){
      showSummary();
    }
    else if(playerPoints[playerTurn]==0){
      playersContainer[playerTurn].setAttribute("style", "color: red");
      playerDraw();
    }
  }

  const calcValueCards = (value: string):void => {
    switch(value){
      case 'JACK':{
        playerPoints[playerTurn]+= 2;
        break;
      }
      case 'QUEEN':{
        playerPoints[playerTurn]+= 3;
        break;
      }
      case 'KING':{
        playerPoints[playerTurn]+= 4;
        break;
      }
      case 'ACE':{
        playerPoints[playerTurn]+= 11;
        break;
      }
      default: { 
        playerPoints[playerTurn]+= Number(value);
         break; 
      } 
    }
    pointsContainer[playerTurn].innerHTML = playerPoints[playerTurn];
    if(playerPoints[playerTurn]==21){
      pass();
    }
    else if(playerPoints[playerTurn]>=22){
      playerLose();
    }
  }

  const showSummary = ():void =>{
    disableBtn();
    let maxValue = -1;
    let winers : number[] = new Array();
    playerPoints.forEach(function(element){
      if(element>maxValue && element<22){
        maxValue = element;
      }
    })
    playerPoints.forEach(function(element, index){
      if(element==maxValue){
        winers.push(index+1);
      }
    })
    let output: string ;
    // chack if many players have the same score, draw
    if(winers.length>1){
      output = `Remis, wygrywaja Gracze: `;
      winers.forEach(function(element, index){
        output += `${element} `;
        if(winers.length > index+1){
          output += `i `;
        }
      })
      output += `uzyzkując ${maxValue} pukntów`
    }else{
      output= `
      Wygrywa gacz ${winers[0]} uzyskując ${maxValue} pukntów
    `;
    }
    
  summaryContainer.innerHTML = output;
  }

  const playerWinOczko = ():void =>{
    disableBtn();
    let output: string = `
     Wygrywa gacz ${playerTurn+1} - Oczko 
  `;
  summaryContainer.innerHTML = output;
  pointsContainer[playerTurn].innerHTML = `Oczko`;
  }

  const playerLose = ():void =>{
    playersInGame--;
    let output: string = `
    Przegrywasz
  `;
    playersContainer[playerTurn].innerHTML+= output;
    pass();
  }

  const disableBtn = ():void =>{
    btnDraw.style.display = "none";
    btnPass.style.display = "none";
  }
  
  getDeck();
