// src/pages/AboutUs.jsx
import React, { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Shield,
  Globe2,
  Target,
  Handshake,
  Zap,
  Award,
  Star,
  CheckCircle,
  Heart,
  TrendingUp,
  BookOpen,
  BarChart,
  MessageCircle,
  Smartphone,
  Coffee,
  MapPin,
  ThumbsUp,
  Clock,
  ArrowRight
} from "lucide-react";

import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    companies: 0,
    users: 0,
    free: 0,
    success: 0
  });

  // Brand Colors
  const colors = {
    deepBlue: "#13419E",
    skyBlue: "#72BBE8",
    red: "#FE0303",
    lightBlue: "#CCE4F4",
    cyanBlue: "#119FE6"
  };

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [e.target.id]: true }));

            if (e.target.id === "stats") {
              const interval = setInterval(() => {
                setCounters((prev) => ({
                  companies: prev.companies < 500 ? prev.companies + 5 : 500,
                  users: prev.users < 50000 ? prev.users + 500 : 50000,
                  free: prev.free < 100 ? prev.free + 2 : 100,
                  success: prev.success < 85 ? prev.success + 1.5 : 85
                }));
              }, 20);

              setTimeout(() => clearInterval(interval), 1800);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = [
      "hero",
      "mission",
      "stats",
      "features",
      "story",
      "team",
      "cta"
    ];

    setTimeout(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 200);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative pt-28 pb-24 px-6 text-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.deepBlue}, ${colors.cyanBlue})`
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-8 ${
              isVisible.hero ? "animate-fadeInUp" : "opacity-0"
            }`}
          >
            <Star className="w-12 h-12 text-white" />
          </div>

          <h1
            className={`text-5xl md:text-6xl font-extrabold text-white leading-tight ${
              isVisible.hero ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: ".1s" }}
          >
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              AIM9HIRE
            </span>
          </h1>

          <p
            className={`text-white/90 max-w-2xl mx-auto text-xl mt-6 ${
              isVisible.hero ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: ".2s" }}
          >
            India's most innovative recruitment platform connecting ambition
            with opportunity — completely free.
          </p>

          <div
            className={`flex flex-col sm:flex-row justify-center mt-10 gap-4 ${
              isVisible.hero ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: ".3s" }}
          >
            <button
              onClick={() =>
                document.getElementById("mission").scrollIntoView({
                  behavior: "smooth"
                })
              }
              className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl shadow hover:scale-105 transition"
            >
              Explore Our Story <ArrowRight className="inline ml-2" />
            </button>

            <a
              href="/jobs"
              className="px-8 py-4 text-white border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition hover:scale-105"
            >
              Browse Jobs
            </a>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section id="mission" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">
          {/* Mission */}
          <div
            className={`${isVisible.mission ? "animate-fadeInUp" : "opacity-0"}`}
          >
            <h2
              className="text-3xl font-bold mb-5"
              style={{ color: colors.deepBlue }}
            >
              Our Mission
            </h2>

            <p className="text-gray-700 text-lg mb-5">
              To democratize access to employment by creating a recruitment
              ecosystem that is completely{" "}
              <span style={{ color: colors.red }} className="font-semibold">
                free
              </span>{" "}
              and accessible to all.
            </p>

            <div className="space-y-3">
              {[
                "Break barriers between talent & opportunity",
                "Equal access for students & professionals",
                "Build meaningful employer partnerships",
                "Innovate to match India’s evolving job market"
              ].map((item, i) => (
                <p key={i} className="flex items-start">
                  <CheckCircle
                    className="w-5 h-5 mt-1 mr-3"
                    style={{ color: colors.cyanBlue }}
                  />
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div
            className={`${
              isVisible.mission ? "animate-fadeInUp" : "opacity-0"
            }`}
            style={{ animationDelay: ".2s" }}
          >
            <h2
              className="text-3xl font-bold mb-5"
              style={{ color: colors.red }}
            >
              Our Vision
            </h2>

            <p className="text-gray-700 text-lg mb-6">
              To become India's most trusted career platform, empowering every
              individual to find{" "}
              <span style={{ color: colors.deepBlue }}>meaningful work</span>{" "}
              and every company to hire exceptional talent.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        id="stats"
        className="py-20 px-6 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold" style={{ color: colors.deepBlue }}>
            Our Impact in Numbers
          </h2>

          <p className="text-gray-600 mt-2 mb-12">
            A quick look at how far we've come.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                label: "Partner Companies",
                value: counters.companies,
                icon: Building2,
                color: colors.deepBlue,
                suffix: "+"
              },
              {
                label: "Career Transformations",
                value: counters.users,
                icon: Users,
                color: colors.cyanBlue,
                suffix: "+"
              },
              {
                label: "Free Forever",
                value: counters.free,
                icon: Shield,
                color: colors.red,
                suffix: "%"
              },
              {
                label: "Success Rate",
                value: counters.success,
                icon: TrendingUp,
                color: colors.skyBlue,
                suffix: "%"
              }
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-8 bg-white rounded-2xl shadow border text-center ${
                  isVisible.stats ? "animate-fadeInUp" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>

                <div
                  className="text-4xl font-extrabold"
                  style={{ color: stat.color }}
                >
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </div>

                <p className="text-gray-700 font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES (Smart AI Matching Removed) */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold" style={{ color: colors.deepBlue }}>
            What Makes AIM9HIRE Unique
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mt-3">
            Built to give every job seeker a fair chance and every company the
            right talent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            {
              icon: Handshake,
              title: "Direct Company Partnerships",
              description:
                "Access real hiring managers directly — skip automated filters.",
              color: colors.deepBlue,
              highlight: "No ATS Black Hole"
            },
            {
              icon: Zap,
              title: "Priority Application Pipeline",
              description:
                "Applications reviewed 3x faster than traditional portals.",
              color: colors.red,
              highlight: "Fast Processing"
            },
            {
              icon: Shield,
              title: "100% Free Forever",
              description: "No charges, no premium plans — completely free.",
              color: colors.cyanBlue,
              highlight: "Zero Cost"
            },
            {
              icon: Globe2,
              title: "Pan-India Reach",
              description:
                "Opportunities across metros and emerging cities nationwide.",
              color: colors.skyBlue,
              highlight: "Nationwide"
            },
            {
              icon: Heart,
              title: "Student & Fresher First",
              description:
                "Dedicated programs for internships & early career growth.",
              color: colors.red,
              highlight: "Early Careers"
            },
            {
              icon: MessageCircle,
              title: "Direct Recruiter Chat",
              description:
                "Communicate instantly with verified hiring teams.",
              color: colors.deepBlue,
              highlight: "Direct Access"
            },
            {
              icon: BookOpen,
              title: "Career Resources",
              description:
                "Free resume reviews, interview prep, and expert guidance.",
              color: colors.skyBlue,
              highlight: "Career Growth"
            },
            {
              icon: BarChart,
              title: "Market Insights",
              description:
                "Real-time salary benchmarks and demand insights.",
              color: colors.deepBlue,
              highlight: "Data-Driven"
            }
          ].map((feature, i) => (
            <div
              key={i}
              className={`p-8 bg-white rounded-2xl border shadow-sm hover:shadow-xl transition ${
                isVisible.features ? "animate-fadeInUp" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="flex items-start">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon
                    className="w-7 h-7"
                    style={{ color: feature.color }}
                  />
                </div>

                <div className="ml-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      color: feature.color
                    }}
                  >
                    {feature.highlight}
                  </span>
                  <h3 className="text-xl font-semibold mt-2">
                    {feature.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section
        id="story"
        className="py-24 px-6 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="max-w-6xl mx-auto bg-white p-12 rounded-3xl shadow-xl">
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: colors.deepBlue }}
          >
            Our Journey
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {[
              {
                year: "2020",
                title: "The Beginning",
                desc: "A small team with a big mission."
              },
              {
                year: "2021",
                title: "Growing Fast",
                desc: "100+ companies, 10,000+ users onboarded."
              },
              {
                year: "2024",
                title: "Today",
                desc: "Now one of India’s most impactful job platforms."
              }
            ].map((m, i) => (
              <div
                key={i}
                className="p-6 text-center border rounded-2xl bg-white"
              >
                <div
                  className="text-4xl font-extrabold mb-2"
                  style={{ color: colors.deepBlue }}
                >
                  {m.year}
                </div>
                <h3 className="font-semibold text-lg">{m.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{m.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            AIM9HIRE started with one idea — to give every Indian, irrespective
            of background, location, or experience, an equal chance at employment.
            Today, we are empowering thousands across India and shaping the future
            of recruitment with honesty, speed, and opportunity.
          </p>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold" style={{ color: colors.deepBlue }}>
            Meet Our Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Driven individuals working together to change India’s employment
            landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            { role: "Recruitment Experts", count: "25+", icon: Users },
            { role: "Career Counselors", count: "15+", icon: MessageCircle },
            { role: "Tech Innovators", count: "30+", icon: Smartphone },
            { role: "Industry Partners", count: "50+", icon: Handshake },
            { role: "Student Mentors", count: "20+", icon: BookOpen },
            { role: "Operations Team", count: "40+", icon: Coffee }
          ].map((t, i) => (
            <div
              key={i}
              className="p-10 bg-white border rounded-2xl shadow hover:shadow-lg text-center transition"
            >
              <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 bg-blue-50">
                <t.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{t.count}</div>
              <p className="font-semibold text-gray-800 mt-2">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-center text-white rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of professionals who have already found success
            through AIM9HIRE.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/jobs"
              className="px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:scale-105 transition flex items-center justify-center"
            >
              Browse Opportunities <ArrowRight className="ml-2" />
            </a>

            <a
              href="/join-freelancer"
              className="px-8 py-4 border-2 border-white rounded-xl font-semibold hover:bg-white/10 hover:scale-105 transition"
            >
              Join as Freelancer
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-blue-200 text-sm">
            <div className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-2" /> No Fees
            </div>
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2" /> Direct Access
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Faster Responses
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
