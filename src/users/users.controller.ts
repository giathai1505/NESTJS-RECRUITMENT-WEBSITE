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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserDto } from './dto/create-user.dto';
import {
  Public,
  ResponseMessage,
  User,
} from '@/decorators/customizeDecorators';
import { IUser } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('limit') limit: string,
    @Query('current') current: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+limit, +current, qs);
  }

  @Post()
  @ResponseMessage('Create user successfully!')
  create(@Body() CreateUserDto: createUserDto, @User() user: IUser) {
    return this.usersService.create(CreateUserDto, user);
  }

  @Get(':id')
  @Public()
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete user successfully!')
  async deleteUser(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.usersService.remove(id, user);
  }

  @Patch()
  @ResponseMessage('Update user successfully!')
  updateUserById(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(updateUserDto);
  }
}
