'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Download, Home, Calendar, Users, CreditCard, Phone, Mail } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { formatPrice, formatDate } from '@/utils'

const ReceiptPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentBooking, clearCurrentBooking } = useBookingStore()
  const [transactionId, setTransactionId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('transactionId')
    setTransactionId(id)

    if (!currentBooking || !id) {
      router.push('/')
    }
  }, [currentBooking, router, searchParams])

  const bookingId = `BK${Date.now()}`

  const handleDownloadReceipt = () => {
    const receiptContent = `
      HOTEL BOOKING RECEIPT
      ====================
      
      Transaction ID: ${transactionId}
      Booking ID: ${bookingId}
      Date: ${new Date().toLocaleDateString()}
      
      Room: ${currentBooking?.roomName}
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
    clearCurrentBooking()
    router.push('/')
  }

  if (!currentBooking || !transactionId) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading booking information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Success Header */}
        <div className="text-center mb-5">
          <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
            <CheckCircle size={48} className="text-success" />
          </div>
          <h1 className="display-5 fw-bold mb-2">Payment Successful!</h1>
          <p className="lead text-muted">
            Your booking has been confirmed. We&apos;ve sent a confirmation email to {currentBooking.guestInfo.email}
          </p>
        </div>

        {/* Receipt Card */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Booking Receipt</h5>
              </div>
              <div className="card-body">
                {/* Transaction Details */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <small className="text-muted">Transaction ID</small>
                    <p className="fw-semibold mb-0">{transactionId}</p>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted">Booking ID</small>
                    <p className="fw-semibold mb-0">{bookingId}</p>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Room Details */}
                <h6 className="fw-semibold mb-3">Room Details</h6>
                <div className="bg-light rounded p-3 mb-4">
                  <h5 className="mb-3">{currentBooking.roomName}</h5>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={18} className="text-primary" />
                        <div>
                          <small className="text-muted d-block">Check-in</small>
                          <span>{formatDate(currentBooking.checkIn)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={18} className="text-primary" />
                        <div>
                          <small className="text-muted d-block">Check-out</small>
                          <span>{formatDate(currentBooking.checkOut)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <Users size={18} className="text-primary" />
                        <span>{currentBooking.guests} Guests</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center gap-2">
                        <CreditCard size={18} className="text-primary" />
                        <span className="fw-bold text-primary">{formatPrice(currentBooking.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Information */}
                <h6 className="fw-semibold mb-3">Guest Information</h6>
                <div className="bg-light rounded p-3 mb-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>{currentBooking.guestInfo.firstName} {currentBooking.guestInfo.lastName}</strong>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2">
                        <Phone size={16} className="text-muted" />
                        <span>{currentBooking.guestInfo.phone}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2">
                        <Mail size={16} className="text-muted" />
                        <span>{currentBooking.guestInfo.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <h6 className="fw-semibold mb-3">Important Information</h6>
                <div className="alert alert-info mb-0">
                  <ul className="mb-0 ps-3">
                    <li>Check-in available from 3:00 PM</li>
                    <li>Check-out by 12:00 PM</li>
                    <li>Free cancellation up to 24 hours before check-in</li>
                    <li>Contact us at 02-123-4567 for any questions</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card-footer bg-white">
                <div className="row g-2">
                  <div className="col-sm-6">
                    <button
                      onClick={handleDownloadReceipt}
                      className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <Download size={18} />
                      <span>Download Receipt</span>
                    </button>
                  </div>
                  <div className="col-sm-6">
                    <button
                      onClick={handleGoHome}
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <Home size={18} />
                      <span>Return Home</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-4">
              <h3 className="h4 mb-2">Thank you for choosing us!</h3>
              <p className="text-muted mb-0">
                We hope you enjoy your stay. Please don&apos;t hesitate to contact us if you need any assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceiptPage