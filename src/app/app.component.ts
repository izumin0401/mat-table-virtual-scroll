import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { TableColumn, TableComponent } from '../app/features/table/table.component';

interface UserData {
  id: number;
  email: string;
  cardNumber: string;
  displayFlg: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent
  ],
  template: `<app-table [columns]="tableColumns" [data]="tableData"></app-table>`,
})
export class AppComponent {
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'label' },
    { key: 'email', label: 'Email', tooltip: 'メールアドレスだよ', type: 'input', input_type: 'email', validators: [Validators.required, Validators.email] },
    { key: 'cardNumber', label: 'カード番号', type: 'input', validators: [Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)] },
    { key: 'displayFlg', label: '表示フラグ', type: 'checkbox' },
    { key: 'detailButton', label: '詳細', type: 'button' },
  ];

  tableData: UserData[] = [
    { id: 1, email: 'user1@example.com', cardNumber: '1111-2222-3333-4444', displayFlg: true },
    { id: 2, email: 'user2@example.com', cardNumber: '5555-6666-7777-8888', displayFlg: true },
    { id: 3, email: 'user3@example.com', cardNumber: '9999-0000-1111-2222', displayFlg: false },
  ];
}
