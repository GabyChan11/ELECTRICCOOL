import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Products } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-products',
  templateUrl: './update-products.component.html',
  styleUrls: ['./update-products.component.scss'],
})
export class UpdateProductsComponent  implements OnInit {

  @Input() products: Products;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user = {} as User;


  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required]),
    precio: new FormControl(null, [Validators.required]),
    cantidad: new FormControl(null, [Validators.required]),
  })

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.products) this.form.setValue(this.products)
  }

  setNumberInput() {
    let { precio } = this.form.controls;
    if(precio.value) precio.setValue(parseFloat(precio.value));
  }

  async submit() {
    if(this.form.valid) {
      if(this.products) this.updateEmployee();
      else this.createEmployee();
    }   

  }

  async createEmployee() {
    let path = `productos`;
    /* let path = `users/${this.user.uid}/empleados`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    let dataUrl = this.form.value.img;
    let imgPath = `${this.user.uid}/${Date.now()}`;    
    let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

    this.form.controls.img.setValue(imgUrl);

    delete this.form.value.id;

    this.firebaseService.addDocument(path, this.form.value)
      .then( async resp => {

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Producto creado exitósamente`,
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

  async updateEmployee() {
    let path = `productos/${this.products.id}`;
    /* let path = `users/${this.user.uid}/empleados/${this.products.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.products.img ) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.products.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp => {

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Producto actualizado exitósamente`,
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

  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Imagen del producto')).dataUrl //Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}
