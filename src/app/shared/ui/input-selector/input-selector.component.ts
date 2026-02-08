import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-input-selector',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './input-selector.component.html',
  styleUrl: './input-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectorComponent {
  @Input() public selection: FormControl = new FormControl('', [
    Validators.required,
  ]);
  @Input() public placeholder: string = '';
  @Input() public name: string = '';
  @Input() public disabled: boolean = false;
  @Input() options: {
    _id: number;
    label: string;
    value: string;
    disabled?: boolean;
  }[] = [];
}
