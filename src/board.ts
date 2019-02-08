import { Game } from './game'
import { Ninja } from './ninja'
import { Enemy } from './enemy'
import * as PIXI from 'pixi.js'
import { Subject } from 'rxjs'

const aliveState: number = 0
const boardHeight: number = 3
const boardWidth: number = 3
const enemiesContainerHeight: number = 600
const enemiesContainerWidth: number = 600

export class Board {
  public boardValues: Enemy[][] = []
  public enemiesContainer: PIXI.Container
  public enemyClicked: Subject<Enemy> = new Subject()

  private demonTexture: PIXI.Texture
  private dragonTexture: PIXI.Texture
  private monkTexture: PIXI.Texture

  constructor(
    demonTexture: PIXI.Texture,
    dragonTexture: PIXI.Texture,
    monkTexture: PIXI.Texture,
    screenHeight: number,
    screenWidth: number
  ) {
    this.demonTexture = demonTexture
    this.dragonTexture = dragonTexture
    this.monkTexture = monkTexture
    this.initBoard(screenHeight, screenWidth)
  }

  public detectNinjaWinner(ninja: Ninja): boolean {
    return this.detectRows(ninja) || this.detectColumns(ninja) || this.detectDiagonals(ninja)
  }

  public markTile(x: number, y: number, playerId: number): void {
    if (this.isEnemyAlive(x, y)) {
      this.boardValues[y][x].playerId = playerId
    }
  }

  public resetBoardValues(): void {
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        this.boardValues[y][x].playerId = aliveState
      }
    }
  }

  private detectColumns(ninja: Ninja): boolean {
    let sprites: PIXI.Sprite[] = this.enemiesContainer.children as PIXI.Sprite[]
    return (
      (sprites[0].tint === ninja.playerColor && sprites[3].tint === ninja.playerColor && sprites[6].tint === ninja.playerColor) ||
      (sprites[1].tint === ninja.playerColor && sprites[4].tint === ninja.playerColor && sprites[7].tint === ninja.playerColor) ||
      (sprites[2].tint === ninja.playerColor && sprites[5].tint === ninja.playerColor && sprites[8].tint === ninja.playerColor)
    )
  }

  private detectRows(ninja: Ninja): boolean {
    let sprites: PIXI.Sprite[] = this.enemiesContainer.children as PIXI.Sprite[]
    console.log(sprites[0].tint, sprites[1].tint, sprites[2].tint, ninja.playerColor)
    return (
      (sprites[0].tint === ninja.playerColor && sprites[1].tint === ninja.playerColor && sprites[2].tint === ninja.playerColor) ||
      (sprites[3].tint === ninja.playerColor && sprites[4].tint === ninja.playerColor && sprites[5].tint === ninja.playerColor) ||
      (sprites[6].tint === ninja.playerColor && sprites[7].tint === ninja.playerColor && sprites[8].tint === ninja.playerColor)
    )
  }

  private detectDiagonals(ninja: Ninja): boolean {
    let sprites: PIXI.Sprite[] = this.enemiesContainer.children as PIXI.Sprite[]
    return (
      (sprites[0].tint === ninja.playerColor && sprites[4].tint === ninja.playerColor && sprites[8].tint === ninja.playerColor) ||
      (sprites[6].tint === ninja.playerColor && sprites[4].tint === ninja.playerColor && sprites[2].tint === ninja.playerColor)
    )
  }

  private getEnemyTexture(enemyId: number): PIXI.Texture {
    if ([0, 2, 6, 8].includes(enemyId)) {
      return this.demonTexture
    }
    if ([1, 3, 5, 7].includes(enemyId)) {
      return this.monkTexture
    }
    if (enemyId === 4) {
      return this.dragonTexture
    }
  }

  private initBoard(screenHeight: number, screenWidth: number): void {
    this.enemiesContainer = new PIXI.Container()
    this.enemiesContainer.x = (screenWidth - enemiesContainerWidth) / 2
    this.enemiesContainer.y = (screenHeight - enemiesContainerHeight) / 2

    let enemyId: number = 0
    const enemyHeight: number = enemiesContainerHeight / boardHeight
    const enemyWidth: number = enemiesContainerWidth / boardWidth

    for (let y = 0; y < boardHeight; y++) {
      this.boardValues.push([])
      for (let x = 0; x < boardWidth; x++) {
        let newEnemy: Enemy = new Enemy(this.getEnemyTexture(enemyId), aliveState, enemyId)
        newEnemy.sprite.buttonMode = true
        newEnemy.sprite.interactive = true
        newEnemy.sprite.position.set(x * enemiesContainerWidth / boardWidth, y * enemiesContainerHeight / boardHeight)
        newEnemy.sprite.height = enemyHeight
        newEnemy.sprite.width = enemyWidth
        newEnemy.sprite.on('click', () => {
          this.enemyClicked.next(newEnemy)
        })
        this.boardValues[y].push(newEnemy)
        this.enemiesContainer.addChild(this.boardValues[y][x].sprite)
        enemyId++
      }
    }
  }

  private isEnemyAlive(x: number, y: number): boolean {
    return this.boardValues[y][x].playerId === aliveState
  }
}