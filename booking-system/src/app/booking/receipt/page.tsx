'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Home, Calendar, Users, Mail, Phone, User } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { formatPrice, formatDate, generateBookingId } from '@/utils'

const ReceiptPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transactionId')
  
  const { currentBooking, addToHistory, clearCurrentBooking } = useBookingStore()
  const [bookingId, setBookingId] = useState<string>('')
  const [isProcessed, setIsProcessed] = useState(false)

  useEffect(() => {
    if (!currentBooking || !transactionId) {
      router.push('/')
      return
    }

    if (!isProcessed) {
      const newBookingId = generateBookingId()
      setBookingId(newBookingId)
      
      // Add to booking history
      addToHistory(currentBooking)
      setIsProcessed(true)
    }
  }, [currentBooking, transactionId, router, addToHistory, isProcessed])

  const handleDownloadReceipt = () => {
    // In a real application, this would generate and download a PDF receipt
    const receiptContent = `
      ใบเสร็จการจองที่พัก
      
      หมายเลขการจอง: ${bookingId}
      Transaction ID: ${transactionId}
      วันที่จอง: ${formatDate(new Date().toISOString().split('T')[0])}
      
      ข้อมูลห้องพัก:
      ${currentBooking?.roomName}
      เช็คอิน: ${currentBooking ? formatDate(currentBooking.checkIn) : ''}
      เช็คเอาท์: ${currentBooking ? formatDate(currentBooking.checkOut) : ''}
      จำนวนคืน: ${currentBooking?.nights} คืน
      ผู้เข้าพัก: ${currentBooking?.guests} คน
      
      ข้อมูลผู้จอง:
      ${currentBooking?.guestInfo.firstName} ${currentBooking?.guestInfo.lastName}
      ${currentBooking?.guestInfo.email}
      ${currentBooking?.guestInfo.phone}
      
      ยอดรวม: ${currentBooking ? formatPrice(currentBooking.totalPrice) : ''}
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
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
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ชำระเงินสำเร็จ!
          </h1>
          <p className="text-gray-600 text-lg">
            การจองของคุณได้รับการยืนยันแล้ว
          </p>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-primary-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">ใบเสร็จการจอง</h2>
                <p className="text-primary-100">Hotel Booking System</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-100">วันที่ออกใบเสร็จ</p>
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
                  ข้อมูลการจอง
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">หมายเลขการจอง:</span>
                    <span className="font-medium">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ห้องพัก:</span>
                    <span className="font-medium">{currentBooking.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">เช็คอิน:</span>
                    <span className="font-medium">{formatDate(currentBooking.checkIn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">เช็คเอาท์:</span>
                    <span className="font-medium">{formatDate(currentBooking.checkOut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">จำนวนคืน:</span>
                    <span className="font-medium">{currentBooking.nights} คืน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ผู้เข้าพัก:</span>
                    <span className="font-medium">{currentBooking.guests} คน</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  ข้อมูลผู้จอง
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
              <h3 className="text-lg font-semibold mb-4">สรุปการชำระเงิน</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ค่าที่พัก ({currentBooking.nights} คืน)</span>
                    <span>{formatPrice(currentBooking.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ภาษีและค่าธรรมเนียม</span>
                    <span>รวมแล้ว</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>ยอดรวมที่ชำระ</span>
                    <span className="text-primary-600">{formatPrice(currentBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">ข้อมูลสำคัญ</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• เช็คอินได้ตั้งแต่เวลา 15:00 น. และเช็คเอาท์ภายในเวลา 12:00 น.</p>
                  <p>• กรุณานำบัตรประชาชนหรือหนังสือเดินทางมาแสดงตอนเช็คอิน</p>
                  <p>• สามารถยกเลิกการจองได้ฟรีก่อนวันเช็คอิน 24 ชั่วโมง</p>
                  <p>• หากมีคำถามเพิ่มเติม กรุณาติดต่อ 02-123-4567</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                onClick={handleDownloadReceipt}
                className="btn-outline flex items-center justify-center space-x-2 flex-1"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดใบเสร็จ</span>
              </button>
              
              <button
                onClick={handleGoHome}
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                <Home className="w-4 h-4" />
                <span>กลับหน้าหลัก</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ขอบคุณที่เลือกใช้บริการของเรา
          </h3>
          <p className="text-gray-600">
            เราหวังว่าคุณจะมีประสบการณ์การพักผ่อนที่ดีกับเรา 
            หากมีข้อสงสัยหรือต้องการความช่วยเหลือ กรุณาติดต่อเราได้ตลอดเวลา
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReceiptPage