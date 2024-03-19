import { Inject, Injectable } from '@nestjs/common';
import { UserPort } from '../../infrastructure/ports/user.port';

export interface IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
  password?: string;
  passwordEncrypted?: string;
}
@Injectable()
export class UserDomain implements IUser {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _isActive: boolean;
  private _password: string;
  private _passwordEncrypted: string;
  @Inject() private readonly userPort: UserPort;

  async new(user: IUser) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.isActive = user.isActive;
    this.password = user.password;
    this.passwordEncrypted = user.passwordEncrypted;
    const userNew = await this.userPort.saveUser({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      isActive: this.isActive,
      password: this.password,
      passwordEncrypted: this.passwordEncrypted,
    });
    this.id = userNew.id;
    return this;
  }

  async update(user: IUser) {
    return await this.userPort.saveUser({ ...user });
  }

  async delete(id: number) {
    return await this.userPort.deleteUser(id);
  }

  async getInstance(where: any) {
    const user = await this.userPort.getUserBy(where);
    if (user) {
      this.id = user.id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.isActive = user.isActive;
      this.passwordEncrypted = user.passwordEncrypted;
      return this;
    }
    return;
  }

  getUsers(): Promise<IUser[]> {
    return this.userPort.getUsers();
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }
  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get passwordEncrypted(): string {
    return this._passwordEncrypted;
  }

  set passwordEncrypted(value: string) {
    this._passwordEncrypted = value;
  }
}
