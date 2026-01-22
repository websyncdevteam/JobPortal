// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { 
  Shield, Lock, Eye, EyeOff, Database, Users, 
  FileText, CheckCircle, XCircle, AlertCircle,
  Mail, Phone, MapPin, Calendar, Download,
  ArrowRight, ChevronRight, ShieldCheck, Key
} from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const PrivacyPolicy = () => {
  // Brand colors
  const colors = {
    deepBlue: '#13419E',
    skyBlue: '#72BBE8',
    red: '#FE0303',
    lightBlue: '#CCE4F4',
    cyanBlue: '#119FE6'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white">
      {/* Include Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
           style={{ 
             background: `linear-gradient(135deg, ${colors.deepBlue} 0%, ${colors.cyanBlue} 100%)`
           }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, ${colors.lightBlue} 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Your Privacy. Our Priority. Simple and Transparent.
            </p>
            
            <div className="inline-flex items-center text-white/80 text-lg">
              <span>Last Updated:</span>
              <Calendar className="w-5 h-5 mx-2" />
              <span className="font-semibold">December 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Quick Navigation */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.deepBlue }}>
              Quick Navigation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Database, label: 'Data We Collect', link: '#data-collection' },
                { icon: ShieldCheck, label: 'How We Use It', link: '#data-usage' },
                { icon: Lock, label: 'Data Protection', link: '#data-protection' },
                { icon: Users, label: 'Your Rights', link: '#your-rights' }
              ].map((nav, index) => (
                <a 
                  key={index}
                  href={nav.link}
                  className="group flex items-center p-4 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"
                       style={{ backgroundColor: `${colors.deepBlue}15` }}>
                    <nav.icon className="w-5 h-5" style={{ color: colors.deepBlue }} />
                  </div>
                  <div className="font-medium text-gray-800 group-hover:text-gray-900">
                    {nav.label}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Key Principles */}
          <div className="mb-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.deepBlue }}>
              Our Privacy Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'Transparency',
                  description: 'We clearly explain what data we collect and why',
                  color: colors.deepBlue
                },
                {
                  icon: Lock,
                  title: 'Security',
                  description: 'Your data is protected with enterprise-grade security',
                  color: colors.red
                },
                {
                  icon: Eye,
                  title: 'Control',
                  description: 'You have complete control over your personal information',
                  color: colors.cyanBlue
                },
                {
                  icon: XCircle,
                  title: 'No Hidden Agenda',
                  description: 'We never sell your data to third parties',
                  color: colors.skyBlue
                }
              ].map((principle, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                         style={{ backgroundColor: `${principle.color}15` }}>
                      <principle.icon className="w-5 h-5" style={{ color: principle.color }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{principle.title}</h3>
                    <p className="text-gray-600">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Policy Content */}
          <div className="space-y-16">
            {/* Section 1: Introduction */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 rounded-full mr-4" style={{ backgroundColor: colors.deepBlue }}></div>
                <h2 className="text-3xl font-bold" style={{ color: colors.deepBlue }}>Introduction</h2>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Welcome to AIM9HIRE's Privacy Policy. This document explains how we collect, use, disclose, and safeguard your information when you use our platform. We're committed to protecting your privacy and being transparent about our practices.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using AIM9HIRE, you trust us with your information. We take that responsibility seriously and are committed to protecting your privacy rights. This policy complies with applicable Indian data protection laws and international privacy standards.
                </p>
              </div>
            </section>

            {/* Section 2: Data Collection */}
            <section id="data-collection">
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 rounded-full mr-4" style={{ backgroundColor: colors.red }}></div>
                <h2 className="text-3xl font-bold" style={{ color: colors.red }}>What Data We Collect</h2>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ color: colors.deepBlue }}>Information You Provide</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Users, text: 'Personal details (name, email, phone)', required: true },
                    { icon: FileText, text: 'Professional information (resume, skills)', required: true },
                    { icon: Mail, text: 'Communication preferences', required: false },
                    { icon: Key, text: 'Account credentials', required: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-4 rounded-lg border border-gray-200 bg-white/50">
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: colors.deepBlue }} />
                      <span className="text-gray-700">{item.text}</span>
                      <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${item.required ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {item.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: colors.deepBlue }}>Information We Collect Automatically</h3>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { title: 'Usage Data', desc: 'How you interact with our platform' },
                      { title: 'Device Info', desc: 'Browser type, operating system' },
                      { title: 'Log Data', desc: 'IP address, access times, pages viewed' }
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-semibold mb-2" style={{ color: colors.deepBlue }}>{item.title}</div>
                        <div className="text-gray-600 text-sm">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: How We Use Your Data */}
            <section id="data-usage">
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 rounded-full mr-4" style={{ backgroundColor: colors.cyanBlue }}></div>
                <h2 className="text-3xl font-bold" style={{ color: colors.cyanBlue }}>How We Use Your Information</h2>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Job Matching',
                      description: 'Connect you with relevant opportunities using smart algorithms',
                      icon: Users,
                      color: colors.deepBlue
                    },
                    {
                      title: 'Account Management',
                      description: 'Create and maintain your secure AIM9HIRE account',
                      icon: ShieldCheck,
                      color: colors.red
                    },
                    {
                      title: 'Communication',
                      description: 'Send important updates about your applications and opportunities',
                      icon: Mail,
                      color: colors.cyanBlue
                    },
                    {
                      title: 'Platform Improvement',
                      description: 'Analyze usage patterns to enhance your experience',
                      icon: Database,
                      color: colors.skyBlue
                    },
                    {
                      title: 'Security & Safety',
                      description: 'Protect our platform and users from fraud and abuse',
                      icon: Lock,
                      color: colors.deepBlue
                    },
                    {
                      title: 'Legal Compliance',
                      description: 'Meet our legal obligations and respond to lawful requests',
                      icon: FileText,
                      color: colors.red
                    }
                  ].map((use, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: `${use.color}15` }}>
                          <use.icon className="w-6 h-6" style={{ color: use.color }} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{use.title}</h3>
                        <p className="text-gray-600">{use.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What We Don't Do */}
              <div className="mt-8 p-6 rounded-xl border-2 border-red-100 bg-red-50">
                <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: colors.red }}>
                  <XCircle className="w-6 h-6 mr-2" />
                  What We Never Do
                </h3>
                <div className="space-y-3">
                  {[
                    'Sell your personal data to advertisers or third parties',
                    'Use your data for purposes unrelated to job seeking or recruitment',
                    'Share your contact information with companies without your consent',
                    'Track you across other websites for advertising purposes',
                    'Keep your data longer than necessary for our services'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <XCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: colors.red }} />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4: Data Protection */}
            <section id="data-protection">
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 rounded-full mr-4" style={{ backgroundColor: colors.skyBlue }}></div>
                <h2 className="text-3xl font-bold" style={{ color: colors.skyBlue }}>How We Protect Your Data</h2>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Lock,
                      title: 'Encryption',
                      description: 'All data is encrypted both in transit and at rest',
                      percent: '100%'
                    },
                    {
                      icon: Shield,
                      title: 'Access Control',
                      description: 'Strict role-based access to sensitive information',
                      percent: '24/7'
                    },
                    {
                      icon: EyeOff,
                      title: 'Anonymization',
                      description: 'Personal data is anonymized for analytics',
                      percent: 'Always'
                    }
                  ].map((protection, index) => (
                    <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto"
                           style={{ backgroundColor: `${colors.deepBlue}15` }}>
                        <protection.icon className="w-8 h-8" style={{ color: colors.deepBlue }} />
                      </div>
                      <div className="text-2xl font-bold mb-2" style={{ color: colors.deepBlue }}>
                        {protection.percent}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{protection.title}</h3>
                      <p className="text-gray-600 text-sm">{protection.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.deepBlue }}>Security Certifications</h3>
                  <div className="flex flex-wrap gap-4">
                    {['ISO 27001', 'GDPR Compliant', 'Indian IT Act Compliance', 'SOC 2 Type II'].map((cert, index) => (
                      <div key={index} className="px-4 py-2 rounded-full bg-green-50 border border-green-100">
                        <span className="text-green-700 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Cookies */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 rounded-full mr-4" style={{ backgroundColor: colors.deepBlue }}></div>
                <h2 className="text-3xl font-bold" style={{ color: colors.deepBlue }}>Cookies & Tracking</h2>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience on AIM9HIRE. Here's what you need to know:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">Purpose</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">Duration</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">Essential</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        {
                          type: 'Session Cookies',
                          purpose: 'Keep you logged in during your visit',
                          duration: 'Session',
                          essential: 'Yes'
                        },
                        {
                          type: 'Preference Cookies',
                          purpose: 'Remember your settings and preferences',
                          duration: '30 days',
                          essential: 'No'
                        },
                        {
                          type: 'Analytics Cookies',
                          purpose: 'Help us improve the platform',
                          duration: '2 years',
                          essential: 'No'
                        },
                        {
                          type: 'Security Cookies',
                          purpose: 'Protect your account from unauthorized access',
                          duration: 'Session',
                          essential: 'Yes'
                        }
                      ].map((cookie, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{cookie.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cookie.purpose}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cookie.duration}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cookie.essential === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {cookie.essential}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-700 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    You can control cookies through your browser settings. However, disabling essential cookies may affect platform functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Your Rights */}
            <section id="your-rights">
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 rounded-full mr-4" style={{ backgroundColor: colors.red }}></div>
                <h2 className="text-3xl font-bold" style={{ color: colors.red }}>Your Privacy Rights</h2>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  You have important rights regarding your personal data. Here's how you can exercise them:
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Right to Access',
                      description: 'Request a copy of all personal data we have about you',
                      action: 'Download Data',
                      icon: Download,
                      color: colors.deepBlue
                    },
                    {
                      title: 'Right to Correct',
                      description: 'Update or correct any inaccurate information',
                      action: 'Update Profile',
                      icon: FileText,
                      color: colors.cyanBlue
                    },
                    {
                      title: 'Right to Delete',
                      description: 'Request deletion of your personal data',
                      action: 'Delete Account',
                      icon: XCircle,
                      color: colors.red
                    },
                    {
                      title: 'Right to Portability',
                      description: 'Transfer your data to another service',
                      action: 'Export Data',
                      icon: Database,
                      color: colors.skyBlue
                    },
                    {
                      title: 'Right to Object',
                      description: 'Object to certain types of processing',
                      action: 'Manage Preferences',
                      icon: Shield,
                      color: colors.deepBlue
                    },
                    {
                      title: 'Right to Restrict',
                      description: 'Limit how we use your personal data',
                      action: 'Restrict Processing',
                      icon: Lock,
                      color: colors.cyanBlue
                    }
                  ].map((right, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                             style={{ backgroundColor: `${right.color}15` }}>
                          <right.icon className="w-5 h-5" style={{ color: right.color }} />
                        </div>
                        <h3 className="font-semibold text-lg">{right.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{right.description}</p>
                      <button className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                              style={{ 
                                backgroundColor: `${right.color}15`,
                                color: right.color
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${right.color}25`}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${right.color}15`}>
                        {right.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 7: Contact Information */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-2 h-10 rounded-full mr-4" style={{ backgroundColor: colors.cyanBlue }}></div>
                <h2 className="text-3xl font-bold" style={{ color: colors.cyanBlue }}>Contact Us</h2>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  If you have any questions about this Privacy Policy or your data, please reach out to our Data Protection Officer:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3" style={{ color: colors.deepBlue }} />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">privacy@aim9hire.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3" style={{ color: colors.deepBlue }} />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">+91-22-XXXX-XXXX</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: colors.deepBlue }} />
                      <div>
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="font-medium">AIM9HIRE<br />Thane, Maharashtra<br />India - 400601</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3" style={{ color: colors.deepBlue }} />
                      <div>
                        <div className="text-sm text-gray-500">Response Time</div>
                        <div className="font-medium">Within 48 hours</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: colors.deepBlue }}>Need to File a Complaint?</h3>
                  <p className="text-gray-700 mb-4">
                    If you're not satisfied with how we handle your privacy concerns, you have the right to contact the relevant data protection authority in India.
                  </p>
                  <button className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                          style={{ 
                            backgroundColor: colors.deepBlue,
                            color: 'white'
                          }}>
                    File a Complaint
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Download Section */}
          <div className="mt-16 p-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.deepBlue }}>Download Full Policy</h2>
                <p className="text-gray-600">Want to save or print this privacy policy for your records?</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
                <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border-2 transition-all hover:shadow-lg"
                        style={{ 
                          borderColor: colors.deepBlue,
                          color: colors.deepBlue
                        }}>
                  <Download className="w-5 h-5 mr-2" />
                  PDF Version
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-all hover:shadow-lg"
                        style={{ backgroundColor: colors.deepBlue }}>
                  Print Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Include Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;