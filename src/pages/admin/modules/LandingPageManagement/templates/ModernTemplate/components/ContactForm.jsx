import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, Gift, User, Calendar, Users, Star, FileText, Plane, CheckSquare, Sparkles, PhoneCall } from 'lucide-react';
import { toast, Toaster } from "sonner";

const API_BASE_URL = 'https://api.yaadigo.com/secure/api';
const API_KEY = 'x8oxPBLwLyfyREmFRmCkATEGG1PWnp37_nVhGatKwlQ';
const DEFAULT_DOMAIN = 'https://www.holidaysplanners.com';

export default function ContactForm({ settings, primaryColor, secondaryColor, selectedTrips = [] }) {
    const [formData, setFormData] = useState({
        destination: '',
        departure_city: '',
        travel_date: '',
        adults: 2,
        hotel_category: 'Budget',
        full_name: '',
        contact_number: '',
        email: '',
        additional_comments: '',
        domain_name: DEFAULT_DOMAIN
    });
    
    const [isFlexibleDate, setIsFlexibleDate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCustomDestination, setShowCustomDestination] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // If destination dropdown changes to "other", show custom input
        if (name === 'destination') {
            if (value === 'other_custom') {
                setShowCustomDestination(true);
                setFormData(prev => ({ ...prev, [name]: '' }));
                return;
            } else {
                setShowCustomDestination(false);
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const finalDepartureCity = formData.departure_city.trim() !== "" 
            ? formData.departure_city 
            : "lead from landing page";

        let finalComments = formData.additional_comments;
        let finalDate = formData.travel_date;

        if (isFlexibleDate) {
            finalComments = `(Flexible Travel Dates) ${finalComments}`;
            if (!finalDate) finalDate = new Date().toISOString().split('T')[0]; 
        }

        const payload = {
            ...formData,
            departure_city: finalDepartureCity,
            additional_comments: finalComments,
            travel_date: finalDate
        };

        try {
            const response = await fetch(`${API_BASE_URL}/enquires`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to submit enquiry');
            }

            setShowSuccess(true);
            toast.success("We'll contact you within 24 hours with an exclusive offer!");

        } catch (error) {
            console.error('Error submitting enquiry:', error);
            toast.error('Failed to submit enquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setShowSuccess(false);
        setIsFlexibleDate(false);
        setShowCustomDestination(false);
        setFormData({
            destination: '',
            departure_city: '',
            travel_date: '',
            adults: 2,
            hotel_category: 'Budget',
            full_name: '',
            contact_number: '',
            email: '',
            additional_comments: '',
            domain_name: DEFAULT_DOMAIN
        });
    };

    // Get company details with fallbacks
    const companyName = settings?.name || 'Holidays Planners';
    const companyPhone = settings?.contact || '+91 98765 43210';
    const companyEmail = 'info@holidaysplanners.com'; // Fixed email
    const companyAddress = 'Kapil Niwas Bye Pass Road Chakkar, Shimla, H.P. (171005)';
    const companyAddressLink = 'https://maps.app.goo.gl/pkCAr39eBtwqskYs7';

    return (
        <>
            <Toaster richColors position="top-center" />
            
            <section id="contact" className="py-24 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}05, ${secondaryColor}05)`
                }}
            >
                {/* Background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full filter blur-3xl" 
                        style={{ backgroundColor: primaryColor }} />
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full filter blur-3xl" 
                        style={{ backgroundColor: secondaryColor }} />
                </div>
                
                {/* Floating shapes */}
                <motion.div
                    animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, 0] 
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-40 right-20 w-32 h-32 opacity-5"
                    style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', backgroundColor: primaryColor }}
                />
                <motion.div
                    animate={{ 
                        y: [0, 20, 0],
                        rotate: [0, -5, 0] 
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute bottom-40 left-20 w-40 h-40 opacity-5"
                    style={{ borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%', backgroundColor: secondaryColor }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left side - Company Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <motion.div 
                                initial={{ scale: 0.9 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                                style={{
                                    backgroundColor: `${primaryColor}20`,
                                    color: primaryColor
                                }}
                            >
                                <Gift className="w-4 h-4" />
                                <span className="text-sm font-semibold">Get Special Discount on First Booking!</span>
                            </motion.div>

                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                                Ready for Your
                                <span 
                                    className="block bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                                    }}
                                >
                                    Dream Vacation?
                                </span>
                            </h2>

                            <p className="text-xl text-slate-700 mb-10 leading-relaxed">
                                Get in touch with our travel experts and receive a personalized itinerary 
                                crafted just for you. Plus, mention this form for an exclusive discount!
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: Phone, label: 'Call Us', value: companyPhone, highlight: '24/7 Support', isLink: false },
                                    { icon: Mail, label: 'Email', value: companyEmail, highlight: 'Quick Response', isLink: false },
                                    { icon: MapPin, label: 'Office', value: companyAddress, highlight: 'Get Directions', isLink: true, link: companyAddressLink },
                                    { icon: Clock, label: 'Response Time', value: 'Within 2 hours', highlight: 'Guaranteed', isLink: false }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-4 group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
                                        onClick={item.isLink ? () => window.open(item.link, '_blank') : undefined}
                                        style={{ cursor: item.isLink ? 'pointer' : 'default' }}
                                    >
                                        <div 
                                            className="p-3 rounded-xl transition-all"
                                            style={{
                                                background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`
                                            }}
                                        >
                                            <item.icon className="w-6 h-6" style={{ color: primaryColor }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-500">{item.label}</div>
                                            <div className={`text-slate-900 font-semibold ${item.isLink ? 'hover:underline' : ''}`}>
                                                {item.value}
                                            </div>
                                        </div>
                                        <span 
                                            className="text-xs px-3 py-1 rounded-full font-medium"
                                            style={{
                                                backgroundColor: `${secondaryColor}20`,
                                                color: secondaryColor
                                            }}
                                        >
                                            {item.highlight}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right side - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {!showSuccess ? (
                                <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-slate-100">
                                    <div className="text-center mb-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                                            }}
                                        >
                                            <Send className="w-7 h-7 text-white" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            Get Your Free Quote
                                        </h3>
                                        <p className="text-slate-600 text-sm">
                                            Fill out the form and get an exclusive offer within 2 hours!
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        
                                        {/* Destination */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="destination" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                <MapPin className="w-3.5 h-3.5" /> Destination *
                                            </Label>
                                            {!showCustomDestination ? (
                                                selectedTrips && selectedTrips.length > 0 ? (
                                                    <select
                                                        id="destination"
                                                        name="destination"
                                                        value={formData.destination}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full h-11 px-3 rounded-xl border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                                    >
                                                        <option value="">Select a destination</option>
                                                        {selectedTrips.map((trip, index) => (
                                                            <option key={index} value={trip.trip_title || trip.custom_title}>
                                                                {trip.trip_title || trip.custom_title}
                                                            </option>
                                                        ))}
                                                        <option value="other_custom">Other / Custom Destination</option>
                                                    </select>
                                                ) : (
                                                    <Input
                                                        id="destination"
                                                        name="destination"
                                                        value={formData.destination}
                                                        onChange={handleChange}
                                                        placeholder="Enter your Dream Destination. Eg: Manali"
                                                        required
                                                        className="h-11 rounded-xl border-2 border-slate-200 focus:border-slate-400 text-sm"
                                                    />
                                                )
                                            ) : (
                                                <div className="space-y-2">
                                                    <Input
                                                        id="destination"
                                                        name="destination"
                                                        value={formData.destination}
                                                        onChange={handleChange}
                                                        placeholder="Enter your custom destination"
                                                        required
                                                        className="h-11 rounded-xl border-2 border-slate-200 focus:border-slate-400 text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowCustomDestination(false);
                                                            setFormData(prev => ({ ...prev, destination: '' }));
                                                        }}
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        ← Back to destination list
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Travel Date & Adults */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="travel_date" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                    <Calendar className="w-3.5 h-3.5" /> Travel Date *
                                                </Label>
                                                <Input
                                                    id="travel_date"
                                                    type="date"
                                                    name="travel_date"
                                                    value={formData.travel_date}
                                                    onChange={handleChange}
                                                    disabled={isFlexibleDate}
                                                    required={!isFlexibleDate}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className={`h-11 rounded-xl border-2 text-sm transition-colors ${isFlexibleDate ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-200 focus:border-slate-400'}`}
                                                />
                                                <div className="flex items-center gap-1.5 mt-1.5 cursor-pointer" onClick={() => setIsFlexibleDate(!isFlexibleDate)}>
                                                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isFlexibleDate ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-slate-300 bg-white'}`}>
                                                        {isFlexibleDate && <CheckSquare className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span className="text-xs text-slate-600 select-none">
                                                        Flexible dates
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="adults" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                    <Users className="w-3.5 h-3.5" /> Adults *
                                                </Label>
                                                <Input
                                                    id="adults"
                                                    type="number"
                                                    name="adults"
                                                    value={formData.adults}
                                                    onChange={handleChange}
                                                    min="1"
                                                    required
                                                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-slate-400 text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Hotel Category & Travel From */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="hotel_category" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                    <Star className="w-3.5 h-3.5" /> Hotel *
                                                </Label>
                                                <select
                                                    id="hotel_category"
                                                    name="hotel_category"
                                                    value={formData.hotel_category}
                                                    onChange={handleChange}
                                                    className="w-full h-11 px-3 rounded-xl border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                                    required
                                                >
                                                    <option>Budget</option>
                                                    <option>3 Star</option>
                                                    <option>4 Star</option>
                                                    <option>5 Star</option>
                                                    <option>Luxury</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="departure_city" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                    <Plane className="w-3.5 h-3.5" /> Travel From
                                                </Label>
                                                <Input
                                                    id="departure_city"
                                                    name="departure_city"
                                                    value={formData.departure_city}
                                                    onChange={handleChange}
                                                    placeholder="City (Optional)"
                                                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-slate-400 text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Full Name & Phone */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="full_name" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                    <User className="w-3.5 h-3.5" /> Full Name *
                                                </Label>
                                                <Input
                                                    id="full_name"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleChange}
                                                    placeholder="Your Name"
                                                    required
                                                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-slate-400 text-sm"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="contact_number" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                    <Phone className="w-3.5 h-3.5" /> Phone *
                                                </Label>
                                                <Input
                                                    id="contact_number"
                                                    type="tel"
                                                    name="contact_number"
                                                    value={formData.contact_number}
                                                    onChange={handleChange}
                                                    placeholder="+91 98765 43210"
                                                    required
                                                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-slate-400 text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                <Mail className="w-3.5 h-3.5" /> Email Address *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@example.com"
                                                required
                                                className="h-11 rounded-xl border-2 border-slate-200 focus:border-slate-400 text-sm"
                                            />
                                        </div>

                                        {/* Additional Requirements */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="additional_comments" className="text-slate-700 font-semibold flex items-center gap-1 text-sm">
                                                <FileText className="w-3.5 h-3.5" /> Additional Requirements
                                            </Label>
                                            <textarea
                                                id="additional_comments"
                                                name="additional_comments"
                                                value={formData.additional_comments}
                                                onChange={handleChange}
                                                placeholder="Any specific preferences? (Optional)"
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full text-white rounded-full py-6 text-base font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all"
                                            style={{
                                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                            ) : (
                                                <>
                                                    Get Special Discount
                                                    <Send className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="flex items-center justify-center gap-4 text-center text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                <span>Secure & Private</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                <span>No Spam</span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white rounded-3xl p-12 shadow-2xl text-center border-2 border-slate-100"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                                        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                                        style={{
                                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                                        }}
                                    >
                                        <PhoneCall className="w-12 h-12 text-white" />
                                    </motion.div>
                                    
                                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                                        Thank you, {formData.full_name.split(' ')[0]}! <Sparkles className="w-6 h-6 text-yellow-500 inline" />
                                    </h3>
                                    
                                    <p className="text-lg text-slate-500 font-medium mb-1">
                                        We have received your request for <span style={{ color: primaryColor }} className="font-bold">{formData.destination}</span>.
                                    </p>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-orange-50 border border-orange-100 rounded-xl p-6 mt-6"
                                    >
                                        <p className="text-xl font-bold text-slate-700 leading-relaxed">
                                            "Your dream trip is just a call away!" ✈️
                                        </p>
                                        <p className="text-sm text-slate-500 mt-2">
                                            Our travel expert will contact you within 2 hours with your personalized quote!
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-8"
                                    >
                                        <Button 
                                            onClick={resetForm}
                                            className="w-full text-white py-6 text-lg rounded-full font-bold shadow-lg transition-transform hover:scale-[1.02]"
                                            style={{
                                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                                            }}
                                        >
                                            Awesome, I'll be waiting!
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}