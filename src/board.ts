import { Enemy } from './enemy'
import * as PIXI from 'pixi.js'

const aliveState: number = 0
const boardHeight: number = 3
const boardWidth: number = 3
const enemiesContainerHeight: number = 600
const enemiesContainerWidth: number = 600

export class Board {
  public boardValues: Enemy[][] = []
  public enemiesContainer: PIXI.Container

  constructor(texture: PIXI.Texture, screenHeight: number, screenWidth: number) {
    this.initBoard(texture, screenHeight, screenWidth)
  }

  public markTile(x: number, y: number, playerNumber: number): void {
    if (this.isEnemyAlive(x, y)) {
      this.boardValues[y][x].playerNumber = playerNumber
    }
  }

  public resetBoardValues(): void {
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        this.boardValues[y][x].playerNumber = aliveState
      }
    }
  }

  private initBoard(texture: PIXI.Texture, screenHeight: number, screenWidth: number): void {
    this.enemiesContainer = new PIXI.Container()
    this.enemiesContainer.x = (screenWidth - enemiesContainerWidth) / 2
    this.enemiesContainer.y = (screenHeight - enemiesContainerHeight) / 2

    let enemyId: number = 0
    const enemyHeight: number = enemiesContainerHeight / boardHeight
    const enemyWidth: number = enemiesContainerWidth / boardWidth

    for (let y = 0; y < boardHeight; y++) {
      this.boardValues.push([])
      for (let x = 0; x < boardWidth; x++) {
        this.boardValues[y].push(new Enemy(texture, aliveState, enemyId))
        this.boardValues[y][x].sprite.position.set(x * enemiesContainerWidth / boardWidth, y * enemiesContainerHeight / boardHeight)
        this.boardValues[y][x].sprite.height = enemyHeight
        this.boardValues[y][x].sprite.width = enemyWidth
        this.enemiesContainer.addChild(this.boardValues[y][x].sprite)
        enemyId++
      }
    }
  }

  private isEnemyAlive(x: number, y: number): boolean {
    return this.boardValues[y][x].playerNumber === aliveState
  }
}