import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaDumbbell, FaMoon, FaUsers, FaShieldAlt, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import Header from '../components/Header';

const HomePage = () => {
  const benefits = [
    {
      icon: <FaHeart className="benefit-icon" />,
      title: 'Promotes Healthy Skin',
      description: 'Oil massage keeps baby\'s skin soft, hydrated, and protected from rashes.'
    },
    {
      icon: <FaDumbbell className="benefit-icon" />,
      title: 'Strengthens Muscles & Bones',
      description: 'Improves blood circulation and supports healthy growth and development.'
    },
    {
      icon: <FaMoon className="benefit-icon" />,
      title: 'Better Sleep for Baby & Parents',
      description: 'Babies who get gentle massage and bath sleep more peacefully at night.'
    },
    {
      icon: <FaUsers className="benefit-icon" />,
      title: 'Enhances Bonding',
      description: 'Skin-to-skin contact creates emotional connection between parent and child.'
    },
    {
      icon: <FaShieldAlt className="benefit-icon" />,
      title: 'Boosts Immunity & Digestion',
      description: 'Massage stimulates nerve endings and metabolism, aiding overall health.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Bangalore',
      text: 'The care team at Vihaan Care Nest has been incredible. My baby sleeps so much better after their gentle massages!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      location: 'Dharwad',
      text: 'Professional, caring, and reliable. They\'ve made our postpartum journey so much easier.',
      rating: 5
    },
    {
      name: 'Ananya Reddy',
      location: 'Bangalore',
      text: 'I was nervous about letting someone else care for my newborn, but their expertise gave me confidence.',
      rating: 5
    }
  ];

  return (
    <div className="page-container">
      <Header />
      
      {/* Hero Section */}
      <section className="hero py-4">
        <div className="container text-center">
          <div className="trust-badge mb-2">
            ⭐ Trusted by 500+ Families in Bangalore & Dharwad
          </div>
          
          <h1 className="hero-title mb-3">
            Give your newborn the gift of gentle care!
          </h1>
          
          <p className="hero-subtitle mb-3">
            A warm bath and soothing oil massage not only keeps their skin soft and muscles strong 
            but also helps them sleep peacefully at night—so parents can enjoy a restful, uninterrupted night too.
          </p>
          
          <div className="tagline mb-4 text-primary">
            "Happy Baby, Happy Parents!"
          </div>
          
          <div className="hero-buttons">
            <Link to="/packages" className="btn mr-2 mb-2">
              Start Your Care Journey
            </Link>
            <Link to="/packages" className="btn btn-secondary mb-2">
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits py-4">
        <div className="container">
          <h2 className="text-center mb-2">Why Choose Professional Baby Care?</h2>
          <p className="text-center text-muted mb-4">
            Our specialized care services provide essential benefits for your newborn's health and development
          </p>
          
          <div className="grid grid-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card card">
                <div className="benefit-header">
                  {benefit.icon}
                  <h3>{benefit.title}</h3>
                </div>
                <p className="text-muted">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access py-4" style={{background: 'white'}}>
        <div className="container">
          <h2 className="text-center mb-4">Quick Access</h2>
          
          <div className="grid grid-2">
            <Link to="/packages" className="access-card card text-center">
              <div className="access-icon mb-2">🎁</div>
              <h3>View Packages</h3>
              <p className="text-muted">Choose the perfect care plan for your family</p>
            </Link>
            
            <Link to="/customer-login" className="access-card card text-center">
              <div className="access-icon mb-2">👤</div>
              <h3>Customer Portal</h3>
              <p className="text-muted">Manage your subscriptions and bookings</p>
            </Link>
            
            <Link to="/team-login" className="access-card card text-center">
              <div className="access-icon mb-2">👥</div>
              <h3>Team Login</h3>
              <p className="text-muted">Access your visit schedule and logs</p>
            </Link>
            
            <Link to="/admin-login" className="access-card card text-center">
              <div className="access-icon mb-2">⚙️</div>
              <h3>Admin Panel</h3>
              <p className="text-muted">Manage team and business operations</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-4">
        <div className="container">
          <h2 className="text-center mb-2">What Parents Say</h2>
          <p className="text-center text-muted mb-4">Real experiences from our happy families</p>
          
          <div className="grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card card">
                <div className="testimonial-rating mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-text mb-3">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span className="text-muted"> - {testimonial.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact py-4" style={{background: 'white'}}>
        <div className="container">
          <h2 className="text-center mb-2">Get in Touch</h2>
          <p className="text-center text-muted mb-4">Have questions? We're here to help!</p>
          
          <div className="contact-info card" style={{maxWidth: '600px', margin: '0 auto'}}>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <strong>Phone</strong>
                <p>For immediate assistance and queries</p>
                <a href="tel:9740517671" className="text-primary">+91 97405 17671</a>
              </div>
            </div>
            
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <strong>Email</strong>
                <p>Send us your questions anytime</p>
                <a href="mailto:vihaancarenest@gmail.com" className="text-primary">vihaancarenest@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-4">
        <div className="container text-center">
          <h3 className="mb-2">About Vihaan Care Nest</h3>
          <p className="mb-3">
            Founded by <strong>Vishwanath V M & Megha V M</strong>, Vihaan Care Nest is dedicated to providing 
            professional, compassionate care for newborns and new mothers. We understand the precious nature 
            of these early moments and are committed to supporting families with expert care services.
          </p>
          
          <div className="footer-info">
            <p><strong>Service Areas:</strong> Currently serving Bangalore & Dharwad, Karnataka</p>
            <p><strong>Visit Duration:</strong> Each care session lasts 1-2 hours for comprehensive care</p>
          </div>
          
          <div className="mt-4">
            <Link to="/packages" className="btn">
              Start Your Care Journey Today
            </Link>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--secondary-color);
          line-height: 1.2;
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--dark-gray);
          max-width: 800px;
          margin: 0 auto;
        }
        
        .tagline {
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .trust-badge {
          color: var(--medium-gray);
          font-size: 0.9rem;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .benefit-card {
          text-align: center;
          padding: 2rem 1.5rem;
        }
        
        .benefit-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .benefit-icon {
          font-size: 2rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .access-card {
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s;
        }
        
        .access-card:hover {
          transform: translateY(-5px);
          text-decoration: none;
          color: inherit;
        }
        
        .access-icon {
          font-size: 2.5rem;
        }
        
        .testimonial-card {
          text-align: center;
        }
        
        .testimonial-rating {
          color: #ffc107;
        }
        
        .star {
          margin-right: 2px;
        }
        
        .testimonial-text {
          font-style: italic;
          color: var(--dark-gray);
        }
        
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .contact-icon {
          font-size: 1.5rem;
          color: var(--primary-color);
          margin-top: 0.25rem;
        }
        
        .footer {
          background: var(--secondary-color);
          color: white;
        }
        
        .footer a {
          color: white;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .contact-item {
            text-align: center;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;