import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    ConfigModule,
  ],
})
export class CompaniesModule {}
