
// // game logic

// // drawing
// ctx.beginPath()
// ctx.rect(10, 10, 100, 100)
// ctx.fillStyle = "rgb(0, 0, 200)";
// // ctx.fillRect(50, 10, 20, 100);
// ctx.fill()

// ctx.beginPath()
// ctx.rect(30, 30, 100, 100);
// ctx.fillStyle = "rgb(0, 200, 0, 0.8)"
// ctx.fill()
// // ctx.font = '48px serif';
// // ctx.fillText('Hello world', 10, 50);

// window.addEventListener("keydown",function(e){
//     console.log(e)
// })

/****************configs********************/
//screen
const screenSize = { 
  x: 600,
  y: 600
}
const scoreboard = {
  x : 200,
  y : 150
}
// player
const playerSize = 30
const playerColour = "#f0f"
const playerSpeed = 10
const playerHealth = 100
const playerBulletSize = 10
const playerBulletColour = "#f0f"
const playerBulletDamage = 20
const playerBulletSpeed = 10
// enemy
const enemySize = 25
const enemySpeed = 10
const enemyColour = "yellow"
const enemyHealth = 50
const enemyBulletSize = 8
const enemyBulletColour = "red"
const enemyBulletDamage = 10
const enemyBulletSpeed = 10
//enemy boss
const enemyBossSize = 35
const enemyBossColour = "red"
const enemyBossHealth = 150
const enemyBossSpeed = 10
const bossBulletSize = 12
const bossBulletColour = "red"
const bossBulletDamage = 20
const bossBulletSpeed = 10
// hud
const hudColour = "black"
const hudSize = "20px Cursive"

//rate
const noOfEnemies = 10
const bossSelectionRate = 4
const enemyDirectionSelectionRate = 0.5
const enemyMoveSelectionRate = 0.5
const enemyBulletFireRate = 0.3


/***************configs*********************/
//data
const player = {
  position: { x: 300, y: 300 },
  size: playerSize,
  colour: playerColour,
  direction: "up",
  speed: playerSpeed,
  health: playerHealth,
  bulletSpeed : playerBulletSpeed,
  bulletSize: playerBulletSize,
  bulletColour: playerBulletColour,
  bulletDamage: playerBulletDamage
}
const gameState = {
  score : 0,
  isPaused : false
}

const enemyArray = [] 
const playerBulletArray = [] 
const enemyBulletArray =[]

//action
window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowRight" || e.code === "KeyD") {
    player.position.x = player.position.x + 10
    player.direction = "right"
    if (player.position.x + player.size / 2 > screenSize.x) {
      // player.position.x = screenSize.x-player.size/2
      player.position.x = player.size / 2
    }
  }
  else if (e.code === "ArrowLeft" || e.code === "KeyA") {
    player.position.x = player.position.x - 10
    player.direction = "left"
    if (player.position.x - player.size / 2 < 0) {
      // player.position.x = player.size/2
      player.position.x = screenSize.x - player.size / 2
    }
  }
  else if (e.code === "ArrowUp" || e.code === "KeyW") {
    player.position.y = player.position.y - 10
    player.direction = "up"
    if (player.position.y - player.size / 2 < 0) {
      // player.position.y = player.size/2
      player.position.y = screenSize.y - player.size / 2

    }
  }
  else if (e.code === "ArrowDown" || e.code === "KeyS") {
    player.position.y = player.position.y + 10
    player.direction = "down"
    if (player.position.y + player.size / 2 > screenSize.y) {
      player.position.y = player.size / 2
      // player.position.y = screenSize.y-player.size/2
    }
  }
  else if (e.code === "Space" || e.code === "Enter") {
    const bullet = {
      position: {
        x: player.position.x,
        y: player.position.y
      },
      direction:player.direction,
      size: player.bulletSize,
      colour: player.bulletColour,
      speed: player.bulletSpeed,
      damage: player.bulletDamage
    }
    playerBulletArray.push(bullet)
  }
  else if (e.code ==="KeyP"){
    if (!gameState.isPaused) {
      clearInterval(gameState.loop)
      gameState.isPaused = true
    }else{
      gameState.loop = gameLoop()
      gameState.isPaused = false
    }
  }
})

