import React from 'react';


import img1 from '../assets/gallery1.png';
import img2 from '../assets/gallery2.png';
import img3 from '../assets/gallery3.png';
import img4 from '../assets/gallery4.png';
import img5 from '../assets/gallery5.png';

const images = [
    { src: img1, label: 'Research & Development' },
    { src: img2, label: 'Quality Control Lab' },
    { src: img3, label: 'Pharmaceutical Manufacturing' },
    { src: img4, label: 'Clinical Testing' },
    { src: img5, label: 'Medicine Production' },
];

const ImageGallery = () => {
    return (
        <section className="py-24 bg-primary-light overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent)]" />

            {/* Header */}
            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 text-center mb-14 relative z-10">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">
                    Our Facilities
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                    Where Science Becomes <span className="text-secondary">Medicine</span>
                </h2>
                <p className="text-blue-200/60 max-w-xl mx-auto text-base">
                    A glimpse inside our GMP-certified research and manufacturing facilities.
                </p>
            </div>

            {/* Gallery grid — no rotation, clean hover effects */}
            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((item, index) => (
                        <div
                            key={index}
                            className="relative rounded-2xl overflow-hidden border border-secondary/15 shadow-lg hover:shadow-secondary/25 hover:border-secondary/45 hover:-translate-y-2 transition-all duration-500 group"
                            style={{ aspectRatio: '3/4' }}
                        >
                            <img
                                src={item.src}
                                alt={item.label}
                                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent" />

                            {/* Teal glow on hover */}
                            <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/8 transition-colors duration-300" />

                            {/* Label at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-xs font-semibold text-center leading-tight">
                                    {item.label}
                                </p>
                            </div>

                            {/* Top teal line on hover */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImageGallery;