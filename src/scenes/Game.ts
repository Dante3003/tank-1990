import { CollidingObject, EventData } from "phaser-matter-collision-plugin";
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

export class GameScene extends Scene {
  walls!: Phaser.Tilemaps.TilemapLayer;
  enemies: Enemy[] = [];
  enemySpawnInterval!: number;
  constructor() {
    super("GameScene");
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
    this.matter.world.setBounds();

    const player = new Tank(this, this.matter.world, 100, 100);
    const base = this.matter.add.sprite(
      230,
      500,
      "mainSpritesheet",
      "base.png",
      {
        isStatic: true,
      }
    );

    const map = this.make.tilemap({ key: "demoMap" });
    const tileset = map.addTilesetImage("demo", "demoTextures");

    this.walls = map.createLayer("Walls", tileset);
    map.setCollisionByProperty({ collider: true });
    this.matter.world.convertTilemapLayer(this.walls);

    this.walls.forEachTile((tile) => {
      this.matterCollision.addOnCollideStart({
        objectA: tile,
        callback: this.tileCollideHandler.bind(this),
      });
    });

    const enemySpawn = map.getObjectLayer("EnemySpawn");
    this.enemySpawnInterval = setInterval(() => {
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
            this.matter.world,
            randomPoint.x || 0,
            randomPoint.y || 0
          );
          enemy.once("destroy", () => {
            this.enemies = this.enemies.filter((e) => e !== enemy);
          });
        }
      );
    }, 3000);

    this.matterCollision.addOnCollideStart({
      objectA: base,
      callback: this.baseCollideHandler.bind(this),
    });
  }
  update() {}
  tileCollideHandler({
    bodyA,
    bodyB,
  }: EventData<CollidingObject, CollidingObject>) {
    if (
      // @ts-ignore
      bodyB.label === "bullet" &&
      // @ts-ignore
      bodyA?.gameObject?.tile?.properties?.destroyable
    ) {
      // @ts-ignore
      this.walls.removeTileAtWorldXY(bodyA.position.x, bodyA.position.y);
      // @ts-ignore
      bodyA?.gameObject?.destroy();

      const explosion = new Explosion(
        this,
        // @ts-ignore
        bodyB.position.x,
        // @ts-ignore
        bodyB.position.y
      );
      this.add.existing(explosion);
      // @ts-ignore
      bodyB?.gameObject?.destroy();
    }
  }
  baseCollideHandler({
    gameObjectA,
  }: EventData<CollidingObject, CollidingObject>) {
    // @ts-ignore
    gameObjectA.setFrame("base-die.png");
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
  spawnEnemy() {}
}
