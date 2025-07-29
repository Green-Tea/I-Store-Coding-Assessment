'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, MapPin, User, Mail, Phone, ArrowLeft } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { formatPrice, formatDate } from '@/utils'
import RoomCard from '@/components/ui/RoomCard'
import roomsData from '@/data/rooms.json'
import { Room } from '@/types/index'
import BookingSection from '@/components/ui/BookingSection'

const BookingConfirmationPage = () => {
  const router = useRouter()
  const { currentBooking } = useBookingStore()
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!currentBooking) {
      router.push('/')
    } else {
      // Simulate loading delay for better UX
      const timer = setTimeout(() => {
        const foundRoom = roomsData.rooms.find(room => room.id === currentBooking.roomId)
        setRoomDetails(foundRoom || null)
        setIsLoading(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [currentBooking, router])

  if (!currentBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>กลับไปแก้ไขข้อมูล</span>
        </button>

        <h1 className="text-xl font-semibold">
          ยืนยันการจอง
        </h1>
      </div>
      <p className="text-gray-600">
        กรุณาตรวจสอบข้อมูลการจองให้ถูกต้องก่อนดำเนินการชำระเงิน
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Information */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded mb-6"></div>
                <div className="flex space-x-4 mb-4">
                  <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : roomDetails ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <RoomCard
                room={roomDetails}
                showButton={false}
              />
              <BookingSection
                title='ข้อมูลการจอง'
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>เช็คอิน: {formatDate(currentBooking.checkIn)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>เช็คเอาท์: {formatDate(currentBooking.checkOut)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>ผู้เข้าพัก: {currentBooking.guests} คน</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>จำนวนคืน: {currentBooking.nights} คืน</span>
                  </div>
                </div>
              </BookingSection>
            </div>


          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                ข้อมูลห้องพัก
              </h2>
              <p className="text-gray-600">ไม่พบข้อมูลห้องพัก</p>
            </div>
          )}

          {/* Guest Information */}
          <BookingSection
            title='ข้อมูลผู้เข้าพัก'>
            <div className='flex'>
              <User />
              <span>
                {currentBooking.guestInfo.firstName} {currentBooking.guestInfo.lastName}
              </span>
            </div>

            <div className='flex'>
              <Mail />
              <span>
                {currentBooking.guestInfo.email}
              </span>
            </div>

            <div className="flex">
              <Phone />
              <span>
                {currentBooking.guestInfo.phone}
              </span>
            </div>
          </BookingSection>


          {/* Booking Terms */}
          <BookingSection
            title='เงื่อนไขการจอง'>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  เช็คอินได้ตั้งแต่เวลา 15:00 น. และเช็คเอาท์ภายในเวลา 12:00 น.
                </p>
                <p>
                  สามารถยกเลิกการจองได้ฟรีก่อนวันเช็คอิน 24 ชั่วโมง
                </p>
                <p>
                  กรุณานำบัตรประชาชนหรือหนังสือเดินทางมาแสดงตอนเช็คอิน
                </p>
                <p>
                  ห้ามสูบบุหรี่ในห้องพัก และห้ามนำสัตว์เลี้ยงเข้าพัก
                </p>
              </div>
            </div>

          </BookingSection>

        </div>

        {/* Payment Summary */}
        <BookingSection title='สรุปการจอง'>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ห้องพัก</span>
                  <span className="font-medium">{currentBooking.roomName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">วันที่เข้าพัก</span>
                  <span className="font-medium">
                    {formatDate(currentBooking.checkIn)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">วันที่ออก</span>
                  <span className="font-medium">
                    {formatDate(currentBooking.checkOut)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">จำนวนคืน</span>
                  <span className="font-medium">{currentBooking.nights} คืน</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ผู้เข้าพัก</span>
                  <span className="font-medium">{currentBooking.guests} คน</span>
                </div>

                <hr />

                <div className="flex justify-between items-center">
                  <span></span>
                  <span className="font-medium">
                    {formatPrice(currentBooking.totalPrice / currentBooking.nights)} x {currentBooking.nights}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">ราคารวมทั้งหมด</span>
                  <span className="font-bold text-primary-600">
                    {formatPrice(currentBooking.totalPrice)}
                  </span>
                </div>
              </div>
              <br />

              <div className="space-y-3">
                <Link
                  href="/booking/payment"
                  className="btn-primary text-center block"
                >
                  ดำเนินการชำระเงิน
                </Link>

              </div>
            </div>
          </div>
        </BookingSection>
      </div>
    </div >
  )
}

export default BookingConfirmationPage