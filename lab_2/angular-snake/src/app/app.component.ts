import { Component } from '@angular/core';
import { SnakeComponent } from './snake/snake.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SnakeComponent], // <-- добавьте сюда
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-snake';
}