export default class Flash extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "mainSpritesheet", "flash-1.png", {
      isSensor: true,
      isStatic: true,
    });

    scene.add.existing(this);

    this.anims.play("flashLight");
    this.once("animationcomplete", () => {
      this.destroy();
    });
  }
}
