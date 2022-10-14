import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  async executeSeed() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=10';
    const { data } = await this.axios.get<PokeResponse>(url);
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      console.log('====================================');
      console.log(name, no);
      console.log('====================================');
    });

    return data.results;
  }
}
