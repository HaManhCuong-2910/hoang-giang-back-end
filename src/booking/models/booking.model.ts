import { Schema } from 'mongoose';
import { TAmountPeople, TServiceBooking } from '../dto/DefaultType.dto';
import { EStatusBookingRoom, EStatusPaymentOrder } from 'src/common/common';

const bookingSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      require: true,
      default: '',
    },
    email: {
      type: String,
      require: true,
      default: '',
    },
    service: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Service',
        },
        countPeople: {
          type: Number,
        },
      },
    ],
    note: {
      type: String,
    },
    checkInDay: {
      type: Date,
      require: true,
    },
    checkOutDay: {
      type: Date,
      require: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Room',
    },
    nightCount: {
      type: Number,
      require: true,
      default: 0,
    },
    prices: {
      type: Number,
      require: true,
      default: 0,
    },
    AmountPeople: {
      Adult: {
        type: Number,
        require: true,
        default: 0,
      },
      children: {
        type: Number,
        require: true,
        default: 0,
      },
    },
    statusPayment: {
      type: Number,
      require: true,
      default: EStatusPaymentOrder.NO_PAY,
    },
    status: {
      type: String,
      require: true,
      default: EStatusBookingRoom.CHUA_NHAN_PHONG,
    },
    hangPhong: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'bookings',
    versionKey: false,
  },
);

export { bookingSchema };

export interface Booking extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  service: TServiceBooking[];
  checkInDay: string;
  checkOutDay: string;
  room: any;
  nightCount: number;
  AmountPeople: TAmountPeople;
  note: string;
  prices: number;
  statusPayment: EStatusPaymentOrder;
  status: EStatusBookingRoom;
  hangPhong: string;
}
