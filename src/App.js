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
      // Enhanced system prompt with mandatory job matching
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

CRITICAL INSTRUCTION - ALWAYS SHOW JOBS:
You MUST always include relevant job IDs in your response. Even for general questions, show the most relevant jobs. Never respond without showing job tiles unless the user is asking something completely unrelated to careers (like asking about the weather).

JOB MATCHING RULES:
- If they mention "mental health" or "nursing" → show jobs 1, 3, 5 (Mental Health Nurse, Clinical Psychologist, Mental Health Support Worker)
- If they mention "support worker" or "learning disabilities" → show jobs 2, 5 (Support Worker LD, Mental Health Support Worker)
- If they mention "entry level", "no experience", "new to healthcare" → show jobs 2, 4, 5 (Support Worker, Healthcare Assistant, Mental Health Support Worker)
- If they mention "clinical", "psychologist", "therapy" → show jobs 3, 6 (Clinical Psychologist, Occupational Therapist)
- If they mention "part-time" or "flexible" → show jobs 4, 6 (Healthcare Assistant, Occupational Therapist)
- If they mention specific locations → show jobs in/near that location
- If they ask general questions about careers → show jobs 1, 2, 4 (mix of different levels)
- If they ask about salary/benefits → show jobs 1, 3, 6 (different salary ranges)
- If they ask about training → show jobs 2, 4, 5 (mention training provided)
- For ANY career-related question → show at least 2-3 relevant jobs

CONVERSATION STYLE:
- Be warm, encouraging, and genuinely helpful
- Keep responses to 2-3 sentences maximum
- Don't list job details - the job tiles will show everything
- Always be enthusiastic about showing opportunities
- Ask one follow-up question to keep conversation flowing

RESPONSE FORMAT:
Respond with a JSON object containing:
{
  "response": "Brief, encouraging response (2-3 sentences max)",
  "matchingJobs": [REQUIRED - array of job IDs that match their query - minimum 2-3 jobs unless completely unrelated to careers],
  "followUpQuestions": [optional single follow-up question]
}

EXAMPLES:
User: "I'm thinking about healthcare" → Show jobs [1,2,4] + encouraging response
User: "What's the salary like?" → Show jobs [1,3,6] + mention salary ranges vary
User: "Tell me about mental health roles" → Show jobs [1,3,5] + brief mental health info
User: "I'm new to this field" → Show jobs [2,4,5] + mention training provided

