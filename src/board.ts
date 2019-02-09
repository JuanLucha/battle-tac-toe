import { Ninja } from './ninja'
import { Enemy } from './enemy'
import * as PIXI from 'pixi.js'
import { Subject } from 'rxjs'
import { Point } from './shared/point.interface'

export class Board {
  public boardValues: Enemy[] = []
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

  public markTile(enemyIndex: number, playerId: number): void {
    if (this.isEnemyAlive(enemyIndex)) {
      this.boardValues[enemyIndex].playerId = playerId
    }
  }

  public resetBoardValues(): void {
    this.boardValues.forEach((enemy: Enemy) => {
      enemy.playerId = aliveState
    })
  }

  private detectColumns(ninja: Ninja): boolean {
    return (
      (this.boardValues[0].playerId === ninja.playerId && this.boardValues[3].playerId === ninja.playerId && this.boardValues[6].playerId === ninja.playerId) ||
      (this.boardValues[1].playerId === ninja.playerId && this.boardValues[4].playerId === ninja.playerId && this.boardValues[7].playerId === ninja.playerId) ||
      (this.boardValues[2].playerId === ninja.playerId && this.boardValues[5].playerId === ninja.playerId && this.boardValues[8].playerId === ninja.playerId)
    )
  }

  private detectRows(ninja: Ninja): boolean {
    return (
      (this.boardValues[0].playerId === ninja.playerId && this.boardValues[1].playerId === ninja.playerId && this.boardValues[2].playerId === ninja.playerId) ||
      (this.boardValues[3].playerId === ninja.playerId && this.boardValues[4].playerId === ninja.playerId && this.boardValues[5].playerId === ninja.playerId) ||
      (this.boardValues[6].playerId === ninja.playerId && this.boardValues[7].playerId === ninja.playerId && this.boardValues[8].playerId === ninja.playerId)
    )
  }

  private detectDiagonals(ninja: Ninja): boolean {
    return (
      (this.boardValues[0].playerId === ninja.playerId && this.boardValues[4].playerId === ninja.playerId && this.boardValues[8].playerId === ninja.playerId) ||
      (this.boardValues[6].playerId === ninja.playerId && this.boardValues[4].playerId === ninja.playerId && this.boardValues[2].playerId === ninja.playerId)
    )
  }

  private getEnemyPosition(enemyIndex: number, enemiesContainerHeight: number, enemiesContainerWidth: number, boardHeight: number, boardWidth: number): Point {
    let x: number = enemyIndex
    if (x >= boardWidth * 2) {
      x = x - (boardWidth * 2)
    } else if (x >= boardWidth) {
      x = x - (boardWidth)
    }

    let y: number = Math.floor(enemyIndex / 3)

    return {x: x * enemiesContainerWidth / boardWidth, y: y * enemiesContainerHeight / boardHeight}
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

    const enemyHeight: number = enemiesContainerHeight / boardHeight
    const enemyWidth: number = enemiesContainerWidth / boardWidth

    for (let enemyIndex = 0; enemyIndex < boardWidth * boardHeight; enemyIndex++) {
      let newEnemy: Enemy = new Enemy(this.getEnemyTexture(enemyIndex), aliveState, enemyIndex)
      newEnemy.sprite.name = enemyIndex.toString()
      newEnemy.sprite.buttonMode = true
      newEnemy.sprite.interactive = true
      let newEnemyPosition: Point = this.getEnemyPosition(enemyIndex, enemiesContainerHeight, enemiesContainerWidth, boardHeight, boardWidth)
      newEnemy.sprite.position.set(newEnemyPosition.x, newEnemyPosition.y)
      newEnemy.sprite.height = enemyHeight
      newEnemy.sprite.width = enemyWidth
      newEnemy.sprite.on('click', () => {
        this.enemyClicked.next(newEnemy)
      })
      this.boardValues.push(newEnemy)
      this.enemiesContainer.addChild(newEnemy.sprite)
    }
  }

  private isEnemyAlive(enemyIndex: number): boolean {
    return this.boardValues[enemyIndex].playerId === aliveState
  }
}

// Constants
const aliveState: number = 0
const boardHeight: number = 3
const boardWidth: number = 3
const enemiesContainerHeight: number = 600
const enemiesContainerWidth: number = 600
