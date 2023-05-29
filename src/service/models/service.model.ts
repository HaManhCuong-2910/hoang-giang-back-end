import { Schema } from 'mongoose';

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      default: '',
    },
    image: {
      type: String,
      require: true,
      default: '',
    },
    typeService: {
      type: String,
      require: true,
      default: 'ROOM_SERVICE',
    },
    price: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'services',
    versionKey: false,
  },
);

export { serviceSchema };

export interface Service extends Document {
  name: string;
  image: string;
}
