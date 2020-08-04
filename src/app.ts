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
let playerPoints : number[] = [0,0,0];

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
      deck_id = deck.deck_id
      console.log(`new deck id: ${deck_id}`);
    /*
    const api = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
    try{
      const data: Response = await fetch(api);
      const deck: any = await data.json();
      deck_id = deck.deck_id
      console.log(`new deck id: ${deck_id}`);
    }catch (error) {
      if (error) {
       //  console.error(error);
      }
    }*/
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

  const startGame = ():void =>{
    resetBoard();
    playersContainer[playerTurn].setAttribute("style", "color: red");
    playerDraw();
  }

  const resetBoard = ():void =>{
    btnDraw.style.display = "inline-block";
    btnPass.style.display = "inline-block";
    reshuffleDeck();
    playerPoints.forEach(function(element, index, array){
      array[index] = 0;
    })
    cardsContatiner.forEach(element => {
      element.innerHTML= ``;
    });
    pointsContainer.forEach(element => {
      element.innerHTML= `0`;
    });
    playersContainer.forEach(function(element, index){
      element.innerHTML=`Gracz ${index+1}`;
      element.setAttribute("style", "color: #f8d020");
    })
    summaryContainer.innerHTML = ``;
    playerTurn =0;
  }

  const startMultiplayerGame = ():void =>{
    playerNumbers = 3;
    playersInGame = playerNumbers;
    startGame();
  }

  const startSoloGame = ():void =>{
    playerNumbers = 1;
    playersInGame = playerNumbers;
    startGame();
  }

  const playerDraw = ():void =>{
    if(playerPoints[playerTurn]==0){
      drawCard(2);
    }else{
      drawCard(1);
    }
  }
 const pass = ():void =>{
    if(playersInGame<=1){
      showSummary();
    }
    playersContainer[playerTurn].setAttribute("style", "color: #f8d020");
    playerTurn++;
    
   if(playerTurn==playerNumbers){
    showSummary();
   }
   
    if(playerTurn>=playerNumbers){
      playerTurn=0;
    }
    playersContainer[playerTurn].setAttribute("style", "color: red");
    if(playerPoints[playerTurn]==0){
      playerDraw();
    }else if(playerPoints[playerTurn]>=22){
        pass();
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
    if(playerPoints[playerTurn]>=22){
      playerLose();
    }
  }

  const showSummary = ():void =>{
    disableBtn();
    let maxValue = 0;
    let indexPlayer = -1;
    playerPoints.forEach(function(element, index){
      if(element>maxValue && element<22){
        maxValue = element;
        indexPlayer = index;
      }
    })
    let output: string;
    if(indexPlayer==-1){
      output = `
      Przegrana
    `;
    }else{
      indexPlayer++;
      output = `
      Wygrywa gacz ${indexPlayer} uzyskując ${maxValue} pukntów
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
