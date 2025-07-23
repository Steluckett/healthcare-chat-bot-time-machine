// src/utils/utils.js

import { cityCoordinates } from '../data/jobsData';

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
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
export const findJobsWithinRadius = (sampleJobs, userLocation, maxDistance = 30) => {
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
export const extractLocation = (filename, cvContent = '') => {
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
export const extractCVText = (file) => {
  const filename = file.name.toLowerCase();
  
  // Simulate reading CV content based on filename
  if (filename.includes('jane') || filename.includes('nurse') || filename.includes('stockport')) {
    return 'Jane Doe Address: 21 Meadow Lane, Stockport, SK4 2AA Registered Mental Health Nurse NMC PIN: RM12345678 experience mental health nursing acute inpatient ward Senior Mental Health Nurse 5 years experience';
  }
  
  return '';
};

// Analyze qualifications from CV content
export const analyzeQualifications = (cvContent) => {
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
export const filterJobsByQualifications = (jobs, qualifications) => {
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

// Analyze user input for job matching
export const analyzeUserInput = (input) => {
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
