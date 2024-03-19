import { IsDeletedDto } from '../dtos/IsDeletedDto';

describe('IsDeletedDto', () => {
  it('should create an instance with the provided isDeleted value', () => {
    const isDeletedValue = true;
    const isDeletedDto = new IsDeletedDto(isDeletedValue);
    expect(isDeletedDto).toBeDefined();
    expect(isDeletedDto.isDeleted).toEqual(isDeletedValue);
  });

  it('should default isDeleted to false if not provided', () => {
    const isDeletedDto = new IsDeletedDto(false);
    expect(isDeletedDto).toBeDefined();
    expect(isDeletedDto.isDeleted).toEqual(false);
  });
});
