import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  constructor(private platform: Platform) { }

  openFacebook() {
    const urlScheme = 'fb://profile/100090313556139'; // Reemplaza <your-page-id> con el ID de tu página
    const webUrl = 'https://www.facebook.com/100090313556139'; // URL de fallback
    
    window.open(urlScheme, '_system');
    
    // Fallback si la app no está instalada
    setTimeout(() => {
      window.open(webUrl, '_system');
    }, 1000);
  }

  openWhatsApp() {
    const phoneNumber = '+527661216696'; // Número de teléfono en formato internacional
    const message = 'Hola, me gustaría solicitar un servicio.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  
    window.open(url, '_system');
  
    // Fallback si la app no está instalada
    setTimeout(() => {
      const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(webUrl, '_system');
    }, 1000);
  }
  
  ngOnInit() {
  }

}
