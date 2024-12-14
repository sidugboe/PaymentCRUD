import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';

const routes: Routes = [
  { path: '', redirectTo: 'main-screen', pathMatch: 'full' },
  { path: 'main-screen', component: MainScreenComponent },
  { path: 'add-payment', component: AddPaymentComponent },
  { path: 'edit-payment/:id', component: EditPaymentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
