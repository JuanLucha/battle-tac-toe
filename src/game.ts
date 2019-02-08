import * as PIXI from 'pixi.js'
import { Subscription } from 'rxjs'
import { Board } from './board'
import { Enemy } from './enemy'
import { Ninja } from './ninja'
import { Weapon } from './weapon'

const demonImage: string = 'images/demon.png'
const dragonImage: string = 'images/dragon.png'
const monkImage: string = 'images/monk.png'
const ninjaID1: number = 1
const ninjaID2: number = 2
const ninjaColor1: number = 0xff0000
const ninjaColor2: number = 0x0000ff
const shurikenImage: string = 'images/shuriken.png'
const weaponRotationAmount: number = 0.3

export class Game {
  public actualNinja: Ninja
  public actualWeapon: Weapon
  public app: PIXI.Application

  private board: Board
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
    console.log(this.actualNinja.playerId)
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
      .add(dragonImage)
      .add(demonImage)
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
    this.ninja1 = new Ninja(PIXI.utils.TextureCache[shurikenImage], ninjaID1, ninjaColor1)
    this.ninja2 = new Ninja(PIXI.utils.TextureCache[shurikenImage], ninjaID2, ninjaColor2)
    this.actualNinja = this.ninja1
  }

  private startGameEngine(): void {
    this.setupNinjas()
    this.setupBoard()
    this.setSubscriptions()

    // this.actualWeapon = this.ninja1.weapon.clone()
    // this.actualWeapon.rotate(weaponRotationAmount)
    // this.app.stage.addChild(this.actualWeapon.sprite)
  }
}