const fireEnemiesBullet = (enemies, enemiesBullets)=>{
  enemies.forEach((e)=>{
    if(Math.random()*10 < enemyBulletFireRate){
      enemiesBullets.push({
        position : {
          x: e.position.x,
          y: e.position.y
        },
        direction:e.direction,
        size: e.bulletSize,
        colour: e.bulletColour,
        speed: e.bulletSpeed,
        damage: e.bulletDamage
      })
    }
  })
}
const moveEnemies = (enemies)=>{
  enemies.forEach((e)=>{
    if(Math.random()*10<enemyDirectionSelectionRate){
      e.direction = directionGenerator()
    }
    if(Math.random()*10< enemyMoveSelectionRate){
      if(e.direction === "up"){
        e.position.y-= e.speed
        if (e.position.y-e.size/2<0) {
          e.position.y = screenSize.y - e.size/2
        }
      }else if(e.direction === "down"){
        e.position.y += e.speed
        if (e.position.y+e.size/2>screenSize.y) {
          e.position.y = e.size/2
        }
      }else if(e.direction === "left"){
        e.position.x -= e.speed
        if (e.position.x-e.size/2<0) {
          e.position.x = screenSize.x - e.size/2   
        }
      }else if(e.direction === "right"){
        e.position.x += e.speed
        if(e.position.x+e.size/2>screenSize.x) {
          e.position.x = e.size/2
        }
      }
    }
  })
}

const posGenerator = (sSize, eSize)=>{
  return Math.random()*(sSize-eSize)+eSize/2
}
const directionGenerator = ()=>{
  const selection = ["up","up","down","left","right"]
  const d = Math.floor((Math.random()*selection.length)-0.0000001)
  return selection[d]
}
const spawnEnemies = (enemies)=>{
  if(enemies.length<noOfEnemies){
    // selection of enemy
    const enemyType = {
      size: enemySize,
      speed: enemySpeed,
      colour: enemyColour, 
      health: enemyHealth,
      bulletSpeed : enemyBulletSpeed,
      bulletSize: enemyBulletSize,
      bulletColour: enemyBulletColour,
      bulletDamage: enemyBulletDamage
    }
    if(Math.random()*10<bossSelectionRate){
      enemyType.size = enemyBossSize
      enemyType.speed = enemyBossSpeed
      enemyType.colour = enemyBossColour
      enemyType.health = enemyBossHealth
      enemyType.bulletDamage = bossBulletDamage
      enemyType.bulletSize = bossBulletSize
      enemyType.bulletColour = bossBulletColour
      enemyType.bulletSpeed = bossBulletSpeed
    }

    // enemy creation
    const enemy = {
      position:{
        x: posGenerator(screenSize.x, enemyType.size),
        y: posGenerator(screenSize.y, enemyType.size),
      },
      size: enemyType.size,
      speed: enemyType.speed,
      colour: enemyType.colour, 
      health: enemyType.health,
      direction: directionGenerator(),
      bulletSpeed : enemyType.bulletSpeed,
      bulletSize: enemyType.bulletSize,
      bulletColour: enemyType.bulletColour,
      bulletDamage: enemyType.bulletDamage,
    } 
    // spawn enemy
    enemies.push(enemy)
  }
}

const init = (player,enemies,playerBulletArray,enemyBulletArray) => {
  if(gameState.over){
    gameState.over = false
    player.position.x = 300
    player.position.y = 300
    player.health = 100
    enemies.splice(0, enemies.length-1)
    playerBulletArray.splice(0, playerBulletArray.length-1)
    enemyBulletArray.splice(0, enemyBulletArray.length-1)
  }
}
const gameOver = () => {
  if (player.health <= 0) {
    player.health = 0
    const x = confirm("Game Over! \n Do you want to play again?")
    console.log(x)
    if(x){
      gameState.over = true
    }else{
      clearInterval(gameState.loop)
      window.close()
    }
  }
}

const moveBullets = (bullets) => {
  bullets.forEach((b) => {
    if (b.direction === "up") {
      b.position.y = b.position.y - b.speed
    } else if (b.direction === "down") {
      b.position.y = b.position.y + b.speed
    } else if (b.direction === "left") {
      b.position.x = b.position.x - b.speed
    } else if (b.direction === "right") {
      b.position.x = b.position.x + b.speed
    }
  })
}
const checkPlayerBulletCollisionWithEnemy = (enemies, bullets) => {
  bullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (enemy.size / 2 + bullet.size / 2 >= Math.abs(enemy.position.x - bullet.position.x) && enemy.size / 2 + bullet.size / 2 >= Math.abs(enemy.position.y - bullet.position.y)) {
        enemy.health = enemy.health - enemyBulletDamage;
        bullet.delete = true
        if (enemy.health <= 0) {
          enemy.delete = true;
          gameState.score = gameState.score + 10
        }
      }
    })
  })
}

const checkOutScreenBullets = (bullets) => {
  bullets.forEach((b) => {
    if (b.position.x < 0 || b.position.x > screenSize.x || b.position.y < 0 || b.position.y > screenSize.y) {
      b.delete = true
    }
  })
}
const deleteBullets = (bullets) => {
  bullets.forEach((b, i) => {
    if (b.delete) {
      bullets.splice(i, 1)
    }
  })
}
const deleteEnemy = (enemies) => {
  enemies.forEach((enemy, i) => {
    if (enemy.delete) {
      enemies.splice(i, 1)
    }
  })
}
const checkEnemyBulletCollisionWithPlayer = (player, bullets) => {
  bullets.forEach((bullet) => {
      if (player.size/3+bullet.size/2 >= Math.abs(player.position.x - bullet.position.x)&&player.size/3+bullet.size/2 >= Math.abs(player.position.y-bullet.position.y)) {
        player.health -=  bullet.damage
        bullet.delete = true  
      }
    })
}

