import { useState, useEffect } from "react";

export default function LoginInfo() 
{
  const [currentQuote, setCurrentQuote] = useState(0);

  const motivationalContent = [
    {
      icon: "🎯",
      quote: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier",
      highlight: "Start Today",
      color: "#1976d2"
    },
    {
      icon: "🚀",
      quote: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      highlight: "Take Action",
      color: "#7b1fa2"
    },
    {
      icon: "⭐",
      quote: "Your limitation—it's only your imagination.",
      author: "Unknown",
      highlight: "Break Barriers",
      color: "#388e3c"
    },
    {
      icon: "💪",
      quote: "Push yourself, because no one else is going to do it for you.",
      author: "Unknown",
      highlight: "Self Motivation",
      color: "#f57c00"
    },
    {
      icon: "🌟",
      quote: "Great things never come from comfort zones.",
      author: "Unknown",
      highlight: "Step Forward",
      color: "#e91e63"
    },
    {
      icon: "🔥",
      quote: "Dream it. Wish it. Do it.",
      author: "Unknown",
      highlight: "Make It Happen",
      color: "#ff5722"
    }
  ];

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [motivationalContent.length]);

  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      }}
    >
      {/* Welcome Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1 
          style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '12px',
            background: 'linear-gradient(45deg, #1976d2, #7b1fa2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2',
            margin: '0 0 12px 0'
          }}
        >
          Welcome Back! ✨
        </h1>
        <p 
          style={{
            fontSize: '1.1rem',
            color: '#666',
            margin: '0',
            lineHeight: '1.5'
          }}
        >
          Ready to turn your goals into achievements?
        </p>
      </div>

      {/* Rotating Motivational Quote */}
      <div 
        style={{
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #f8f9fa,rgb(185, 255, 251))',
          border: '1px solid #e0e0e0',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          width:"100%",
          minHeight:"425px"
        }}
      >
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div
            key={currentQuote}
            style={{
              animation: 'fadeInUp 0.6s ease-out'
            }}
          >
            {/* Icon */}
            <div 
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px auto',
                background: `linear-gradient(135deg, ${motivationalContent[currentQuote].color}20, ${motivationalContent[currentQuote].color}10)`,
                border: `3px solid ${motivationalContent[currentQuote].color}30`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                boxShadow: `0 4px 20px ${motivationalContent[currentQuote].color}20`
              }}
            >
              {motivationalContent[currentQuote].icon}
            </div>
            
            {/* Quote */}
            <blockquote style={{ 
              fontSize: '1.375rem', 
              fontWeight: '500',
              fontStyle: 'italic',
              marginBottom: '16px',
              color: '#333',
              lineHeight: '1.6',
              margin: '0 0 16px 0',
              position: 'relative'
            }}>
              <span style={{ 
                fontSize: '3rem', 
                color: motivationalContent[currentQuote].color,
                position: 'absolute',
                left: '-20px',
                top: '-10px',
                opacity: 0.3
              }}>
                "
              </span>
              {motivationalContent[currentQuote].quote}
              <span style={{ 
                fontSize: '3rem', 
                color: motivationalContent[currentQuote].color,
                position: 'absolute',
                right: '-20px',
                bottom: '-40px',
                opacity: 0.3
              }}>
                "
              </span>
            </blockquote>
            
            {/* Author */}
            <p style={{ 
              fontSize: '1rem', 
              color: '#888',
              marginBottom: '24px',
              fontWeight: '400',
              margin: '0 0 24px 0'
            }}>
              — {motivationalContent[currentQuote].author}
            </p>
            
            {/* Highlight Badge */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: motivationalContent[currentQuote].color,
                color: 'white',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '0.95rem',
                boxShadow: `0 4px 15px ${motivationalContent[currentQuote].color}30`,
                transform: 'translateY(-2px)'
              }}
            >
              <span>✨</span>
              {motivationalContent[currentQuote].highlight}
            </div>
          </div>
          
          {/* Quote Progress Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
            {motivationalContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                style={{
                  width: index === currentQuote ? '32px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: index === currentQuote ? motivationalContent[currentQuote].color : '#ddd',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: index === currentQuote ? `0 2px 8px ${motivationalContent[currentQuote].color}40` : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Benefits */}
      <div>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { icon: '⚡', text: 'Get organized in minutes', color: '#f57c00' },
            { icon: '🎯', text: 'Track your progress effortlessly', color: '#1976d2' },
            { icon: '🏆', text: 'Achieve your goals faster', color: '#388e3c' }
          ].map((benefit, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: `${benefit.color}08`,
                border: `1px solid ${benefit.color}20`,
                borderRadius: '12px',
                animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: `${benefit.color}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                {benefit.icon}
              </div>
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: '500', 
                color: '#333' 
              }}>
                {benefit.text}
              </span>
            </div>
          ))}
        </div>
      </div>

     
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}