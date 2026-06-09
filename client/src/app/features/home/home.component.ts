import { Component, OnInit } from '@angular/core';
import { HealthService } from '../../core/services/health.service';

@Component({
  selector: 'app-home',
  template: `
    <h1>MEAN Starter Template</h1>
    <pre>{{ health | json }}</pre>
  `
})
export class HomeComponent implements OnInit {
  health: any;

  constructor(private healthService: HealthService) {}

  ngOnInit() {
    this.healthService.checkHealth().subscribe((res) => {
      this.health = res;
    });
  }
}
