import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Clients } from 'src/app/models/clients.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateClientsComponent } from 'src/app/shared/components/update-clients/update-clients.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  client: Clients[] = [];

  ngOnInit() {
    // this.getEmployee()
  }

  ionViewWillEnter() {
    this.getEmployee()
  }

  async addUpdateEmployee(client?: Clients) {
    let modal = await this.utilsService.getModal({
      component: UpdateClientsComponent,
      cssClass: 'add-update-modal',
      componentProps: { client }
    })
    
    if(modal) this.getEmployee()
  }

  user(): User {
    return this.utilsService.getLocalStorage('user')
  }

  getEmployee() {
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
      this.getEmployee()
      event.target.complete()
    }, 1000)
  }

  async deleteEmployee(client: Clients) {
    let path = `clientes/${client.id}`;
    /* let path = `users/${this.user().uid}/clientes/${client.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(client.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then( async resp => {

        //Actualizar lista
        this.client = this.client.filter(e => e.id !== client.id);

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Cliente eliminado exitósamente`,
          duration: 1500,
          color: 'primary',
          position: 'bottom',
          icon: 'checkmark-circle-outline'
        })

      }).catch(error => {
        console.log(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })

  }

  async confirmDeleteEmployee( client: Clients) {
    this.utilsService.presentAlert({
      header: 'Eliminar cliente',
      message: '¿Desea eliminar el cliente?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteEmployee(client)
          }
          
        }
      ]
    })
  }

  getBills() {
    // this.utilsService.navigate('bills')
  }

}
