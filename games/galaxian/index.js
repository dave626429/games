import Bullet from "./entities/Bullet.js";
import EnemyGrid from "./entities/EnemyGrid.js";
import Particle from "./entities/Particle.js";
import Player from "./entities/Player.js";
import GameAudio from "./utility/GameAudio.js";

const GAME_BACKGROUND = "black";
const GAME_BACKGROUND_SOUND_FILE_NAME = "game_background.wav";
const GAME_BACKGROUND_PARTICLES = 150;
const GAME_BACKGROUND_STARS_COLOR = "white";

const PLAYER_TILT = 0.15;
const PLAYER_SPEED = 3;
const PLAYER_BULLET_SPEED = 1.5;
const PLAYER_EXPLODES_SOUND_FILE_NAME = "spaceship_explodes.wav";
// const PLAYER_COLOR = "white";

const ENEMY_COLOR = "#BAA0DE";
const ENEMY_EXPLODES_SOUND_FILE_NAME = "enemy_explosion_500ms.wav";

const EXPLOSTION_PARTICLES = 15;

/**
 * load all the game sounds
 */
const gameAudio = new GameAudio();

const sounds = [
  {
    name: "background",
    path: `./assets/sounds/${GAME_BACKGROUND_SOUND_FILE_NAME}`,
  },
  {
    name: "enemy_explodes",
    path: `./assets/sounds/${ENEMY_EXPLODES_SOUND_FILE_NAME}`,
  },
  {
    name: "player_explodes",
    path: `./assets/sounds/${PLAYER_EXPLODES_SOUND_FILE_NAME}`,
  },
];

await Promise.all(sounds.map((sound) => gameAudio.load(sound)));

gameAudio.setVolume("background", 0.4);
gameAudio.setVolume("effects", 0.2);

// Browser auto sound blocking solution
// need to create a click or some eventLister where
// this can be passed(a button click "start the game")
// async function unlockAudio(gameAudio) {
//   if (gameAudio.context.state === "suspended") {
//     await gameAudio.context.resume();
//     console.log("🔊 AudioContext resumed");
//   }
// }

const button = document.querySelector("#start-game");
button.addEventListener("click", () => {
  button.blur();
  if (button.innerText === "Reload Game") window.location.reload();

  if (!game.active) gameAudio.play("background", "background", true);

  game.active = true;

  button.innerText = "Reload Game";
});

/**
 * Game UI
 */
export const canvas = document.querySelector("canvas");
canvas.width = 1280;
canvas.height = 720;

const scoreElement = document.querySelector("#score");

export const context = canvas.getContext("2d");

const game = {
  over: false,
  active: false,
};

let score = 0;

let frames = 0;

const player = new Player();
const bullets = [];

const enemyGrids = [];
const enemyBullets = [];

const particles = [];

/**
 * Game background stars
 */
for (let i = 0; i < GAME_BACKGROUND_PARTICLES; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.15,
      },
      radius: Math.random() * 3,
      color: GAME_BACKGROUND_STARS_COLOR,
      fade: false,
    })
  );
}

// to detect, if the key pressed
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

function explode(object, color) {
  /**
   * Generate explosion particles
   */
  for (let i = 0; i < EXPLOSTION_PARTICLES; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 1,
          y: (Math.random() - 0.5) * 1,
        },
        radius: Math.random() * 3,
        color,
      })
    );
  }
}

