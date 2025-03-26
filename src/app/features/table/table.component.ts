import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

export interface TableColumn {
  key: string;
  label: string;
  tooltip?: string;
  type: 'button' | 'checkbox' | 'input' | 'label';
  input_type?: 'text' | 'email' | 'number';
  validators?: ValidatorFn[];
  is_key?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T extends Record<string, any>> implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];

  displayedColumns: string[] = [];
  errorMessages: string[] = [];
  private form: FormGroup;
  private subscriptions: Subscription[] = [];

  private readonly fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private init() {
    this.displayedColumns = this.columns.map(col => col.key);

    this.data.forEach(item => {
      const group: any = {};
      this.columns.forEach(col => {
        if (['checkbox', 'input', 'label'].includes(col.type)) {
          group[col.key] = new FormControl(item[col.key], col.validators || []);
        }
      });

      this.items.push(this.fb.group(group));
    });

    this.columns.forEach((col) => {
      if (col.validators && col.validators.length > 0) {
        this.items.controls.forEach((fg) => {
          const control = fg.get(col.key);
          if (control) {
            const sub = control.valueChanges.subscribe(() => this.validate());
            this.subscriptions.push(sub);
          }
        });
      }
    });
  }

  private validate() {
    this.errorMessages = [];

    this.items.controls.forEach((fg) => {
      if (fg instanceof FormGroup) {
        Object.keys(fg.controls).forEach((key) => {
          const control = fg.get(key);
          if (control?.errors) {
            Object.keys(control.errors).forEach((errorKey) => {
              const column = this.columns.find(col => col.key === key);
              const label = column?.label;

              let message = '';
              switch (errorKey) {
                case 'required':
                  message = `${label}は必須です。`;
                  break;
                case 'email':
                  message = `${label}の形式が正しくありません。`;
                  break;
                case 'pattern':
                  message = `${label}の形式が正しくありません。`;
                  break;
                default:
                  message = `${label}にエラーがあります。`;
                  break;
              }

              const keyColumn = this.columns.find(col => col.is_key);
              const keyColumnKey = keyColumn?.key;
              const keyValue = keyColumnKey ? fg.get(keyColumnKey)?.value : '';

              this.errorMessages.push(`${keyColumn?.label} ${keyValue}: ${message}`);
            });
          }
        });
      }
    });
  }

  log() {
    console.log(this.form.value.items);
  }
}
