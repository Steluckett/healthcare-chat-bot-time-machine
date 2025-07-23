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

const FreshJobsChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI assistant for Cygnet Group healthcare careers. I can help you discover mental health, learning disabilities, and healthcare support roles across the UK. What type of position interests you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [userCV, setUserCV] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToMessage = () => {
    // Scroll to top to show the newest message (which appears at top due to flex-end)
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToMessage();
  }, [messages]);

  useEffect(() => {
    setJobs(sampleJobs);
  }, []);

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
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate CV analysis with realistic processing time
      setTimeout(() => {
        try {
          // Extract location and analyze qualifications
          const cvText = extractCVText(file);
          const userLocation = extractLocation(file.name, cvText);
          const qualifications = analyzeQualifications(cvText);
          
          console.log('Detected location:', userLocation);
          console.log('CV text:', cvText);
          console.log('Qualifications:', qualifications);
          
          let matchingJobs = [];
          let responseMessage = '';
          
          if (userLocation) {
            // Find jobs within 30 miles using actual geographic calculations
            const jobsWithDistance = findJobsWithinRadius(sampleJobs, userLocation, 30);
            const nearbyJobs = jobsWithDistance.filter(job => job.withinRadius);
            
            // Filter jobs based on qualifications
            const qualifiedJobs = filterJobsByQualifications(nearbyJobs, qualifications);
            
            console.log('Jobs with distances:', jobsWithDistance);
            console.log('Nearby jobs:', nearbyJobs);
            console.log('Qualified jobs:', qualifiedJobs);
            
            if (qualifiedJobs.length > 0) {
              matchingJobs = qualifiedJobs.map(job => job.id);
              
              // Customize message based on qualification level - keep it simple
              if (qualifications.isQualifiedNurse) {
                responseMessage = `Perfect! I found ${qualifiedJobs.length} nursing role${qualifiedJobs.length > 1 ? 's' : ''} in your area that match your professional qualifications.`;
              } else if (qualifications.isHCA) {
                responseMessage = `Great! I found ${qualifiedJobs.length} suitable role${qualifiedJobs.length > 1 ? 's' : ''} in your area.`;
              } else {
                responseMessage = `Excellent! I found ${qualifiedJobs.length} entry-level role${qualifiedJobs.length > 1 ? 's' : ''} in your area with full training provided.`;
              }
            } else if (nearbyJobs.length > 0) {
              // Jobs nearby but not suitable for qualification level
              if (qualifications.isQualifiedNurse) {
                responseMessage = `I found some roles in your area, but they don't match your professional nursing qualifications. Let me know if you'd like to explore opportunities in nearby areas.`;
              } else {
                responseMessage = `I found some roles in your area, but they don't quite match your experience level. Would you like to see what's available in nearby areas?`;
              }
            } else {
              // No jobs within 30 miles
              responseMessage = `I don't currently have any suitable roles within 30 miles of ${userLocation.charAt(0).toUpperCase() + userLocation.slice(1)}. Would you be interested in exploring opportunities further away?`;
            }
          } else {
            // Location not detected, show general message
            responseMessage = "Thank you for uploading your CV! I couldn't detect your location from the filename. Could you tell me which area you're looking for work in so I can show you the most relevant opportunities?";
          }
          
          const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: responseMessage,
            matchingJobs: matchingJobs,
            locationDetected: userLocation,
            nearbyJobs: matchingJobs.length > 0,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error processing CV:', error);
          const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: "Thank you for uploading your CV! I'd be happy to help you find suitable healthcare roles. Could you tell me which area you're looking for work in?",
            matchingJobs: [],
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }
        
        setIsLoading(false);
      }, 1500);
    }
  };

  const buildConversationHistory = () => {
    const systemPrompt = `You are an experienced healthcare recruitment specialist working for Cygnet Group, the UK's leading independent provider of mental health and learning disabilities services. You have deep knowledge of healthcare careers and are genuinely passionate about helping people find meaningful work in healthcare.

ABOUT CYGNET GROUP:
- Leading independent provider of mental health and learning disabilities services in the UK
- Over 150 services across England and Wales
- Specializes in acute mental health, CAMHS, learning disabilities, neurological and complex care
- Part of Universal Health Services (UHS) - Fortune 500 company
- Award-winning employer with excellent training and career progression
- Strong focus on person-centered care and recovery-focused approaches
- Committed to staff development with comprehensive training programs
- Offers competitive salaries, excellent benefits, and flexible working arrangements

AVAILABLE JOBS:
${JSON.stringify(sampleJobs, null, 2)}

WHEN TO SHOW JOBS:
Show job IDs when the user is asking about:
- Specific roles or job types
- Career opportunities or job searching
- Salary, benefits, or working conditions
- Training or qualifications needed
- Locations for work
- "What jobs are available" or similar

DO NOT show jobs when the user is asking about:
- General company information (history, services, values)
- How to apply or application process
- General healthcare industry questions
- Personal experiences or stories
- Casual greetings or thanks
- Non-career related topics

JOB MATCHING RULES (when jobs should be shown):
- If they mention "mental health" or "nursing" → show jobs 1, 3, 5 (Mental Health Nurse, Clinical Psychologist, Mental Health Support Worker)
- If they mention "support worker" or "learning disabilities" → show jobs 2, 5 (Support Worker LD, Mental Health Support Worker)
- If they mention "entry level", "no experience", "new to healthcare" → show jobs 2, 4, 5 (Support Worker, Healthcare Assistant, Mental Health Support Worker)
- If they mention "clinical", "psychologist", "therapy" → show jobs 3, 6 (Clinical Psychologist, Occupational Therapist)
- If they mention "part-time" or "flexible" → show jobs 4, 6 (Healthcare Assistant, Occupational Therapist)
- If they mention specific locations → show jobs in/near that location
- If they ask about salary/benefits → show jobs 1, 3, 6 (different salary ranges)
- If they ask about training → show jobs 2, 4, 5 (mention training provided)

CONVERSATION STYLE:
- Be warm, encouraging, and genuinely helpful
- Keep responses to 2-3 sentences maximum unless explaining company info
- Don't list job details - the job tiles will show everything
- Be enthusiastic about opportunities when relevant
- Ask one follow-up question to keep conversation flowing

RESPONSE FORMAT:
Respond with a JSON object containing:
{
  "response": "Brief, encouraging response (2-3 sentences max)",
  "matchingJobs": [array of job IDs that match their query - ONLY if they're asking about jobs/careers],
  "followUpQuestions": [optional single follow-up question]
}

Your entire response MUST be valid JSON. Only include job IDs when the user is specifically asking about careers or job opportunities.`;

    const conversationMessages = [];
    
    // Add system message
    conversationMessages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Add recent conversation history (last 6 messages)
    const recentMessages = messages.slice(-6);
    
    recentMessages.forEach(msg => {
      if (msg.type === 'user') {
        conversationMessages.push({
          role: 'user',
          content: msg.content
        });
      } else if (msg.type === 'ai' && msg.id !== 1) {
        conversationMessages.push({
          role: 'assistant',
          content: msg.content
        });
      }
    });
    
    // Add current user message
    conversationMessages.push({
      role: 'user',
      content: inputValue
    });
    
    return conversationMessages;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Enhanced OpenAI API call
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: buildConversationHistory(),
          max_tokens: 600,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const aiResponseText = data.choices[0].message.content;
      
      // Parse JSON response
      let aiResponse;
      try {
        aiResponse = JSON.parse(aiResponseText);
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON:', aiResponseText);
        // Use backup logic for job matching
        const backupJobs = analyzeUserInput(inputValue);
        aiResponse = {
          response: aiResponseText,
          matchingJobs: backupJobs,
          followUpQuestions: []
        };
      }

      // Ensure we show jobs only when relevant (updated backup safety net)
      if (!aiResponse.matchingJobs || aiResponse.matchingJobs.length === 0) {
        console.log('No jobs in AI response, applying backup logic');
        aiResponse.matchingJobs = analyzeUserInput(inputValue);
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.response,
        matchingJobs: aiResponse.matchingJobs,
        followUpQuestions: aiResponse.followUpQuestions || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Enhanced fallback with flexible job matching
      const fallbackJobs = analyzeUserInput(inputValue);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm here to help you with information about Cygnet Group and our healthcare opportunities. What would you like to know?",
        matchingJobs: fallbackJobs,
        followUpQuestions: ["Are you interested in learning about our available roles?"],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      className="chat-container" 
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      {/* Main chat container - scrollable content */}
      <div className="messages-container">
        {/* CV Status */}
        {userCV && (
          <div className="mt-4 mb-2">
            <div className="cv-status">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-slate-600 font-medium text-sm">{userCV.name}</p>
                  <p className="text-emerald-600 text-xs font-normal">CV analyzed successfully</p>
                </div>
              </div>
              <button
                onClick={() => setUserCV(null)}
                className="text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Messages - normal order, newest at bottom of array but appears at top */}
        <div className="messages-list">
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{
                paddingTop: message.id === 1 && index === 0 ? '40px' : '0px'
              }}
            >
              <div className={`message-bubble ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {message.type === 'user' ? (
                    // User message layout
                    <>
                      <div className="flex-1 text-right">
                        <div className="inline-block">
                          <div className="user-message leading-relaxed text-lg px-4 py-2">
                            {message.content}
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 user-message" />
                      </div>
                    </>
                  ) : (
                    // AI message layout
                    <>
                      <div className="flex-1">
                        <div className="ai-message-container">
                          {/* Icon inside the box, top left */}
                          <div className="ai-icon">
                            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                              {/* Background wave (tinted down) */}
                              <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                                    stroke="#3b82f6" 
                                    strokeWidth="8" 
                                    fill="none"
                                    strokeLinecap="round"
                                    opacity="0.2"/>
                              
                              {/* Animated wave */}
                              <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                                    stroke="#3b82f6" 
                                    strokeWidth="8" 
                                    fill="none"
                                    strokeLinecap="round">
                                <animate attributeName="stroke-dasharray" 
                                         values="0,2000;400,2000;0,2000" 
                                         dur="3s" 
                                         repeatCount="indefinite"/>
                                <animate attributeName="stroke-dashoffset" 
                                         values="0;-400;-800" 
                                         dur="3s" 
                                         repeatCount="indefinite"/>
                              </path>
                            </svg>
                          </div>
                          
                          {/* Message content */}
                          <div className="message-content">
                            {message.content}
                          </div>
                          
                          {/* Quick Action Prompts - only show after initial message */}
                          {message.id === 1 && (
                            <div className="pl-20 mt-8 space-y-4">
                              <p className="text-slate-400 text-xs mb-3 font-normal">
                                Choose an option to get started:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="quick-action-btn"
                                >
                                  <div className="flex items-start space-x-3">
                                    <Upload className="w-6 h-6" style={{color: '#0068A3'}} />
                                    <div>
                                      <h4 className="text-slate-600 font-medium mb-1 text-sm">Upload Your CV</h4>
                                      <p className="text-slate-400 text-xs font-normal">
                                        Get personalized job matches
                                      </p>
                                    </div>
                                  </div>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setInputValue("I'm looking for mental health nursing roles");
                                    document.querySelector('textarea').focus();
                                  }}
                                  className="quick-action-btn"
                                >
                                  <div className="flex items-start space-x-3">
                                    <Heart className="w-6 h-6" style={{color: '#0068A3'}} />
                                    <div>
                                      <h4 className="text-slate-600 font-medium mb-1 text-sm">Mental Health Roles</h4>
                                      <p className="text-slate-400 text-xs font-normal">
                                        Explore nursing positions
                                      </p>
                                    </div>
                                  </div>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setInputValue("Show me support worker positions for learning disabilities");
                                    document.querySelector('textarea').focus();
                                  }}
                                  className="quick-action-btn"
                                >
                                  <div className="flex items-start space-x-3">
                                    <User className="w-6 h-6" style={{color: '#0068A3'}} />
                                    <div>
                                      <h4 className="text-slate-600 font-medium mb-1 text-sm">Support Worker Roles</h4>
                                      <p className="text-slate-400 text-xs font-normal">
                                        Learning disabilities support
                                      </p>
                                    </div>
                                  </div>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setInputValue("I'm new to healthcare - what entry level positions are available?");
                                    document.querySelector('textarea').focus();
                                  }}
                                  className="quick-action-btn"
                                >
                                  <div className="flex items-start space-x-3">
                                    <Sparkles className="w-6 h-6" style={{color: '#0068A3'}} />
                                    <div>
                                      <h4 className="text-slate-600 font-medium mb-1 text-sm">New to Healthcare</h4>
                                      <p className="text-slate-400 text-xs font-normal">
                                        Discover entry-level opportunities
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Job Cards */}
                          {message.matchingJobs && message.matchingJobs.length > 0 && (
                            <div className="jobs-grid">
                              {sampleJobs
                                .filter(job => message.matchingJobs.includes(job.id))
                                .map(job => (
                                  <div key={job.id} className="job-card-container">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                        {job.category}
                                      </div>
                                      <span className="text-xs text-slate-400 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {job.posted}
                                      </span>
                                    </div>
                                    
                                    <h4 className="text-slate-600 mb-2 text-sm font-semibold leading-tight">{job.title}</h4>
                                    <p className="text-slate-400 text-xs mb-3 line-clamp-2 font-normal">{job.description}</p>
                                    
                                    <div className="flex items-center gap-3 text-xs text-slate-300 mb-3 font-normal">
                                      <span className="flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {job.location}
                                      </span>
                                      <span className="flex items-center">
                                        <Briefcase className="w-3 h-3 mr-1" />
                                        {job.type}
                                      </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {job.skills.slice(0, 2).map((skill, index) => (
                                        <span key={index} className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-xs font-normal">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="text-slate-600 text-sm font-semibold">{job.salary}</div>
                                      <button
                                        onClick={() => handleJobClick(job)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-xs shadow-sm hover:shadow-md"
                                      >
                                        <span>View</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    </div>
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
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="ai-message-container">
                <div className="ai-icon">
                  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                    <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                          stroke="#3b82f6" 
                          strokeWidth="8" 
                          fill="none"
                          strokeLinecap="round"
                          opacity="0.2"/>
                    
                    <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                          stroke="#3b82f6" 
                          strokeWidth="8" 
                          fill="none"
                          strokeLinecap="round">
                      <animate attributeName="stroke-dasharray" 
                               values="0,2000;400,2000;0,2000" 
                               dur="3s" 
                               repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" 
                               values="0;-400;-800" 
                               dur="3s" 
                               repeatCount="indefinite"/>
                    </path>
                  </svg>
                </div>
                <div className="message-content loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* This div marks the end of messages for auto-scroll */}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>
      </div>

      {/* Input Area - Fixed/Floating at bottom */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about healthcare roles, locations, or get career advice..."
            className="chat-textarea chat-input"
            style={{
              maxHeight: Math.min(window.innerHeight * 0.2, 140) + 'px'
            }}
            disabled={isLoading}
            onInput={(e) => {
              e.target.style.height = 'auto';
              const maxHeight = Math.min(window.innerHeight * 0.2, 140);
              e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + 'px';
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
          
          {/* Button container */}
          <div className="input-buttons">
            {/* CV Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="text-slate-300 hover:text-slate-500 w-10 h-10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center hover:bg-sky-100 relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Upload className="w-4 h-4" />
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="tooltip">
                  Upload your CV for personalized matches
                </div>
              )}
            </button>
            
            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-slate-600 hover:bg-slate-700 text-white w-12 h-12 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Job Modal */}
      {showJobModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-block px-4 py-2 bg-sky-100 text-sky-700 text-sm rounded-full mb-3">
                    {selectedJob.category}
                  </div>
                  <h2 className="text-2xl text-slate-600 mb-2 font-semibold">{selectedJob.title}</h2>
                  <p className="text-slate-400">{selectedJob.company}</p>
                </div>
                <button
                  onClick={closeJobModal}
                  className="text-slate-300 hover:text-slate-500 text-xl w-8 h-8 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
                <div className="flex items-center gap-6 text-slate-400 flex-wrap text-sm">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {selectedJob.type}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedJob.posted}
                  </span>
                </div>

                <div className="text-xl text-slate-600 font-semibold">{selectedJob.salary}</div>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg text-slate-600 mb-3 font-semibold">Job Description</h3>
                <div className="text-slate-500 leading-relaxed whitespace-pre-line text-sm">
                  {selectedJob.fullDescription || selectedJob.description}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <button
                  onClick={() => handleApply(selectedJob)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreshJobsChat;
