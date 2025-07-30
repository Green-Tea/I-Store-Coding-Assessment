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
          <span>Back</span>
        </button>

        <h1 className="text-xl font-semibold">
          Confirm booking
        </h1>
      </div>
      <p className="text-gray-600">
        Please check your booking information before proceeding with payment.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Information */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
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
                title='Booking information'
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Check-in: {formatDate(currentBooking.checkIn)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Check-out: {formatDate(currentBooking.checkOut)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Guests: {currentBooking.guests} guests</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Nights Staying: {currentBooking.nights} nights</span>
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
            title='Guest Information'>
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
            title='Booking conditions'>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Check-in is from 3:00 PM and check-out is until 12:00 PM.
                </p>
                <p>
                  Free cancellation is available up to 24 hours prior to check-in.
                </p>
                <p>
                  Please present your ID card or passport upon check-in.
                </p>
              </div>
            </div>

          </BookingSection>

        </div>

        {/* Payment Summary */}
        <BookingSection title='Booking Summary'>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Room Type</span>
                  <span className="font-medium">{currentBooking.roomName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check-in Date</span>
                  <span className="font-medium">
                    {formatDate(currentBooking.checkIn)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check-out Date</span>
                  <span className="font-medium">
                    {formatDate(currentBooking.checkOut)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Nights</span>
                  <span className="font-medium">{currentBooking.nights} nights</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Guests</span>
                  <span className="font-medium">{currentBooking.guests} guests</span>
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
                  <span className="font-semibold">Total Price</span>
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
                  Proceed with payment
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