import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from './payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000'; // Replace with your actual FastAPI server URL

  constructor(private http: HttpClient) {}

  // Get a list of payments with filtering, pagination, and sorting
  getPayments(paymentStatus: string = 'all'): Observable<any> {
    let url = `${this.apiUrl}/get_payments`;
  
    // Append the payment_status filter if it's not 'all'
    if (paymentStatus && paymentStatus !== 'all') {
      url += `?payment_status=${paymentStatus}`;
    }
  
    console.log('Constructed URL:', url);  // This will log the full URL for debugging
    return this.http.get<any>(url);
  }
  
  

  // Get payment by ID
  getPaymentById(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/get_payment/${paymentId}`);
  }

  // Create a new payment
  createPayment(paymentData: Payment): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_payment`, paymentData);
  }

  // Update a payment
  updatePayment(paymentId: string, paymentData: Payment): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_payment/${paymentId}`, paymentData);
  }

  // Delete a payment
  deletePayment(paymentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_payment/${paymentId}`);
  }

  // Upload evidence for a completed payment
  uploadEvidence(paymentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload_evidence/${paymentId}`, formData);
  }

  // Download evidence file
  downloadEvidence(fileId: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/download_evidence/${fileId}`, {
      responseType: 'blob' as 'json'
    });
  }
}
