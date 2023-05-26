import { plainToClass } from 'class-transformer';

export abstract class BaseDto {
  static plainToClass<T>(
    this: new (...args: any[]) => T,
    obj: T,
    files?: any,
    key?: string,
  ): T {
    if (key) {
      obj[key] = files;
    }
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
