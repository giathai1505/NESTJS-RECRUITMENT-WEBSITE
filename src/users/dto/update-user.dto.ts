export class UpdateUserDto {
  _id: string;

  name: string;

  email: string;

  age: number;

  gender: string;

  address: string;

  role: string;

  company: {
    _id: string;
    name: string;
  };
}
