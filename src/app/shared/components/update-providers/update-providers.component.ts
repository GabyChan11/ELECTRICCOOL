import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-providers',
  templateUrl: './update-providers.component.html',
  styleUrls: ['./update-providers.component.scss'],
})
export class UpdateProvidersComponent  implements OnInit {

  @Input() provider: Providers;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required])    
  })

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.provider) this.form.setValue(this.provider)
  }

  async submit() {
    if(this.form.valid) {
      if(this.provider) this.updateEmployee();
      else this.createEmployee();
    }   

  }

  async createEmployee() {
    let path = `proveedores`;
    /* let path = `users/${this.user.uid}/proveedores`; */

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
          message: `Proveedor creado exitósamente`,
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
    let path = `proveedores/${this.provider.id}`;
    /* let path = `users/${this.user.uid}/proveedores/${this.provider.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.provider.img ) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.provider.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp => {

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Proveedor actualizado exitósamente`,
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
    const dataUrl = (await this.utilsService.takePicture('Imagen del proveedor')).dataUrl //Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}

