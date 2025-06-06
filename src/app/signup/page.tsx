// src/app/signup/page.tsx
'use client'

import 'bootstrap/dist/css/bootstrap.min.css'

export default function SignUpPage() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary text-white position-relative">
      <div className="position-absolute w-100 text-center" style={{ opacity: 0.1, fontSize: '5rem' }}>
        <p>campus.build</p>
        <p style={{ fontSize: '1.5rem' }}>CAREERS. NOT JOBS</p>
      </div>
      <form className="z-2" style={{ minWidth: '320px', maxWidth: '400px' }}>
        <h2 className="mb-4 text-center fw-bold">Sign up</h2>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="username" placeholder="Enter Name" />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="email" placeholder="abcd@gmail.com" />
          <label htmlFor="email">Email Address</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="password" placeholder="Enter Password" />
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" value="" id="terms" />
          <label className="form-check-label" htmlFor="terms">
            I accept the terms & conditions
          </label>
        </div>
        <button className="btn btn-light w-100 fw-bold" type="submit">Sign up</button>
      </form>
    </div>
  )
}
