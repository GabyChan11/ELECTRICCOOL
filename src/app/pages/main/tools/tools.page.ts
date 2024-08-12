import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Tools } from 'src/app/models/tools.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateToolsComponent } from 'src/app/shared/components/update-tools/update-tools.component';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.page.html',
  styleUrls: ['./tools.page.scss'],
})
export class ToolsPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  tool: Tools[] = [];

  ngOnInit() {
    // this.getEmployee()
  }

  ionViewWillEnter() {
    this.getProducts()
  }

  async addUpdateProducts(tool?: Tools) {
    let modal = await this.utilsService.getModal({
      component: UpdateToolsComponent,
      cssClass: 'add-update-modal',
      componentProps: { tool }
    })
    
    if(modal) this.getProducts()
  }

  user(): User {
    return this.utilsService.getLocalStorage('user')
  }

  getProducts() {
    let path = `herramientas`;
    /* let path = `users/${this.user().uid}/herramientas`; */
    
    this.loading = true

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.tool = resp;
     
          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getProducts()
      event.target.complete()
    }, 1000)
  }

  async deleteProducts(tool: Tools) {
    let path = `herramientas/${tool.id}`;
    /* let path = `users/${this.user().uid}/herramientas/${tool.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(tool.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then( async resp => {

        //Actualizar lista
        this.tool = this.tool.filter(e => e.id !== tool.id);

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Herramienta eliminada exitósamente`,
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

  async confirmDeleteProducts( tool: Tools) {
    this.utilsService.presentAlert({
      header: 'Eliminar Herramienta',
      message: '¿Desea eliminar la herramienta?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProducts(tool)
          }
          
        }
      ]
    })
  }

 
}