// Frames generation loop [infinite]
function animate() {
  window.requestAnimationFrame(animate);
  if (!game.active) return;

  // reset the background
  context.fillStyle = GAME_BACKGROUND;
  // draws the fresh context
  context.fillRect(0, 0, canvas.width, canvas.height);

  /**
   * Explosion particles
   */
  particles.forEach((particle, particleIndex) => {
    /**
     * re-using particles for background
     */
    if (
      particle.opacity > 0 &&
      particle.position.y - particle.radius >= canvas.height
    ) {
      console.log("should render the particles");
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = particle.radius;
      particle.radius = Math.random() * 3;
    }

    /**
     * removing the exploded particles
     */
    if (particle.opacity <= 0) {
      const particleFound = particles.find(
        (particleTemp) => particle === particleTemp
      );
      if (particleFound)
        setTimeout(() => {
          particles.splice(particleIndex, 1);
        }, 0);
    } else {
      particle.update();
    }
  });

  /**
   * Player
   */
  player.update();

  /**
   * Player bullets
   */
  bullets.forEach((bullet, index) => {
    // removing bullets exited the screen (GC)
    if (bullet.position.y + bullet.radius <= 0) {
      setTimeout(() => {
        bullets.splice(index, 1);
      }, 0);
    } else {
      bullet.update();
    }
  });

  /**
   * Enemy bullets
   */
  enemyBullets.forEach((enemyBullet, enemyBulletIndex) => {
    // removing enemy bullets exited the screen (GC)
    if (enemyBullet.position.y + enemyBullet.height >= canvas.height) {
      const enemyBulletFound = enemyBullets.find(
        (tempEnemyBullet) => tempEnemyBullet === enemyBullet
      );
      if (enemyBulletFound) {
        setTimeout(() => {
          enemyBullets.splice(enemyBulletIndex, 1);
        }, 0);
      }
    } else {
      enemyBullet.update();
    }

    /**
     * Player-hit collision logic
     */
    if (
      enemyBullet.position.y + enemyBullet.height >= player.position.y &&
      enemyBullet.position.x >= player.position.x &&
      enemyBullet.position.x <= player.position.x + player.width
    ) {
      console.log("Game Over");
      /**
       * bullet which hit the player GC
       */
      const enemyBulletFound = enemyBullets.find(
        (tempEnemyBullet) => tempEnemyBullet === enemyBullet
      );
      if (enemyBulletFound) {
        explode(player, "white");
        gameAudio.play("player_explodes");

        player.opacity = 0;
        game.over = true;

        setTimeout(() => {
          game.active = false;
          gameAudio.stopBackgroundSound();
        }, 2000);

        setTimeout(() => {
          enemyBullets.splice(enemyBulletIndex, 1);
        }, 0);
      }
    }
  });

  /**
   * Array of Enemy Grids
   */
  enemyGrids.forEach((enemyGrid, enemyGridIndex) => {
    /**
     * rendering single enemy grid
     */
    enemyGrid.update();

    /**
     * randomly enemy generating bulllets
     */
    if (frames % 200 === 0 && enemyGrid.enemies.length) {
      enemyGrid.enemies[
        Math.floor(Math.random() * enemyGrid.enemies.length)
      ].shoot(enemyBullets);
    }

    /**
     * inserting enemies in single grid
     */
    enemyGrid.enemies.forEach((enemy, enemyIndex) => {
      /**
       * rendering single enmey
       */
      enemy.update({ velocity: enemyGrid.velocity });

      /**
       * Enemy-hit collision logic
       */
      bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.position.x + bullet.radius > enemy.position.x &&
          bullet.position.x - bullet.radius < enemy.position.x + enemy.width &&
          bullet.position.y + bullet.radius > enemy.position.y &&
          bullet.position.y - bullet.radius < enemy.position.y + enemy.height
        ) {
          setTimeout(() => {
            // splice changes the order in the array. this to target the same enemy
            const enemyFound = enemyGrid.enemies.find(
              (enemyTemp) => enemy === enemyTemp
            );

            // splice changes the order in the array. this to target the same bullet
            const bulletFound = bullets.find(
              (projectileTemp) => bullet === projectileTemp
            );

            explode(enemy, ENEMY_COLOR);
            gameAudio.play("enemy_explodes");

            /**
             * increaing score
             */
            score += 100;
            scoreElement.innerText = score;

            if (enemyFound && bulletFound) {
              enemyGrid.enemies.splice(enemyIndex, 1);
              bullets.splice(bulletIndex, 1);

              // after removing enemy, enemygrid needs to resized,
              // so that remaining enemy can reach the screen horizontal edges
              if (enemyGrid.enemies.length > 0) {
                const firstEnemy = enemyGrid.enemies[0];
                const lastEnemy =
                  enemyGrid.enemies[enemyGrid.enemies.length - 1];

                // for right edge
                enemyGrid.width =
                  lastEnemy.position.x -
                  firstEnemy.position.x +
                  lastEnemy.width;

                // for left edge
                enemyGrid.position.x = firstEnemy.position.x;
              } else {
                // if the enemyGrid is empty, remove from the enemyGrids (GC)
                enemyGrids.splice(enemyGridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -PLAYER_SPEED;
    player.rotation = -PLAYER_TILT;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = PLAYER_SPEED;
    player.rotation = PLAYER_TILT;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  /**
   * spawning new enemies
   */
  if (enemyGrids.length < 2 && frames % 1000 === 0) {
    const newEnemyGrid = new EnemyGrid();
    enemyGrids.push(newEnemyGrid);
  }

  frames++;
}

animate();

/**
 * Listeners
 */

// 1. Binding keys [player's control]
addEventListener("keydown", ({ key }) => {
  if (game.over) return;
  console.log(key);
  switch (key) {
    case "a" || "ArrowLeft": {
      keys.a.pressed = true;
      break;
    }
    case "ArrowLeft": {
      keys.a.pressed = true;
      break;
    }
    case "d": {
      keys.d.pressed = true;
      break;
    }
    case "ArrowRight": {
      keys.d.pressed = true;
      break;
    }
    case " ": {
      bullets.push(
        new Bullet({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: PLAYER_BULLET_SPEED,
          },
        })
      );
      break;
    }
    default: {
      break;
    }
  }
});
addEventListener("keyup", ({ key }) => {
  if (game.over) return;
  switch (key) {
    case "a": {
      keys.a.pressed = false;
      break;
    }
    case "ArrowLeft": {
      keys.a.pressed = false;
      break;
    }
    case "d": {
      keys.d.pressed = false;
      break;
    }
    case "ArrowRight": {
      keys.d.pressed = false;
      break;
    }
    case " ": {
      break;
    }
    default: {
      break;
    }
  }
});
