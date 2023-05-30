import { Schema } from 'mongoose';
import { ETypeService } from 'src/common/common';

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
    description: {
      type: String,
      default: '',
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
  typeService: ETypeService;
  price: number;
  description: string;
}
