export default class Flash extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "mainSpritesheet", "flash-1.png");

    scene.add.existing(this);

    this.anims.play("flashLight");
    this.once("animationcomplete", () => {
      this.destroy();
    });
  }
}
