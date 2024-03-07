export abstract class UserStub {
  static params = {
    createUser: {
      firstName: 'test',
      lastName: 'test lastname',
      email: 'test1@gmail.com',
      password: '123456',
    },
  };
  static repository = {
    findOne: {
      firstName: 'test',
      lastName: 'test lastname',
      email: 'test1@gmail.com',
      id: 1,
    },
    instance: {
      firstName: 'test',
      lastName: 'test lastname',
      email: 'test1@gmail.com',
      id: 1,
    },
  };
  static service = {
    findOne: this.repository.findOne,
  };
  static port = {
    getInstance: this.repository.instance,
  };
  static controller = {
    findOne: this.service.findOne,
  };
}
