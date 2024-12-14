import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  standalone: false,
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent {
  addPaymentForm: FormGroup;

  constructor(private fb: FormBuilder, private paymentService: PaymentService) {
    this.addPaymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_email: ['', [Validators.required, Validators.email]],
      payee_phone_number: ['', [Validators.required, Validators.pattern(/^\+\d{1,15}$/)]],
      payee_address_line_1: ['', Validators.required],
      payee_city: ['', Validators.required],
      payee_country: ['', Validators.required],
      payee_postal_code: ['', Validators.required],
      currency: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      due_amount: [0, [Validators.required, Validators.min(0)]],
      payee_due_date: ['', Validators.required],
      payee_payment_status: [{ value: 'pending', disabled: true }, Validators.required],
      discount_percent: [0, [Validators.min(0), Validators.max(100)]],
      tax_percent: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.addPaymentForm.valid) {
      const paymentData = this.addPaymentForm.getRawValue(); // Get all form values
      this.paymentService.createPayment(paymentData).subscribe({
        next: () => {
          alert('Payment added successfully!');
          this.addPaymentForm.reset();
        },
        error: (err) => {
          alert('Failed to add payment: ' + err.message);
        }
      });
    }
  }
}
