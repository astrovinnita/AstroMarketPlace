import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SnackBarService } from '../../Common/Services/Ui/snack-bar.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [MatProgressBarModule, AsyncPipe],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {

  snackbar = inject(SnackBarService)

}
