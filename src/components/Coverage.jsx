// src/components/Coverage.jsx

import { FaShippingFast } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Note: 'leaflet/dist/leaflet.css' must be imported in your main CSS file/entry point

// === Leaflet Icon Fix: Markers Fix করার জন্য এই কোডটি অপরিহার্য ===
import L from 'leaflet';
// Default Leaflet icon doesn't work well with React-Leaflet without this fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
// =================================================================


// ডেমো কভারেজ এরিয়া (আপনার প্রয়োজন অনুযায়ী Coordinates এবং City Name পরিবর্তন করুন)
const coverageAreas = [
    { position: [23.8103, 90.4125], name: "Dhaka Central", popup: "Dhaka: Core Delivery Zone" }, // ঢাকা
    { position: [22.3569, 91.7832], name: "Chittagong Metro", popup: "Chittagong: Key Pickup Area" }, // চট্টগ্রাম
    { position: [24.8949, 91.8687], name: "Sylhet Region", popup: "Sylhet: Expanded Service Area" }, // সিলেট
    { position: [22.8456, 89.5403], name: "Khulna City", popup: "Khulna: New Service Point" }, // খুলনা
];


const Coverage = () => {
    // Initial position set to Dhaka for centering the map
    const initialPosition = [23.8103, 90.4125]; 
    const initialZoom = 7; // একটি বৃহত্তর এলাকা দেখানোর জন্য জুম লেভেল

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900" data-aos="fade-up">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
                    Our Service Coverage
                </h2>
                <p className="mb-10 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    We bring the library to your doorstep in the following major cities:
                </p>

                {/* Map Integration Area */}
                <div 
                    className="w-full h-96 rounded-xl overflow-hidden shadow-2xl mb-8 border border-gray-300 dark:border-gray-700"
                    data-aos="zoom-in"
                >
                    <MapContainer 
                        center={initialPosition} 
                        zoom={initialZoom} 
                        scrollWheelZoom={true} 
                        className="w-full h-full"
                    >
                        {/* OpenStreetMap-এর টাইলস */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* Coverage Area Markers */}
                        {coverageAreas.map((area, index) => (
                            <Marker position={area.position} key={index}>
                                <Popup>
                                    <span className='font-bold text-indigo-600'>{area.name}</span> <br /> 
                                    {area.popup}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div className="flex justify-center items-center gap-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    <FaShippingFast className="text-indigo-500" size={24} />
                    <span>Serving {coverageAreas.length}+ locations, expanding every quarter!</span>
                </div>
            </div>
        </section>
    );
};

export default Coverage;