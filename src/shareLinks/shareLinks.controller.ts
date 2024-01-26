import { JwtAuthGuard } from '../utils/guards/jwt/jwtAuth.guard';
import { ShareLinksService } from './shareLinks.service';
import { ShareLinkDTO } from './dto/shareLink.dto';
import {
  Controller,
  UseGuards,
  HttpCode,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDecorator } from 'src/utils/decorators/user.decorator';
import { UserType } from 'src/utils/interfaces/user.interface';

@ApiTags('ShareLinks')
@Controller('shareLinks')
export class ShareLinksController {
  constructor(private shareLinksService: ShareLinksService) {}

  @Post('task/:taskId')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Store Share Link',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @UserDecorator() user: UserType,
    @Param('taskId') taskId: string,
    @Body() shareLink: ShareLinkDTO,
  ) {
    return this.shareLinksService.create(user, taskId, shareLink);
  }
}
