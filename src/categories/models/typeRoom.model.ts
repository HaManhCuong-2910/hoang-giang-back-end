import { Schema } from 'mongoose';

const typeRoomSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'type-rooms',
    versionKey: false,
  },
);

export { typeRoomSchema };

export interface TypeRoom extends Document {
  name: string;
  image: string;
}
