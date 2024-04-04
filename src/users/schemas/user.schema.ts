import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  email: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop()
  age: number;

  @Prop()
  phone: number;

  @Prop()
  address: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
