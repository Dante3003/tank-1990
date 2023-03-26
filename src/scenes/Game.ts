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
  playerSpawnPoint: {
    x: number;
    y: number;
  };
  constructor() {
    super("GameScene");
    this.playerLifes = 3;
    this.playerSpawnPoint = {
      x: 0,
      y: 0,
    };
  }
  preload() {
    this.load.image("baseTileset", "assets/sprites/base-textures.png");

    this.load.tilemapTiledJSON("levelFirst", "assets/levels/test-level.json");
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

    const map = this.make.tilemap({ key: "levelFirst" });
    const tileset = map.addTilesetImage("demo", "baseTileset");

    this.walls = map.createLayer("Walls", tileset);
    map.setCollisionByProperty({ collider: true });

    const playerSpawn = map.getObjectLayer("PlayerSpawn");
    this.playerSpawnPoint = {
      x: playerSpawn.objects[0].x || this.playerSpawnPoint.x,
      y: playerSpawn.objects[0].y || this.playerSpawnPoint.y,
    };

    this.player = new Tank(
      this,
      this.playerSpawnPoint.x,
      this.playerSpawnPoint.y
    );

    const baseSpawn = map.getObjectLayer("BaseSpawn");
    const base = this.physics.add.sprite(
      baseSpawn.objects[0].x || 0,
      baseSpawn.objects[0].y || 0,
      "mainSpritesheet",
      "base.png"
    );

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
      objA.body?.position?.x,
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
    console.log(objA);

    objB.destroy();

    this.player.die();
    this.playerLifes -= 1;

    if (this.playerLifes <= 0) {
      this.gameOver();
    }

    this.player.setPosition(this.playerSpawnPoint.x, this.playerSpawnPoint.y);
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
    console.log(objA);

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
    console.log(this.enemies);

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
