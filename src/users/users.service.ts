import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { createUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { IUser } from './user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async register(createUserDto: RegisterUserDto) {
    const isEmailExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (isEmailExist) {
      throw new BadRequestException('Email already exist');
    }
    const hashPass = this.getHashPassword(createUserDto.password);

    const data = await this.userModel.create({
      ...createUserDto,
      password: hashPass,
      role: 'USER',
    });

    return {
      _id: data?._id,
      createdAt: data?.createdAt,
    };
  }

  async create(createUserDto: createUserDto, user: IUser) {
    const isEmailExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (isEmailExist) {
      throw new BadRequestException('Email already exist');
    }

    const hashPass = this.getHashPassword(createUserDto.password);

    const data = await this.userModel.create({
      ...createUserDto,
      password: hashPass,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: data._id,
      createdAt: data.createdAt,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid!');
    }
    return await this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate([
        { path: 'role', select: { _id: 1, name: 1, permissions: 1 } },
      ]);
  }

  async findAll(limit: number, current: number, qs: string) {
    const { filter, population, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.limit;

    let offset = (current - 1) * limit;
    let defaultLimit = limit ?? 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select('-password')
      .populate(population)
      .exec();

    return {
      pagination: {
        current,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async remove(id: string, user: IUser): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid!');
    }

    const curentUser = await this.userModel.findOne({ _id: id });
    if (curentUser && curentUser.email === 'admin@gmail.con') {
      throw new BadRequestException('Can not delete admin account!');
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.userModel.softDelete({ _id: id });
  }

  async updateOne(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  updateUserRefreshToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  checkPassword(hash: string, plain: string) {
    return compareSync(hash, plain);
  }

  findOneByEmail(email: string) {
    return this.userModel
      .findOne({ email: email })
      .select('-password')
      .populate([
        { path: 'role', select: { _id: 1, name: 1, permissions: 1 } },
      ]);
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel
      .findOne({ refreshToken })
      .select('-password')
      .populate([
        { path: 'role', select: { _id: 1, name: 1, permissions: 1 } },
      ]);
  };

  clearRefreshToken = async (_id: string) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Id is not valid!');
    }
    return await this.userModel.updateOne({ _id: _id }, { refreshToken: '' });
  };
}
