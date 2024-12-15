import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../payment.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  standalone: false,
  styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit {
  editPaymentForm: FormGroup;
  paymentId: string = '';
  filteredAddresses: string[] = [];
  filteredCurrencies: string[] = [];
  allAddresses: string[] = ['123 Main St', '456 Elm St', '789 Oak St']; // Example addresses
  allCurrencies: string[] = ['USD', 'EUR', 'GBP']; // Example currencies

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.editPaymentForm = this.fb.group({
      payee_due_date: ['', Validators.required],
      due_amount: [0, [Validators.required, Validators.min(0)]],
      payee_payment_status: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      currency: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPaymentData();

    // Address autocomplete
    this.editPaymentForm.get('payee_address_line_1')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAddresses(value))
    ).subscribe(filteredAddresses => {
      this.filteredAddresses = filteredAddresses;
    });

    // Currency autocomplete
    this.editPaymentForm.get('currency')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCurrencies(value))
    ).subscribe(filteredCurrencies => {
      this.filteredCurrencies = filteredCurrencies;
    });
  }

  loadPaymentData(): void {
    this.paymentService.getPaymentById(this.paymentId).subscribe((payment: any) => {
      if (payment) {
        this.editPaymentForm.patchValue(payment);
      } else {
        alert('Payment not found');
        this.router.navigate(['/main-screen']);
      }
    });
  }

  // Filtering logic for addresses
  private _filterAddresses(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allAddresses.filter(address => address.toLowerCase().includes(filterValue));
  }

  // Filtering logic for currencies
  private _filterCurrencies(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCurrencies.filter(currency => currency.toLowerCase().includes(filterValue));
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
