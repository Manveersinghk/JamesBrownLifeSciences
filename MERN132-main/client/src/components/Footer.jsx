const Footer = () => {
    return (
        <footer className="bg-primary text-white py-12 mt-auto border-t border-primary-light">
            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid md:grid-cols-4 gap-8 mb-8">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-light to-primary-dark border border-secondary/30 rounded-lg flex items-center justify-center">
                                <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                                    <path d="M8 3C8 3 10 6 13 6C16 6 18 3 18 3" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round"/>
                                    <path d="M8 23C8 23 10 20 13 20C16 20 18 23 18 23" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
                                    <path d="M9.5 3.5 C7 7 7 10 9.5 13 C12 16 12 19 9.5 22.5" stroke="#0EA5E9" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                                    <path d="M16.5 3.5 C19 7 19 10 16.5 13 C14 16 14 19 16.5 22.5" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                                    <line x1="9" y1="7.5" x2="17" y2="7.5" stroke="rgba(14,165,233,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                                    <line x1="8.2" y1="11" x2="17.8" y2="11" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                                    <line x1="8.2" y1="15" x2="17.8" y2="15" stroke="rgba(14,165,233,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                                    <line x1="9" y1="18.5" x2="17" y2="18.5" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold leading-tight">James Brown</h3>
                                <p className="text-secondary text-xs font-semibold tracking-[0.15em] uppercase -mt-0.5">Life Sciences</p>
                            </div>
                        </div>
                        <p className="text-blue-200/60 text-sm max-w-sm leading-relaxed">
                            Manufacturing and supplying pharmaceutical-grade medicines to healthcare providers and patients across 50+ countries — with safety, efficacy, and integrity at the core of everything we do.
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="bg-secondary/10 border border-secondary/20 text-secondary text-xs px-3 py-1 rounded-full font-semibold">WHO-GMP</span>
                            <span className="bg-secondary/10 border border-secondary/20 text-secondary text-xs px-3 py-1 rounded-full font-semibold">ISO 9001</span>
                            <span className="bg-secondary/10 border border-secondary/20 text-secondary text-xs px-3 py-1 rounded-full font-semibold">EU GMP</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-base mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-blue-200/60">
                            <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
                            <li><a href="/about" className="hover:text-secondary transition-colors">About Us</a></li>
                            <li><a href="/products" className="hover:text-secondary transition-colors">Our Medicines</a></li>
                            <li><a href="/careers" className="hover:text-secondary transition-colors">Careers</a></li>
                            <li><a href="/contact" className="hover:text-secondary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-base mb-4 text-white">Contact</h4>
                        <ul className="space-y-3 text-sm text-blue-200/60">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">📧</span>
                                <a href="mailto:dbsingh490@rediffmail.com" className="hover:text-secondary transition-colors">
                                    dbsingh490@rediffmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">📞</span>
                                <a href="tel:+919799832489" className="hover:text-secondary transition-colors">
                                    +91 97998 32489
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">📍</span>
                                <span>Khatipura, Jaipur, Rajasthan 302012, India</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">🚨</span>
                                <span>Emergency / Orders: <a href="tel:+919799832489" className="text-secondary hover:text-white transition-colors font-semibold">+91 97998 32489</a></span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-blue-300/40">
                        &copy; {new Date().getFullYear()} James Brown Life Sciences. All rights reserved. Khatipura, Jaipur, Rajasthan 302012, India.
                    </p>
                    <div className="flex space-x-6 text-xs text-blue-300/40">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Regulatory Info</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;