import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaCreditCard, FaMobile } from 'react-icons/fa';
import Header from '../components/Header';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentInfo = location.state;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUPIPayment = () => {
    const upiLink = `upi://pay?pa=vihaancarenest@okaxis&pn=Vihaan Care Nest&am=${paymentInfo.price}&cu=INR&tn=Subscription Payment for ${paymentInfo.packageName}`;
    
    // Try to open UPI app
    window.open(upiLink, '_blank');
    
    setTimeout(() => {
      alert('After completing UPI payment, please click "I have completed the payment" button below.');
    }, 1000);
  };

  const handleBankTransfer = () => {
    const bankDetails = `Please transfer ₹${paymentInfo.price} to the following account:

Account Name: Vihaan Care Nest
Account Number: 1234567890
IFSC: AXIS0001234
Bank: Axis Bank

After transfer, please call +91 97405 17671 with transaction details.`;
    
    alert(bankDetails);
    
    // Copy to clipboard
    navigator.clipboard.writeText(bankDetails).then(() => {
      alert('Bank details copied to clipboard!');
    });
  };

  const createSubscription = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: paymentInfo.customerId,
          package_id: paymentInfo.packageId,
          start_date: new Date().toISOString(),
          duration_months: 1
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Subscription created successfully! Our team will contact you within 24 hours to schedule your first visit.');
        navigate('/customer-dashboard', {
          state: { customerId: paymentInfo.customerId }
        });
      } else {
        alert(result.detail || 'Failed to create subscription');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirmation = () => {
    const confirmed = window.confirm('Have you completed the payment?');
    if (confirmed) {
      createSubscription();
    }
  };

  if (!paymentInfo) {
    return (
      <div className="page-container">
        <Header />
        <div className="container py-4 text-center">
          <h2>Payment Information Missing</h2>
          <p>Please go through the proper signup process.</p>
          <Link to="/packages" className="btn">View Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      
      <div className="container py-4">
        <div className="payment-container">
          <h1 className="text-center mb-4">Complete Payment</h1>

          {/* Order Summary */}
          <div className="order-summary card mb-4">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Package</span>
              <span>{paymentInfo.packageName}</span>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <span>1 Month</span>
            </div>
            <div className="summary-row">
              <span>Type</span>
              <span>{paymentInfo.packageType === 'baby' ? 'Newborn Baby Care' : 'Postpartum Mother Care'}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{paymentInfo.price?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods card mb-4">
            <h3 className="mb-3">Choose Payment Method</h3>
            
            <div className="payment-option" onClick={handleUPIPayment}>
              <div className="payment-icon">
                <FaMobile />
              </div>
              <div className="payment-content">
                <h4>UPI Payment</h4>
                <p>Pay instantly using GPay, PhonePe, Paytm, or any UPI app</p>
              </div>
              <div className="payment-arrow">→</div>
            </div>
            
            <div className="payment-option" onClick={handleBankTransfer}>
              <div className="payment-icon">
                <FaCreditCard />
              </div>
              <div className="payment-content">
                <h4>Bank Transfer</h4>
                <p>Transfer money directly to our bank account</p>
              </div>
              <div className="payment-arrow">→</div>
            </div>
          </div>

          {/* Payment Confirmation */}
          <div className="payment-confirmation card mb-4">
            <button
              className="btn btn-success w-100 mb-3"
              onClick={handlePaymentConfirmation}
              disabled={isProcessing}
            >
              {isProcessing ? 'Creating Subscription...' : 'I have completed the payment'}
            </button>
            
            <p className="text-center text-muted">
              Click this button after completing your payment to activate your subscription.
            </p>
          </div>

          {/* Contact Support */}
          <div className="contact-support card">
            <h3 className="text-center mb-3">Need Help?</h3>
            <p className="text-center text-muted mb-3">For any payment issues, contact us:</p>
            
            <div className="contact-buttons">
              <a href="tel:+919740517671" className="btn btn-secondary">
                <FaPhone /> Call: +91 97405 17671
              </a>
              
              <a href="mailto:vihaancarenest@gmail.com" className="btn btn-secondary">
                <FaEnvelope /> Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .payment-container {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .order-summary {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
        }
        
        .summary-divider {
          height: 1px;
          background: var(--border-color);
          margin: 1rem 0;
        }
        
        .summary-row.total {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .payment-option {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .payment-option:hover {
          border-color: var(--primary-color);
          background: var(--light-gray);
        }
        
        .payment-icon {
          width: 50px;
          height: 50px;
          background: var(--light-gray);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: 1.5rem;
          color: var(--primary-color);
        }
        
        .payment-content {
          flex: 1;
        }
        
        .payment-content h4 {
          margin-bottom: 0.25rem;
          color: var(--secondary-color);
        }
        
        .payment-content p {
          color: var(--medium-gray);
          margin: 0;
        }
        
        .payment-arrow {
          font-size: 1.2rem;
          color: var(--medium-gray);
        }
        
        .contact-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .contact-buttons .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .w-100 {
          width: 100%;
        }
        
        @media (max-width: 600px) {
          .contact-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;