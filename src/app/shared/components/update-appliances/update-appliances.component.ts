import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Appliances } from 'src/app/models/appliances.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-appliances',
  templateUrl: './update-appliances.component.html',
  styleUrls: ['./update-appliances.component.scss'],
})
export class UpdateAppliancesComponent  implements OnInit {

  @Input() appliance: Appliances;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user = {} as User;


  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required]),
    precio: new FormControl(null, [Validators.required, Validators.min(0)]),
    garantia: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),  
  })

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.appliance) this.form.setValue(this.appliance)
  }

  setNumberInput() {
    let { precio } = this.form.controls;
    if(precio.value) precio.setValue(parseFloat(precio.value));
  }

  async submit() {
    if(this.form.valid) {
      if(this.appliance) this.updateEmployee();
      else this.createEmployee();
    }   

  }

  async createEmployee() {
    let path = `electrodomesticos`;
    /* let path = `users/${this.user.uid}/electrodomesticos`;`; */

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
          message: `Electrodomestico creado exitósamente`,
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
    let path = `electrodomesticos/${this.appliance.id}`;
    /* let path = `users/${this.user.uid}/electrodomesticos/${this.appliance.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.appliance.img ) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.appliance.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp => {

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Electrodomestico actualizado exitósamente`,
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
    const dataUrl = (await this.utilsService.takePicture('Imagen del electrodomestico')).dataUrl //Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}
