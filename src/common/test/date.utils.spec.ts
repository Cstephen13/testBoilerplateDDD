import { differenceInDays, getMilliseconds } from '../utils/date.util';

describe('differenceInDays', () => {
  it('should return the difference in days between two dates', () => {
    const startDate = new Date('2024-03-10');
    const endDate = new Date('2024-03-15');
    const difference = differenceInDays(startDate, endDate);
    expect(difference).toBe(-5);
  });

  it('should return 0 if the two dates are the same', () => {
    const startDate = new Date('2024-03-10');
    const endDate = new Date('2024-03-10');
    const difference = differenceInDays(startDate, endDate);
    expect(difference).toBe(0);
  });

  it('should return a positive difference if end date is before start date', () => {
    const startDate = new Date('2024-03-15');
    const endDate = new Date('2024-03-10');
    const difference = differenceInDays(startDate, endDate);
    expect(difference).toBe(5);
  });
});

describe('getMilliseconds', () => {
  it('should return the milliseconds from human readable time string', () => {
    const timeString = '1h 30m 10s';
    const milliseconds = getMilliseconds(timeString);
    expect(milliseconds).toBe(5410000); // 1 hour + 30 minutes + 10 seconds
  });

  it('should return 0 if no valid time units are provided', () => {
    const timeString = 'abc def xyz';
    const milliseconds = getMilliseconds(timeString);
    expect(milliseconds).toBe(0);
  });

  it('should handle missing space between number and unit', () => {
    const timeString = '1h30m10s';
    const milliseconds = getMilliseconds(timeString);
    expect(milliseconds).toBe(5410000); // 1 hour + 30 minutes + 10 seconds
  });

  it('should handle singular units', () => {
    const timeString = '1h 1m 1s';
    const milliseconds = getMilliseconds(timeString);
    expect(milliseconds).toBe(3661000); // 1 hour + 1 minute + 1 second
  });
});
