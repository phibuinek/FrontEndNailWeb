'use client';

import { useState, useEffect } from 'react';
import { 
    useStripe, 
    useElements, 
    CardNumberElement, 
    CardExpiryElement, 
    CardCvcElement 
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Lock, CreditCard, Truck, Store } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Country, State } from 'country-state-city';

const translations = {
  EN: {
    delivery: "Delivery",
    ship: "Ship",
    pickup: "Pick up",
    shippingAddress: "Shipping Address",
    contactInfo: "Contact Information",
    email: "Email",
    country: "Country/Region",
    firstName: "First name",
    lastName: "Last name",
    address: "Address",
    apartment: "Apartment, suite, etc. (optional)",
    city: "City",
    state: "State",
    zip: "ZIP code",
    phone: "Phone",
    payment: "Payment",
    secureText: "All transactions are secure and encrypted.",
    creditCard: "Credit card",
    payAtStore: "Pay At Store",
    nameOnCard: "Name on card",
    sameAddress: "Use shipping address as billing address",
    payNow: "Pay Now",
    processing: "Processing...",
    orderPlaced: "Order placed! Please pay at store.",
    paymentSuccess: "Payment Successful!",
    paymentFailed: "Failed to initialize payment",
    errors: {
        emailRequired: "Email is required",
        emailInvalid: "Email is invalid",
        firstName: "First name is required",
        lastName: "Last name is required",
        address: "Address is required",
        city: "City is required",
        zip: "ZIP code is required"
    }
  },
  VI: {
    delivery: "Phương Thức Giao Hàng",
    ship: "Giao Hàng",
    pickup: "Nhận Tại Cửa Hàng",
    shippingAddress: "Địa Chỉ Giao Hàng",
    contactInfo: "Thông Tin Liên Hệ",
    email: "Email",
    country: "Quốc Gia/Khu Vực",
    firstName: "Họ",
    lastName: "Tên",
    address: "Địa Chỉ",
    apartment: "Căn hộ, phòng, v.v. (tùy chọn)",
    city: "Thành Phố",
    state: "Tiểu Bang/Tỉnh",
    zip: "Mã Bưu Điện",
    phone: "Số Điện Thoại",
    payment: "Thanh Toán",
    secureText: "Toàn bộ các giao dịch được bảo mật và mã hóa.",
    creditCard: "Thẻ tín dụng",
    payAtStore: "Thanh Toán Tại Cửa Hàng",
    nameOnCard: "Tên trên thẻ",
    sameAddress: "Dùng địa chỉ giao hàng làm địa chỉ thanh toán",
    payNow: "Thanh Toán Ngay",
    processing: "Đang xử lý...",
    orderPlaced: "Đã đặt hàng! Vui lòng thanh toán tại cửa hàng.",
    paymentSuccess: "Thanh toán thành công!",
    paymentFailed: "Khởi tạo thanh toán thất bại",
    errors: {
        emailRequired: "Vui lòng nhập Email",
        emailInvalid: "Email không hợp lệ",
        firstName: "Vui lòng nhập Họ",
        lastName: "Vui lòng nhập Tên",
        address: "Vui lòng nhập Địa chỉ",
        city: "Vui lòng nhập Thành phố",
        zip: "Vui lòng nhập Mã bưu điện"
    }
  }
};

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // 'credit_card' | 'store'
  const [deliveryMethod, setDeliveryMethod] = useState('ship'); // 'ship' | 'pickup'
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  // Form State
  const [formData, setFormData] = useState({
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: 'CA', // Default to California code
      country: 'US', // Default to US code
      zip: '',
      phone: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});

  const [states, setStates] = useState([]);
  const countries = Country.getAllCountries();

  useEffect(() => {
      const countryStates = State.getStatesOfCountry(formData.country);
      setStates(countryStates);
      // Reset state if current state is not in new country list
      const currentStateExists = countryStates.find(s => s.isoCode === formData.state);
      if (!currentStateExists && countryStates.length > 0) {
          setFormData(prev => ({ ...prev, state: countryStates[0].isoCode }));
      } else if (countryStates.length === 0) {
          setFormData(prev => ({ ...prev, state: '' }));
      }
  }, [formData.country]);

  useEffect(() => {
    setMounted(true);
    const userEmail = localStorage.getItem('username') || ''; 
    // Simple check if username looks like an email
    if (userEmail && /\S+@\S+\.\S+/.test(userEmail)) {
        setFormData(prev => ({ ...prev, email: userEmail }));
    }
  }, []);

  // Automatically switch to credit_card if delivery method is ship and payment method is store
  useEffect(() => {
      if (deliveryMethod === 'ship' && paymentMethod === 'store') {
          setPaymentMethod('credit_card');
      }
  }, [deliveryMethod, paymentMethod]);

  const amount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error when user types
      if (fieldErrors[name]) {
          setFieldErrors(prev => ({ ...prev, [name]: null }));
      }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = null;

    if (deliveryMethod === 'ship') {
        if (name === 'email') {
             if (!value.trim()) errorMsg = t.errors.emailRequired;
             else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = t.errors.emailInvalid;
        }
        if (name === 'firstName' && !value.trim()) errorMsg = t.errors.firstName;
        if (name === 'lastName' && !value.trim()) errorMsg = t.errors.lastName;
        if (name === 'address' && !value.trim()) errorMsg = t.errors.address;
        if (name === 'city' && !value.trim()) errorMsg = t.errors.city;
        if (name === 'zip' && !value.trim()) errorMsg = t.errors.zip;
    } else {
         if (name === 'email') {
             if (!value.trim()) errorMsg = t.errors.emailRequired;
             else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = t.errors.emailInvalid;
        }
    }
    
    if (errorMsg) {
        setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const validateForm = () => {
      const errors = {};
      
      // Only validate shipping/contact info if delivery method is 'ship'
      if (deliveryMethod === 'ship') {
        if (!formData.email.trim()) {
            errors.email = t.errors.emailRequired;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = t.errors.emailInvalid;
        }
        if (!formData.firstName.trim()) errors.firstName = t.errors.firstName;
        if (!formData.lastName.trim()) errors.lastName = t.errors.lastName;
        if (!formData.address.trim()) errors.address = t.errors.address;
        if (!formData.city.trim()) errors.city = t.errors.city;
        if (!formData.zip.trim()) errors.zip = t.errors.zip;
      } else {
        // If Pickup, maybe just require basic info if needed, or nothing?
        // For now let's at least require email for order confirmation
        if (!formData.email.trim()) {
             errors.email = t.errors.emailRequired;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
             errors.email = t.errors.emailInvalid;
        }
      }
      
      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Always validate now, but logic inside validateForm handles the method check
    if (!validateForm()) {
        return;
    }
    
    setProcessing(true);
    
    // Helper to create order
    const createOrder = async (paymentStatus) => {
        try {
            const user = localStorage.getItem('username');
            const orderData = {
                username: user || 'Guest',
                email: formData.email,
                items: cart.map(item => ({
                    productId: item.id,
                    name: typeof item.name === 'object' ? item.name.en : item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: Math.round(amount * 100), // Save in cents to match Stripe and Admin Dashboard logic
                paymentMethod: paymentMethod,
                shippingAddress: deliveryMethod === 'ship' 
                    ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`
                    : 'Pickup at store',
                status: paymentStatus // 'pending' or 'paid'
            };

            const token = localStorage.getItem('access_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(orderData)
            });

            if (!res.ok) {
                console.error("Failed to create order", await res.text());
                return null;
            }

            const order = await res.json();
            
            // Send invoice email if payment succeeded
            if (paymentStatus === 'paid' && order._id) {
                try {
                    await fetch(`${API_URL}/orders/${order._id}/send-invoice`, {
                        method: 'POST',
                        headers: headers
                    });
                } catch (emailError) {
                    console.error("Failed to send invoice email:", emailError);
                    // Don't block success if email fails
                }
            }

            return order;
        } catch (err) {
            console.error("Error creating order:", err);
            return null;
        }
    };

    if (paymentMethod === 'store') {
        // Handle Pay at Store logic (Simulated)
        
        // 1. Create Order Record
        const order = await createOrder('pending');
        
        // 2. Update sold count for store payment as well
        try {
            await fetch(`${API_URL}/products/update-sold`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
                })
            });
        } catch (updateError) {
            console.error("Failed to update sold count:", updateError);
        }

        clearCart();
        if (order && order._id) {
            router.push(`/checkout/success?orderId=${order._id}`);
        } else {
            alert(t.orderPlaced);
            router.push('/');
        }
        return;
    }

    if (!stripe || !elements) {
      return;
    }

    const token = localStorage.getItem('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        // 1. Create PaymentIntent
        const res = await fetch(`${API_URL}/payments/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: Math.round(amount * 100) })
        });

        if (!res.ok) throw new Error(t.paymentFailed);
        
        const data = await res.json();
        const clientSecret = data.clientSecret || data.client_secret;

        if (!clientSecret) {
            console.error("Missing client_secret in response", data);
            throw new Error(t.paymentFailed);
        }

        // 2. Confirm Card Payment using Split Elements
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement), 
                billing_details: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    address: {
                        line1: formData.address,
                        city: formData.city,
                        postal_code: formData.zip,
                    }
                },
            },
        });

        if (result.error) {
            // Map generic Stripe errors to user-friendly messages if needed, but Stripe messages are usually okay.
            // The specific "Missing value for stripe.confirmCardPayment intent secret" is a developer error.
            // We should catch that before calling confirmCardPayment if possible, or mask it here.
            if (result.error.message && (result.error.message.includes("Missing value for stripe.confirmCardPayment") || result.error.message.includes("intent secret"))) {
                setError(t.paymentFailed); // "Failed to initialize payment"
            } else {
                setError(result.error.message);
            }
            setProcessing(false);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                // 1. Create Order Record
                const order = await createOrder('paid');

                // Update sold count
                try {
                    await fetch(`${API_URL}/products/update-sold`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': `Bearer ${token}` // If you protect this route
                        },
                        body: JSON.stringify({
                            items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
                        })
                    });
                } catch (updateError) {
                    console.error("Failed to update sold count:", updateError);
                    // We don't block success if this fails, just log it
                }

                clearCart();
                if (order && order._id) {
                    router.push(`/checkout/success?orderId=${order._id}`);
                } else {
                    alert(t.paymentSuccess);
                    router.push('/');
                }
            }
        }
    } catch (err) {
        console.error("Payment error:", err);
        // Check if it's the specific technical error regarding client_secret or intent secret
        if (err.message && (err.message.includes("client_secret") || err.message.includes("intent secret"))) {
             setError(t.paymentFailed);
        } else {
             // Display the actual error message for debugging if possible, or fallback
             setError(err.message || t.paymentFailed);
        }
        setProcessing(false);
    }
  };

  const isDark = mounted && theme === 'dark';
  
  const inputStyle = `w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-transparent text-vintage-cream [&>option]:bg-vintage-dark [&>option]:text-vintage-cream' : 'bg-white text-gray-900'} transition-colors`;
  const errorInputStyle = `border-red-500 focus:ring-red-500`;
  const labelStyle = "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1";
  const errorTextStyle = "text-xs text-red-500 mt-1";

  const elementOptions = {
    showIcon: true,
    style: {
        base: {
            fontSize: '16px',
            color: isDark ? '#fdfbf7' : '#424770',
            '::placeholder': {
                color: isDark ? '#a0aec0' : '#aab7c4',
            },
            iconColor: isDark ? '#fdfbf7' : '#424770',
            backgroundColor: 'transparent',
        },
        invalid: {
            color: '#9e2146',
        },
    },
    disableLink: true, 
  };

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Delivery Method */}
      <section>
          <h2 className="text-lg font-medium text-gray-900 dark:text-vintage-cream mb-4">{t.delivery}</h2>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-300 dark:border-gray-600 ${deliveryMethod === 'ship' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="ship" 
                        checked={deliveryMethod === 'ship'} 
                        onChange={() => setDeliveryMethod('ship')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-vintage-cream">{t.ship}</span>
                  </div>
                  <Truck className="w-5 h-5 text-gray-500" />
              </label>
              <label className={`flex items-center justify-between p-4 cursor-pointer ${deliveryMethod === 'pickup' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="pickup" 
                        checked={deliveryMethod === 'pickup'} 
                        onChange={() => setDeliveryMethod('pickup')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-vintage-cream">{t.pickup}</span>
                  </div>
                  <Store className="w-5 h-5 text-gray-500" />
              </label>
          </div>
      </section>

      {/* Shipping Address */}
      {deliveryMethod === 'ship' && (
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-vintage-cream">{t.shippingAddress}</h2>
            
            {/* Contact Info (Email) */}
            <div>
                <label className={labelStyle}>{t.email}</label>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    onBlur={handleBlur}
                    className={`${inputStyle} ${fieldErrors.email ? errorInputStyle : 'border-gray-300'}`} 
                    placeholder="email@example.com"
                />
                {fieldErrors.email && <p className={errorTextStyle}>{fieldErrors.email}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className={labelStyle}>{t.country}</label>
                    <select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={inputStyle}
                    >
                        {countries.map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelStyle}>{t.firstName}</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                            onBlur={handleBlur}
                            className={`${inputStyle} ${fieldErrors.firstName ? errorInputStyle : 'border-gray-300'}`} 
                        />
                        {fieldErrors.firstName && <p className={errorTextStyle}>{fieldErrors.firstName}</p>}
                    </div>
                    <div>
                        <label className={labelStyle}>{t.lastName}</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                            onBlur={handleBlur}
                            className={`${inputStyle} ${fieldErrors.lastName ? errorInputStyle : 'border-gray-300'}`} 
                        />
                        {fieldErrors.lastName && <p className={errorTextStyle}>{fieldErrors.lastName}</p>}
                    </div>
                </div>
                <div>
                    <label className={labelStyle}>{t.address}</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        onBlur={handleBlur}
                        className={`${inputStyle} ${fieldErrors.address ? errorInputStyle : 'border-gray-300'}`} 
                        placeholder={t.address} 
                    />
                    {fieldErrors.address && <p className={errorTextStyle}>{fieldErrors.address}</p>}
                </div>
                <div>
                    <label className={labelStyle}>{t.apartment}</label>
                    <input type="text" className={`${inputStyle} border-gray-300`} placeholder="" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className={labelStyle}>{t.city}</label>
                        <input 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange} 
                            onBlur={handleBlur}
                            className={`${inputStyle} ${fieldErrors.city ? errorInputStyle : 'border-gray-300'}`} 
                        />
                        {fieldErrors.city && <p className={errorTextStyle}>{fieldErrors.city}</p>}
                    </div>
                    <div className="col-span-1">
                        <label className={labelStyle}>{t.state}</label>
                        {states.length > 0 ? (
                            <select 
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className={`${inputStyle} border-gray-300`}
                            >
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                name="state" 
                                value={formData.state} 
                                onChange={handleInputChange} 
                                className={`${inputStyle} border-gray-300`} 
                            />
                        )}
                    </div>
                    <div className="col-span-1">
                        <label className={labelStyle}>{t.zip}</label>
                        <input 
                            type="text" 
                            name="zip" 
                            value={formData.zip} 
                            onChange={handleInputChange} 
                            onBlur={handleBlur}
                            className={`${inputStyle} ${fieldErrors.zip ? errorInputStyle : 'border-gray-300'}`} 
                        />
                        {fieldErrors.zip && <p className={errorTextStyle}>{fieldErrors.zip}</p>}
                    </div>
                </div>
                <div>
                    <label className={labelStyle}>{t.phone}</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputStyle} placeholder="(555) 555-5555" />
                </div>
            </div>
          </section>
      )}

      {/* Payment */}
      <section>
          <h2 className="text-lg font-medium text-gray-900 dark:text-vintage-cream mb-2">{t.payment}</h2>
          <p className="text-sm text-gray-500 mb-4">{t.secureText}</p>
          
          <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              {/* Credit Card Option */}
              <div>
                  <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-gray-300 dark:border-gray-600 ${paymentMethod === 'credit_card' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="credit_card" 
                            checked={paymentMethod === 'credit_card'} 
                            onChange={() => setPaymentMethod('credit_card')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-vintage-cream">{t.creditCard}</span>
                      </div>
                      <div className="flex gap-1 items-center">
                          <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-full w-full object-contain" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-full w-full object-contain" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-full w-full object-contain" />
                          </div>
                          <div className="bg-gray-100 border border-gray-200 rounded p-0.5 h-6 w-9 flex items-center justify-center text-[10px] font-medium text-gray-600">
                            +3
                          </div>
                      </div>
                  </label>
                  
                  {paymentMethod === 'credit_card' && (
                      <div className="p-4 bg-gray-50 dark:bg-vintage-dark/30 border-b border-gray-300 dark:border-gray-600 space-y-4">
                          <div>
                              <div className={`p-3 border border-gray-300 dark:border-gray-600 rounded-md ${isDark ? 'bg-transparent' : 'bg-white'}`}>
                                  <CardNumberElement options={elementOptions} />
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div className={`p-3 border border-gray-300 dark:border-gray-600 rounded-md ${isDark ? 'bg-transparent' : 'bg-white'}`}>
                                  <CardExpiryElement options={elementOptions} />
                              </div>
                              <div className={`p-3 border border-gray-300 dark:border-gray-600 rounded-md ${isDark ? 'bg-transparent' : 'bg-white'}`}>
                                  <CardCvcElement options={elementOptions} />
                              </div>
                          </div>

                          <input 
                            type="text" 
                            placeholder={t.nameOnCard}
                            className={inputStyle} 
                          />
                          
                          <label className="flex items-center gap-2 mt-2">
                              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{t.sameAddress}</span>
                          </label>
                      </div>
                  )}
              </div>

              {/* Pay At Store Option */}
              {deliveryMethod === 'pickup' && (
                  <div>
                      <label className={`flex items-center justify-between p-4 cursor-pointer ${paymentMethod === 'store' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <div className="flex items-center gap-3">
                              <input 
                                type="radio" 
                                name="payment" 
                                value="store" 
                                checked={paymentMethod === 'store'} 
                                onChange={() => setPaymentMethod('store')}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-900 dark:text-vintage-cream">{t.payAtStore}</span>
                          </div>
                      </label>
                  </div>
              )}
          </div>
      </section>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button 
        disabled={processing || (paymentMethod === 'credit_card' && (!stripe || !elements)) || amount === 0} 
        className="w-full py-4 text-lg font-semibold rounded-md"
      >
        {processing ? t.processing : t.payNow}
      </Button>
    </form>
  );
}
