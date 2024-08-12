import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  currentPath: string = '';

  pages = [
    {
      title: 'Perfil',
      url: '/main/profile',
      icon: 'person'
    },
    {
      title: 'Electrodomésticos',
      url: '/main/appliances',
      icon: 'tv'
    },
    {
      title: 'Productos',
      url: '/main/products',
      icon: 'cube'
    },
    {
      title: 'Proveedores',
      url: '/main/providers',
      icon: 'business'
    },
  ];

  admin = [
    {
      title: 'Empleados',
      url: '/main/employees',
      icon: 'person-add'
    },
    {
      title: 'Finanzas',
      url: '/main/finances',
      icon: 'cash'
    },
    {
      title: 'Clientes',
      url: '/main/clients',
      icon: 'people'
    },
    {
      title: 'Herramientas',
      url: '/main/tools',
      icon: 'construct'
    },
  ]

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url
    })

  }

  signOut() {
    this.firebaseService.signOut();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }
}
