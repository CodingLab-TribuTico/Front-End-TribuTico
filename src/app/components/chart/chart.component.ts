import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() title: string = "";
  @Input() labels: string[] = [];
  @Input() datasets: any[] = [];
  @Input() type: ChartType = 'bar';

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  public chart!: Chart;

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasets'] || changes['labels']) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: {
        responsive: true,
      }
    });
  }
}
