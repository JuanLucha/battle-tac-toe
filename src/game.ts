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
  private enemyClickedSubscription: Subscription
  private grid: PIXI.Sprite
  private ninja1: Ninja
  private ninja2: Ninja
  private playerWinMessage: PIXI.Sprite
  private titleScreen: PIXI.Sprite
  private weaponHitSubscription: Subscription
  private winnerBackground: PIXI.Sprite

  constructor() { }

  public start(): void {
    this.createAppEngine()
    this.loadResources()
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

  private cleanOldGame(): void {
    this.app.destroy(true, true)
    this.enemyClickedSubscription.unsubscribe()
    this.actualNinja = null
    this.actualWeapon = null
    this.background = null
    this.board = null
    this.enemyClickedSubscription = null
    this.grid = null
    this.ninja1 = null
    this.ninja2 = null
    this.playerWinMessage = null
    this.weaponHitSubscription = null
    this.winnerBackground = null
  }

  private createAppEngine(): void {
    let height: number = window.innerHeight
    let width: number = window.innerWidth

    this.app = new PIXI.Application({ height: height, width: width })
    this.app.ticker.add(delta => this.gameLoop(delta))
    document.body.appendChild(this.app.view)
  }

  private gameLoop(delta: any): void {
    if (this.actualWeapon && this.actualWeapon.target) {
      this.actualWeapon.rotate(weaponRotationAmount)
      this.actualWeapon.moveToTarget()
    }
  }

  private gameOver(): void {
    let winnerImage: string
    if (this.actualNinja.playerId === ninjaID1) {
      winnerImage = player1WinImage
    } else {
      winnerImage = player2WinImage
    }
    this.playerWinMessage = new PIXI.Sprite(PIXI.utils.TextureCache[winnerImage])
    let playerWinMessagePosition: Point = this.centerSprite(this.playerWinMessage, this.app)
    this.playerWinMessage.position.set(playerWinMessagePosition.x, playerWinMessagePosition.y)
    this.playerWinMessage

    this.winnerBackground = new PIXI.Sprite(PIXI.Texture.WHITE)
    this.winnerBackground.height = this.app.screen.height
    this.winnerBackground.width = this.app.screen.width
    this.winnerBackground.tint = winnerBackgroundColor
    this.winnerBackground.alpha = winnerBackgroundAlpha
    this.winnerBackground.interactive = true
    this.winnerBackground.on('click', (e: MouseEvent) => {
      e.stopPropagation()
      this.cleanOldGame()
      this.createAppEngine()
      this.loadResources()
    })

    this.app.stage.addChild(this.winnerBackground, this.playerWinMessage)
  }

  private loadResources(): void {
    this.app.loader
      .add(backgroundImage)
      .add(dragonImage)
      .add(demonImage)
      .add(gridImage)
      .add(hitImage)
      .add(monkImage)
      .add(player1WinImage)
      .add(player2WinImage)
      .add(titleScreenImage)
      .add(shurikenImage)
      .load(this.startGameEngine.bind(this))
  }

  private setSubscriptions(): void {
    this.enemyClickedSubscription = this.board.enemyClicked.subscribe((enemy: Enemy) => {
      this.actualWeapon = this.actualNinja.weapon.clone()
      if (this.weaponHitSubscription) this.weaponHitSubscription.unsubscribe()
      this.weaponHitSubscription = this.actualWeapon.onEnemyHit.subscribe(() => {
        this.board.markTile(parseInt(enemy.sprite.name), this.actualNinja.playerId)
        enemy.elimitate()
        this.actualWeapon.target = null
        if (this.board.detectNinjaWinner(this.actualNinja)) {
          this.gameOver()
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
    this.grid.position.set(gridPosition.x, gridPosition.y - gridOffsetY)
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

  private setupTitleScreen(): void {
    this.titleScreen = new PIXI.Sprite(PIXI.utils.TextureCache[titleScreenImage])
    this.titleScreen.height = this.app.screen.height
    this.titleScreen.width = this.app.screen.width
    this.titleScreen.interactive = true
    this.titleScreen.on('click', (e: MouseEvent) => {
      e.stopPropagation()
      this.showGame()
    })

    this.app.stage.addChild(this.titleScreen)
  }

  private showGame(): void {
    this.titleScreen.visible = false
  }

  private startGameEngine(): void {
    this.setupBackground()
    this.setupNinjas()
    this.setupBoard()
    this.setSubscriptions()
    this.setupTitleScreen()
  }
}

// Constants
const backgroundImage: string = 'images/background.png'
const demonImage: string = 'images/demon.png'
const dragonImage: string = 'images/dragon.png'
const gridImage: string = 'images/grid.png'
const gridOffsetY: number = 20
const hitImage: string = 'images/hit.png'
const monkImage: string = 'images/monk.png'
const player1WinImage: string = 'images/1p-win.png'
const player2WinImage: string = 'images/2p-win.png'
const ninjaID1: number = 1
const ninjaID2: number = 2
const ninjaColor1: number = 0xff0000
const ninjaColor2: number = 0x0000ff
const titleScreenImage: string = 'images/title.png'
const shurikenImage: string = 'images/shuriken.png'
const weaponRotationAmount: number = 0.3
const winnerBackgroundAlpha: number = 0.4
const winnerBackgroundColor: number = 0xaa5555
