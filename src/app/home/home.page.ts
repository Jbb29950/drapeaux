import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  searchTerm: string = '';
  countries: any;
  filteredCountries: any;
  alphabet: string[] = []; // Liste des lettres de l'alphabet

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCountries();
    this.generateAlphabet(); 
  }

  async getCountries() {
    const url = 'https://rest-countries10.p.rapidapi.com/countries';
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': '9c610fb80cmsh60e198d41e23213p1bd3dcjsn3a3862204473',
      'X-RapidAPI-Host': 'rest-countries10.p.rapidapi.com'
    });

    try {
      this.countries = await this.http.get(url, { headers }).toPromise();
      this.filteredCountries = this.countries; 
    } catch (error) {
      console.error(error);
    }
  }

  // Générer l'alphabet
  generateAlphabet() {
    for (let i = 65; i <= 90; i++) {
      this.alphabet.push(String.fromCharCode(i));
    }
  }

  // Filtrer les pays par lettre
  filterByLetter(letter: string) {
    this.filteredCountries = this.countries.filter((country: { name: { shortname: string; }; }) =>
      country.name.shortname.toLowerCase().startsWith(letter.toLowerCase())
    );
  }

  // Réinitialiser le filtre et afficher tous les pays
  resetFilter() {
    this.filteredCountries = this.countries;
  }
}
