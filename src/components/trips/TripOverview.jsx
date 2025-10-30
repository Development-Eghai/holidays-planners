import { MapPin, Clock } from 'lucide-react';

// Trip overview data - replace with your actual data
const tripOverviewData = {
  'jibhi': {
    title: '3 Days Jibhi & Tirthan Valley',
    pickup: 'Delhi',
    drop: 'Delhi',
    duration: '3D - 2N'
  },
  'kasol': {
    title: '3 Days Kasol Kheerganga Trek',
    pickup: 'Delhi',
    drop: 'Delhi',
    duration: '3D - 2N'
  },
  'romantic-paris-getaway': {
    title: '3 Days Romantic Paris Getaway',
    pickup: 'Delhi',
    drop: 'Mumbai',
    duration: '3D - 2N'
  },
  'chopta': {
    title: '3 Days Chopta-Tungnath-Deoriatal',
    pickup: 'Delhi',
    drop: 'Delhi',
    duration: '3D - 2N'
  },
  'yulia': {
    title: '3 Days Yulia Kanda Trek',
    pickup: 'Chandigarh',
    drop: 'Chandigarh',
    duration: '3D - 2N'
  },
  'hampta': {
    title: '5 Days Hampta Pass Trek',
    pickup: 'Manali',
    drop: 'Manali',
    duration: '5D - 4N'
  },
  'kedarkantha': {
    title: '6 Days Kedarkantha Trek',
    pickup: 'Dehradun',
    drop: 'Dehradun',
    duration: '6D - 5N'
  },
  'valley': {
    title: '7 Days Valley of Flowers',
    pickup: 'Haridwar',
    drop: 'Haridwar',
    duration: '7D - 6N'
  },
  'triund': {
    title: '2 Days Triund Trek',
    pickup: 'Dharamshala',
    drop: 'Dharamshala',
    duration: '2D - 1N'
  },
  'frozen-spiti': {
    title: '3 Days Frozen Spiti Trek',
    pickup: 'Delhi',
    drop: 'Delhi',
    duration: '3D - 2N'
  }
};

export default function TripOverview({ tripId = 'jibhi' }) {
  const trip = tripOverviewData[tripId] || tripOverviewData['jibhi'];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Title with animation */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {trip.title}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          {/* Pickup & Drop Card */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 animate-slide-in-left hover:-translate-y-2">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">Pickup & Drop</p>
                <p className="text-lg font-bold text-gray-900">
                  {trip.pickup} - {trip.drop}
                </p>
              </div>
            </div>
          </div>

          {/* Duration Card */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 animate-slide-in-right hover:-translate-y-2">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">Duration</p>
                <p className="text-lg font-bold text-gray-900">
                  {trip.duration}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out 0.2s backwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 0.4s backwards;
        }
      `}</style>
    </section>
  );
}