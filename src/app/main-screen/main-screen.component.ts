import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Payment } from '../payment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  standalone: false,
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
  payments: Payment[] = [];
  allPayments: Payment[] = [];  // Declare allPayments to store all fetched payments
  currentPage: number = 1;
  pageSize: number = 10;
  totalPayments: number = 0;
  paymentStatus: string = 'all';  // Can be 'due_now', 'overdue', or 'completed'
  displayedColumns: string[] = ['payee_first_name', 'payee_last_name', 'total_due', 'payee_payment_status', 'actions'];

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  // Load payments with the current filter and pagination
  loadPayments(): void {
    this.paymentService.getPayments(this.paymentStatus).subscribe((response: any) => {
      console.log('API Response:', response);
      this.allPayments = response.payments; // Store all payments
      this.totalPayments = this.allPayments.length; // Total number of payments for pagination
      this.updatePaginatedPayments(); // Update the current page's data
    });
  }

  // Update payments based on pagination
  updatePaginatedPayments(): void {
    // Calculate the start and end index for the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Slice the payments for the current page
    this.payments = this.allPayments.slice(startIndex, endIndex);
  }

  // Search functionality to filter payments by status
  onSearch(status: string): void {
    this.paymentStatus = status;
    this.loadPayments(); // Reload payments based on the new filter
  }

  // Pagination functionality to handle page changes
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPayments(); // Update the displayed payments based on the new page
  }

  // Handle file upload when payment status is updated to completed
  onUploadEvidence(paymentId: string, file: File | undefined): void {
    if (!file) {
      alert('Please upload evidence file.');
      return;
    }

    // Call the service to upload evidence
    this.paymentService.uploadEvidence(paymentId, file).subscribe(response => {
      console.log('Evidence uploaded successfully', response);
      alert('Evidence uploaded successfully!');
    }, error => {
      console.error('Error uploading evidence:', error);
      alert('Failed to upload evidence.');
    });
  }

  // Handle payment deletion
  onDelete(paymentId: string): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePayment(paymentId).subscribe(response => {
        console.log('Payment deleted successfully', response);
        this.loadPayments();  // Reload the payment list after deletion
      }, error => {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment.');
      });
    }
  }
}
