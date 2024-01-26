import { Status } from '../../utils/enums/status.enum';
import { Day } from '../../utils/enums/day.enum';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsBoolean,
  IsString,
  IsArray,
  IsEnum,
} from 'class-validator';

export class TaskDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  displayInfo: string;

  @IsMongoId()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsDateString()
  @IsNotEmpty()
  startHour: Date;

  @IsDateString()
  @IsNotEmpty()
  endHour: Date;

  @IsString()
  @IsOptional()
  status: Status;

  @IsBoolean()
  @IsNotEmpty()
  isPeriodical: boolean;

  @IsArray()
  @IsEnum(Day, { each: true })
  @IsOptional()
  enumPeriodical: Day[];

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
