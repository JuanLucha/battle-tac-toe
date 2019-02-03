import { Weapon } from './weapon'
import * as PIXI from 'pixi.js'
import { Ninja } from './ninja'

const gameLoopInterval: number = 10
const shuriken1Image: string = 'images/shuriken-1.png'
const shuriken2Image: string = 'images/shuriken-2.png'
const weaponRotationAmount: number = 0.1

export class Game {
  private app: PIXI.Application
  private actualWeapon: Weapon
  private gameLoop: number
  private ninja1: Ninja
  private ninja2: Ninja

  constructor() { }

  public start(): void {
    this.createAppEngine()
    this.loadResources()
    this.gameLoop = window.setInterval(this.gameIteration.bind(this), gameLoopInterval)
  }

  private createAppEngine(): void {
    let height: number = window.innerHeight
    let width: number = window.innerWidth

    this.app = new PIXI.Application({ height: height, width: width })
    document.body.appendChild(this.app.view)
  }

  private gameIteration(): void {
    this.rotateStar()
  }

  private loadResources(): void {
    this.app.loader
      .add(shuriken1Image)
      .add(shuriken2Image)
      .load(this.startGameEngine.bind(this))
  }

  private rotateStar(): void {
    if (this.actualWeapon)
    this.actualWeapon.rotate(weaponRotationAmount)
  }

  private setupNinjas(): void {
    this.ninja1 = new Ninja(PIXI.utils.TextureCache['images/shuriken-1.png'])
    this.ninja2 = new Ninja(PIXI.utils.TextureCache['images/shuriken-2.png'])
  }

  private startGameEngine(): void {
    this.setupNinjas()

    this.actualWeapon = this.ninja1.weapon.clone()
    // this.actualWeapon.rotate(weaponRotationAmount)
    this.app.stage.addChild(this.actualWeapon.sprite)
  }
}
