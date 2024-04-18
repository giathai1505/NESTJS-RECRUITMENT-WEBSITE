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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  Public,
  ResponseMessage,
  User,
} from '@/decorators/customizeDecorators';
import { IUser } from '@/users/user.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage('Create company successfully!')
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Update company successfully!')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete company successfully!')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch companies successfully!')
  findAll(
    @Query('limit') limit: string,
    @Query('current') current: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+limit, +current, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch company successfully!')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }
}
