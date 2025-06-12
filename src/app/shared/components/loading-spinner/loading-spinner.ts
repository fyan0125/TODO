import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinnerComponent {
  loadingService = inject(LoadingService);
  isLoading = this.loadingService.isLoading;
}
