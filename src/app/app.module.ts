import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';

// Angular Material modules
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';  // For sidenav (side navigation)
import { MatListModule } from '@angular/material/list';        // For list inside sidenav
import { MatIconModule } from '@angular/material/icon';        // For icons in the toolbar
import { MatGridListModule } from '@angular/material/grid-list'; // For grid layouts (if necessary)

@NgModule({
  declarations: [
    AppComponent,
    MainScreenComponent,
    AddPaymentComponent,
    EditPaymentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Angular Material modules
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,      // Add Sidenav module for side navigation
    MatListModule,         // Add List module for list items
    MatIconModule,         // Add Icon module for Material Icons
    MatGridListModule      // Optionally, for grid layouts (if needed)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
