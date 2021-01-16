
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var readState;
var gameState="hungry";
var bedroom, garden, washroom;
function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
bedroom=loadImage("virtual pet images/Bed Room.png");
garden=loadImage("virtual pet images/Garden.png");
washroom=loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
   if(gameState!="hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   } else {
     feed.show();
     addFood.show();
     dog.show();
   }
   
   currentTime=hour();
   if(currentTime==(lastFed+1)){
     update("playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     update("Sleeping");
     foodObj.bedroom();
   }
   else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
   update("Bathing");
   foodObj.washroom();
   }
  else{
     update("hungry");
     foodObj.display();
   }

  drawSprites();
}

function bedroom(){
  background(bedroom,1000,400);
}
function garden(){
  background(garden,1000,400);
}
function washroom(){
  background(washroom,1000,400);
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//read gameState from database
  readState = database.ref('gameState');
  readState.on("value", function (data){
    gameState=data.val();
  });

//function to update gameStates in database
function update(state){
  database.ref('/').update({
    gameState:state
  });
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}





