import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { IUser } from '@/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private readonly resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const data = await this.resumeModel.create({
      ...createResumeDto,
      email: user.email,
      userId: user._id,
      status: 'PENDING',
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: data?._id,
      createdAt: data?.createdAt,
    };
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid');
    }

    return await this.resumeModel.updateOne(
      {
        _id: id,
      },

      {
        status: updateResumeDto.status,
        $push: {
          history: {
            status: updateResumeDto?.status ?? 'PENDING',
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },

        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.resumeModel.softDelete({ _id: id });
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, population, sort, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let defaultPageSize = pageSize ?? 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultPageSize);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultPageSize)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select(projection as any)
      .populate(population)
      .exec();

    return {
      pagination: {
        current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async getResumeByUser(user: IUser) {
    return await this.resumeModel.find({ userId: user._id });
  }
  async findOne(id: string) {
    return await this.resumeModel.findOne({ _id: id });
  }
}
