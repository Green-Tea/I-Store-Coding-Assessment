'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Eye, EyeOff, User, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface LoginFormData {
  email: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const { login, isLoading } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('')
    
    const success = await login(data.email, data.password)
    
    if (success) {
      router.push('/')
    } else {
      setLoginError('Incorrect email or password')
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
                  <User className="mb-3" size={40} />
                  <h1 className="h3 mb-2">Welcome Back</h1>
                  <p className="text-muted">
                    Please login to your account to continue booking
                  </p>
                </div>

                {/* Demo Account Info */}
                <div className="alert alert-info" role="alert">
                  <h6 className="alert-heading">Demo Account</h6>
                  <small>
                    <div>admin@example.com / admin123</div>
                  </small>
                </div>

                {/* Error Alert */}
                {loginError && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <AlertCircle size={16} className="me-2" />
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      {...register('email', {
                        required: 'Please enter email address',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email format'
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

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        {...register('password', {
                          required: 'Please enter your password',
                          minLength: {
                            value: 6,
                            message: 'Password should be at least 6 characters'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password.message}
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
                        Logging In...
                      </div>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>

                {/* Links */}
                <div className="mt-4 text-center">
                  <p className="text-muted mb-0">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary text-decoration-none">
                      Register here
                    </Link>
                  </p>
                </div>

                <div className="mt-3 text-center">
                  <Link href="/" className="text-muted text-decoration-none small">
                    ← Back to Home
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

export default LoginPage