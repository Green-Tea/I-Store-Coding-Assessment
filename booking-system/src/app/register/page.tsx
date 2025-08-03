'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const RegisterPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerError, setRegisterError] = useState('')
  
  const { register: registerUser, isLoading } = useAuthStore()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError('')
    
    if (data.password !== data.confirmPassword) {
      setRegisterError('Passwords do not match')
      return
    }

    const success = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password
    })
    
    if (success) {
      router.push('/')
    } else {
      setRegisterError('Registration failed, please try again.')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <UserPlus className="mb-3" size={40} />
                  <h1 className="h3 mb-2">Register</h1>
                  <p className="text-muted">
                    Create your account to start booking
                  </p>
                </div>

                {/* Error Alert */}
                {registerError && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <AlertCircle size={16} className="me-2" />
                    {registerError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        {...register('firstName', {
                          required: 'Please enter your first name',
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters'
                          }
                        })}
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">
                          {errors.firstName.message}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Surname</label>
                      <input
                        {...register('lastName', {
                          required: 'Please enter your surname',
                          minLength: {
                            value: 2,
                            message: 'Surname must be at least 2 characters'
                          }
                        })}
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">
                          {errors.lastName.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      {...register('email', {
                        required: 'Please enter your email address',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      {...register('phone', {
                        required: 'Please enter your phone number',
                        pattern: {
                          value: /^[0-9-+().\s]{10,}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">
                        {errors.phone.message}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        {...register('password', {
                          required: 'Please enter your password',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters.'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) => value === password || 'Passwords do not match'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Confirm Password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">
                          {errors.confirmPassword.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-100 py-2"
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Registering User...
                      </div>
                    ) : (
                      'Register'
                    )}
                  </button>
                </form>

                {/* Links */}
                <div className="mt-4 text-center">
                  <p className="text-muted mb-0">
                    Have an account?{' '}
                    <Link href="/login" className="text-primary text-decoration-none">
                      Login
                    </Link>
                  </p>
                </div>

                <div className="mt-3 text-center">
                  <Link href="/" className="text-muted text-decoration-none small">
                    ← Go Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage