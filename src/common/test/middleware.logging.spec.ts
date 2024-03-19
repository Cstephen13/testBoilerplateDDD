import { Logger } from '@nestjs/common';
import { LoggingMiddleware } from '../middlewares/logging.middleware';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new LoggingMiddleware();
    req = { originalUrl: '/test', method: 'GET' };
    res = {
      on: jest.fn(),
      statusCode: 200,
    };
    next = jest.fn();
    Logger.log = jest.fn();
  });

  it('should call next()', () => {
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should log route, method, and status code on finish', () => {
    middleware.use(req, res, next);

    const finishCallback = res.on.mock.calls[0][1];
    finishCallback();

    expect(Logger.log).toHaveBeenCalledWith(
      'requested route: /test | method: GET | status: 200',
      expect.any(String),
    );
  });
});
