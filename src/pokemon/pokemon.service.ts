import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { eq } from 'lodash';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAllPageable(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findAll() {
    return await this.pokemonModel.find();
  }

  async findOne(keywords: string) {
    let pokemon: Pokemon;
    // search by numbers
    if (!isNaN(+keywords))
      pokemon = await this.pokemonModel.findOne({ no: keywords });
    // search by _ids
    if (!pokemon && isValidObjectId(keywords))
      pokemon = await this.pokemonModel.findById(keywords);
    // search by name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: keywords.toLowerCase().trim(),
      });

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon not found to this search: '${keywords}'.`,
      );

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();
    return `Pokemon has been deleted successfully`;
  }

  async removeByMongoId(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (eq(deletedCount, 0))
      throw new BadRequestException(`Pokemon id not found, ${id}`);

    return 'Pokemon has been deleted successfully';
  }

  async insertAll(pokemonsArray: CreatePokemonDto[]) {
    await this.pokemonModel.insertMany(pokemonsArray);
    return 'All Pokemons has been added successfully';
  }

  async removeAll() {
    await this.pokemonModel.deleteMany({});
    return 'All Pokemons has been deleted successfully';
  }

  private handleExceptions(error: any) {
    if (eq(error.code, 11000))
      throw new BadRequestException(
        `This id is already exist, ${JSON.stringify(error.keyValue)}`,
      );

    throw new InternalServerErrorException(
      `Error creating pokemon, ${JSON.stringify(error)}`,
    );
  }
}
