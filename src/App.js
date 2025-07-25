// src/App.js - Clean version with CSS classes

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
      } else if (msg.type === 'ai') {
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

    setMessages(prev => [userMessage, ...prev]);
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

      setMessages(prev => [aiMessage, ...prev]);

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
      setMessages(prev => [errorMessage, ...prev]);
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
    <div className="time-machine-container">
      {/* 3D Messages Container - Only show when messages exist */}
      {messages.length > 0 && (
        <div 
          ref={containerRef}
          className="messages-3d-container"
          onWheel={handleWheel}
        >
          <div className="messages-3d-wrapper">
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
                opacity = Math.max(0.005, 1 - (distance * 0.25));
                blur = Math.min(6, distance * 1.5);
                rotateX = Math.min(15, distance * 3);
              } else {
                // Messages behind (older) - stack downward and backward with more transparency
                translateZ = -distance * 200;
                translateY = distance * 80;
                scale = Math.max(0.4, 1 - (distance * 0.2));
                opacity = Math.max(0.001, 1 - (distance * 0.6)); // Much more transparent for older messages
                blur = Math.min(15, distance * 3);
                rotateX = -Math.min(20, distance * 4);
              }
              
              return (
                <div
                  key={message.id}
                  className="message-3d-layer"
                  style={{
                    transform: `translate(-50%, -50%) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    zIndex: isActive ? 1000 : (isInFront ? 900 - index : 800 - index),
                    pointerEvents: isActive ? 'auto' : 'none',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="message-container">
                    <div className={`message-wrapper ${message.type === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper'}`}>
                      <div className={`message-bubble ${message.type === 'user' ? 'user-message-bubble' : 'ai-message-bubble'}`}>
                        <div className={`message-layout ${message.type === 'user' ? 'user-message-layout' : 'ai-message-layout'}`}>
                          {message.type === 'user' ? (
                            <>
                              <div className="user-message-content">
                                <div className="user-message-text">
                                  {message.content}
                                </div>
                              </div>
                              <div className="user-avatar">
                                <User className="user-avatar-icon" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="ai-avatar">
                                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="ai-avatar-icon">
                                  {/* Background wave (tinted white) */}
                                  <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                                        stroke="currentColor" 
                                        strokeWidth="12" 
                                        fill="none"
                                        strokeLinecap="round"
                                        opacity="0.4"/>
                                  
                                  {/* Animated wave (pure white) */}
                                  <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                                        stroke="white" 
                                        strokeWidth="18" 
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
                              <div className="ai-message-content">
                                <div className="ai-message-text">
                                  {message.content}
                                </div>

                                {/* Job Cards */}
                                {message.matchingJobs && message.matchingJobs.length > 0 && (
                                  <div className="jobs-grid">
                                    {sampleJobs
                                      .filter(job => message.matchingJobs.includes(job.id))
                                      .map(job => (
                                        <div key={job.id} className="job-card">
                                          <div className="job-card-header">
                                            <h4 className="job-title">{job.title}</h4>
                                            <div className="job-category">
                                              {job.category}
                                            </div>
                                          </div>
                                          
                                          <div className="job-details">
                                            <div className="job-location">
                                              <MapPin className="job-detail-icon" />
                                              <span className="job-detail-text">{job.location}</span>
                                            </div>
                                            <div className="job-salary">{job.salary}</div>
                                          </div>
                                          
                                          <button
                                            onClick={() => handleJobClick(job)}
                                            className="job-view-button"
                                          >
                                            <span>View</span>
                                            <ArrowRight className="job-view-icon" />
                                          </button>
                                        </div>
                                      ))}
                                  </div>
                                )}
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
              <div className="loading-container">
                <div className="message-container">
                  <div className="ai-message-wrapper">
                    <div className="ai-message-bubble">
                      <div className="ai-message-layout">
                        <div className="ai-avatar">
                          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="ai-avatar-icon">
                            {/* Background wave (tinted white) */}
                            <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                                  stroke="currentColor" 
                                  strokeWidth="5" 
                                  fill="none"
                                  strokeLinecap="round"
                                  opacity="0.4"/>
                            
                            {/* Animated wave (pure white) */}
                            <path d="M-200 200 Q -100 50, 0 200 Q 100 350, 200 200 Q 300 50, 400 200 Q 500 350, 600 200 Q 700 50, 800 200" 
                                  stroke="white" 
                                  strokeWidth="5" 
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
                        <div className="ai-message-content loading-content">
                          <div className="loading-dots">
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                            <div className="loading-dot"></div>
                          </div>
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
        <div className="navigation-indicator">
          <div className="nav-content">
            <span className="nav-counter">{currentMessageIndex + 1} of {messages.length}</span>
            <div className="nav-divider"></div>
            <span className="nav-instructions">Scroll or ↑↓ keys to navigate</span>
            <div className="nav-divider"></div>
            <div className="nav-status">
              {currentMessageIndex === 0 ? 'Latest' : 
               currentMessageIndex === messages.length - 1 ? 'Oldest' : 
               'History'}
            </div>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {messages.length > 1 && (
        <div className="progress-container">
          <div className="progress-track">
            <div 
              className="progress-bar"
              style={{ 
                width: `${((messages.length - 1 - currentMessageIndex) / (messages.length - 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={`input-area ${
        messages.length === 0 
          ? 'input-area-centered' 
          : currentMessageIndex === 0 
            ? 'input-area-bottom' 
            : 'input-area-hidden'
      }`}>
        <div className="input-wrapper">
          <div className="input-container-inner">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about healthcare roles, locations, or get career advice..."
              className="chat-input"
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
              className="file-input-hidden"
            />
            
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="upload-button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Upload className="upload-icon" />
              
              {showTooltip && (
                <div className="tooltip">
                  Upload your CV
                </div>
              )}
            </button>
            
            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="send-button"
            >
              <Send className="send-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* CV Status */}
      {userCV && (
        <div className="cv-status-container">
          <div className="cv-status">
            <FileText className="cv-icon" />
            <div className="cv-info">
              <p className="cv-filename">{userCV.name}</p>
              <p className="cv-status-text">CV analyzed successfully</p>
            </div>
            <button
              onClick={() => setUserCV(null)}
              className="cv-close-button"
            >
              <X className="cv-close-icon" />
            </button>
          </div>
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-inner">
              <div className="modal-header">
                <div className="modal-job-info">
                  <div className="modal-job-category">
                    {selectedJob.category}
                  </div>
                  <h2 className="modal-job-title">{selectedJob.title}</h2>
                  <p className="modal-job-company">{selectedJob.company}</p>
                </div>
                <button
                  onClick={closeJobModal}
                  className="modal-close-button"
                >
                  <X className="modal-close-icon" />
                </button>
              </div>

              <div className="modal-details">
                <div className="modal-job-meta">
                  <span className="modal-meta-item">
                    <MapPin className="modal-meta-icon" />
                    {selectedJob.location}
                  </span>
                  <span className="modal-meta-item">
                    <Briefcase className="modal-meta-icon" />
                    {selectedJob.type}
                  </span>
                  <span className="modal-meta-item">
                    <Clock className="modal-meta-icon" />
                    {selectedJob.posted}
                  </span>
                </div>

                <div className="modal-salary">{selectedJob.salary}</div>

                <div className="modal-skills">
                  {selectedJob.skills.map((skill, index) => (
                    <span key={index} className="modal-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-description">
                <h3 className="modal-description-title">Job Description</h3>
                <div className="modal-description-text">
                  {selectedJob.fullDescription || selectedJob.description}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => handleApply(selectedJob)}
                  className="modal-apply-button"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="modal-apply-icon" />
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
