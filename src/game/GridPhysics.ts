import { Direction } from "../enum/Direction";
import GameScene from "./GameScene";
import { Player } from "./Player";

const Vector2 = Phaser.Math.Vector2;
type Vector2 = Phaser.Math.Vector2;

export class GridPhysics {
  private movementDirection: Direction = Direction.NONE;
  private readonly speedPixelsPerSecond: number = GameScene.TILE_SIZE * 4;
  private movementDirectionVectors: {
    [key in Direction]?: Vector2;
  } = {
    [Direction.UP]: Vector2.UP,
    [Direction.DOWN]: Vector2.DOWN,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.RIGHT]: Vector2.RIGHT,
  };

  constructor(private player: Player) {}

  movePlayer(direction: Direction): void {
    if (!this.isMoving()) {
      this.startMoving(direction);
    }
  }

  private isMoving(): boolean {
    return this.movementDirection != Direction.NONE;
  }

  private startMoving(direction: Direction): void {
    this.movementDirection = direction;
  }

  update(delta: number): void {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta);
    }
  }

  private updatePlayerPosition(delta: number) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta);
    const directionVec = this.movementDirectionVectors[
      this.movementDirection
    ];
    if (directionVec === undefined) {
      return;
    }
    const movementDistance = directionVec.clone().multiply(
      new Vector2(pixelsToWalkThisUpdate)
    );
    const newPlayerPos = this.player.getPosition().add(movementDistance);
    this.player.setPosition(newPlayerPos)
    this.stopMoving();
  }

  private getPixelsToWalkThisUpdate(delta: number): number {
    const deltaInSeconds = delta / 1000;
    return this.speedPixelsPerSecond * deltaInSeconds;
  }

  private stopMoving(): void {
    this.movementDirection = Direction.NONE;
  }
  
}