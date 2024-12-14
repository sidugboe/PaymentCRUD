import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  standalone: false,
  styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit {
  editPaymentForm: FormGroup;
  paymentId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.editPaymentForm = this.fb.group({
      payee_due_date: ['', Validators.required],
      due_amount: [0, [Validators.required, Validators.min(0)]],
      payee_payment_status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPaymentData();
  }

  loadPaymentData(): void {
    // Fetch payment details by ID and populate the form
    this.paymentService.getPayments('', 1, 1).subscribe((response: any) => {
      const payment = response.payments.find((p: any) => p._id === this.paymentId);
      if (payment) {
        this.editPaymentForm.patchValue(payment);
      }
    });
  }

  onSubmit(): void {
    if (this.editPaymentForm.valid) {
      const paymentData = this.editPaymentForm.getRawValue();

      // Prevent updating to completed without evidence
      if (
        paymentData.payee_payment_status === 'completed' &&
        !paymentData.evidence_file_id
      ) {
        alert('Evidence file is required to mark the payment as completed.');
        return;
      }

      this.paymentService.updatePayment(this.paymentId, paymentData).subscribe({
        next: () => {
          alert('Payment updated successfully!');
          this.router.navigate(['/main-screen']);
        },
        error: (err) => {
          alert('Failed to update payment: ' + err.message);
        }
      });
    }
  }
}
