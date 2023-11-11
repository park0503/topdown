import Phaser from "phaser";
import { Player } from "./Player";
import { GridPhysics } from "./GridPhysics";
import { GridControls } from "./GridControls";
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

class GameScene extends Phaser.Scene {
  public static readonly TILE_SIZE = 48;

  private tilemap!: Phaser.Tilemaps.Tilemap;
  private gridControls!: GridControls;
  private gridPhysics!: GridPhysics;

  constructor() {
    super(sceneConfig);
  }

  preload() {
    this.load.image("tiles", "assets/cloud_tileset.png");
    this.load.tilemapTiledJSON("cloud-city-map", "assets/cloud_city.tmj");
    this.load.spritesheet("player", "assets/characters.png", {
      frameWidth: 26,
      frameHeight: 36,
    });
  }

  create() {
    this.tilemap = this.make.tilemap({ key: "cloud-city-map" });
    this.tilemap.addTilesetImage("Cloud city", "tiles");
    console.log(this.tilemap.layers.length);
    for (let i = 0; i < this.tilemap.layers.length; i++) {
      const layer = this.tilemap.createLayer(i, "Cloud city", 0, 0);
      if (layer !== null) {
        layer.setDepth(i);
        layer.scale = 3;
      }
    }

    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(2);
    playerSprite.scale = 3;
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;
    const player = new Player(playerSprite, new Phaser.Math.Vector2(6, 6));

    this.gridPhysics = new GridPhysics(player);
    this.gridControls = new GridControls(
      this.input,
      this.gridPhysics
    );
  }

  update(_time: number, delta: number) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }
}

export default GameScene;