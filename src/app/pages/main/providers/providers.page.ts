import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateProvidersComponent } from 'src/app/shared/components/update-providers/update-providers.component';
  
@Component({
  selector: 'app-providers',
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
})
export class ProvidersPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  provider: Providers[] = [];

  ngOnInit() {
    // this.getEmployee()
  }

  ionViewWillEnter() {
    this.getEmployee()
  }

  async addUpdateEmployee(provider?: Providers) {
    let modal = await this.utilsService.getModal({
      component: UpdateProvidersComponent,
      cssClass: 'add-update-modal',
      componentProps: { provider }
    })
    
    if(modal) this.getEmployee()
  }

  user(): User {
    return this.utilsService.getLocalStorage('user')
  }

  getEmployee() {
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getEmployee()
      event.target.complete()
    }, 1000)
  }

  async deleteEmployee(provider: Providers) {
    let path = `proveedores/${provider.id}`;
    /* let path = `users/${this.user().uid}/proveedores/${provider.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(provider.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then( async resp => {

        //Actualizar lista
        this.provider = this.provider.filter(e => e.id !== provider.id);

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Proveedor eliminado exitósamente`,
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

  async confirmDeleteEmployee( provider: Providers) {
    this.utilsService.presentAlert({
      header: 'Eliminar proveedor',
      message: '¿Desea eliminar el proveedor?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteEmployee(provider)
          }
          
        }
      ]
    })
  }

}
