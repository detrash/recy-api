import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ email, password, name }: CreateUserDto) {
    const userExists = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const hashPassword = await hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.users.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
