import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Observable, of } from 'rxjs';

interface DataItem {
  id: number;
  email: string;
  cardNumber: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  displayedColumns: string[] = ['id', 'email', 'cardNumber'];
  form: FormGroup;

  private data: DataItem[] = [
    { id: 1, email: 'user1@example.com', cardNumber: '1111-2222-3333-4444' },
    { id: 2, email: 'user2@example.com', cardNumber: '5555-6666-7777-8888' },
    { id: 3, email: 'user3@example.com', cardNumber: '9999-0000-1111-2222' },
  ];

  private readonly fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      items: this.fb.array([]),
    });

    of([...this.data]).subscribe((data) => {
      const itemsArray = this.form.get('items') as FormArray;
      data.forEach((item) => {
        itemsArray.push(this.createItem(item));
      });
    });
  }

  createItem(item: DataItem) {
    return this.fb.group({
      id: [item.id],
      email: [item.email],
      cardNumber: [item.cardNumber],
    });
  }

  updateData() {
    const updatedData: DataItem[] = (this.form.get('items') as FormArray).value;
    console.log(updatedData);
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }
}
