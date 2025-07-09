import React from "react";

const Payment = () => {
  return (
    <div>
      <h1>Payment Page</h1>
      <p>Redirecting you to the payment provider...</p>
      {/* Simulate a real payment flow */}
      <a href="https://example-payment-site.com" target="_blank" rel="noopener noreferrer">
        Proceed to Payment
      </a>
    </div>
  );
};

export default Payment;
