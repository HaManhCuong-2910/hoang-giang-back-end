import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsOptional(validationOptions?: ValidationOptions) {
  return ValidateIf((obj, value) => {
    return value !== null && value !== undefined && value !== '';
  }, validationOptions);
}

export const roles = {
  fullOptionRoles: 'full-roles',

  createPost: 'create-post',
  updatePost: 'update-post',
  deletePost: 'delete-post',

  getListAccount: 'get-list-account',
  createAccount: 'create-account',
  updateAccount: 'update-account',
  deleteAccount: 'delete-account',

  createCategory: 'create-category',
  deleteCategory: 'delete-category',

  createNews: 'create-news',
  updateNews: 'update-news',
  deleteNews: 'delete-news',
};

export enum EStatusAccount {
  ACTIVE = 'ACTIVE',
  LOCK = 'LOCK',
}

export enum EStatusOrder {
  PICKUP_PRODUCT = 0,
  DELIVERY = 1,
  RECEIVED = 2,
  CANCEL = 3,
}

export enum EStatusPaymentOrder {
  PAYED = 1,
  NO_PAY = 0,
}

export const formatNumberMoney = (value: number | string) => {
  let valueNumber = value;
  if (typeof value !== 'string') {
    valueNumber = Number(value);
  }
  const formatter = new Intl.NumberFormat('vi-VN');
  return formatter.format(valueNumber as number).split(',')[0];
};

export const filterAccount = (user: any) => {
  return {
    id: `${user._id || user.id}`,
    status: user.status,
    roles: user.roles,
  };
};

export const randomNumberCustomLength = (length: number) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  );
};

export const saltOrRounds = 10;
