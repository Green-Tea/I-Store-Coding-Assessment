'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, CreditCard, Mail, Phone, Clock, Users, Home, User, LogOut, Settings, Award, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBookingStore } from '@/store/bookingStore'
import { formatPrice, formatDate } from '@/utils'

const ProfilePage = () => {
    const router = useRouter()
    const { user, isAuthenticated, logout } = useAuthStore()
    const { bookingHistory } = useBookingStore()

    const userBookings = bookingHistory.filter(booking =>
        booking.userId && booking.userId === user?.id
    )

    const totalNights = userBookings.reduce((total, booking) => total + booking.nights, 0)
    const totalSpent = userBookings.reduce((total, booking) => total + booking.totalPrice, 0)
    const averageStayLength = userBookings.length > 0 ? Math.round(totalNights / userBookings.length) : 0

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated || !user) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-vh-100 bg-light py-4">
            <div className="container">
                {/* Profile Header Card */}
                <div className="card mb-4 overflow-hidden">
                    <div className="bg-gradient p-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                        <div className="row align-items-start">
                            <div className="col-auto">
                                <div className="bg-white bg-opacity-25 rounded-circle p-3 d-inline-flex">
                                    <User size={48} className="text-dark" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex flex-column" style={{ paddingTop: '0.5rem' }}>
                                    <h1 className="h2 mb-2 text-dark">{user.firstName} {user.lastName}</h1>

                                    {/* Contact Information - aligned with user icon */}
                                    <div className="row g-3 mt-1">
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                                                    <Mail size={20} className="text-primary" />
                                                </div>
                                                <div className="text-dark">
                                                    <small className="text-muted d-block">Email</small>
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                                                    <Phone size={20} className="text-primary" />
                                                </div>
                                                <div className="text-dark">
                                                    <small className="text-muted d-block">Phone</small>
                                                    <span>{user.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {userBookings.length > 0 && (
                    <div className="row g-3 mb-4">
                        <div className="col-md-3 col-6">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <Calendar size={24} className="text-primary" />
                                    </div>
                                    <h3 className="h4 mb-1">{userBookings.length}</h3>
                                    <p className="text-muted small mb-0">Total Bookings</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-6">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <Clock size={24} className="text-success" />
                                    </div>
                                    <h3 className="h4 mb-1">{totalNights}</h3>
                                    <p className="text-muted small mb-0">Total Nights</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-6">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <TrendingUp size={24} className="text-warning" />
                                    </div>
                                    <h3 className="h4 mb-1">{averageStayLength}</h3>
                                    <p className="text-muted small mb-0">Avg. Stay (nights)</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-6">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <CreditCard size={24} className="text-danger" />
                                    </div>
                                    <h3 className="h5 mb-1">{formatPrice(totalSpent)}</h3>
                                    <p className="text-muted small mb-0">Total Spent</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking History Section */}
                <div className="card">
                    <div className="card-header bg-white">
                        <div className="d-flex align-items-center justify-content-between">
                            <h2 className="h4 mb-0 d-flex align-items-center gap-2">
                                <Calendar size={24} className="text-primary" />
                                Booking History
                            </h2>
                            {userBookings.length > 0 && (
                                <span className="badge bg-primary">{userBookings.length}</span>
                            )}
                        </div>
                    </div>

                    <div className="card-body">
                        {userBookings.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                                    <Home size={40} className="text-muted" />
                                </div>
                                <h3 className="h5 mb-2">No bookings yet</h3>
                                <p className="text-muted mb-4">
                                    When you make your first booking, it will appear here.
                                </p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="btn btn-primary"
                                >
                                    Browse Rooms
                                </button>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {userBookings.map((booking, index) => (
                                    <div key={index} className="col-12">
                                        <div
                                            className="card border shadow-sm h-100 booking-card"
                                            onClick={() => router.push(`/rooms/${booking.roomId}`)}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)'
                                                e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)'
                                                e.currentTarget.style.boxShadow = ''
                                            }}
                                        >
                                            <div className="card-body">
                                                <div className="row align-items-center">
                                                    <div className="col-md-6">
                                                        <h5 className="card-title mb-3">{booking.roomName}</h5>
                                                        <div className="d-flex flex-wrap gap-3 text-muted small">
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Calendar size={16} />
                                                                <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Clock size={16} />
                                                                <span>{booking.nights} nights</span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Users size={16} />
                                                                <span>{booking.guests} guests</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 text-md-end mt-3 mt-md-0">
                                                        <div className="mb-2">
                                                            <span className="text-muted small">Total Price</span>
                                                        </div>
                                                        <div className="h4 mb-0 text-primary">
                                                            {formatPrice(booking.totalPrice)}
                                                        </div>
                                                        {booking.userId && (
                                                            <span className="badge bg-success small">Confirmed</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="row g-3 mt-4">
                    <div className="col-md-4">
                        <div className="card border-0 bg-success bg-opacity-10 h-100">
                            <div className="card-body text-center">
                                <Settings size={32} className="text-success mb-3" />
                                <h5 className="card-title">Account Settings</h5>
                                <p className="card-text small">Update your preferences</p>
                                <button className="btn btn-sm btn-success">Manage</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 bg-warning bg-opacity-10 h-100">
                            <div className="card-body text-center">
                                <Home size={32} className="text-warning mb-3" />
                                <h5 className="card-title">Special Offers</h5>
                                <p className="card-text small">Exclusive deals for members</p>
                                <button className="btn btn-sm btn-warning">View Offers</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage