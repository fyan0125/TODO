import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinnerComponent {
  // inject
  private loadingService = inject(LoadingService);

  // input/output/一般變數/signal 無

  // computed
  isLoading = this.loadingService.isLoading;

  // 生命週期/公有/私有 function 無
}
