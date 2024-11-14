import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
// import * as sgMail from '@sendgrid/mail';
import { EmailService } from './email.service';
// import * as nodemailer from 'nodemailer';
@Injectable()
export class UserService {
  // private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,private readonly emailService: EmailService
  ) {}
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.fullName = createUserDto.fullName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    // Trigger the email after user registration
    await this.emailService.sendEmail(
      user.email,
      user.fullName,
    );
    return this.userRepository.save(user);
  }
  // private async sendWelcomeEmail(email: string, name: string) {
  //   const msg = {
  //     to: email,
  //     from: 'shoaib.hassan@ovrlod.com',
  //     subject: 'Welcome to Our Zoot',
  //     text: `Hello ${name}, welcome to our Zoot!`,
  //     html: `<strong>Hello ${name}, welcome to our platform!</strong>`,
  //   };
  
  //   try {
  //     await sgMail.send(msg);
  //     console.log('Welcome email sent successfully');
  //   } catch (error) {
  //     console.error('Error sending welcome email:', error.response.body.errors);
  //   }
  // }
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { fullName: username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
