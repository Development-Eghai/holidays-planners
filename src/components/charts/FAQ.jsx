import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    id: 1,
    question: 'Can I get the refund?',
    answer: 'Phang Nga Bay Sea Cave Canoeing & James Bond Island w/ Buffet Lunch by Big Boat cancellation policy: For a full refund, cancel at least 24 hours in advance of the start date of the experience. Discover and book Phang Nga Bay Sea Cave Canoeing & James Bond Island w/ Buffet Lunch by Big Boat.'
  },
  {
    id: 2,
    question: 'Can I change the travel date?',
    answer: 'Yes, you can change your travel date based on availability. Please contact our support team at least 48 hours before your scheduled trip to modify your booking. Additional charges may apply depending on the new date selected.'
  },
  {
    id: 3,
    question: 'When and where does the tour end?',
    answer: 'The tour typically ends at the original pickup location. The exact timing depends on the specific tour package you\'ve booked. Most tours conclude by early evening, between 5-7 PM. You\'ll receive detailed information about the end time and location in your booking confirmation.'
  }
];

const guidelinesData = [
  {
    id: 1,
    text: 'While applying for a Schengen Visa, your passport should be valid 6 months post the date of travel.'
  },
  {
    id: 2,
    text: 'Your passport should have at least 2 blank pages with all the previous Visa applications through the same passport.'
  },
  {
    id: 3,
    text: 'It is advised to activate an International roaming plan as per the countries you are visiting, before departing from India.'
  },
  {
    id: 4,
    text: 'Currency exchange rates at airports are comparatively higher. Rather exchange your currency from your city in India for better deals. You can also use an International travel card which is widely accepted in Europe.'
  }
];

export default function FAQGuidelines() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* FAQ Section */}
        <div className="mb-16 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block">
              Frequently Asked Questions
              <div className="w-20 h-1 bg-blue-600 mx-auto mt-3"></div>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden opacity-0 animate-slide-up"
                style={{
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        openFaq === faq.id
                          ? 'bg-blue-600 rotate-180'
                          : 'bg-gray-300'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </button>
                
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 bg-blue-600 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Travel Guidelines
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              {guidelinesData.map((guideline, index) => (
                <div
                  key={guideline.id}
                  className="flex gap-4 opacity-0 animate-slide-right"
                  style={{
                    animationDelay: `${600 + index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">
                    {guideline.id}
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1 pt-1">
                    {guideline.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-right {
          animation: slide-right 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}