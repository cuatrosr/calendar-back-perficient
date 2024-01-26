import { IsNotEmpty, IsString } from 'class-validator';

export class ShareLinkDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}
