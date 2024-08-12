import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PdfService } from 'src/app/services/pdf.service'; 
import { Clients } from 'src/app/models/clients.model';
import { Appliances } from 'src/app/models/appliances.model';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.page.html',
  styleUrls: ['./finances.page.scss'],
})
export class FinancesPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  provider: Providers[] = [];
  client: Clients[] = [];
  appliance: Appliances[] = [];

  constructor(private pdfService: PdfService) { }

  ngOnInit() {
    this.getAppliances(),
    this.getProviders(),
    this.getClients()
  }

  downloadFinancePDF() {
    this.pdfService.downloadPDF('finance-content', 'Finanzas_Proveedores');
  }

  user(): User {
    return this.utilsService.getLocalStorage('user')
  }

  getAppliances() {
    let path = `electrodomesticos`;
    /* let path = `users/${this.user().uid}/electrodomesticos`; */

    this.loading = true

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.appliance = resp;

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }


  getProviders() {
    let path = `proveedores`;
    /* let path = `users/${this.user().uid}/proveedores`; */
    
    this.loading = true

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.provider = resp;
     
          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  getClients() {
    let path = `clientes`;
    /* let path = `users/${this.user().uid}/clientes`; */
    
    this.loading = true

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.client = resp;
     
          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getAppliances(),
      this.getProviders(),
      this.getClients()
      event.target.complete()
    }, 1000)
  }

}
