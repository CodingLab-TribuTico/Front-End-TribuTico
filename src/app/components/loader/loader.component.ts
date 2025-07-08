import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

}