Your entire response MUST be valid JSON and MUST include job IDs unless completely unrelated to careers.`;

      // Analyze user input for job matching (backup logic)
      const analyzeUserInput = (input) => {
        const lowerInput = input.toLowerCase();
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
        // Default fallback - show variety
        else {
          suggestedJobs = [1, 2, 4]; // Default mix
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

      // Ensure we always have jobs to show (backup safety net)
      if (!aiResponse.matchingJobs || aiResponse.matchingJobs.length === 0) {
        console.log('No jobs in AI response, applying backup logic');
        aiResponse.matchingJobs = analyzeUserInput(inputValue);
      }

      // Final safety net - if still no jobs, show default mix
      if (!aiResponse.matchingJobs || aiResponse.matchingJobs.length === 0) {
        aiResponse.matchingJobs = [1, 2, 4]; // Default variety
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
      
      // Enhanced fallback with guaranteed job matching
      const fallbackJobs = analyzeUserInput(inputValue);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm here to help you explore exciting healthcare opportunities at Cygnet Group! Here are some great roles that might interest you based on what you're looking for.",
        matchingJobs: fallbackJobs.length > 0 ? fallbackJobs : [1, 2, 4], // Always show jobs
        followUpQuestions: ["What type of healthcare role interests you most?"],
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
    <div className="min-h-screen relative bg-transparent" style={{fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      {/* Messages Container */}
      <div className="max-w-5xl mx-auto px-6 py-8 pb-40">
        
        {/* CV Status */}
        {userCV && (
          <div className="mb-8 bg-green-50/80 border border-green-200 rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">{userCV.name}</p>
                <p className="text-green-600 text-sm" style={{fontWeight: 300}}>
                  CV uploaded and analyzed
                </p>
              </div>
            </div>
            <button
              onClick={() => setUserCV(null)}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="space-y-12">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{
                paddingTop: message.id === 1 ? '160px' : '0px'
              }}
            >
              <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.type === 'ai' 
                      ? '' 
                      : 'bg-gray-300'
                  }`} style={message.type === 'ai' ? {background: 'linear-gradient(to right, #005994, #BFD12F)'} : {}}>
                    {message.type === 'ai' ? (
                      <Sparkles className="w-6 h-6 text-white" />
                    ) : (
                      <User className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block rounded-3xl shadow-lg ${
                      message.type === 'user' 
                        ? 'text-white p-6' 
                        : 'bg-white/80 text-gray-800 border border-gray-200/50 p-10'
                    }`} style={message.type === 'user' ? {background: 'rgb(0, 89, 148)'} : {}}>
                      <div className="whitespace-pre-wrap leading-relaxed" style={{fontWeight: 300, fontSize: '1rem'}}>
                        {message.content}
                      </div>
                      
                      {/* Quick Action Prompts - only show after initial message */}
                      {message.id === 1 && (
                        <div className="mt-8 space-y-4">
                          <p className="text-gray-600 text-sm mb-4" style={{fontWeight: 300}}>
                            Choose an option to get started:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white/90 hover:bg-white border border-gray-200 rounded-3xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
                            >
                              <div className="flex items-start space-x-4">
                                <Upload className="w-8 h-8 text-blue-600 group-hover:text-blue-700 flex-shrink-0" />
                                <div>
                                  <h4 className="text-gray-900 font-medium mb-2">Upload Your CV</h4>
                                  <p className="text-gray-600 text-sm" style={{fontWeight: 300}}>
                                    Get personalized job matches based on your experience
                                  </p>
                                </div>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => {
                                setInputValue("I'm looking for mental health nursing roles");
                                document.querySelector('textarea').focus();
                              }}
                              className="bg-white/90 hover:bg-white border border-gray-200 rounded-3xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
                            >
                              <div className="flex items-start space-x-4">
                                <Heart className="w-8 h-8 text-red-500 group-hover:text-red-600 flex-shrink-0" />
                                <div>
                                  <h4 className="text-gray-900 font-medium mb-2">Mental Health Roles</h4>
                                  <p className="text-gray-600 text-sm" style={{fontWeight: 300}}>
                                    Explore nursing and support positions in mental health
                                  </p>
                                </div>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => {
                                setInputValue("Show me support worker positions for learning disabilities");
                                document.querySelector('textarea').focus();
                              }}
                              className="bg-white/90 hover:bg-white border border-gray-200 rounded-3xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
                            >
                              <div className="flex items-start space-x-4">
                                <User className="w-8 h-8 text-green-600 group-hover:text-green-700 flex-shrink-0" />
                                <div>
                                  <h4 className="text-gray-900 font-medium mb-2">Support Worker Roles</h4>
                                  <p className="text-gray-600 text-sm" style={{fontWeight: 300}}>
                                    Find opportunities in learning disabilities support
                                  </p>
                                </div>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => {
                                setInputValue("I'm new to healthcare - what entry level positions are available?");
                                document.querySelector('textarea').focus();
                              }}
                              className="bg-white/90 hover:bg-white border border-gray-200 rounded-3xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
                            >
                              <div className="flex items-start space-x-4">
                                <Sparkles className="w-8 h-8 text-purple-600 group-hover:text-purple-700 flex-shrink-0" />
                                <div>
                                  <h4 className="text-gray-900 font-medium mb-2">New to Healthcare</h4>
                                  <p className="text-gray-600 text-sm" style={{fontWeight: 300}}>
                                    Discover entry-level opportunities and training roles
                                  </p>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Job Cards */}
                      {message.matchingJobs && message.matchingJobs.length > 0 && (
                        <div className="mt-8" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                          {sampleJobs
                            .filter(job => message.matchingJobs.includes(job.id))
                            .map(job => (
                              <div key={job.id} className="bg-white/90 rounded-3xl p-6 border border-gray-200/50 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 hover:shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="inline-block px-4 py-2 bg-blue-100/80 text-blue-700 text-sm rounded-3xl" style={{fontWeight: 400}}>
                                    {job.category}
                                  </div>
                                  <span className="text-sm text-gray-500 flex items-center" style={{fontWeight: 300}}>
                                    <Clock className="w-4 h-4 mr-2" />
                                    {job.posted}
                                  </span>
                                </div>
                                
                                <h4 className="text-gray-900 mb-3 text-base leading-snug" style={{fontWeight: 500}}>{job.title}</h4>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{fontWeight: 300}}>{job.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4" style={{fontWeight: 300}}>
                                  <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {job.location}
                                  </span>
                                  <span className="flex items-center">
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    {job.type}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {job.skills.slice(0, 2).map((skill, index) => (
                                    <span key={index} className="bg-gray-100/80 text-gray-700 px-3 py-2 rounded-2xl" style={{fontWeight: 300, fontSize: '0.75rem'}}>
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-gray-900 text-base" style={{fontWeight: 500}}>{job.salary}</div>
                                  <button
                                    onClick={() => handleJobClick(job)}
                                    className="text-white px-5 py-3 rounded-2xl transition-colors flex items-center space-x-2 text-sm shadow-md hover:shadow-lg"
                                    style={{background: 'linear-gradient(to right, #005994, #BFD12F)', fontWeight: 400}}
                                  >
                                    <span>View Details</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-sm text-gray-400 mt-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`} style={{fontWeight: 300}}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(to right, #005994, #BFD12F)'}}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/80 rounded-3xl p-10 shadow-lg border border-gray-200/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input */}
      <div className="fixed bottom-0 left-0 right-0 pt-8">
        <div className="max-w-5xl mx-auto px-6 pb-8">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about healthcare roles, locations, or get career advice..."
              className="w-full resize-none border-0 rounded-full px-10 py-8 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-gray-700 placeholder-gray-400 shadow-xl text-lg"
              rows="1"
              style={{ minHeight: '72px', maxHeight: '140px', fontWeight: 300, fontFamily: 'Figtree' }}
              disabled={isLoading}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
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
            
            {/* CV Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="absolute right-20 top-7 text-gray-500 hover:text-gray-700 w-12 h-12 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center hover:bg-gray-50"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Upload className="w-5 h-5" />
            </button>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute right-14 top-0 transform -translate-y-full bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-lg border border-gray-200 whitespace-nowrap text-sm font-medium z-50 mb-2">
                Share your CV and I'll find the best role matches for you
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
            )}
            
            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-4 top-7 text-white w-14 h-14 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              style={{backgroundColor: 'rgb(0, 89, 148)'}}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Job Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-md flex items-center justify-center z-50 p-8">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50">
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="inline-block px-5 py-3 bg-blue-100/80 text-blue-700 text-base rounded-3xl mb-6" style={{fontWeight: 400}}>
                    {selectedJob.category}
                  </div>
                  <h2 className="text-4xl text-gray-900 mb-4 leading-tight" style={{fontWeight: 500}}>{selectedJob.title}</h2>
                  <p className="text-gray-600 text-xl" style={{fontWeight: 300}}>{selectedJob.company}</p>
                </div>
                <button
                  onClick={closeJobModal}
                  className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 rounded-3xl hover:bg-gray-100/50 transition-colors" style={{fontWeight: 300}}
                >
                  ×
                </button>
              </div>

              <div className="space-y-8 mb-10">
                <div className="flex items-center gap-10 text-gray-600 flex-wrap" style={{fontWeight: 300}}>
                  <span className="flex items-center text-lg">
                    <MapPin className="w-6 h-6 mr-4 text-gray-400" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center text-lg">
                    <Briefcase className="w-6 h-6 mr-4 text-gray-400" />
                    {selectedJob.type}
                  </span>
                  <span className="flex items-center text-lg">
                    <Clock className="w-6 h-6 mr-4 text-gray-400" />
                    {selectedJob.posted}
                  </span>
                </div>

                <div className="text-3xl text-gray-900" style={{fontWeight: 400}}>{selectedJob.salary}</div>

                <div className="flex flex-wrap gap-4">
                  {selectedJob.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100/80 text-gray-700 px-5 py-3 rounded-3xl text-base" style={{fontWeight: 300}}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl text-gray-900 mb-6" style={{fontWeight: 400}}>Job Description</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg" style={{fontWeight: 300}}>
                  {selectedJob.fullDescription || selectedJob.description}
                </div>
              </div>

              <div className="border-t border-gray-200/50 pt-10">
                <button
                  onClick={() => handleApply(selectedJob)}
                  className="w-full text-white py-5 px-10 rounded-3xl transition-colors flex items-center justify-center space-x-4 text-xl shadow-xl hover:shadow-2xl"
                  style={{background: 'linear-gradient(to right, #005994, #BFD12F)', fontWeight: 400}}
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

export default FreshJobsChat;
