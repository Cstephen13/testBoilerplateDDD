export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    isActive: boolean,
    id: number,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isActive = isActive;
    this.id = id;
  }
}
