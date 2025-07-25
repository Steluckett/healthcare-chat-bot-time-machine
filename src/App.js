// src/App.js

import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Clock, Briefcase, Sparkles, ArrowRight, User, Upload, FileText, X, Heart } from 'lucide-react';

// Import data and utilities
import { sampleJobs } from './data/jobsData';
import { 
  findJobsWithinRadius, 
  extractLocation, 
  extractCVText, 
  analyzeQualifications, 
  filterJobsByQualifications, 
  analyzeUserInput 
} from './utils/utils';

// Import styles
import './styles/styles.css';

const TimeMachineHealthcareChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [userCV, setUserCV] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const scrollAccumulator = useRef(0);

  // Auto-focus on newest message when new message is added
  useEffect(() => {
    setCurrentMessageIndex(0);
  }, [messages]);

  // Handle wheel scrolling for navigation with throttling and accumulation
  const handleWheel = (e) => {
    e.preventDefault();
    
    if (messages.length === 0) return;
    
    const now = Date.now();
    const timeDelta = now - lastScrollTime.current;
    
    // Reset accumulator if too much time has passed (prevents drift)
    if (timeDelta > 200) {
      scrollAccumulator.current = 0;
    }
    
    lastScrollTime.current = now;
    
    // Accumulate scroll delta - require more scroll to trigger a change
    scrollAccumulator.current += e.deltaY;
    
    // Only change message when we've accumulated enough scroll (threshold)
    const threshold = 100; // Adjust this to make scrolling more/less sensitive
    
    if (Math.abs(scrollAccumulator.current) >= threshold) {
      const delta = scrollAccumulator.current > 0 ? 1 : -1;
      
      setCurrentMessageIndex(prev => {
        const newIndex = Math.max(0, Math.min(messages.length - 1, prev + delta));
        return newIndex;
      });
      
      // Reset accumulator after triggering a change
      scrollAccumulator.current = 0;
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (messages.length === 0) return;
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentMessageIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentMessageIndex(prev => Math.min(messages.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages.length]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const closeJobModal = () => {
    setShowJobModal(false);
    setSelectedJob(null);
  };

  const handleApply = (job) => {
    const url = job.applyUrl || 'https://apply.cygnetgroup.com/';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserCV(file);
      setIsLoading(true);
      
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: `I've uploaded my CV: ${file.name}`,
        timestamp: new Date()
      };
      setMessages(prev => [userMessage, ...prev]);
      
      // Simulate CV analysis with your existing logic
      setTimeout(() => {
        try {
          const cvText = extractCVText(file);
          const userLocation = extractLocation(file.name, cvText);
          const qualifications = analyzeQualifications(cvText);
          
          let matchingJobs = [];
          let responseMessage = '';
          
          if (userLocation) {
            const jobsWithDistance = findJobsWithinRadius(sampleJobs, userLocation, 30);
            const nearbyJobs = jobsWithDistance.filter(job => job.withinRadius);
            const qualifiedJobs = filterJobsByQualifications(nearbyJobs, qualifications);
            
            if (qualifiedJobs.length > 0) {
              matchingJobs = qualifiedJobs.map(job => job.id);
              
              if (qualifications.isQualifiedNurse) {
                responseMessage = `Perfect! I found ${qualifiedJobs.length} nursing role${qualifiedJobs.length > 1 ? 's' : ''} in your area that match your professional qualifications.`;
              } else if (qualifications.isHCA) {
                responseMessage = `Great! I found ${qualifiedJobs.length} suitable role${qualifiedJobs.length > 1 ? 's' : ''} in your area.`;
              } else {
                responseMessage = `Excellent! I found ${qualifiedJobs.length} entry-level role${qualifiedJobs.length > 1 ? 's' : ''} in your area with full training provided.`;
              }
            } else {
              responseMessage = `I found some roles in your area, but they don't quite match your experience level. Would you like to see what's available in nearby areas?`;
            }
          } else {
            responseMessage = "Thank you for uploading your CV! I couldn't detect your location from the filename. Could you tell me which area you're looking for work in so I can show you the most relevant opportunities?";
          }
          
          const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: responseMessage,
            matchingJobs: matchingJobs,
            timestamp: new Date()
          };
          
          setMessages(prev => [aiMessage, ...prev]);
        } catch (error) {
          console.error('Error processing CV:', error);
          const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: "Thank you for uploading your CV! I'd be happy to help you find suitable healthcare roles. Could you tell me which area you're looking for work in?",
            matchingJobs: [],
            timestamp: new Date()
          };
          setMessages(prev => [aiMessage, ...prev]);
        }
        
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [userMessage, ...prev]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response using your existing logic
    setTimeout(() => {
      const matchingJobs = analyzeUserInput(inputValue);
      
      const responses = [
        {
          content: "Great! I found several mental health nursing positions that match your interests. These roles offer excellent career development and training opportunities.",
          matchingJobs: [1, 3]
        },
        {
          content: "Wonderful! Support worker roles are incredibly rewarding. You'll be making a real difference in people's lives while receiving comprehensive training.",
          matchingJobs: [2]
        },
        {
          content: "Excellent question! Cygnet Group offers competitive salaries, excellent benefits, flexible working arrangements, and outstanding career progression opportunities.",
          matchingJobs: [1, 2, 3]
        },
        {
          content: "I'm here to help you discover amazing healthcare opportunities with Cygnet Group. What type of role interests you most?",
          matchingJobs: matchingJobs.length > 0 ? matchingJobs : [1, 2, 4]
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: randomResponse.content,
        matchingJobs: randomResponse.matchingJobs,
        timestamp: new Date()
      };

      setMessages(prev => [aiMessage, ...prev]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* 3D Messages Container - Only show when messages exist */}
      {messages.length > 0 && (
        <div 
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
          onWheel={handleWheel}
          style={{ 
            perspective: '1500px',
            perspectiveOrigin: 'center center'
          }}
        >
          <div className="relative w-full max-w-4xl h-screen flex items-center justify-center">
            {messages.map((message, index) => {
              const isActive = index === currentMessageIndex;
              const distance = Math.abs(index - currentMessageIndex);
              const isInFront = index < currentMessageIndex;
              const isBehind = index > currentMessageIndex;
              
              // Enhanced transform calculations for better stacking
              let translateZ, translateY, scale, opacity, blur, rotateX;
              
              if (isActive) {
                // Active message - fully visible and centered
                translateZ = 0;
                translateY = 0;
                scale = 1;
                opacity = 1;
                blur = 0;
                rotateX = 0;
              } else if (isInFront) {
                // Messages in front (newer) - stack upward and forward
                translateZ = distance * 150;
                translateY = -distance * 60;
                scale = Math.max(0.6, 1 - (distance * 0.1));
                opacity = Math.max(0.2, 1 - (distance * 0.25));
                blur = Math.min(6, distance * 1.5);
                rotateX = Math.min(15, distance * 3);
              } else {
                // Messages behind (older) - stack downward and backward with more transparency
                translateZ = -distance * 200;
                translateY = distance * 80;
                scale = Math.max(0.4, 1 - (distance * 0.2));
                opacity = Math.max(0.05, 1 - (distance * 0.45)); // Much more transparent for older messages
                blur = Math.min(12, distance * 2.5);
                rotateX = -Math.min(20, distance * 4);
              }
              
              return (
                <div
                  key={message.id}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out w-full max-w-4xl"
                  style={{
                    transform: `translate(-50%, -50%) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    zIndex: isActive ? 1000 : (isInFront ? 900 - index : 800 - index),
                    pointerEvents: isActive ? 'auto' : 'none',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="mx-4 md:mx-8">
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`message-bubble ${message.type === 'user' ? 'order-2' : 'order-1'} max-w-3xl`}>
                        <div className={`flex items-start space-x-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {message.type === 'user' ? (
                            <>
                              <div className="flex-1 text-right">
                                <div className="inline-block bg-blue-500 text-white px-6 py-4 rounded-2xl shadow-lg">
                                  <div className="text-lg leading-relaxed">
                                    {message.content}
                                  </div>
                                </div>
                              </div>
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-gray-600" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                                  <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200" 
                                        stroke="white" 
                                        strokeWidth="12" 
                                        fill="none"
                                        strokeLinecap="round">
                                    <animate attributeName="stroke-dasharray" 
                                             values="0,1000;300,1000;0,1000" 
                                             dur="2s" 
                                             repeatCount="indefinite"/>
                                  </path>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                  <div className="text-lg text-gray-700 leading-relaxed mb-4">
                                    {message.content}
                                  </div>

                                  {/* Job Cards - Using your existing job data structure */}
                                  {message.matchingJobs && message.matchingJobs.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                      {sampleJobs
                                        .filter(job => message.matchingJobs.includes(job.id))
                                        .map(job => (
                                          <div key={job.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                            <div className="mb-2">
                                              <h4 className="text-gray-700 font-semibold text-sm leading-tight mb-1">{job.title}</h4>
                                              <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mb-2">
                                                {job.category}
                                              </div>
                                            </div>
                                            
                                            <div className="space-y-1 mb-3">
                                              <div className="text-gray-600 text-xs flex items-center">
                                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                                <span className="truncate">{job.location}</span>
                                              </div>
                                              <div className="text-gray-700 font-medium text-xs">{job.salary}</div>
                                            </div>
                                            
                                            <button
                                              onClick={() => handleJobClick(job)}
                                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded text-xs transition-all duration-300 flex items-center justify-center space-x-1 shadow-sm hover:shadow-md"
                                            >
                                              <span>View</span>
                                              <ArrowRight className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Loading indicator */}
            {isLoading && (
              <div 
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out w-full max-w-4xl"
                style={{
                  transform: 'translate(-50%, -50%) translateZ(0px) translateY(0px) scale(1)',
                  opacity: 1,
                  zIndex: 1001,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="mx-4 md:mx-8">
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                          <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200" 
                                stroke="white" 
                                strokeWidth="12" 
                                fill="none"
                                strokeLinecap="round">
                            <animate attributeName="stroke-dasharray" 
                                     values="0,1000;300,1000;0,1000" 
                                     dur="2s" 
                                     repeatCount="indefinite"/>
                          </path>
                        </svg>
                      </div>
                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Navigation Indicator */}
      {messages.length > 0 && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border transition-all duration-300">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="font-medium">{currentMessageIndex + 1} of {messages.length}</span>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-xs">Scroll or ↑↓ keys to navigate</span>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-1">
              <div className="text-xs text-gray-500">
                {currentMessageIndex === 0 ? 'Latest' : 
                 currentMessageIndex === messages.length - 1 ? 'Oldest' : 
                 'History'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {messages.length > 1 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64">
          <div className="bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-700 ease-in-out"
              style={{ 
                width: `${((messages.length - 1 - currentMessageIndex) / (messages.length - 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Input Area - Centered when no messages, bottom when messages exist */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 transition-all duration-700 ease-out ${
        messages.length === 0 
          ? 'top-1/2 -translate-y-1/2' 
          : currentMessageIndex === 0 
            ? 'bottom-6 translate-y-0' 
            : 'bottom-6 translate-y-0 opacity-30 pointer-events-none'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="relative flex items-end space-x-4 p-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about healthcare roles, locations, or get career advice..."
              className="flex-1 resize-none bg-transparent border-0 focus:outline-none max-h-32 text-gray-700 placeholder-gray-500"
              rows="1"
              disabled={isLoading}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Upload className="w-6 h-6" />
              
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                  Upload your CV
                </div>
              )}
            </button>
            
            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* CV Status */}
      {userCV && (
        <div className="absolute top-32 right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-gray-700 font-medium text-sm">{userCV.name}</p>
              <p className="text-emerald-600 text-xs">CV analyzed successfully</p>
            </div>
            <button
              onClick={() => setUserCV(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Job Modal - Using your existing modal structure */}
      {showJobModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-full mb-3">
                    {selectedJob.category}
                  </div>
                  <h2 className="text-2xl text-gray-800 mb-2 font-bold">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.company}</p>
                </div>
                <button
                  onClick={closeJobModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
                <div className="flex items-center gap-6 text-gray-600 flex-wrap">
                  <span className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    {selectedJob.type}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {selectedJob.posted}
                  </span>
                </div>

                <div className="text-2xl text-gray-800 font-bold">{selectedJob.salary}</div>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl text-gray-800 mb-3 font-semibold">Job Description</h3>
                <div className="text-gray-600 leading-relaxed">
                  {selectedJob.fullDescription || selectedJob.description}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => handleApply(selectedJob)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl font-semibold"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeMachineHealthcareChat;
