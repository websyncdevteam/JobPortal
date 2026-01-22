// src/pages/JoinFreelancer.jsx
import React, { useState } from 'react';
import { 
  Users, TrendingUp, DollarSign, Shield, Clock, 
  Target, BarChart, Award, Key, UserCheck, 
  CheckCircle, ArrowRight, Sparkles, Percent, 
  Calendar, Briefcase, Building2, Wallet, Star,
  Zap, Heart, Users as UsersIcon, FileText,
  ShieldCheck, TrendingUp as TrendingUpIcon, Crown,
  Mail, Phone, MessageCircle, Video, UserPlus, Lock
} from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const JoinFreelancer = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // Brand colors
  const colors = {
    deepBlue: '#13419E',
    skyBlue: '#72BBE8',
    red: '#FE0303',
    lightBlue: '#CCE4F4',
    cyanBlue: '#119FE6'
  };

  // Email and contact info
  const emailAddress = "agents@aim9hire.com";
  const phoneNumber = "+91-98765-43210";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white">
      {/* Include Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${colors.deepBlue} 0%, ${colors.cyanBlue} 100%)`
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${colors.lightBlue} 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center justify-center w-28 h-28 mb-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <div className="relative">
                <Lock className="w-14 h-14 text-white" />
                <Crown className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300" />
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="block text-white">Become a</span>
              <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Certified Agent</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Exclusive referral program for selected professionals. Earn commissions by referring quality candidates.
            </p>

            {/* Stats Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '₹2.5Cr+', label: 'Total Payouts' },
                  { value: '1,500+', label: 'Selected Agents' },
                  { value: '90 Days', label: 'Retention Period' },
                  { value: '₹50K+', label: 'Avg. Monthly/Agent' }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Apply Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.deepBlue }}>
              How to Become an Agent
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our agent program is selective. Here's our simple 3-step onboarding process:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Mail,
                title: 'Email Application',
                description: 'Send your details to agents@aim9hire.com with subject "Agent Application"',
                color: colors.deepBlue,
                highlight: 'Email Only'
              },
              {
                step: '2',
                icon: Video,
                title: 'Screening Interview',
                description: '30-minute interview to understand your network and experience',
                color: colors.red,
                highlight: '30-min Call'
              },
              {
                step: '3',
                icon: Key,
                title: 'Get Approved',
                description: 'Receive your unique agent code and access to the dashboard',
                color: colors.cyanBlue,
                highlight: 'Exclusive Access'
              }
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-xl"
                     style={{ backgroundColor: step.color }}>
                  {step.step}
                </div>
                
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4"
                       style={{ backgroundColor: `${step.color}15` }}>
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  
                  <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-3"
                       style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                    {step.highlight}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Application Email Box */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="flex items-center mb-4">
                  <Mail className="w-8 h-8 mr-4" />
                  <h3 className="text-2xl font-bold">Email Your Application</h3>
                </div>
                <p className="text-blue-100">
                  Send your professional details to our dedicated agent onboarding team
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{emailAddress}</div>
                <button
                  onClick={() => copyToClipboard(emailAddress)}
                  className="px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors flex items-center mx-auto"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {copied ? 'Copied!' : 'Copy Email'}
                </button>
              </div>
            </div>
            
            {/* What to Include */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h4 className="text-lg font-semibold mb-4">What to Include in Your Email:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Full Name & Contact Details</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Current Profession & Experience</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Size of Professional Network</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Why you want to be an agent</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.deepBlue }}>
              Commission Structure (90-Day System)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You earn only when your referred candidate stays for 90+ days
            </p>
          </div>
          
          {/* Commission Timeline */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="text-center mb-6 md:mb-0">
                <div className="text-3xl font-bold" style={{ color: colors.red }}>Day 0</div>
                <div className="text-gray-600">Candidate Joins</div>
              </div>
              
              <ArrowRight className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0 my-4" />
              
              <div className="text-center mb-6 md:mb-0">
                <div className="text-3xl font-bold" style={{ color: colors.cyanBlue }}>Day 90</div>
                <div className="text-gray-600">Retention Period Ends</div>
              </div>
              
              <ArrowRight className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0 my-4" />
              
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: colors.deepBlue }}>Day 91+</div>
                <div className="text-gray-600">Commission Released</div>
              </div>
            </div>
            
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full rounded-full"
                style={{ 
                  width: '100%',
                  background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.cyanBlue} 50%, ${colors.deepBlue} 100%)`
                }}
              ></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                level: 'Tier 1',
                commission: '₹5,000',
                requirement: 'Entry Level Agents',
                color: colors.skyBlue,
                icon: UserPlus
              },
              {
                level: 'Tier 2',
                commission: '₹7,500',
                requirement: '5+ Successful Referrals',
                color: colors.cyanBlue,
                icon: TrendingUpIcon
              },
              {
                level: 'Tier 3',
                commission: '₹10,000',
                requirement: '15+ Successful Referrals',
                color: colors.deepBlue,
                icon: Award
              },
              {
                level: 'Premium',
                commission: '15%',
                requirement: 'High-value Placements',
                color: colors.red,
                icon: Crown
              }
            ].map((tier, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border-2 shadow-lg" style={{ borderColor: tier.color }}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                       style={{ backgroundColor: `${tier.color}15` }}>
                    <tier.icon className="w-8 h-8" style={{ color: tier.color }} />
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: tier.color }}>{tier.level}</div>
                  <div className="text-4xl font-black mb-2" style={{ color: tier.color }}>{tier.commission}</div>
                  <div className="text-gray-600 text-sm">{tier.requirement}</div>
                </div>
                <div className="text-center text-gray-700 text-sm">
                  {tier.level === 'Premium' ? 'Of candidate\'s salary' : 'Per successful placement'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Selective Program */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.deepBlue }}>
              Why We're Selective
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quality over quantity. We maintain high standards for our agent network.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Requirements */}
            <div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.deepBlue }}>
                  <Lock className="w-6 h-6 inline mr-2" />
                  Agent Requirements
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Professional Experience',
                      description: 'Minimum 2 years in HR, recruitment, or business development',
                      icon: Briefcase
                    },
                    {
                      title: 'Network Size',
                      description: 'Active professional network of 200+ contacts',
                      icon: Users
                    },
                    {
                      title: 'Communication Skills',
                      description: 'Excellent written and verbal communication',
                      icon: MessageCircle
                    },
                    {
                      title: 'Ethical Standards',
                      description: 'Commitment to ethical referral practices',
                      icon: Shield
                    },
                    {
                      title: 'Tech Savvy',
                      description: 'Comfortable using digital tools and platforms',
                      icon: Zap
                    }
                  ].map((req, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                             style={{ backgroundColor: `${colors.deepBlue}15` }}>
                          <req.icon className="w-5 h-5" style={{ color: colors.deepBlue }} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{req.title}</h4>
                        <p className="text-gray-600 text-sm">{req.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Benefits */}
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">
                  <Crown className="w-6 h-6 inline mr-2" />
                  Agent Benefits
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Exclusive Access',
                      description: 'Access to premium job listings before public release',
                      icon: Key
                    },
                    {
                      title: 'Higher Commissions',
                      description: 'Better rates than standard referral programs',
                      icon: DollarSign
                    },
                    {
                      title: 'Priority Support',
                      description: 'Dedicated account manager for top agents',
                      icon: Phone
                    },
                    {
                      title: 'Advanced Tools',
                      description: 'Premium dashboard with advanced analytics',
                      icon: BarChart
                    },
                    {
                      title: 'Recognition Program',
                      description: 'Monthly awards and recognition for top performers',
                      icon: Award
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
                          <benefit.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-blue-100 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.deepBlue }}>
              Ready to Apply?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contact our Agent Onboarding Team for more information
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center border-b border-gray-200"
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.deepBlue} 0%, ${colors.cyanBlue} 100%)`
                 }}>
              <h2 className="text-3xl font-bold text-white mb-4">
                Agent Onboarding Team
              </h2>
              <p className="text-white/90">
                Reach out to us for any questions about the agent program
              </p>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Email Contact */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                       style={{ backgroundColor: `${colors.deepBlue}15` }}>
                    <Mail className="w-8 h-8" style={{ color: colors.deepBlue }} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.deepBlue }}>
                    Email Application
                  </h3>
                  
                  <div className="text-lg font-medium mb-4">{emailAddress}</div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => copyToClipboard(emailAddress)}
                      className="w-full px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: colors.lightBlue,
                        color: colors.deepBlue
                      }}
                    >
                      Copy Email Address
                    </button>
                    
                    <a
                      href={`mailto:${emailAddress}?subject=Agent Application Inquiry&body=Dear AIM9HIRE Agent Team,%0D%0A%0D%0AI am interested in becoming a certified agent. Please find my details below:%0D%0A%0D%0A1. Full Name:%0D%0A2. Current Profession:%0D%0A3. Years of Experience:%0D%0A4. Contact Number:%0D%0A5. LinkedIn Profile (if available):%0D%0A%0D%0AThank you,%0D%0A[Your Name]`}
                      className="block w-full px-6 py-3 rounded-lg font-medium text-center transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: colors.deepBlue,
                        color: 'white'
                      }}
                    >
                      Compose Email
                    </a>
                  </div>
                </div>
                
                {/* Phone Contact */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                       style={{ backgroundColor: `${colors.red}15` }}>
                    <Phone className="w-8 h-8" style={{ color: colors.red }} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.red }}>
                    Phone Support
                  </h3>
                  
                  <div className="text-lg font-medium mb-4">{phoneNumber}</div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => copyToClipboard(phoneNumber)}
                      className="w-full px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: `${colors.red}15`,
                        color: colors.red
                      }}
                    >
                      Copy Phone Number
                    </button>
                    
                    <a
                      href={`tel:${phoneNumber.replace(/-/g, '')}`}
                      className="block w-full px-6 py-3 rounded-lg font-medium text-center transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: colors.red,
                        color: 'white'
                      }}
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.deepBlue }}>
                  Business Hours
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { day: 'Mon-Fri', time: '10 AM - 7 PM' },
                    { day: 'Saturday', time: '10 AM - 4 PM' },
                    { day: 'Sunday', time: 'Closed' },
                    { day: 'Response Time', time: '24-48 hours' }
                  ].map((schedule, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="font-medium">{schedule.day}</div>
                      <div className="text-gray-600 text-sm">{schedule.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.deepBlue }}>
              Our Certified Agents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from agents who went through our selective onboarding process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Anjali Mehta',
                profession: 'HR Consultant',
                location: 'Mumbai',
                earnings: '₹15L+',
                time: '11 months',
                quote: 'The interview process ensured only serious professionals join. This maintains the quality of the network.',
                avatar: 'AM',
                certified: true
              },
              {
                name: 'Rajesh Iyer',
                profession: 'Business Developer',
                location: 'Bangalore',
                earnings: '₹8.5L',
                time: '6 months',
                quote: 'The 30-minute screening was professional and thorough. Made me confident about the program.',
                avatar: 'RI',
                certified: true
              },
              {
                name: 'Priya Singh',
                profession: 'Career Coach',
                location: 'Delhi',
                earnings: '₹12L',
                time: '9 months',
                quote: 'Being selective means higher quality referrals and better commissions. Worth the application process.',
                avatar: 'PS',
                certified: true
              }
            ].map((agent, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4"
                         style={{ backgroundColor: colors.deepBlue }}>
                      {agent.avatar}
                    </div>
                    {agent.certified && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{agent.name}</h3>
                    <div className="text-gray-600 text-sm">{agent.profession}</div>
                    <div className="flex items-center mt-2">
                      <div className="text-lg font-bold mr-4" style={{ color: colors.red }}>
                        {agent.earnings}
                      </div>
                      <div className="text-sm text-gray-600">{agent.time}</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 italic mb-6">"{agent.quote}"</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {agent.location}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2" style={{ color: colors.deepBlue }}>
                      Certified Agent
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Certification Badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full"
                 style={{ backgroundColor: `${colors.deepBlue}15` }}>
              <ShieldCheck className="w-5 h-5 mr-2" style={{ color: colors.deepBlue }} />
              <span className="font-semibold" style={{ color: colors.deepBlue }}>
                All agents are certified after successful interview screening
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready for Selective Success?
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join 1,500+ certified agents in India's most exclusive referral network
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => copyToClipboard(emailAddress)}
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Mail className="mr-2 group-hover:scale-110 transition-transform" />
                  Apply via Email
                </button>
                
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Phone className="mr-2" />
                  Call for Details
                </a>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center gap-6 text-blue-200 text-sm">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Selective Onboarding</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>90-Day Payment Guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>1,500+ Certified Agents</span>
                  </div>
                </div>
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

export default JoinFreelancer;