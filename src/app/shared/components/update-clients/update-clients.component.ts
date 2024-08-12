import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Clients } from 'src/app/models/clients.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-clients',
  templateUrl: './update-clients.component.html',
  styleUrls: ['./update-clients.component.scss'],
})
export class UpdateClientsComponent  implements OnInit {

  @Input() client: Clients;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user = {} as User;


  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
  })

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.client) this.form.setValue(this.client)
  }

  async submit() {
    if(this.form.valid) {
      if(this.client) this.updateEmployee();
      else this.createEmployee();
    }   

  }

  async createEmployee() {
    let path = `clientes`;
    /* let path = `users/${this.user.uid}/clientes`; */

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
          message: `Cliente creado exitósamente`,
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
    let path = `clientes/${this.client.id}`;
    /* let path = `users/${this.user.uid}/clientes/${this.client.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.client.img ) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.client.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp => {

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Cliente actualizado exitósamente`,
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
    const dataUrl = (await this.utilsService.takePicture('Imagen del cliente')).dataUrl //Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}
