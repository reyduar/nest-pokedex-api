import { Inject, Injectable } from '@nestjs/common';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  @Inject()
  private readonly pokemonService: PokemonService;

  constructor(private readonly http: AxiosAdapter) {}
  async executeSeed() {
    await this.pokemonService.removeAll();
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=600';
    const pokemonToInsert: CreatePokemonDto[] = [];
    const data = await this.http.get<PokeResponse>(url);
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonToInsert.push(new CreatePokemonDto(name, no));
    });

    return await this.pokemonService.insertAll(pokemonToInsert);
  }

  /**
   * Inserta datos con Promise All
   */
  async executeSeedWithPromise() {
    await this.pokemonService.removeAll();
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=10';
    const insertPromiseArray = [];
    const data = await this.http.get<PokeResponse>(url);
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      insertPromiseArray.push(
        this.pokemonService.create(new CreatePokemonDto(name, no)),
      );
    });

    return await Promise.all(insertPromiseArray);
  }

  /**
   * Inserta datos con async await
   */
  async executeSeedWithoutPromise() {
    await this.pokemonService.removeAll();
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=10';
    const data = await this.http.get<PokeResponse>(url);
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      await this.pokemonService.create(new CreatePokemonDto(name, no));
    });
    return data.results;
  }
}
