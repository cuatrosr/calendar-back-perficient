import { PartialType } from '@nestjs/swagger';
import { TaskDTO } from './tasks.dto';

export class PatchDTO extends PartialType(TaskDTO) {}
