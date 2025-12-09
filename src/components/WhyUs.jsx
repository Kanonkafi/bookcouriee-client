// src/components/WhyUs.jsx
import { FaBookReader, FaRocket, FaHandshake } from "react-icons/fa";

const features = [
    { 
        icon: FaBookReader, 
        title: "Vast Collection Access", 
        description: "Easily borrow from multiple regional libraries in one place." 
    },
    { 
        icon: FaRocket, 
        title: "Optimized Delivery Speed", 
        description: "Our courier system ensures your requested books arrive quickly." 
    },
    { 
        icon: FaHandshake, 
        title: "Hassle-Free Logistics", 
        description: "We manage pickup and return logistics completely stress-free." 
    },
];

const WhyUs = () => {
    return (
        <section className="py-16 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white tracking-tight">
                    Why Choose BookCourier?
                </h2>
                <p className="text-center mb-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    We redefine convenience in the world of borrowing and reading.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            // Gradient Border + Professional Hover
                            className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl transition-all duration-500 
                                       border-t-4 border-indigo-500 dark:border-purple-500 
                                       hover:shadow-indigo-500/30 hover:-translate-y-2 hover:border-r-4"
                            data-aos="fade-up" // AOS
                            data-aos-delay={index * 150}
                        >
                            <feature.icon className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold dark:text-white">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;