//drawing
const c = document.getElementById("canvas")
c.width = screenSize.x
c.height = screenSize.y
const ctx = c.getContext("2d")
const d = document.getElementById("canvas1")
d.width = scoreboard.x
d.height = scoreboard.y

const drawHud = () => {
  const context = d.getContext("2d")
  context.clearRect(0, 0, scoreboard.x, scoreboard.y);
  context.fillStyle = hudColour
  context.font = hudSize
  context.fillText(`Score : ${gameState.score}`,10,25)
  context.fillText(`Health : ${player.health}`,10,55)
  if(gameState.isPaused){
    context.fillText("Paused",10,85)
  }
}

const drawChar = (x, y, charSize, colour, direction) => {
  const size = charSize / 3
  if (direction === "up") {
  ctx.fillStyle = colour;
    ctx.fillRect(x - size / 2, y - size * 1.5, size, size); // 1
    ctx.fillRect(x - size * 1.5, y - size / 2, size, size); // 2
    ctx.fillRect(x - size / 2, y - size / 2, size, size); // 3
    ctx.fillRect(x + size / 2, y - size / 2, size, size);  // 4
    ctx.fillRect(x - size * 1.5, y + size / 2, size, size);  // 5
    ctx.fillRect(x + size / 2, y + size / 2, size, size);  // 6
  }
  else if (direction === "down") {
  ctx.fillStyle = colour;
  ctx.fillRect(x - size / 2, y + size / 2, size, size);  // 1
  ctx.fillRect(x - size * 1.5, y - size / 2, size, size);  // 2
  ctx.fillRect(x - size / 2, y - size / 2, size, size);  // 3
  ctx.fillRect(x + size / 2, y - size / 2, size, size);  // 4
  ctx.fillRect(x - size * 1.5, y - size * 1.5, size, size);  // 5
  ctx.fillRect(x + size / 2, y - size * 1.5, size, size);  // 6
  }
  else if (direction === "left") {
    ctx.fillStyle = colour;
    ctx.fillRect(x - size / 2, y - size * 1.5, size, size); //1
    ctx.fillRect(x + size / 2, y - size * 1.5, size, size); //2
    ctx.fillRect(x - size / 2, y - size / 2, size, size); //3
    ctx.fillRect(x - size * 1.5, y - size / 2, size, size); //4
    ctx.fillRect(x - size / 2, y + size / 2, size, size); //5
    ctx.fillRect(x + size / 2, y + size / 2, size, size); //6
  }
  else if (direction === "right") {
    ctx.fillStyle = colour;
    ctx.fillRect(x + size / 2, y - size / 2, size, size); //1
    ctx.fillRect(x - size / 2, y + size / 2, size, size); //2
    ctx.fillRect(x - size / 2, y - size / 2, size, size); //3
    ctx.fillRect(x - size / 2, y - size * 1.5, size, size); //4
    ctx.fillRect(x - size * 1.5, y - size * 1.5, size, size); //5
    ctx.fillRect(x - size * 1.5, y + size / 2, size, size); //6
  }
}

const drawBullets = (bullets) => {
  bullets.forEach((bullets) => {
    ctx.fillStyle = bullets.colour;
    ctx.fillRect(
      bullets.position.x - 0.5 * bullets.size,
      bullets.position.y - 0.5 * bullets.size,
      bullets.size, bullets.size)
  })
}

const gameLoop = ()=>{
  return setInterval(() => {
    init(player, enemyArray, playerBulletArray, enemyBulletArray)
    gameOver()
    spawnEnemies(enemyArray)
    fireEnemiesBullet(enemyArray, enemyBulletArray)
    moveEnemies(enemyArray)
    moveBullets(playerBulletArray)
    moveBullets(enemyBulletArray)
    checkPlayerBulletCollisionWithEnemy(enemyArray, playerBulletArray)
    checkOutScreenBullets(playerBulletArray)
    checkEnemyBulletCollisionWithPlayer(player,enemyBulletArray)
    deleteBullets(playerBulletArray)
    deleteBullets(enemyBulletArray)
    deleteEnemy(enemyArray)
    ctx.clearRect(0, 0, screenSize.x, screenSize.y);
    drawBullets(playerBulletArray)
    drawBullets(enemyBulletArray)
    drawChar(player.position.x,player.position.y,player.size,player.colour ,player.direction)
    enemyArray.forEach((enemy)=>{
      drawChar(enemy.position.x,enemy.position.y,enemy.size,enemy.colour ,enemy.direction)
    })
    drawHud()
  }, 20);
}
gameState.loop = gameLoop()






