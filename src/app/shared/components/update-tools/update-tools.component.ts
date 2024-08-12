import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tools } from 'src/app/models/tools.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-tools',
  templateUrl: './update-tools.component.html',
  styleUrls: ['./update-tools.component.scss'],
})
export class UpdateToolsComponent  implements OnInit {

  @Input() tool: Tools;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user = {} as User;


  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    estado: new FormControl(null, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required])    
  })

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.tool) this.form.setValue(this.tool)
  }

  async submit() {
    if(this.form.valid) {
      if(this.tool) this.updateEmployee();
      else this.createEmployee();
    }   

  }

  async createEmployee() {
    let path = `herramientas`;
    /* let path = `users/${this.user.uid}/herramientas`; */

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
          message: `Herramienta creada exitósamente`,
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
    let path = `herramientas/${this.tool.id}`;
    /* let path = `users/${this.user.uid}/herramientas/${this.tool.id}`; */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.tool.img ) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.tool.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp => {

        this.utilsService.dismissModal({ success: true });
        
        this.utilsService.presentToast({
          message: `Herramienta actualizada exitósamente`,
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
    const dataUrl = (await this.utilsService.takePicture('Imagen de la herramienta')).dataUrl //Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}

