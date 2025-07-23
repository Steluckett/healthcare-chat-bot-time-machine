import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Clock, Briefcase, Sparkles, ArrowRight, User, Upload, FileText, X, Heart } from 'lucide-react';

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

  // Sample jobs data
  const sampleJobs = [
    {
      id: 1,
      title: "Mental Health Nurse",
      company: "Cygnet Group",
      location: "London, England",
      salary: "£32,000 - £38,000",
      type: "Full-time",
      posted: "2 days ago",
      skills: ["Mental Health Assessment", "Therapeutic Communication", "Risk Assessment", "NMC Registration"],
      description: "Join our dedicated mental health team providing compassionate care to adults with complex mental health needs. We offer excellent training opportunities and career progression in a supportive environment.",
      fullDescription: "Join our dedicated mental health team providing compassionate care to adults with complex mental health needs. We offer excellent training opportunities and career progression in a supportive environment. You'll work with a multidisciplinary team to provide holistic care and support recovery journeys. This role offers excellent professional development opportunities and the chance to make a real difference in people's lives.",
      applyUrl: "https://apply.cygnetgroup.com/job/mental-health-nurse",
      category: "Mental Health"
    },
    {
      id: 2,
      title: "Support Worker - Learning Disabilities",
      company: "Cygnet Group",
      location: "Birmingham, England",
      salary: "£22,000 - £26,000",
      type: "Full-time",
      posted: "1 day ago",
      skills: ["Person-Centered Care", "Behavior Support", "Safeguarding", "Team Working"],
      description: "Support individuals with learning disabilities to live fulfilling lives. No experience required - full training provided. Make a real difference in people's lives.",
      fullDescription: "Support individuals with learning disabilities to live fulfilling lives. No experience required - full training provided. Make a real difference in people's lives. You'll help with daily activities, social skills development, and promoting independence. We provide comprehensive training and ongoing support to help you succeed in this rewarding role.",
      applyUrl: "https://apply.cygnetgroup.com/job/support-worker-ld",
      category: "Learning Disabilities"
    },
    {
      id: 3,
      title: "Clinical Psychologist",
      company: "Cygnet Group",
      location: "Manchester, England",
      salary: "£45,000 - £55,000",
      type: "Full-time",
      posted: "3 days ago",
      skills: ["Clinical Assessment", "Therapy Delivery", "HCPC Registration", "CBT"],
      description: "Lead psychological interventions for adults with complex mental health presentations. Excellent supervision and CPD opportunities available.",
      fullDescription: "Lead psychological interventions for adults with complex mental health presentations. Excellent supervision and CPD opportunities available. You'll conduct assessments, deliver therapy, and work with multidisciplinary teams to support recovery. This role offers excellent career progression opportunities and access to continued professional development.",
      applyUrl: "https://apply.cygnetgroup.com/job/clinical-psychologist",
      category: "Mental Health"
    },
    {
      id: 4,
      title: "Healthcare Assistant",
      company: "Cygnet Group",
      location: "Bristol, England",
      salary: "£20,000 - £24,000",
      type: "Part-time",
      posted: "1 day ago",
      skills: ["Patient Care", "Medication Support", "Documentation", "Compassionate Care"],
      description: "Provide essential care and support to service users. Flexible hours available. Perfect opportunity to start your healthcare career.",
      fullDescription: "Provide essential care and support to service users. Flexible hours available. Perfect opportunity to start your healthcare career. You'll assist with personal care, medication administration, and daily living activities. This role offers flexible working arrangements and comprehensive training for those new to healthcare.",
      applyUrl: "https://apply.cygnetgroup.com/job/healthcare-assistant",
      category: "Healthcare Support"
    },
    {
      id: 5,
      title: "Mental Health Support Worker",
      company: "Cygnet Group",
      location: "Stockport, England",
      salary: "£24,000 - £28,000",
      type: "Full-time",
      posted: "Today",
      skills: ["Mental Health Support", "Person-Centered Care", "Crisis Support", "Team Working"],
      description: "Support individuals with mental health needs in our Stockport facility. Full training provided for the right candidate. Excellent career progression opportunities.",
      fullDescription: "Support individuals with mental health needs in our Stockport facility. Full training provided for the right candidate. Excellent career progression opportunities. You'll work alongside qualified nurses and other professionals to provide compassionate care and support recovery journeys. This role offers comprehensive training, competitive salary, and the chance to make a real difference in people's lives in your local community.",
      applyUrl: "https://apply.cygnetgroup.com/job/mh-support-worker-stockport",
      category: "Mental Health"
    },
    {
      id: 6,
      title: "Occupational Therapist",
      company: "Cygnet Group",
      location: "Leeds, England",
      salary: "£35,000 - £42,000",
      type: "Full-time",
      posted: "4 days ago",
      skills: ["Assessment", "Treatment Planning", "HCPC Registration", "Rehabilitation"],
      description: "Help service users develop independence and life skills. Work across multiple services with excellent professional development opportunities.",
      fullDescription: "Help service users develop independence and life skills. Work across multiple services with excellent professional development opportunities. You'll assess needs, develop treatment plans, and deliver interventions to promote recovery and independence. This role offers variety across different service areas and excellent career progression.",
      applyUrl: "https://apply.cygnetgroup.com/job/occupational-therapist",
      category: "Allied Health"
    }
  ];

  // Geographic coordinates for UK cities (lat, lng)
  const cityCoordinates = {
    'london': { lat: 51.5074, lng: -0.1278 },
    'birmingham': { lat: 52.4862, lng: -1.8904 },
    'manchester': { lat: 53.4808, lng: -2.2426 },
    'stockport': { lat: 53.4106, lng: -2.1575 },
    'leeds': { lat: 53.8008, lng: -1.5491 },
    'bristol': { lat: 51.4545, lng: -2.5879 },
    'liverpool': { lat: 53.4084, lng: -2.9916 },
    'newcastle': { lat: 54.9783, lng: -1.6178 }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find jobs within 30 miles of user's location
  const findJobsWithinRadius = (userLocation, maxDistance = 30) => {
    const userCoords = cityCoordinates[userLocation.toLowerCase()];
    if (!userCoords) return [];

    const jobsWithDistance = sampleJobs.map(job => {
      const jobLocation = job.location.split(',')[0].toLowerCase();
      const jobCoords = cityCoordinates[jobLocation];
      
      if (!jobCoords) return null;
      
      const distance = calculateDistance(
        userCoords.lat, userCoords.lng,
        jobCoords.lat, jobCoords.lng
      );
      
      return {
        ...job,
        distance: Math.round(distance),
        withinRadius: distance <= maxDistance
      };
    }).filter(job => job !== null);

    return jobsWithDistance;
  };

  // Extract location from filename or CV content
  const extractLocation = (filename, cvContent = '') => {
    const lowerFilename = filename.toLowerCase();
    const lowerContent = cvContent.toLowerCase();
    const locations = Object.keys(cityCoordinates);
    
    // First try CV content (more reliable)
    if (cvContent) {
      for (const location of locations) {
        if (lowerContent.includes(location)) {
          return location;
        }
      }
    }
    
    // Fallback to filename
    for (const location of locations) {
      if (lowerFilename.includes(location)) {
        return location;
      }
    }
    
    return null;
  };

  // Simple CV text extraction and qualification analysis
  const extractCVText = (file) => {
    const filename = file.name.toLowerCase();
    
    // Simulate reading CV content based on filename
    if (filename.includes('jane') || filename.includes('nurse') || filename.includes('stockport')) {
      return 'Jane Doe Address: 21 Meadow Lane, Stockport, SK4 2AA Registered Mental Health Nurse NMC PIN: RM12345678 experience mental health nursing acute inpatient ward Senior Mental Health Nurse 5 years experience';
    }
    
    return '';
  };

  // Analyze qualifications from CV content
  const analyzeQualifications = (cvContent) => {
    const content = cvContent.toLowerCase();
    
    // Check for nursing qualifications
    const isQualifiedNurse = content.includes('nmc') || content.includes('registered nurse') || content.includes('nmc pin');
    const isMentalHealthNurse = content.includes('mental health nurse') || content.includes('mental health nursing');
    const isSeniorNurse = content.includes('senior') || content.includes('lead nurse') || content.includes('years experience');
    
    // Check for other qualifications
    const isHCA = content.includes('healthcare assistant') || content.includes('hca');
    const isSupportWorker = content.includes('support worker') && !isQualifiedNurse;
    const isNewGrad = content.includes('newly qualified') || content.includes('new graduate');
    
    return {
      isQualifiedNurse,
      isMentalHealthNurse,
      isSeniorNurse,
      isHCA,
      isSupportWorker,
      isNewGrad,
      experienceLevel: isSeniorNurse ? 'senior' : isQualifiedNurse ? 'qualified' : 'entry-level'
    };
  };

  // Filter jobs based on qualifications and location
  const filterJobsByQualifications = (jobs, qualifications) => {
    return jobs.filter(job => {
      const jobTitle = job.title.toLowerCase();
      const jobCategory = job.category.toLowerCase();
      
      // For qualified nurses
      if (qualifications.isQualifiedNurse) {
        // Only show nursing roles, clinical roles, or senior positions
        return jobTitle.includes('nurse') || 
               jobTitle.includes('clinical') || 
               jobTitle.includes('psychologist') ||
               jobCategory.includes('mental health') && !jobTitle.includes('support worker');
      }
      
      // For healthcare assistants
      if (qualifications.isHCA) {
        // Show HCA roles and nursing roles (career progression)
        return jobTitle.includes('healthcare assistant') || 
               jobTitle.includes('nurse') ||
               jobTitle.includes('support worker');
      }
      
      // For support workers
      if (qualifications.isSupportWorker) {
        // Show support worker roles and HCA roles (career progression)
        return jobTitle.includes('support worker') || 
               jobTitle.includes('healthcare assistant');
      }
      
      // For entry-level/no healthcare experience
      // Only show entry-level roles
      return jobTitle.includes('support worker') || 
             jobTitle.includes('healthcare assistant') ||
             jobTitle.includes('apprentice') ||
             jobTitle.includes('trainee');
    });
  };

  const scrollToMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
            const jobsWithDistance = findJobsWithinRadius(userLocation, 30);
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
      // Enhanced system prompt with flexible job matching
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

EXAMPLES:
User: "I'm thinking about healthcare" → Show jobs [1,2,4] + encouraging response
User: "What's the salary like?" → Show jobs [1,3,6] + mention salary ranges vary
User: "Tell me about Cygnet Group" → NO jobs, just company info
User: "How do I apply?" → NO jobs, just application process info
User: "What services does Cygnet provide?" → NO jobs, just services info
User: "Tell me about mental health roles" → Show jobs [1,3,5] + brief mental health info

Your entire response MUST be valid JSON. Only include job IDs when the user is specifically asking about careers or job opportunities.`;

      // Analyze user input for job matching (backup logic)
      const analyzeUserInput = (input) => {
        const lowerInput = input.toLowerCase();
        
        // Check if this is a job/career-related query
        const isJobQuery = lowerInput.includes('job') || lowerInput.includes('role') || 
                          lowerInput.includes('position') || lowerInput.includes('career') || 
                          lowerInput.includes('work') || lowerInput.includes('salary') || 
                          lowerInput.includes('training') || lowerInput.includes('qualification') ||
                          lowerInput.includes('nurse') || lowerInput.includes('support worker') ||
                          lowerInput.includes('healthcare') || lowerInput.includes('opportunity') ||
                          lowerInput.includes('hiring') || lowerInput.includes('vacancy') ||
                          lowerInput.includes('apply') || lowerInput.includes('mental health') ||
                          lowerInput.includes('learning disabilit') || lowerInput.includes('clinical');
        
        // If not a job query, return empty array
        if (!isJobQuery) {
          return [];
        }
        
        let suggestedJobs = [];
        
        // Mental health related
        if (lowerInput.includes('mental health') || lowerInput.includes('nursing') || lowerInput.includes('nurse')) {
          suggestedJobs = [1, 3, 5]; // Mental Health Nurse, Clinical Psychologist, Mental Health Support Worker
        }
        // Support worker related
        else if (lowerInput.includes('support worker') || lowerInput.includes('learning disabilit') || lowerInput.includes('support')) {
          suggestedJobs = [2, 5]; // Support Worker LD, Mental Health Support Worker
        }
        // Entry level
        else if (lowerInput.includes('entry level') || lowerInput.includes('no experience') || lowerInput.includes('new to healthcare') || lowerInput.includes('beginner') || lowerInput.includes('starting out')) {
          suggestedJobs = [2, 4, 5]; // Support Worker, Healthcare Assistant, Mental Health Support Worker
        }
        // Clinical roles
        else if (lowerInput.includes('clinical') || lowerInput.includes('psychologist') || lowerInput.includes('therapy') || lowerInput.includes('therapist')) {
          suggestedJobs = [3, 6]; // Clinical Psychologist, Occupational Therapist
        }
        // Part-time/flexible
        else if (lowerInput.includes('part-time') || lowerInput.includes('flexible') || lowerInput.includes('part time')) {
          suggestedJobs = [4, 6]; // Healthcare Assistant, Occupational Therapist
        }
        // Location-based (show variety)
        else if (lowerInput.includes('london')) {
          suggestedJobs = [1]; // Mental Health Nurse in London
        }
        else if (lowerInput.includes('birmingham')) {
          suggestedJobs = [2]; // Support Worker in Birmingham
        }
        else if (lowerInput.includes('manchester')) {
          suggestedJobs = [3]; // Clinical Psychologist in Manchester
        }
        else if (lowerInput.includes('stockport')) {
          suggestedJobs = [5]; // Mental Health Support Worker in Stockport
        }
        // General healthcare/career questions
        else if (lowerInput.includes('healthcare') || lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('work') || lowerInput.includes('role') || lowerInput.includes('position') || lowerInput.includes('opportunity') || lowerInput.includes('salary') || lowerInput.includes('training') || lowerInput.includes('qualification')) {
          suggestedJobs = [1, 2, 4]; // Good mix of different levels
        }
        
        return suggestedJobs;
      };

      // Build conversation history for context
      const buildConversationHistory = () => {
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
          max_tokens: 600, // Reduced for more concise responses
          temperature: 0.7, // Slightly lower for more consistent job matching
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
        matchingJobs: fallbackJobs, // Only show jobs if it's a job-related query
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
      className="w-full relative bg-transparent" 
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: '400px' // Minimum height to ensure usability
      }}
    >
      {/* Main chat container - scrollable content */}
      <div className="relative z-10 pb-40 px-12">
        {/* CV Status */}
        {userCV && (
          <div className="mt-4 mb-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
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

        {/* Messages */}
        <div className="py-2 space-y-12">
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{
                paddingTop: message.id === 1 && index === 0 ? '40px' : '0px',
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {message.type === 'user' ? (
                    // User message layout - icon on left, blue text on transparent background
                    <>
                      <div className="flex-1 text-right">
                        <div className="inline-block">
                          <div style={{color: '#0068A3'}} className="leading-relaxed text-lg px-4 py-2">
                            {message.content}
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8" style={{color: '#0068A3'}} />
                      </div>
                    </>
                  ) : (
                    // AI message layout - rounded box with icon inside top left
                    <>
                      <div className="flex-1">
                        <div className="bg-transparent border border-gray-200 rounded-3xl p-10 relative">
                          {/* Icon inside the box, top left */}
                          <div className="absolute top-8 left-8 w-12 h-12">
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
                          
                          {/* Message content with left padding to account for icon */}
                          <div className="pl-20 text-slate-600 leading-relaxed text-lg font-normal">
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
                                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-4 text-left transition-all duration-300 hover:transform hover:scale-105 hover:shadow-sm group"
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
                                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-4 text-left transition-all duration-300 hover:transform hover:scale-105 hover:shadow-sm group"
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
                                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-4 text-left transition-all duration-300 hover:transform hover:scale-105 hover:shadow-sm group"
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
                                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-4 text-left transition-all duration-300 hover:transform hover:scale-105 hover:shadow-sm group"
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
                            <div className="pl-20 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {sampleJobs
                                .filter(job => message.matchingJobs.includes(job.id))
                                .map(job => (
                                  <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-sm group">
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
            <div className="flex justify-start animate-fade-in-up" style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
              <div className="bg-transparent border border-gray-200 rounded-3xl p-10 relative">
                <div className="absolute top-8 left-8 w-12 h-12">
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
                <div className="pl-20 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed/Floating at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-12 pb-16 bg-transparent z-50">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about healthcare roles, locations, or get career advice..."
            className="w-full resize-none rounded-full px-6 py-6 pr-32 focus:outline-none bg-white text-slate-700 placeholder-slate-400 text-sm shadow-sm border-2 border-white"
            style={{
              minHeight: '72px',
              maxHeight: Math.min(window.innerHeight * 0.2, 140) + 'px',
              boxShadow: '0 0 0 2px white, 0 0 20px rgba(117, 205, 214, 0.3)',
              animation: 'pulse-glow 2s ease-in-out infinite alternate'
            }}
            disabled={isLoading}
            onInput={(e) => {
              e.target.style.height = 'auto';
              const maxHeight = Math.min(window.innerHeight * 0.2, 140);
              e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + 'px';
            }}
          />
          
          <style jsx>{`
            @keyframes pulse-glow {
              0% {
                box-shadow: 0 0 0 2px white, 0 0 20px rgba(117, 205, 214, 0.3);
              }
              100% {
                box-shadow: 0 0 0 2px white, 0 0 30px rgba(117, 205, 214, 0.6);
              }
            }
            
            @keyframes fadeInUp {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-fade-in-up {
              animation: fadeInUp 0.5s ease-out forwards;
            }
          `}</style>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Button container - positioned to align with textarea center */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
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
                <div className="absolute right-0 bottom-full mb-2 bg-slate-600 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-xs z-50">
                  Upload your CV for personalized matches
                  <div className="absolute top-full right-4 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-600"></div>
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
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-sky-100">
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
