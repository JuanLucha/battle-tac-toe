import { Board } from './board'
import { Weapon } from './weapon'
import * as PIXI from 'pixi.js'
import { Ninja } from './ninja'

const enemyImage: string = 'images/ninja.png'
const ninjaID1: number = 1
const ninjaID2: number = 2
const shuriken1Image: string = 'images/shuriken-1.png'
const shuriken2Image: string = 'images/shuriken-2.png'
const weaponRotationAmount: number = 0.1

export class Game {
  private app: PIXI.Application
  private actualNinja: Ninja
  private actualWeapon: Weapon
  private board: Board
  private ninja1: Ninja
  private ninja2: Ninja

  constructor() { }

  public start(): void {
    this.createAppEngine()
    this.loadResources()
    this.app.ticker.add(delta => this.gameLoop(delta))
  }

  private createAppEngine(): void {
    let height: number = window.innerHeight
    let width: number = window.innerWidth

    this.app = new PIXI.Application({ height: height, width: width })
    document.body.appendChild(this.app.view)
  }

  private gameLoop(delta: any): void {
    this.rotateStar()
  }

  private loadResources(): void {
    this.app.loader
      .add(shuriken1Image)
      .add(shuriken2Image)
      .add(enemyImage)
      .load(this.startGameEngine.bind(this))
  }

  private rotateStar(): void {
    if (this.actualWeapon)
    this.actualWeapon.rotate(weaponRotationAmount)
  }

  private setupBoard(): void {
    this.board = new Board(PIXI.utils.TextureCache[enemyImage], this.app.screen.height, this.app.screen.width)
    this.app.stage.addChild(this.board.enemiesContainer)
  }

  private setupNinjas(): void {
    this.ninja1 = new Ninja(PIXI.utils.TextureCache[shuriken1Image], ninjaID1)
    this.ninja2 = new Ninja(PIXI.utils.TextureCache[shuriken2Image], ninjaID2)
  }

  private startGameEngine(): void {
    this.setupNinjas()
    this.setupBoard()

    // this.actualWeapon = this.ninja1.weapon.clone()
    // this.actualWeapon.rotate(weaponRotationAmount)
    // this.app.stage.addChild(this.actualWeapon.sprite)
  }
}
