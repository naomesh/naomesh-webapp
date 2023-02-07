import { Injectable } from '@angular/core'; 

@Injectable() 
export default class Constants {
    public static readonly WEB_API_ENDPOINT: string = ' http://lrouret-vm.lille.grid5000.fr:3000/';
    public static readonly SEDUCE_API_ENDPOINT: string = ' http://lrouret-vm.lille.grid5000.fr:3001/';
    // public static readonly API_MOCK_ENDPOINT: string = 'https://www.userdomainmock.com/'; 
} 