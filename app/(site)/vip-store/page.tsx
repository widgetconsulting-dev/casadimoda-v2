"use client";

import { useState } from "react";
import { Crown, Mail, Phone, MessageSquare, Send } from "lucide-react";

export default function VipStorePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderType: "existing",
    productName: "",
    quantity: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        orderType: "existing",
        productName: "",
        quantity: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent via-accent/90 to-primary  p-8 md:p-12 mb-12 text-white">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-white  flex items-center justify-center flex-shrink-0">
            <Crown size={32} className="text-accent" />
          </div>
          <div className="flex-grow">
            <h2 className="text-white/80 font-bold uppercase tracking-[0.3em] text-xs mb-3">
              Exclusive Experience
            </h2>
            <h1 className="text-3xl md:text-4xl md:text-5xl font-black tracking-tight mb-6">
              VIP Store
            </h1>
            <p className="text-white/90 max-w-2xl text-sm leading-relaxed mb-6">
              Welcome to our exclusive VIP service. Whether you&apos;re looking
              for a specific product from our collection or seeking something
              truly unique, our dedicated team is here to assist you with
              personalized attention.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm  p-4 border border-white/20">
                <p className="text-white/80 font-black text-xs uppercase tracking-widest mb-2">
                  Personal Concierge
                </p>
                <p className="text-lg font-black">24/7 Support</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm  p-4 border border-white/20">
                <p className="text-white/80 font-black text-xs uppercase tracking-widest mb-2">
                  Custom Orders
                </p>
                <p className="text-lg font-black">Tailored for You</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm  p-4 border border-white/20">
                <p className="text-white/80 font-black text-xs uppercase tracking-widest mb-2">
                  Priority Service
                </p>
                <p className="text-lg font-black">Express Handling</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white  p-8 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-black text-primary mb-6">
            Contact Our VIP Team
          </h2>

          {submitStatus === "success" && (
            <div className="mb-6 bg-green-50 border border-green-200  p-4">
              <p className="text-green-800 font-bold text-sm">
                Thank you! Our VIP team will contact you within 24 hours.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-black uppercase tracking-widest text-text-dark/70 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3  border border-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-black uppercase tracking-widest text-text-dark/70 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3  border border-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-black uppercase tracking-widest text-text-dark/70 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3  border border-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Order Type */}
            <div>
              <label
                htmlFor="orderType"
                className="block text-xs font-black uppercase tracking-widest text-text-dark/70 mb-2"
              >
                Order Type *
              </label>
              <select
                id="orderType"
                name="orderType"
                required
                value={formData.orderType}
                onChange={handleChange}
                className="w-full px-4 py-3  border border-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
              >
                <option value="existing">Existing Product</option>
                <option value="custom">Custom Order</option>
                <option value="inquiry">General Inquiry</option>
                <option value="support">Customer Support</option>
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-xs font-black uppercase tracking-widest text-text-dark/70 mb-2"
              >
                Product Name / Reference
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-4 py-3  border border-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="Product name or SKU"
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-xs font-black uppercase tracking-widest text-text-dark/70 mb-2"
              >
                Quantity Needed
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3  border border-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="1"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs font-black uppercase tracking-widest text-text-dark/70 mb-2"
              >
                Message / Special Requirements *
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3  border border-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                placeholder="Tell us about your requirements, preferences, or any special requests..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white px-8 py-4  font-black uppercase text-xs tracking-[0.2em] hover:bg-primary transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send size={16} />
                  Submit VIP Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Why Choose VIP */}
          <div className="bg-primary  p-8 text-white">
            <h3 className="text-xl font-black mb-6">Why Choose VIP Service?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent  flex items-center justify-center flex-shrink-0 mt-1">
                  <Crown size={16} />
                </div>
                <div>
                  <p className="font-bold mb-1">Priority Access</p>
                  <p className="text-sm text-white/80">
                    Get first access to new collections and exclusive items
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent  flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="font-bold mb-1">Personal Consultation</p>
                  <p className="text-sm text-white/80">
                    Work directly with our experts for tailored recommendations
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent  flex items-center justify-center flex-shrink-0 mt-1">
                  <Send size={16} />
                </div>
                <div>
                  <p className="font-bold mb-1">Custom Solutions</p>
                  <p className="text-sm text-white/80">
                    Special orders, customizations, and bespoke services
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="bg-secondary  p-8">
            <h3 className="text-xl font-black text-primary mb-6">
              Direct Contact
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:vip@casadimoda.com"
                className="flex items-center gap-3 p-4 bg-white  hover:bg-accent hover:text-white transition-all group"
              >
                <div className="w-10 h-10 bg-accent group-hover:bg-white  flex items-center justify-center">
                  <Mail
                    size={20}
                    className="text-white group-hover:text-accent"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-dark/50 group-hover:text-white/70">
                    Email
                  </p>
                  <p className="font-black">vip@casadimoda.com</p>
                </div>
              </a>

              <a
                href="tel:+15550001234"
                className="flex items-center gap-3 p-4 bg-white  hover:bg-accent hover:text-white transition-all group"
              >
                <div className="w-10 h-10 bg-accent group-hover:bg-white  flex items-center justify-center">
                  <Phone
                    size={20}
                    className="text-white group-hover:text-accent"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-dark/50 group-hover:text-white/70">
                    Phone
                  </p>
                  <p className="font-black">+1 (555) 000-1234</p>
                </div>
              </a>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white  p-8 border border-gray-100">
            <h3 className="text-xl font-black text-primary mb-6">
              VIP Service Hours
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-dark/60">Monday - Friday</span>
                <span className="font-black text-primary">
                  9:00 AM - 8:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dark/60">Saturday</span>
                <span className="font-black text-primary">
                  10:00 AM - 6:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dark/60">Sunday</span>
                <span className="font-black text-primary">
                  12:00 PM - 5:00 PM
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-text-dark/50">
                  Emergency support available 24/7 for VIP members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
