import {
  createExplosionAnimation,
  createFlashAnimation,
} from "../animations/effects";
import { createTankMoveAnimation } from "../animations/tank";
import Enemy from "../entities/Enemy";
import Explosion from "../entities/Explosion";
import Tank from "../entities/Tank";
import { Scene } from "phaser";
import { randomInRange } from "../utils/random";
import gameEvents from "../events/game";
import Flash from "../entities/Flash";
import { Bullet, BulletGroup } from "../entities/Bullet";

export class GameScene extends Scene {
  walls!: Phaser.Tilemaps.TilemapLayer;
  enemies: Enemy[] = [];
  enemySpawnInterval!: number;
  bullets!: BulletGroup;
  playerLifes: number;
  player!: Tank;
  constructor() {
    super("GameScene");
    this.playerLifes = 3;
  }
  preload() {
    this.load.atlas(
      "tank",
      "assets/sprites/tank.png",
      "assets/sprites/tank.json"
    );
    this.load.image("bullet", "assets/sprites/bullet.png");
    this.load.image("demoTextures", "assets/sprites/demo.png");

    this.load.tilemapTiledJSON("demoMap", "assets/levels/test-level.json");
    this.load.atlas(
      "mainSpritesheet",
      "assets/sprites/spritesheet.png",
      "assets/sprites/spritesheet.json"
    );
  }
  create() {
    createTankMoveAnimation(this.anims);
    createExplosionAnimation(this.anims);
    createFlashAnimation(this.anims);

    this.scene.launch("GameUI");
    this.bullets = new BulletGroup(this);

    this.player = new Tank(this, 100, 100, this.bullets);
    const base = this.physics.add.sprite(
      230,
      500,
      "mainSpritesheet",
      "base.png"
    );

    const map = this.make.tilemap({ key: "demoMap" });
    const tileset = map.addTilesetImage("demo", "demoTextures");

    this.walls = map.createLayer("Walls", tileset);
    map.setCollisionByProperty({ collider: true });

    const enemySpawn = map.getObjectLayer("EnemySpawn");
    this.enemySpawnInterval = setInterval(() => {
      this.spawnEnemy(enemySpawn, this.player);
    }, 3000);

    this.physics.add.collider(this.walls, this.player);
    this.physics.add.collider(
      this.bullets,
      this.player,
      this.playerWithBulletCollideHandler.bind(this)
    );
    this.physics.add.collider(
      base,
      this.bullets,
      this.baseCollideHandler.bind(this)
    );
    this.physics.add.collider(
      this.walls,
      this.bullets,
      this.tileCollideHandler.bind(this)
    );
    this.physics.add.collider(
      this.walls,
      this.player.bulletGroup,
      this.tileCollideHandler.bind(this)
    );
  }

  update() {}

  tileCollideHandler(
    objA: Phaser.GameObjects.GameObject,
    objB: Phaser.GameObjects.GameObject
  ) {
    const explosion = new Explosion(
      this,
      objA.body.position.x,
      objA.body.position.y
    );
    this.add.existing(explosion);
    objA.destroy();

    // @ts-ignore
    if (objB?.properties?.destroyable) {
      // @ts-ignore
      this.walls.removeTileAtWorldXY(objB.pixelX, objB.pixelY);
    }
  }

  playerWithBulletCollideHandler(
    objA: Phaser.GameObjects.GameObject,
    objB: Phaser.GameObjects.GameObject
  ) {
    objB.destroy();

    this.player.die();
    this.playerLifes -= 1;

    if (this.playerLifes <= 0) {
      this.gameOver();
    }

    this.player.setPosition(100, 100);
    this.player.setActive(true);
    this.player.setVisible(true);
  }

  enemyWithPlayerBulletCollideHandler(
    objA: Phaser.GameObjects.GameObject,
    objB: Phaser.GameObjects.GameObject
  ) {
    const enemy = objA as Enemy;
    const bullet = objB as Bullet;
    console.log(bullet);
    bullet.destroy();
    enemy.die();
  }

  enemyWithBulletCollideHandler(
    objA: Phaser.GameObjects.GameObject,
    objB: Phaser.GameObjects.GameObject
  ) {
    objB.destroy();
  }

  baseCollideHandler() {
    // @ts-ignore
    this.gameOver();
  }

  gameOver() {
    clearInterval(this.enemySpawnInterval);
    this.enemies.forEach((item) => {
      item.die();
    });
    this.scene.pause("GameScene");
    gameEvents.emit("gameOver");
  }
  spawnEnemy(enemySpawn: Phaser.Tilemaps.ObjectLayer, player: Tank) {
    if (this.enemies.length >= 4) {
      return;
    }
    const randomIndex = randomInRange(0, enemySpawn.objects.length);
    const randomPoint = enemySpawn.objects[randomIndex];
    new Flash(this, randomPoint.x || 0, randomPoint.y || 0).once(
      "destroy",
      () => {
        const enemy = new Enemy(
          this,
          randomPoint.x || 0,
          randomPoint.y || 0,
          this.bullets
        );
        this.physics.add.collider(enemy, this.walls);
        this.physics.add.collider(
          enemy,
          player.bulletGroup,
          this.enemyWithPlayerBulletCollideHandler
        );
        this.physics.add.collider(
          enemy,
          this.bullets,
          this.enemyWithBulletCollideHandler
        );
        this.physics.add.collider(enemy, player);
        this.physics.add.collider(enemy, this.enemies);

        this.enemies.push(enemy);

        enemy.once("destroy", () => {
          this.enemies = this.enemies.filter((e) => e !== enemy);
        });
      }
    );
  }
}
