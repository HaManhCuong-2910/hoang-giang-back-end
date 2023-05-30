import { Schema } from 'mongoose';

const roomSchema = new Schema(
  {
    images: {
      type: [String],
      require: true,
      default: [],
    },
    prices: {
      type: Number,
      require: true,
    },
    service: {
      type: [Schema.Types.ObjectId],
      require: true,
      ref: 'Service',
    },
    title: {
      type: String,
      require: true,
    },
    descriptions: {
      type: String,
      require: true,
    },
    typeRoom: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'TypeRoom',
    },
    quantity: {
      type: Number,
      require: true,
    },
    endow: {
      type: String,
    },
    OutstandingService: {
      type: [Schema.Types.ObjectId],
      require: true,
      ref: 'Service',
    },
  },
  {
    timestamps: true,
    collection: 'rooms',
    versionKey: false,
  },
);

export { roomSchema };

export interface Room extends Document {
  images: HTMLCollectionOf<HTMLImageElement>;
  prices: number;
  service: string[];
  OutstandingService: string[];
  title: string;
  descriptions: string;
  typeRoom: string;
  quantity: number;
  endow: string;
}
