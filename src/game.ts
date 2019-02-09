import * as PIXI from 'pixi.js'
import { Subscription } from 'rxjs'
import { Board } from './board'
import { Enemy } from './enemy'
import { Ninja } from './ninja'
import { Weapon } from './weapon'
import { Point } from './shared/point.interface'

export class Game {
  private actualNinja: Ninja
  private actualWeapon: Weapon
  private app: PIXI.Application
  private background: PIXI.Sprite
  private board: Board
  private grid: PIXI.Sprite
  private ninja1: Ninja
  private ninja2: Ninja
  private enemyClickedSubscription: Subscription
  private weaponHitSubscription: Subscription

  constructor() { }

  public start(): void {
    this.createAppEngine()
    this.loadResources()
    this.app.ticker.add(delta => this.gameLoop(delta))
  }

  public switchActualNinja(): void {
    if (this.actualNinja.playerId === ninjaID1) {
      this.actualNinja = this.ninja2
    } else {
      this.actualNinja = this.ninja1
    }
  }

  private centerSprite(sprite: PIXI.Sprite, app: PIXI.Application): Point {
    return {
      x: app.screen.width / 2 - sprite.width / 2,
      y: app.screen.height / 2 - sprite.height / 2,
    }
  }

  private createAppEngine(): void {
    let height: number = window.innerHeight
    let width: number = window.innerWidth

    this.app = new PIXI.Application({ height: height, width: width })
    document.body.appendChild(this.app.view)
  }

  private gameLoop(delta: any): void {
    if (this.actualWeapon && this.actualWeapon.target) {
      this.actualWeapon.rotate(weaponRotationAmount)
      this.actualWeapon.moveToTarget()
    }
  }

  private loadResources(): void {
    this.app.loader
      .add(backgroundImage)
      .add(dragonImage)
      .add(demonImage)
      .add(gridImage)
      .add(hitImage)
      .add(monkImage)
      .add(shurikenImage)
      .load(this.startGameEngine.bind(this))
  }

  private setSubscriptions(): void {
    this.enemyClickedSubscription = this.board.enemyClicked.subscribe((enemy: Enemy) => {
      this.actualWeapon = this.actualNinja.weapon.clone()
      if (this.weaponHitSubscription) this.weaponHitSubscription.unsubscribe()
      this.weaponHitSubscription = this.actualWeapon.onEnemyHit.subscribe(() => {
        enemy.setColor(this.actualNinja.playerColor)
        this.actualWeapon.target = null
        if (this.board.detectNinjaWinner(this.actualNinja)) {
          console.log("gameOver")
          // this.showGameOver()
        } else {
          this.switchActualNinja()
        }
      })
      this.app.stage.addChild(this.actualWeapon.sprite)
      this.actualNinja.attack(this.app.screen.width / 2, this.app.screen.height, enemy, this.actualWeapon)
    })
  }
  private setupBackground(): void {
    this.background = new PIXI.Sprite(PIXI.utils.TextureCache[backgroundImage])
    let backgroundPosition: Point = this.centerSprite(this.background, this.app)
    this.background.position.set(backgroundPosition.x, backgroundPosition.y)
    this.app.stage.addChild(this.background)

    this.grid = new PIXI.Sprite(PIXI.utils.TextureCache[gridImage])
    let gridPosition: Point = this.centerSprite(this.grid, this.app)
    this.grid.position.set(gridPosition.x, gridPosition.y)
    this.app.stage.addChild(this.grid)
  }

  private setupBoard(): void {
    this.board = new Board(
      PIXI.utils.TextureCache[demonImage],
      PIXI.utils.TextureCache[dragonImage],
      PIXI.utils.TextureCache[monkImage],
      this.app.screen.height,
      this.app.screen.width
    )
    this.app.stage.addChild(this.board.enemiesContainer)
  }

  private setupNinjas(): void {
    this.ninja1 = new Ninja(PIXI.utils.TextureCache[shurikenImage], PIXI.utils.TextureCache[hitImage], ninjaID1, ninjaColor1)
    this.ninja2 = new Ninja(PIXI.utils.TextureCache[shurikenImage], PIXI.utils.TextureCache[hitImage], ninjaID2, ninjaColor2)
    this.actualNinja = this.ninja1
  }

  private startGameEngine(): void {
    this.setupBackground()
    this.setupNinjas()
    this.setupBoard()
    this.setSubscriptions()
  }
}

// Constants
const backgroundImage: string = 'images/background.png'
const demonImage: string = 'images/demon.png'
const dragonImage: string = 'images/dragon.png'
const gridImage: string = 'images/grid.png'
const hitImage: string = 'images/hit.png'
const monkImage: string = 'images/monk.png'
const ninjaID1: number = 1
const ninjaID2: number = 2
const ninjaColor1: number = 0xff0000
const ninjaColor2: number = 0x0000ff
const shurikenImage: string = 'images/shuriken.png'
const weaponRotationAmount: number = 0.3
