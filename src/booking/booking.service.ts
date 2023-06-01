import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CCreateBookingDto } from './dto/CreateBooking.dto';
import { BookingRepository } from './repository/booking.repository';
import { ObjectId } from 'mongodb';
import { CQuerySearchBookingDto } from './dto/QuerySearchBooking';
import * as moment from 'moment';
import { UpdateBookingDto } from './dto/UpdateBooking';
import { RoomRepository } from 'src/room/repository/room.repository';
import { EStatusBookingRoom, formatNumberMoney } from 'src/common/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomRepository: RoomRepository,
    private readonly mailerService: MailerService,
  ) {}

  async GetListBooking(query: CQuerySearchBookingDto) {
    const {
      page = 1,
      limit = 10,
      checkInDay,
      checkOutDay,
      nightCount,
      Adult,
      children,
      name,
      ...filterSearch
    } = query;
    const countNightCustom = moment(checkOutDay).diff(
      moment(checkInDay),
      'days',
    );

    if (countNightCustom < 0 || Number(nightCount) < 0) {
      throw new HttpException('Số đêm không hợp lệ', HttpStatus.BAD_REQUEST);
    }

    if (Number(Adult) <= 0 && Number(children) <= 0) {
      throw new HttpException(
        'Số lượng người lớn hoặc trẻ em không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const skip = Number(limit) * Number(page) - Number(limit);

    let querySearch = [];

    if (checkInDay) {
      querySearch.push({
        checkInDay: {
          $gte: new Date(checkInDay),
        },
      });
    }

    if (name) {
      querySearch.push({ name: { $regex: '.*' + name + '.*', $options: 'i' } });
    }

    if (checkOutDay) {
      querySearch.push({
        checkOutDay: {
          $lt: new Date(checkOutDay),
        },
      });
    }

    if (nightCount) {
      querySearch.push({
        nightCount,
      });
    }

    if (Adult) {
      querySearch.push({
        'AmountPeople.Adult': Adult,
      });
    }

    if (children) {
      querySearch.push({
        'AmountPeople.children': children,
      });
    }

    if (Object.keys(filterSearch).length > 0) {
      querySearch.push(filterSearch);
    }

    const result = await this.bookingRepository.getByCondition(
      querySearch.length > 0
        ? {
            $and: querySearch,
          }
        : {},
      undefined,
      { skip, limit, sort: { updatedAt: -1 } },
      [
        {
          path: 'room',
          model: 'Room',
          populate: [
            {
              path: 'service',
              model: 'Service',
            },
            {
              path: 'typeRoom',
              model: 'TypeRoom',
            },
          ],
        },
        {
          path: 'service.id',
          model: 'Service',
        },
      ],
    );

    const countRecord = await this.bookingRepository.countDocuments(
      querySearch,
    );

    return {
      data: result,
      page,
      count: Math.ceil(countRecord / limit),
    };
  }

  async createBooking(body: CCreateBookingDto) {
    try {
      const { room, checkInDay, checkOutDay, ...filterData } = body;
      const newCheckInDay = new Date(checkInDay);
      const newCheckOutDay = new Date(checkOutDay);
      const objectID = new ObjectId(room);

      const valid = await this.roomRepository.verifyQuantityRoom(body);
      if (valid.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(valid.message, HttpStatus.BAD_REQUEST);
      }

      if (valid.status === HttpStatus.OK) {
        const res = await this.bookingRepository.create({
          ...filterData,
          room: objectID,
          checkInDay: newCheckInDay,
          checkOutDay: newCheckOutDay,
        });
        await this.roomRepository.handleBooking(body);
        const objectIDDetail = new ObjectId(res._id);
        const resultDetail = await this.bookingRepository.findByCondition(
          { _id: objectIDDetail },
          undefined,
          undefined,
          [
            {
              path: 'room',
              model: 'Room',
              populate: [
                {
                  path: 'service',
                  model: 'Service',
                },
                {
                  path: 'typeRoom',
                  model: 'TypeRoom',
                },
              ],
            },
            {
              path: 'service.id',
              model: 'Service',
            },
          ],
        );
        const listService =
          resultDetail.service.length > 0
            ? resultDetail.service.map((item) => item.id.name)
            : [];
        this.mailerService
          .sendMail({
            to: body.email,
            from: process.env.MAIL_SERVICE_USER,
            subject: `Đặt phòng thành công`,
            html: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <style>
                  li {
                    margin: 15px 0px;
                  }
                </style>
              </head>
              <body>
                <p>Xin chào, <b>${body.name}</b></p>
                <p>Cảm ơn bạn đã đặt phòng tại Hoàng Giang Hotel</p>
                <p>Thông tin đặt phòng</p>
                <ul>
                  <li><b>Họ và tên:</b> <span>${resultDetail.name}</span></li>
                  <li><b>Số điện thoại:</b> <span>${
                    resultDetail.phoneNumber
                  }</span></li>
                  <li><b>Email:</b> <span>${resultDetail.email}</span></li>
                  <li>
                    <b>Ngày nhận phòng:</b>
                    <span
                      >${moment(resultDetail.checkInDay).format(
                        'DD/MM/YYYY HH:mm',
                      )}</span
                    >
                  </li>
                  <li>
                    <b>Ngày trả phòng:</b>
                    <span
                      >${moment(resultDetail.checkOutDay).format(
                        'DD/MM/YYYY HH:mm',
                      )}</span
                    >
                  </li>
                  <li>
                    <b>Dịch vụ:</b>
                    <span>${
                      listService.length > 0 ? listService.join(', ') : ''
                    }</span>
                  </li>
                  <li><b>Phòng:</b> <span>${resultDetail.room.title}</span></li>
                  <li><b>Hạng phòng:</b> <span>${
                    resultDetail.hangPhong
                  }</span></li>
                  <li><b>Số đêm:</b> <span>${
                    resultDetail.nightCount
                  }</span></li>
                  <li><b>Người lớn:</b> <span>${
                    resultDetail.AmountPeople.Adult
                  }</span></li>
                  <li><b>Trẻ em:</b> <span>${
                    resultDetail.AmountPeople.children
                  }</span></li>
                </ul>
                <p><b>Tổng giá:</b> ${formatNumberMoney(
                  resultDetail.prices,
                )} VNĐ/Đêm</p>
              </body>
            </html>
            `,
          })
          .catch((err) => {
            console.log('err', err);
            throw new BadRequestException();
          });
        return {
          status: HttpStatus.OK,
          data: res,
        };
      }
    } catch (error) {
      throw new HttpException('Không thành công', HttpStatus.BAD_REQUEST);
    }
  }

  async updateBooking(body: UpdateBookingDto) {
    const { id, status, ...updateDtoData } = body;
    let queryStatus = {};
    if (
      status === EStatusBookingRoom.DA_TRA_PHONG ||
      status === EStatusBookingRoom.HUY_DAT
    ) {
      await this.roomRepository.handleReRoom(id);
      queryStatus = { status };
    }

    const updateDataResponse = await this.bookingRepository
      .findByIdAndUpdate(id, {
        ...updateDtoData,
        ...queryStatus,
      })
      .then((res) => {
        return {
          status: HttpStatus.OK,
          data: res,
        };
      })
      .catch((error) => {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: error,
        };
      });

    return updateDataResponse;
  }

  async GetDetailBooking(id: string) {
    try {
      const objectID = new ObjectId(id);
      const result = await this.bookingRepository.findByCondition(
        { _id: objectID },
        undefined,
        undefined,
        [
          {
            path: 'room',
            model: 'Room',
            populate: [
              {
                path: 'service',
                model: 'Service',
              },
              {
                path: 'typeRoom',
                model: 'TypeRoom',
              },
            ],
          },
          {
            path: 'service.id',
            model: 'Service',
          },
        ],
      );

      if (result) {
        return {
          status: HttpStatus.OK,
          data: result,
        };
      }

      throw new HttpException('Không tìm thấy đơn', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException('Không tìm thấy đơn', HttpStatus.NOT_FOUND);
    }
  }
}
