var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;
var girl;
var bt, bt_image,btSound;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var girl_running;
var girl_collided;
var girl_jump;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  girl_running =   loadAnimation("assets/girl1.png","assets/girl2.png","assets/girl3.png","assets/girl4.png","assets/girl5.png","assets/girl7.png",);
  girl_collided = loadAnimation("assets/girl_crash2.png");
  girl_jump= loadAnimation("assets/girl_jump1.png","assets/girl_jump2.png","assets/girl_jump3.png",);
  bt_image=loadImage("assets/bt.gif");
  jungleImage = loadImage("assets/bg.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  btSound=loadSound("assets/bt.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
 
  jungle.x = width /2;

  girl = createSprite(50,200,20,50);
  girl.addAnimation("running", girl_running);
  girl.addAnimation("collided", girl_collided);
  
  
  girl.setCollider("circle",0,0,50)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  btGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  girl.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(girl.y)
    if(keyDown("space")&& girl.y>270) {
      girl.changeAnimation("jump",girl_jump);
      jumpSound.play();
      girl.velocityY = -16;
    }
  
    girl.velocityY = girl.velocityY + 0.8
    spawnbt();
    spawnObstacles();

    girl.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(girl)){
      collidedSound.play();
      gameState = END;
    }
    if(btGroup.isTouching(girl)){
      btSound.play();
      score = score + 1;
      btGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    girl.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    btGroup.setVelocityXEach(0);

    girl.changeAnimation("collided",girl_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    btGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    girl.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    btGroup.setVelocityXEach(0);

    girl.changeAnimation("collided",girl_collided);

    obstaclesGroup.setLifetimeEach(-1);
    btGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x,50);
  
  if(score >= 5){
    girl.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnbt() {
 
  if (frameCount % 150 === 0) {

    var bt = createSprite(camera.position.x+500,100,40,10);

    bt.velocityX = -(6 + 3*score/100)
    bt.scale = 0.4;

    bt.addImage(bt_image);
   
       
    bt.lifetime = 400;
    
    bt.setCollider("rectangle",0,0,bt.width/2,bt.height/2)
    btGroup.add(bt);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.visible = true;
  girl.changeAnimation("running",
               girl_running);
  obstaclesGroup.destroyEach();
  btGroup.destroyEach();
  score = 0;
} 

