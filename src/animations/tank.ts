export function createTankMoveAnimation(
  animator: Phaser.Animations.AnimationManager
) {
  animator.create({
    key: "tankMove",
    frames: animator.generateFrameNames("mainSpritesheet", {
      prefix: "tank-yellow-",
      start: 1,
      end: 2,
      suffix: ".png",
    }),
    frameRate: 24,
    repeat: 20,
  });
}
