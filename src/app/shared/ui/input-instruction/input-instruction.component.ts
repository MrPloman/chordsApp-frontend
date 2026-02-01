import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-input-instruction',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input-instruction.component.html',
  styleUrl: './input-instruction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputInstructionComponent {
  @Input() public instruction = new FormControl('', [Validators.required]);
  @Input() public placeholder: string = '';
  @Input() public name: string = '';
  @Input() public disabled: boolean = false;
}
