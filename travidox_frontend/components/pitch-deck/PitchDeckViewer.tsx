'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer,
  Shield,
  GraduationCap,
  Brain,
  Bot,
  BookOpen,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  Bell,
  Target,
  Award,
  Zap,
  Activity
} from 'lucide-react';

interface PitchDeckViewerProps {
  slides: Array<{
    title: string;
    content: string;
  }>;
}

const PitchDeckViewer: React.FC<PitchDeckViewerProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrint = () => {
    window.print();
  };

  const getSlideBackground = (index: number) => {
    const backgrounds = [
      'bg-gradient-to-br from-slate-50 via-white to-blue-50', // Cover - Clean and professional
      'bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200', // Problem - Neutral gray
      'bg-gradient-to-br from-blue-50 via-white to-indigo-50', // Solution - Trust and reliability
      'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100', // How it works - Process focused
      'bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50', // Platform - Technology
      'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50', // Market - Professional
      'bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50', // Go to market - Strategic
      'bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50', // Roadmap - Future focused
      'bg-gradient-to-br from-slate-100 via-blue-50 to-gray-50', // Team - Human focused
      'bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50', // Thank you - Closing
    ];
    return backgrounds[index] || backgrounds[0];
  };

  const renderSlideContent = (slide: any, index: number) => {
    const slideTitle = (slide.title || '').toLowerCase();
    
    // Cover slide
    if (slideTitle.includes('cover') || index === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-100 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 bg-slate-200 rounded-full opacity-25 blur-lg"></div>
          
          {/* Logo container with elevation */}
          <div className="relative mb-8 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl"></div>
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Travidox Logo" 
                className="h-20 w-auto mx-auto drop-shadow-lg"
              />
            </div>
          </div>
          
          {/* Company name with modern typography */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4 tracking-tight">
            TRAVIDOX
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-slate-600 mb-8 font-medium">
            Trade with Intelligence
          </p>
          
          {/* Brand tagline */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full shadow-lg">
            <span className="text-lg font-semibold">The Future of Safe Investing</span>
          </div>
        </div>
      );
    }

    // Problem slide
    if (slideTitle.includes('problem')) {
      return (
        <div className="h-full flex flex-col justify-center p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-12 text-center">
            The Problem
          </h1>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-4">Investment Fraud</h3>
              <p className="text-slate-600 leading-relaxed">
                Young Nigerians lose millions to fake investment schemes and scams every year
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <GraduationCap className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-4">Lack of Education</h3>
              <p className="text-slate-600 leading-relaxed">
                No safe space to learn investing basics without risking real money
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <Brain className="w-16 h-16 text-purple-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-4">Intimidating Markets</h3>
              <p className="text-slate-600 leading-relaxed">
                Complex financial jargon and overwhelming information scare beginners away
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Solution slide
    if (slideTitle.includes('solution')) {
      return (
        <div className="h-full flex flex-col justify-center p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-12 text-center">
            Our Solution
          </h1>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <Shield className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-4">Practice with Fake Money</h3>
              <p className="text-slate-600 leading-relaxed">
                Learn real skills without any financial risk through virtual trading
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <Bot className="w-16 h-16 text-blue-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-4">AI-Powered Guidance</h3>
              <p className="text-slate-600 leading-relaxed">
                Get personalized investment advice and market insights from our AI assistant
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <BookOpen className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-4">Comprehensive Learning</h3>
              <p className="text-slate-600 leading-relaxed">
                Access courses, certifications, and educational content tailored for beginners
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Platform slide
    if (slideTitle.includes('platform')) {
      const features = [
        { icon: TrendingUp, name: 'Virtual Trading', color: 'text-green-500' },
        { icon: Bot, name: 'AI Trading Bot', color: 'text-blue-500' },
        { icon: Shield, name: 'Scam Alert', color: 'text-red-500', description: 'Scam Alert: Get real-time warnings about suspicious stocks and protect your investments from fraud.' },
        { icon: BarChart3, name: 'Market Analysis', color: 'text-purple-500' },
        { icon: BookOpen, name: 'Learning Center', color: 'text-indigo-500' },
        { icon: Award, name: 'Certifications', color: 'text-yellow-500' },
        { icon: Users, name: 'Leaderboard', color: 'text-orange-500' },
        { icon: Activity, name: 'Trading History', color: 'text-cyan-500' }
      ];

      return (
        <div className="h-full flex flex-col justify-center p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-12 text-center">
            The Platform
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-center hover:shadow-xl transition-shadow">
                <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold text-slate-800">{feature.name}</h3>
                {feature.description && (
                  <p className="text-slate-600 text-sm mt-2">{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default slide layout
    return (
      <div className="h-full flex flex-col justify-center p-8 max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 overflow-hidden">
          <div className="prose prose-lg prose-slate max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => (
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 text-center leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({children}) => (
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-6 leading-tight">
                    {children}
                  </h2>
                ),
                h3: ({children}) => (
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4 leading-tight">
                    {children}
                  </h3>
                ),
                p: ({children}) => (
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({children}) => (
                  <ul className="text-lg text-slate-600 mb-6 space-y-3 list-disc list-inside">
                    {children}
                  </ul>
                ),
                li: ({children}) => (
                  <li className="leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({children}) => (
                  <strong className="font-bold text-slate-800">
                    {children}
                  </strong>
                ),
              }}
            >
              {slide.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Print styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
          .print-slide {
            page-break-after: always;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .print-slide:last-child {
            page-break-after: avoid;
          }
          body {
            background: white !important;
          }
          * {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Navigation Header */}
      <div className="no-print bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Travidox" className="h-8 w-auto" />
              <span className="text-xl font-bold text-slate-800">Pitch Deck</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 font-medium">
                {currentSlide + 1} of {slides.length}
              </span>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Current Slide */}
        <div className={`min-h-screen ${getSlideBackground(currentSlide)} print-slide`}>
          {renderSlideContent(slides[currentSlide], currentSlide)}
        </div>

        {/* Navigation Controls */}
        <div className="no-print fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
            <div className="flex items-center space-x-4">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>

              {/* Slide Dots */}
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-blue-600' 
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Version - All Slides */}
      <div className="hidden print:block">
        {slides.map((slide, index) => (
          <div key={index} className="print-slide bg-white">
            {renderSlideContent(slide, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchDeckViewer;
