import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Products } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateProductsComponent } from 'src/app/shared/components/update-products/update-products.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  
  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  product: Products[] = [];

  ngOnInit() {
    this.getProducts()
  }

  ionViewWillEnter() {
    this.getProducts()
  }

  async addUpdateProducts(products?: Products) {
    let modal = await this.utilsService.getModal({
      component: UpdateProductsComponent,
      cssClass: 'add-update-modal',
      componentProps: { products }
    })
    
    if(modal) this.getProducts()
  }

  user(): User {
    return this.utilsService.getLocalStorage('user')
  }

  getProducts() {
    let path = `productos`;
    /* let path = `users/${this.user().uid}/productos`; */

    this.loading = true

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.product = resp;

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

  async deleteEmployee(product: Products) {
    let path = `productos/${product.id}`;
    /* let path = `users/${this.user().uid}/electrodomesticos/${product.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(product.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then(async resp => {

        //Actualizar lista
        this.product = this.product.filter(e => e.id !== product.id);

        this.utilsService.dismissModal({ success: true });

        this.utilsService.presentToast({
          message: `Producto eliminado exitósamente`,
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

  async confirmDeleteEmployee(product: Products) {
    this.utilsService.presentAlert({
      header: 'Eliminar producto',
      message: '¿Desea eliminar el producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteEmployee(product)
          }

        }
      ]
    })
  }

  getBills() {
    return this.product.reduce((index, employee) => index + employee.precio, 0);
  }

}