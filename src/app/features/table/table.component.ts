import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TableColumn {
  key: string;
  label: string;
  tooltip?: string;
  type: 'button' | 'checkbox' | 'input' | 'label';
  input_type?: 'text' | 'email' | 'number';
  validators?: any[];
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
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.key as string);
    this.data.forEach(item => {
      const group: any = {};
      this.columns.forEach(col => {
        group[col.key] = new FormControl(item[col.key], col.validators || []);
      });

      this.items.push(this.fb.group(group));
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  log() {
    console.log(this.form.value.items);
  }
}
