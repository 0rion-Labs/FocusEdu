"use client";
import React from 'react'
import { TbError404 } from "react-icons/tb";
import { HiHome } from "react-icons/hi";
import { BiArrowBack } from "react-icons/bi";
import Link from 'next/link';
import Background from './components/Background';

const NotFound = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Background />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(192, 38, 211, 0.1) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        {/* 404 Icon */}
        <div style={{
          position: 'relative',
          display: 'inline-block',
          marginBottom: '24px',
        }}>
          <TbError404 style={{
            fontSize: '180px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #d946ef 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.5))',
          }} />
        </div>

        {/* Text Content */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '12px',
          textShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
        }}>
          Oops! Page Not Found
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#a1a1aa',
          marginBottom: '32px',
          lineHeight: '1.6',
        }}>
          The page you are looking for seems to have wandered off into the digital void. 
          Do not worry, let us get you back on track!
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(to right, #7c3aed, #c026d3)',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            transition: 'all 0.3s ease',
          }}>
            <HiHome style={{ fontSize: '18px' }} />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '12px',
              color: '#a78bfa',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <BiArrowBack style={{ fontSize: '18px' }} />
            Go Back
          </button>
        </div>

        {/* Decorative elements */}
        <div style={{
          marginTop: '48px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
        }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i === 2 
                  ? 'linear-gradient(135deg, #7c3aed, #c026d3)' 
                  : 'rgba(124, 58, 237, 0.3)',
                animation: `pulse ${1 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        button:hover {
          background: rgba(124, 58, 237, 0.15) !important;
          border-color: rgba(124, 58, 237, 0.5) !important;
        }
        a:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(124, 58, 237, 0.5) !important;
        }
      `}</style>
    </div>
  )
}

export default NotFound
