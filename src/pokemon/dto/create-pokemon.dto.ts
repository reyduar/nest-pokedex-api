import {
  IsNumber,
  IsString,
  MinLength,
  IsPositive,
  Min,
} from 'class-validator';
export class CreatePokemonDto {
  constructor(name: string, no: number) {
    this.name = name;
    this.no = no;
  }

  @IsNumber()
  @IsPositive()
  @Min(1)
  no: number;
  @IsString()
  @MinLength(2)
  name: string;
}
