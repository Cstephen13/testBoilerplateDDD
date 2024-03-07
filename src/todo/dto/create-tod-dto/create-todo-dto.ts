import { IsBoolean, IsNotEmpty, Length } from 'class-validator';

export class CreateTodoDto {
  @Length(5, 255)
  @IsNotEmpty()
  public name: string;
  @Length(10, 255)
  @IsNotEmpty()
  public description: string;
  @IsBoolean()
  @IsNotEmpty()
  public isCompleted: boolean = false;
}
