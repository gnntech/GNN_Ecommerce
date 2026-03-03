import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    user_name: string;
    user_email: string;
    contact_number: string;
    service_interest: string;
    message: string;
}

interface FormErrors {
    user_name?: string;
    user_email?: string;
    contact_number?: string;
    message?: string;
}

const Contact: React.FC = () => {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        user_name: '',
        user_email: '',
        contact_number: '',
        service_interest: '',
        message: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'user_name':
                if (!value.trim()) return 'Full Name is required';
                return undefined;
            case 'user_email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) return 'Email Address is required';
                if (!emailRegex.test(value)) return 'Please enter a valid Email Address';
                return undefined;
            case 'contact_number':
                if (!value.trim()) return 'Phone Number is required';
                const phoneDigits = value.replace(/[\s-]/g, '');
                if (!/^\d+$/.test(phoneDigits)) return 'Please enter a valid Phone Number';
                if (phoneDigits.length !== 10) return 'Phone Number must be exactly 10 digits';
                return undefined;
            case 'message':
                if (!value.trim()) return 'Message is required';
                return undefined;
            default:
                return undefined;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'contact_number') {
            // Allow only numbers and restrict to 10 digits
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));

                if (touched[name]) {
                    const error = validateField(name, numericValue);
                    setErrors(prev => ({ ...prev, [name]: error }));
                }
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const error = validateField(name, name === 'contact_number' ? value.replace(/\D/g, '') : value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(key => {
            if (key === 'service_interest') return; // Optional
            const error = validateField(key, formData[key as keyof FormData]);
            if (error) {
                newErrors[key as keyof FormErrors] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched({
            user_name: true,
            user_email: true,
            contact_number: true,
            message: true
        });

        if (!isValid) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        const templateParams = {
            user_name: formData.user_name,
            user_email: formData.user_email,
            contact_number: formData.contact_number,
            service_interest: formData.service_interest || 'Not Specified',
            message: formData.message,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) // Adding time in IST or local format
        };

        emailjs.send('service_4uqfwwq', 'template_yeei5pj', templateParams, 'OodusXXLW3pgf2OKX')
            .then((result) => {
                console.log(result.text);
                toast.success("Message sent successfully!");
                setLoading(false);
                setFormData({
                    user_name: '',
                    user_email: '',
                    contact_number: '',
                    service_interest: '',
                    message: ''
                });
                setTouched({});
                if (form.current) form.current.reset();
            }, (error) => {
                console.log(error.text);
                toast.error("Failed to send message. Please check console.");
                setLoading(false);
            });
    };

    const formSectionRef = useRef<HTMLDivElement>(null);
    const contactSectionRef = useRef<HTMLDivElement>(null);
    const mapSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)';

        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        const sections = [formSectionRef.current, contactSectionRef.current, mapSectionRef.current];
        sections.forEach((section) => {
            if (section) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(16px)';
                section.style.transition = 'all 700ms cubic-bezier(0.22, 1, 0.36, 1)';
                observer.observe(section);
            }
        });

        const animateFormInputs = () => {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach((input, index) => {
                const element = input as HTMLElement;
                element.style.backgroundSize = '0% 100%';
                element.style.transition = 'background-size 400ms cubic-bezier(0.22, 1, 0.36, 1)';
                setTimeout(() => {
                    element.style.backgroundSize = '100% 100%';
                }, 400 + (index * 80));
            });
        };

        const formObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateFormInputs();
                    formObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (formSectionRef.current) {
            formObserver.observe(formSectionRef.current);
        }

        return () => {
            observer.disconnect();
            formObserver.disconnect();
        };
    }, []);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Navbar />
            {/* Form Section */}
            <section ref={formSectionRef} className="w-full flex flex-col pt-16 lg:pt-20 bg-gradient-to-br from-[#7f1d1d] to-[#b91c1c]">
                <div className="flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 5rem)' }}>
                    {/* Left Side - Background Color */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-hidden isolate bg-transparent">
                        {/* Abstract Blurred Shapes for Visual Depth */}
                        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-red-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#ff7a7a]/15 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full max-w-lg lg:max-w-xl relative z-10 lg:pl-0"
                        >
                            <h2
                                className="text-4xl md:text-5xl lg:text-5xl font-poppins font-bold mb-6 text-center lg:text-left text-[#FACC15] drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                                style={{ lineHeight: '1.25' }}
                            >
                                <span className="block whitespace-nowrap">GUIDED BY NUMBERS,</span>
                                <span className="block whitespace-nowrap">GROUNDED IN MEANING</span>
                            </h2>

                            <p
                                className="font-sans font-normal text-center lg:text-left mx-auto lg:mx-0 text-base md:text-lg text-white/95"
                                style={{
                                    lineHeight: '1.8',
                                    width: '100%',
                                    maxWidth: '440px',
                                    whiteSpace: 'normal',
                                    wordBreak: 'keep-all',
                                    overflowWrap: 'normal',
                                }}
                            >
                                Gaurab Nerpagar Numerologics helps you connect with life's deeper rhythms,
                                offering thoughtful guidance that brings clarity, balance, and harmony to
                                your everyday journey.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-1/2 bg-[#FAFAFA] flex items-center justify-center relative p-6 lg:p-12">
                        <motion.form
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            ref={form}
                            onSubmit={sendEmail}
                            className="w-full max-w-lg px-8 py-10 md:px-10 md:py-12 space-y-6 mx-auto relative z-10 bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100"
                        >
                            <div className="space-y-0.5">
                                <input
                                    type="text"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-[#FCFCFD] border border-gray-200 rounded-[14px] px-4 py-3.5 focus:outline-none focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15 focus:bg-white text-gray-900 text-[15px] font-sans font-medium placeholder-gray-400 transition-all duration-300 ease-in-out ${errors.user_name ? 'border-red-500 ring-[3px] ring-red-500/15 bg-red-50/50' : ''}`}
                                    placeholder="Full Name"
                                />
                                {errors.user_name && <span className="text-red-500 text-xs font-medium block mt-1">{errors.user_name}</span>}
                            </div>

                            <div className="space-y-0.5">
                                <input
                                    type="email"
                                    name="user_email"
                                    value={formData.user_email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-[#FCFCFD] border border-gray-200 rounded-[14px] px-4 py-3.5 focus:outline-none focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15 focus:bg-white text-gray-900 text-[15px] font-sans font-medium placeholder-gray-400 transition-all duration-300 ease-in-out ${errors.user_email ? 'border-red-500 ring-[3px] ring-red-500/15 bg-red-50/50' : ''}`}
                                    placeholder="Email Address"
                                />
                                {errors.user_email && <span className="text-red-500 text-xs font-medium block mt-1">{errors.user_email}</span>}
                            </div>

                            <div className="space-y-0.5">
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className={`w-full bg-[#FCFCFD] border border-gray-200 rounded-[14px] px-4 py-3.5 focus:outline-none focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15 focus:bg-white text-gray-900 text-[15px] font-sans font-medium placeholder-gray-400 transition-all duration-300 ease-in-out ${errors.contact_number ? 'border-red-500 ring-[3px] ring-red-500/15 bg-red-50/50' : ''}`}
                                    placeholder="Phone Number (10 digits)"
                                />
                                {errors.contact_number && <span className="text-red-500 text-xs font-medium block mt-1">{errors.contact_number}</span>}
                            </div>

                            <div className="space-y-0.5 relative">
                                <select
                                    name="service_interest"
                                    value={formData.service_interest}
                                    onChange={handleChange}
                                    className="w-full bg-[#FCFCFD] border border-gray-200 rounded-[14px] px-4 py-3.5 focus:outline-none focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15 focus:bg-white text-gray-900 text-[15px] font-sans font-medium placeholder-gray-400 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                                >
                                    <option value="" disabled>Select Service Interest</option>
                                    <option value="Numerology">Numerology</option>
                                    <option value="Wealth Astrology">Wealth Astrology</option>
                                    <option value="Life Guidance">Life Guidance</option>
                                    <option value="Career Guidance">Career Guidance</option>
                                    <option value="Astrology">Astrology</option>
                                </select>
                                <div className="absolute right-4 top-[50%] -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </div>


                            <div className="pt-4 space-y-0.5">
                                <textarea
                                    rows={4}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-[#FCFCFD] border border-gray-200 rounded-[14px] px-4 py-3.5 focus:outline-none focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15 focus:bg-white resize-none text-gray-900 text-[15px] font-sans font-medium placeholder-gray-400 transition-all duration-300 ease-in-out ${errors.message ? 'border-red-500 ring-[3px] ring-red-500/15 bg-red-50/50' : ''}`}
                                    style={{ transform: 'none' }}
                                    placeholder="Message"
                                />
                                {errors.message && <span className="text-red-500 text-xs font-medium block mt-1">{errors.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white text-[15px] font-sans font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-[2px] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none tracking-wide mt-2"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <section ref={contactSectionRef} className="w-full bg-white flex flex-col h-[calc(100vh-4rem)] lg:h-[115vh]">
                <div className="w-full max-w-6xl mx-auto px-6 flex flex-col h-full py-10">
                    {/* Contact Cards */}
                    <div className="bg-[#9B2533] rounded-2xl p-4 flex-[0.45] lg:flex-[0.4] flex items-center shadow-lg">
                        <div className="w-full max-w-4xl mx-auto">
                            {/* Email */}
                            <div className="contact-row flex items-center space-x-2 sm:space-x-3 pb-2 sm:pb-3 border-b border-[#FFFAE5]/40">
                                <a
                                    href="mailto:consult@numerologyinsights.com"
                                    className="contact-icon w-10 h-10 sm:w-12 sm:h-12 bg-[#FFFAE5]/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#FFFAE5]/15 transition-colors duration-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFFAE5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </a>
                                <div className="flex-1 text-left">
                                    <a href="mailto:consult@numerologyinsights.com" className="block w-full">
                                        <h3
                                            className="text-sm sm:text-base font-matter font-semibold uppercase text-[#FACC15] tracking-widest mb-0 cursor-pointer"
                                            style={{ lineHeight: '30px', letterSpacing: '-0.01em', marginBottom: '-8px' }}
                                        >
                                            EMAIL
                                        </h3>
                                    </a>
                                    <a
                                        href="mailto:consult@numerologyinsights.com"
                                        className="text-xs sm:text-sm font-matter font-medium text-[#FFFAE5] cursor-pointer"
                                    >
                                        consult@numerologyinsights.com
                                    </a>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="contact-row flex items-center space-x-2 sm:space-x-3 py-2 sm:py-3 border-b border-[#FFFAE5]/40">
                                <a
                                    href="tel:+91980000000"
                                    className="contact-icon w-10 h-10 sm:w-12 sm:h-12 bg-[#FFFAE5]/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#FFFAE5]/15 transition-colors duration-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFFAE5]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </a>
                                <div className="flex-1 text-left">
                                    <a href="tel:+91980000000" className="block w-full">
                                        <h3
                                            className="text-sm sm:text-base font-matter font-semibold uppercase text-[#FACC15] tracking-widest mb-0 cursor-pointer"
                                            style={{ lineHeight: '30px', letterSpacing: '-0.01em', marginBottom: '-8px' }}
                                        >
                                            WHATSAPP
                                        </h3>
                                    </a>
                                    <a
                                        href="tel:+91980000000"
                                        className="text-xs sm:text-sm font-matter font-medium text-[#FFFAE5] cursor-pointer"
                                    >
                                        +91 98XXX XXXXX
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="contact-row flex items-center space-x-2 sm:space-x-3 pt-2 sm:pt-3">
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-icon w-10 h-10 sm:w-12 sm:h-12 bg-[#FFFAE5]/10 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#FFFAE5]/15 transition-colors duration-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFFAE5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </a>
                                <div className="flex-1 text-left">
                                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="block w-full">
                                        <h3
                                            className="text-sm sm:text-base font-matter font-semibold uppercase text-[#FACC15] tracking-widest mb-0 cursor-pointer"
                                            style={{ lineHeight: '30px', letterSpacing: '-0.01em', marginBottom: '-8px' }}
                                        >
                                            LOCATION
                                        </h3>
                                    </a>
                                    <a
                                        href="https://maps.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs sm:text-sm font-matter font-medium text-[#FFFAE5] cursor-pointer"
                                    >
                                        Available Worldwide via Video Consultation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-8 lg:h-10"></div>

                    {/* Map Section */}
                    <div ref={mapSectionRef} className="rounded-2xl overflow-hidden flex-[0.55] lg:flex-[0.6] flex items-center">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.6!2d72.8777!3d19.0761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edec%3A0xf58055b4bf4d4343!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin&t=k"
                            width="100%"
                            height="100%"
                            style={{ border: 0, pointerEvents: 'auto' }}
                            allowFullScreen
                            loading="lazy"
                            title="Google Maps Location"
                            className="rounded-2xl"
                            referrerPolicy="no-referrer-when-downgrade"
                            allow="clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                        ></iframe>
                    </div>
                </div>
            </section >

            <Footer />
        </>
    );
};

export default Contact;