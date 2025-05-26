import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {

  @ViewChild('boardCanvas', { static: true })
  boardCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private gameLoop: any;

  boardSize = 400;
  cellSize = 20;
  snake: { x: number, y: number }[] = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  direction = 'right';
  gameOver = false;
  score = 0;
  highScore = 0;
  
  difficulties = [
    { name: 'Easy', speed: 150 },
    { name: 'Medium', speed: 100 },
    { name: 'Hard', speed: 70 }
  ];
  currentDifficulty = this.difficulties[1]; // Medium by default
  showDifficultySelect = true;
  
  foodColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
  currentFoodColor = this.foodColors[0];

  ngOnInit(): void {
    this.ctx = this.boardCanvas.nativeElement.getContext('2d')!;
    this.startGame();
  }

  startGame(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.snake = [{ x: 10, y: 10 }];
    this.food = { x: 5, y: 5 };
    this.direction = 'right';
    this.gameOver = false;
    this.score = 0;
    this.showDifficultySelect = false;
    this.currentFoodColor = this.getRandomFoodColor();
    this.draw();
    this.gameLoop = setInterval(() => {
      this.update();
      this.draw();
    }, this.currentDifficulty.speed);
  }

  getRandomFoodColor(): string {
    return this.foodColors[Math.floor(Math.random() * this.foodColors.length)];
  }

  setDifficulty(difficulty: any): void {
    this.currentDifficulty = difficulty;
    this.startGame();
  }

  showMenu(): void {
    this.showDifficultySelect = true;
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
  }

  update(): void {
    if (this.gameOver) return;

    const head = { ...this.snake[0] };

    switch (this.direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }

    if (head.x < 0 || head.x * this.cellSize >= this.boardSize ||
      head.y < 0 || head.y * this.cellSize >= this.boardSize ||
      this.checkCollision(head)) {
      this.gameOver = true;
      if (this.score > this.highScore) {
        this.highScore = this.score;
      }
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.currentFoodColor = this.getRandomFoodColor();
      this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  draw(): void {
    // Draw background
    this.ctx.fillStyle = '#F0F0F0';
    this.ctx.fillRect(0, 0, this.boardSize, this.boardSize);
    
    // Draw grid
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i <= this.boardSize; i += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.boardSize);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.boardSize, i);
      this.ctx.stroke();
    }

    this.drawSnake();
    this.drawFood();
    this.drawScore();
  }

  drawSnake(): void {
    // Draw snake body
    this.snake.forEach((segment, index) => {
      const gradient = this.ctx.createLinearGradient(
        segment.x * this.cellSize,
        segment.y * this.cellSize,
        (segment.x + 1) * this.cellSize,
        (segment.y + 1) * this.cellSize
      );
      
      if (index === 0) { // Head
        gradient.addColorStop(0, '#2ECC71');
        gradient.addColorStop(1, '#27AE60');
      } else { // Body
        gradient.addColorStop(0, '#3498DB');
        gradient.addColorStop(1, '#2980B9');
      }
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      );
    });
  }

  drawFood(): void {
    const x = this.food.x * this.cellSize;
    const y = this.food.y * this.cellSize;
    const radius = this.cellSize / 2;
    
    this.ctx.beginPath();
    this.ctx.arc(
      x + radius,
      y + radius,
      radius - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = this.currentFoodColor;
    this.ctx.fill();
    this.ctx.strokeStyle = '#FFF';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawScore(): void {
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillText('Score: ' + this.score, 10, 25);
    this.ctx.fillText('High Score: ' + this.highScore, 10, 50);
  }

  generateFood(): void {
    let newFood = {
      x: Math.floor(Math.random() * (this.boardSize / this.cellSize)),
      y: Math.floor(Math.random() * (this.boardSize / this.cellSize))
    };
    if (this.checkCollision(newFood)) {
      this.generateFood();
    } else {
      this.food = newFood;
    }
  }

  checkCollision(pos: { x: number, y: number }): boolean {
    for (let i = 0; i < this.snake.length; i++) {
      if (pos.x === this.snake[i].x && pos.y === this.snake[i].y) {
        return true;
      }
    }
    return false;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction !== 'down')
          this.direction = 'up';
        break;
      case 'ArrowDown':
        if (this.direction !== 'up')
          this.direction = 'down';
        break;
      case 'ArrowLeft':
        if (this.direction !== 'right')
          this.direction = 'left';
        break;
      case 'ArrowRight':
        if (this.direction !== 'left')
          this.direction = 'right';
        break;
    }
  }
}