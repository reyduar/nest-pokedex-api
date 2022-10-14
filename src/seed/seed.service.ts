import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  @Inject()
  private readonly pokemonService: PokemonService;
  async executeSeed() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=10';
    const { data } = await this.axios.get<PokeResponse>(url);
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      await this.pokemonService.create(new CreatePokemonDto(name, no));
    });
    return data.results;
  }
}
