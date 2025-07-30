'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Download, Home, Calendar, Mail, Phone, User } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { formatPrice, formatDate, generateBookingId } from '@/utils'
import { useAuthStore } from '@/store/authStore'

const ReceiptPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transactionId')

  const { currentBooking, addToHistory, clearCurrentBooking } = useBookingStore()
  const [bookingId, setBookingId] = useState<string>('')
  const [isProcessed, setIsProcessed] = useState(false)
  const { user } = useAuthStore();

  useEffect(() => {
    if (!currentBooking || !transactionId) {
      router.push('/');
      return;
    }

    if (!isProcessed) {
      const newBookingId = generateBookingId();
      setBookingId(newBookingId);

      if (user?.id) {
        const bookingWithUser = {
          ...currentBooking,
          userId: user.id,
          bookingId: newBookingId
        };
        addToHistory(bookingWithUser);
      }

      setIsProcessed(true);
    }
  }, [currentBooking, transactionId, router, isProcessed, user, addToHistory]);

  const handleDownloadReceipt = () => {
    const receiptContent = `
      Booking Receipt
      
      Booking ID: ${bookingId}
      Transaction ID: ${transactionId}
      Booking Date: ${formatDate(new Date().toISOString().split('T')[0])}
      
      Room Details:
      ${currentBooking?.roomName}
      Check-in: ${currentBooking ? formatDate(currentBooking.checkIn) : ''}
      Check-out: ${currentBooking ? formatDate(currentBooking.checkOut) : ''}
      Nights: ${currentBooking?.nights} nights
      Guests: ${currentBooking?.guests} people
      
      Guest Information:
      ${currentBooking?.guestInfo.firstName} ${currentBooking?.guestInfo.lastName}
      ${currentBooking?.guestInfo.email}
      ${currentBooking?.guestInfo.phone}
      
      Total Amount: ${currentBooking ? formatPrice(currentBooking.totalPrice) : ''}
    `

    const element = document.createElement('a')
    const file = new Blob([receiptContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `receipt-${bookingId}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleGoHome = () => {
    clearCurrentBooking();
    router.push('/');
  };

  if (!currentBooking || !transactionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Your booking has been confirmed
          </p>
        </div>

        {/* Receipt Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-primary-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Booking Receipt</h2>
                <p className="text-primary-100">Hotel Booking System</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-100">Issued Date</p>
                <p className="font-semibold">{formatDate(new Date().toISOString().split('T')[0])}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Booking Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                  Booking Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{currentBooking.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{formatDate(currentBooking.checkIn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{formatDate(currentBooking.checkOut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nights:</span>
                    <span className="font-medium">{currentBooking.nights} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{currentBooking.guests} people</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Guest Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{currentBooking.guestInfo.firstName} {currentBooking.guestInfo.lastName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{currentBooking.guestInfo.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{currentBooking.guestInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room ({currentBooking.nights} nights)</span>
                    <span>{formatPrice(currentBooking.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes and fees</span>
                    <span>Included</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Paid</span>
                    <span className="text-primary-600">{formatPrice(currentBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Important Information</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Check-in available from 3:00 PM</p>
                  <p>• Check-out by 12:00 PM</p>
                  <p>• Free cancellation up to 24 hours before check-in</p>
                  <p>• Contact us at 02-123-4567 for any questions</p>
                </div>
              </div>
            </div>

            <br />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleDownloadReceipt}
                className="btn-outline flex items-center justify-center space-x-2 flex-1"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>

              <button
                onClick={handleGoHome}
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Thank you for choosing us!
          </h3>
          <p className="text-gray-600">
            We hope you enjoy your stay. Please don&apos;t hesitate to contact us if you need any assistance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReceiptPage