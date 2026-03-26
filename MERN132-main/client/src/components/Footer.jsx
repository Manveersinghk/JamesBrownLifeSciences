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
                                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <a href="mailto:supportjamesbrown@gmail.com" className="hover:text-secondary transition-colors">
                                    supportjamesbrown@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <a href="tel:+919799832489" className="hover:text-secondary transition-colors">
                                    +91 97998 32489
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 4.97 7 13 7 13s7-8.03 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                                <span>Gandhidham, Gujarat 370201, India</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                <span>Emergency / Orders: <a href="tel:+919799832489" className="text-secondary hover:text-white transition-colors font-semibold">+91 97998 32489</a></span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-blue-300/40">
                        &copy; {new Date().getFullYear()} James Brown Life Sciences. All rights reserved. Gandhidham, Gujarat 370201, India.
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