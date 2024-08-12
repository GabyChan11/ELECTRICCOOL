import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Appliances } from 'src/app/models/appliances.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateAppliancesComponent } from 'src/app/shared/components/update-appliances/update-appliances.component';

@Component({
  selector: 'app-appliances',
  templateUrl: './appliances.page.html',
  styleUrls: ['./appliances.page.scss'],
})
export class AppliancesPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  appliance: Appliances[] = [];

  ngOnInit() {
    // this.getEmployee()
  }

  ionViewWillEnter() {
    this.getEmployee()
  }

  async addUpdateEmployee(appliance?: Appliances) {
    let modal = await this.utilsService.getModal({
      component: UpdateAppliancesComponent,
      cssClass: 'add-update-modal',
      componentProps: { appliance }
    })

    if (modal) this.getEmployee()
  }

  user(): User {
    return this.utilsService.getLocalStorage('user')
  }

  getEmployee() {
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getEmployee()
      event.target.complete()
    }, 1000)
  }

  async deleteEmployee(appliance: Appliances) {
    let path = `electrodomesticos/${appliance.id}`;
    /* let path = `users/${this.user().uid}/electrodomesticos/${appliance.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(appliance.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then(async resp => {

        //Actualizar lista
        this.appliance = this.appliance.filter(e => e.id !== appliance.id);

        this.utilsService.dismissModal({ success: true });

        this.utilsService.presentToast({
          message: `Electrodoméstico eliminado exitósamente`,
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

  async confirmDeleteEmployee(appliance: Appliances) {
    this.utilsService.presentAlert({
      header: 'Eliminar electrodoméstico',
      message: '¿Desea eliminar el electrodoméstico?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteEmployee(appliance)
          }

        }
      ]
    })
  }

  getBills() {
    return this.appliance.reduce((index, employee) => index + employee.precio, 0);
  }

}
