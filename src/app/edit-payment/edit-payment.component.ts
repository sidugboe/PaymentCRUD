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
  evidenceFile: File | null = null;

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
      currency: ['', Validators.required],
      evidence_file: [null] // Evidence file is no longer required for all cases
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

    // Watch for changes in payment status to show/hide evidence field
    this.editPaymentForm.get('payee_payment_status')?.valueChanges.subscribe(status => {
      const evidenceField = this.editPaymentForm.get('evidence_file');
      if (status === 'completed') {
        evidenceField?.setValidators(Validators.required); // Make evidence file required for completed payments
      } else {
        evidenceField?.clearValidators(); // Remove validators for non-completed payments
      }
      evidenceField?.updateValueAndValidity(); // Revalidate field
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.evidenceFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.editPaymentForm.valid) {
      const paymentData = this.editPaymentForm.getRawValue();

      // Prevent updating to completed without evidence
      if (
        paymentData.payee_payment_status === 'completed' &&
        !this.evidenceFile
      ) {
        alert('Evidence file is required to mark the payment as completed.');
        return;
      }

      // Upload evidence if provided
      if (this.evidenceFile) {
        this.paymentService.uploadEvidence(this.paymentId, this.evidenceFile).subscribe({
          next: (response) => {
            // Update payment data with evidence file information if needed
            paymentData.evidence_file_id = response.fileId; // Assuming the response returns a file ID
            this.paymentService.updatePayment(this.paymentId, paymentData).subscribe({
              next: () => {
                alert('Payment updated successfully!');
                this.router.navigate(['/main-screen']);
              },
              error: (err) => {
                alert('Failed to update payment: ' + err.message);
              }
            });
          },
          error: (err) => {
            alert('Failed to upload evidence: ' + err.message);
          }
        });
      } else {
        // Update payment without evidence if not required
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
}
