'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft
} from 'lucide-react'
import { Room, BookingFormData } from '@/types'
import { formatPrice, calculateNights, isRoomAvailable } from '@/utils'
import { useBookingStore } from '@/store/bookingStore'
import RoomCard from '@/components/ui/RoomCard'
import BookingSection from '@/components/ui/BookingSection'
import roomsData from '@/data/rooms.json'
import 'react-datepicker/dist/react-datepicker.css'
import { useAuthStore } from '@/store/authStore'

const RoomDetailPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomId = params.id as string

  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const { setBookingData } = useBookingStore()
  const { user } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>()

  useEffect(() => {
    const loadRoom = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      const foundRoom = roomsData.rooms.find(r => r.id === roomId)
      setRoom(foundRoom || null)
      setIsLoading(false)
    }

    loadRoom()

    const initialCheckIn = searchParams.get('checkIn')
    const initialCheckOut = searchParams.get('checkOut')
    const initialGuests = searchParams.get('guests')

    if (initialCheckIn) setCheckIn(new Date(initialCheckIn))
    if (initialCheckOut) setCheckOut(new Date(initialCheckOut))
    if (initialGuests) setGuests(parseInt(initialGuests))
  }, [roomId, searchParams])

  const handleBooking = (formData: BookingFormData) => {
    if (!room || !checkIn || !checkOut) return

    const nights = calculateNights(
      checkIn.toISOString().split('T')[0],
      checkOut.toISOString().split('T')[0]
    )

    const bookingData = {
      roomId: room.id,
      roomName: room.name,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      guests,
      nights,
      totalPrice: room.price * nights,
      guestInfo: formData,
      userId: user?.id || null
    }

    setBookingData(bookingData)
    router.push('/booking/confirmation')
  }

  const canBook = room && checkIn && checkOut &&
    isRoomAvailable(room, checkIn.toISOString().split('T')[0], checkOut.toISOString().split('T')[0])

  const nights = checkIn && checkOut ? calculateNights(
    checkIn.toISOString().split('T')[0],
    checkOut.toISOString().split('T')[0]
  ) : 0

  const totalPrice = room && nights ? room.price * nights : 0

  const isDateUnavailable = (date: Date) => {
    if (!room) return true
    const dateStr = date.toISOString().split('T')[0]
    return !room.availability.includes(dateStr)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h1>
          <p className="text-gray-600 mb-6">The room you&apos;re looking for may not exist or has been removed</p>
          <button
            onClick={() => router.back()}
            className="btn-primary flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="image-gallery-container">
                {room.images.map((image, index) => (
                  <div key={index} className="gallery-image">
                    <Image
                      src={image}
                      alt={`${room.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Details Card */}
            <RoomCard room={room} showButton={false} />
          </div>

          {/* Booking Form */}
          <div>
            <BookingSection title="Book this room">
              <table className="w-1/2">
                <tbody>
                  <tr>
                    <td className="py-2 pr-8">
                      <label className="block text-sm font-medium text-gray-700">
                        Check-in Date
                      </label>
                    </td>
                    <td className="py-2">
                      <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        placeholderText="Select check-in date"
                        className="input-field"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        filterDate={(date) => !isDateUnavailable(date)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 pr-8">
                      <label className="block text-sm font-medium text-gray-700">
                        Check-out Date
                      </label>
                    </td>
                    <td className="py-2">
                      <DatePicker
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date)}
                        placeholderText="Select check-out date"
                        className="input-field"
                        dateFormat="dd/MM/yyyy"
                        minDate={checkIn ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                        filterDate={(date) => !isDateUnavailable(date)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 pr-8">
                      <label className="block text-sm font-medium text-gray-700">
                        Number of Guests
                      </label>
                    </td>
                    <td className="py-2">
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="input-field w-full"
                      >
                        {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Price Summary */}
              {checkIn && checkOut && (
                <div className="p-4 bg-gray-50 rounded-lg mt-4 w-1/2">
                  <br />
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">
                      {formatPrice(room.price)} × {nights} night{nights > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <br />
                  </div>
                </div>
              )}

              {/* Availability Warning */}
              {checkIn && checkOut && !canBook && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4 w-1/2">
                  <p className="text-red-700 text-sm">
                    Room not available for selected dates. Please choose different dates.
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowBookingForm(!showBookingForm)}
                disabled={!canBook}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {canBook ? (showBookingForm ? 'Hide Form' : 'Book Now') : 'Select dates first'}
              </button>
            </BookingSection>

            {/* Guest Information Form */}
            {showBookingForm && (
              <BookingSection title="Guest Information" className="mt-6">
                <form onSubmit={handleSubmit(handleBooking)} className="space-y-4">
                  {/* First Name */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        First Name*
                      </label>
                    </div>
                    <div className="md:col-span-3">
                      <input
                        {...register('firstName', { required: 'Please enter first name' })}
                        className="input-field w-1/2"
                        placeholder="First Name"
                      />
                      {errors.firstName && (
                        <p className="error-text mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                  </div>
                  <br />

                  {/* Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name*
                      </label>
                    </div>
                    <div className="md:col-span-3">
                      <input
                        {...register('lastName', { required: 'Please enter last name' })}
                        className="input-field w-1/2"
                        placeholder="Last Name"
                      />
                      {errors.lastName && (
                        <p className="error-text mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <br />

                  {/* Email */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Email*
                      </label>
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Please enter email',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email format'
                          }
                        })}
                        className="input-field w-1/2"
                        placeholder="Email"
                      />
                      {errors.email && (
                        <p className="error-text mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <br />

                  {/* Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone*
                      </label>
                    </div>
                    <div className="md:col-span-3">
                      <input
                        {...register('phone', {
                          required: 'Please enter phone number',
                          pattern: {
                            value: /^[0-9-+().\s]+$/,
                            message: 'Invalid phone format'
                          }
                        })}
                        className="input-field w-1/2"
                        placeholder="Phone Number"
                      />
                      {errors.phone && (
                        <p className="error-text mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <br />

                  <div className="flex space-x-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </form>
              </BookingSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetailPage