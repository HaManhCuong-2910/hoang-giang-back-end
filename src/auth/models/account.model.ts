import { Schema } from 'mongoose';
import { EStatusAccount } from 'src/common/common';

const accountSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      default: '',
    },
    name: {
      type: String,
      require: true,
      default: '',
    },
    email: {
      type: String,
      require: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      require: true,
      default: '',
    },
    password: {
      type: String,
      require: true,
      default: '',
    },
    avatar: {
      type: String,
      require: true,
      default: 'default.jpg',
    },
    roles: {
      type: Array,
      require: true,
      default: [],
    },
    status: {
      type: String,
      require: true,
      default: EStatusAccount.ACTIVE,
    },
    province_id: {
      type: Number,
      require: true,
      default: '',
    },
    district_id: {
      type: Number,
      require: true,
      default: '',
    },
    address: {
      type: String,
      require: true,
      default: '',
    },
    type: {
      type: String,
      require: true,
      default: 'ADMIN',
    },
  },
  {
    timestamps: true,
    collection: 'accounts',
    versionKey: false,
  },
);

export { accountSchema };

export interface Account extends Document {
  username: string;
  name: string;
  email: string;
  status: EStatusAccount;
  phoneNumber: string;
  password: string;
  avatar: string;
  province_id: number;
  district_id: number;
  address: string;
  roles: string[];
  type: string;
}
