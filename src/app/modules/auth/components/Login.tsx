import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { login } from '../core/_requests';
import { useAuth } from '../core/Auth';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { UserModel } from '../core/_models';
import { Api_Endpoint } from '../../../services/ApiCalls';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
});

const initialValues = {
  username: '',
  password: '',
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const { saveAuth, setCurrentUser } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const { data: auth } = await login(values.username, values.password);
        saveAuth(auth);
        const decodedToken: any = jwtDecode(auth.jwtToken);
        const user: UserModel = {
          id: decodedToken.id,
          username: decodedToken.username,
          email: decodedToken.email,
          lastName: decodedToken.lastName,
          firstName: decodedToken.firstName,
          password: decodedToken.password,
          departmentId: decodedToken.departmentId,
          department: decodedToken.department,
          positionId: decodedToken.positionId,
          position: decodedToken.positionName,
          status: decodedToken.status,
          phoneNumber: decodedToken.phoneNumber,
          teacherId: decodedToken.teacherId,
          studentId: decodedToken.studentId,
        };
        // await axios.post(`${Api_Endpoint}/auditTrail`, {
        //   userId: decodedToken.id,
        //   action: 'Logged in successfully',
        // });
        setCurrentUser(user);
        setStatus(undefined);
      } catch (error: any) {
        console.error(error);
        saveAuth(undefined);
        setStatus(error.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#f0f0f0',
        fontFamily: '"Times New Roman", Georgia, serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '980px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '70px',
          padding: '0 30px',
          position: 'relative',
        }}
      >
        {/* Left side - headline + floating cards */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            maxWidth: '480px',
            height: '620px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Subtle colorful background glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 40% 60%, #ff3366 0%, #c13584 40%, #833ab4 70%, #5851db 100%)',
              opacity: 0.14,
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />

          <h1
            style={{
              fontSize: '3.1rem',
              fontWeight: 600,
              lineHeight: 1.25,
              textAlign: 'center',
              marginBottom: '45px',
              maxWidth: '420px',
              color: '#ffffff',
              zIndex: 10,
              letterSpacing: '-0.4px',
            }}
          >
            See everyday deals and moments from your{' '}
            <span style={{ color: '#ff4d88', fontWeight: 700 }}>close</span>{' '}
            <span style={{ color: '#e0668a', fontWeight: 700 }}>shopping friends</span>.
          </h1>

          {/* Overlapping tilted photo/story cards */}
          <div
            style={{
              position: 'relative',
              width: '340px',
              height: '520px',
              zIndex: 5,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 50,
                left: 30,
                width: 280,
                height: 460,
                borderRadius: 38,
                overflow: 'hidden',
                border: '10px solid #fff',
                boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
                transform: 'rotate(-10deg)',
              }}
            >
              <img
                src={toAbsoluteUrl('/media/logos/Delivery.png')}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 260,
                height: 440,
                borderRadius: 36,
                overflow: 'hidden',
                border: '10px solid #fff',
                boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
                transform: 'rotate(8deg)',
              }}
            >
              <img
                src={toAbsoluteUrl('/media/logos/mall2.png')}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Sales-themed decorations – larger & more readable */}
            <div style={{ position: 'absolute', top: 90, left: -70, fontSize: 90, filter: 'drop-shadow(0 0 12px #ff3366)', zIndex: 10 }}>🛒</div>
            <div style={{ position: 'absolute', top: 270, right: -60, fontSize: 80, filter: 'drop-shadow(0 0 14px #00ff9d)', zIndex: 12 }}>🏷️</div>
            <div style={{ position: 'absolute', bottom: 110, left: 50, fontSize: 78, filter: 'drop-shadow(0 0 12px #ffd700)', zIndex: 11 }}>🎁</div>
            <div style={{ position: 'absolute', bottom: 10, right: 20, fontSize: 74, filter: 'drop-shadow(0 0 16px #00eaff)', zIndex: 13 }}>💰</div>

            {/* Small gradient circle profile overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: 120,
                width: 110,
                height: 110,
                borderRadius: '50%',
                padding: 6,
                background: 'linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)',
                zIndex: 15,
                boxShadow: '0 8px 30px rgba(255,0,150,0.5)',
              }}
            >
              <img
                src={toAbsoluteUrl('/media/logos/mall1.png')}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid white',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right side - login form card */}
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: 'rgba(40, 38, 38, 0.72)',
            backdropFilter: 'blur(12px)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '48px 36px 36px',
            boxShadow: '0 12px 50px rgba(0,0,0,0.9)',
          }}
        >
          {/* Shop Smart logo – now in Times New Roman bold */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
              style={{
                width: '120px',
                height: '120px',
                backgroundImage: `url(${toAbsoluteUrl('/media/logos/logoRel.png')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                border: '3px solid #00d4ff',
                boxShadow: '0 0 15px rgba(0, 212, 255, 0.5)',
                animation: 'pulseGlow 2s infinite',
              }}
            ></div>
            <div
              style={{
                fontFamily: '"Times New Roman", Georgia, serif',
                fontSize: '4.8rem',
                fontWeight: 700,
                letterSpacing: '-1.5px',
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(255, 105, 180, 0.4)',
              }}
            >
              Shop Smart
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} noValidate>
            <input
              type="text"
              placeholder="Mobile number, username or email"
              {...formik.getFieldProps('username')}
              style={{
                width: '100%',
                padding: '15px 18px',
                marginBottom: '16px',
                borderRadius: 8,
                border: '1px solid #444',
                background: '#111',
                color: '#f8f8f8',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />

            {formik.touched.username && formik.errors.username && (
              <div style={{ color: '#ff6b6b', fontSize: '1rem', marginBottom: '12px', textAlign: 'left' }}>
                {formik.errors.username}
              </div>
            )}

            <input
              type="password"
              placeholder="Password"
              {...formik.getFieldProps('password')}
              style={{
                width: '100%',
                padding: '15px 18px',
                marginBottom: '24px',
                borderRadius: 8,
                border: '1px solid #444',
                background: '#111',
                color: '#f8f8f8',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />

            {formik.touched.password && formik.errors.password && (
              <div style={{ color: '#ff6b6b', fontSize: '1rem', marginBottom: '16px', textAlign: 'left' }}>
                {formik.errors.password}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formik.isValid || formik.isSubmitting}
              style={{
                width: '100%',
                padding: '14px 0',
                background: formik.isValid && !loading ? '#0066cc' : '#004080',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '1.18rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: formik.isValid && !loading ? 'pointer' : 'not-allowed',
                opacity: loading ? 0.7 : 1,
                marginBottom: '20px',
              }}
            >
              {loading ? 'Please wait...' : 'Log in'}
            </button>

            {formik.status && (
              <div style={{ color: '#ff6b6b', textAlign: 'center', margin: '16px 0', fontSize: '1.05rem' }}>
                {formik.status}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '0.95rem',
          color: '#888',
          padding: '0 20px',
        }}
      >
        Shop Smart • About • Blog • Help • Privacy • Terms • Locations • Contact Us • © 2026 Shop Smart
      </div>
    </div>
  );
}