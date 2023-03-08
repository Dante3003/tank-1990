import { Bullet } from "../entities/Bullet";
import Tank from "../entities/Tank";
import { Scene } from "phaser";

export class GameScene extends Scene {
  walls!: Phaser.Tilemaps.TilemapLayer;
  preload() {
    this.load.atlas(
      "tank",
      "assets/sprites/tank.png",
      "assets/sprites/tank.json"
    );
    this.load.image("bullet", "assets/sprites/bullet.png");
    this.load.image("demoTextures", "assets/sprites/demo.png");

    this.load.tilemapTiledJSON("demoMap", "assets/levels/test-level.json");
  }
  create() {
    this.matter.world.setBounds();
    const player = new Tank(this, this.matter.world, 100, 100);

    const map = this.make.tilemap({ key: "demoMap" });
    const tileset = map.addTilesetImage("demo", "demoTextures");

    this.walls = map.createLayer("Walls", tileset);
    map.setCollisionByProperty({ collider: true });
    this.matter.world.convertTilemapLayer(this.walls);

    this.walls.forEachTile((tile) => {
      this.matterCollision.addOnCollideStart({
        objectA: tile,
        callback: ({ bodyB, bodyA }) => {
          console.log(bodyA);
          if (
            bodyB.label === "bullet" &&
            bodyA?.gameObject?.tile?.properties?.destroyable
          ) {
            this.walls.removeTileAtWorldXY(bodyA.position.x, bodyA.position.y);
            bodyA?.gameObject?.tile?.destroy();
            bodyA?.gameObject?.destroy();
            bodyB?.gameObject?.destroy();
          }
        },
      });
    });
  }
  update() {}

  checkCollisionBetweenWallAndBullet(
    gameObjectA: Phaser.GameObjects.GameObject,
    gameObjectB: Phaser.GameObjects.GameObject
  ) {
    if (
      (gameObjectA instanceof Phaser.Physics.Matter.TileBody &&
        gameObjectB instanceof Bullet) ||
      (gameObjectB instanceof Phaser.Physics.Matter.TileBody &&
        gameObjectA instanceof Bullet)
    ) {
      console.log("worked");
    }
  }
}
