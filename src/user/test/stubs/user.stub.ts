const passwordEncrypted =
  '$2b$12$AsDwy3P3rFeJ9B6RNzpT/.OtINMbCfw02Vs5fHTGtItwX5GG/0V62';
const record = {
  firstName: 'test',
  lastName: 'test lastname',
  email: 'test1@gmail.com',
  isActive: true,
  id: 1,
};
export abstract class UserStub {
  static params = {
    createUser: {
      firstName: 'test',
      lastName: 'test lastname',
      email: 'test1@gmail.com',
      password: '123456',
    },
    updateUser: {
      firstName: 'testing',
    },
  };
  static repository = {
    findOne: { ...record, passwordEncrypted },
    findAll: [
      { ...record, passwordEncrypted },
      { ...record, passwordEncrypted, id: 2 },
      { ...record, passwordEncrypted, id: 3 },
    ],
    instance: { ...record },
    delete: {
      raw: [],
      affected: 1,
    },
  };
  static service = {
    findOne: this.repository.findOne,
    findAll: [{ ...record }, { ...record, id: 2 }, { ...record, id: 3 }],
  };
  static port = {
    getInstance: this.repository.instance,
  };
  static controller = {
    findOne: this.service.findOne,
  };
  static payloadChains = {
    id: this.repository.findOne.id,
    email: this.repository.findOne.email,
    sub: this.repository.findOne.id,
  };
  static secretTest = 'test_secret';
}
