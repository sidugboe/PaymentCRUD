import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Payment } from '../payment.model';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  standalone: false,
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
  payments: Payment[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPayments: number = 0;
  paymentStatus: string = 'all';  // Can be 'due_now', 'overdue', or 'completed'
  displayedColumns: string[] = ['payee_first_name', 'payee_last_name', 'total_due', 'payee_payment_status', 'actions'];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getPayments(this.paymentStatus, this.currentPage, this.pageSize).subscribe((response: any) => {
      this.payments = response.payments;
      this.totalPayments = response.totalCount;  // Assuming backend returns total count for pagination
    });
  }

  // Search functionality
  onSearch(status: string): void {
    this.paymentStatus = status;
    this.loadPayments();
  }

  // Pagination functionality
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPayments();
  }

  // Handle file upload when payment status is updated to completed
  // onUploadEvidence(paymentId: string, file: File): void {
  //   if (!file) {
  //     alert('Please upload evidence file.');
  //     return;
  //   }

  //   this.paymentService.uploadEvidence(paymentId, file).subscribe(response => {
  //     console.log('Evidence uploaded successfully', response);
  //   });
  // }

  onUploadEvidence(paymentId: string, file: File | undefined): void {
    if (!file) {
      alert('Please upload evidence file.');
      return;
    }
  
    this.paymentService.uploadEvidence(paymentId, file).subscribe(response => {
      console.log('Evidence uploaded successfully', response);
    });
  }
  
  // Handle payment deletion
  onDelete(paymentId: string): void {
    this.paymentService.deletePayment(paymentId).subscribe(response => {
      console.log('Payment deleted successfully', response);
      this.loadPayments();  // Reload the payment list
    });
  }
}
