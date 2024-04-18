import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import {
  Public,
  ResponseMessage,
  User,
} from '@/decorators/customizeDecorators';
import { IUser } from '@/users/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Upload resume successfully!')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Update resume successfully!')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete resume successfully!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }

  @Post('by-user')
  @ResponseMessage('Delete resume successfully!')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.getResumeByUser(user);
  }

  @Get()
  @Public()
  findAll(
    @Query('pageSize') pageSize: string,
    @Query('current') current: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }
}
