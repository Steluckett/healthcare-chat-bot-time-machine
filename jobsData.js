// Job listings data for Fresh Jobs Chat
const jobsData = [
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
    },
    {
        id: 7,
        title: "Registered Nurse - CAMHS",
        company: "Cygnet Group",
        location: "Edinburgh, Scotland",
        salary: "£35,000 - £42,000",
        type: "Full-time",
        posted: "5 days ago",
        skills: ["Child Mental Health", "Family Therapy", "Crisis Intervention", "NMC Registration"],
        description: "Work with children and adolescents with mental health needs. Specialist training provided. Join our award-winning CAMHS team.",
        fullDescription: "Work with children and adolescents with mental health needs in our specialist CAMHS unit. This role offers the opportunity to work with a multidisciplinary team providing evidence-based interventions for young people aged 12-18. Specialist training provided including trauma-informed care and family therapy approaches. Join our award-winning CAMHS team and make a lasting impact on young lives.",
        applyUrl: "https://apply.cygnetgroup.com/job/camhs-nurse",
        category: "Mental Health"
    },
    {
        id: 8,
        title: "Senior Healthcare Assistant",
        company: "Cygnet Group",
        location: "Cardiff, Wales",
        salary: "£26,000 - £30,000",
        type: "Full-time",
        posted: "1 week ago",
        skills: ["Team Leadership", "Medication Administration", "Care Planning", "Mentoring"],
        description: "Lead a team of healthcare assistants in our learning disabilities service. Excellent progression opportunities to nursing roles.",
        fullDescription: "Lead a team of healthcare assistants in our learning disabilities service. This senior role involves supervising staff, supporting care planning, and mentoring new team members. Excellent progression opportunities available including supported pathways to nursing qualification. We offer comprehensive leadership training and competitive salary with excellent benefits package.",
        applyUrl: "https://apply.cygnetgroup.com/job/senior-hca",
        category: "Healthcare Support"
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
    'newcastle': { lat: 54.9783, lng: -1.6178 },
    'edinburgh': { lat: 55.9533, lng: -3.1883 },
    'cardiff': { lat: 51.4816, lng: -3.1791 }
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { jobsData, cityCoordinates };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.jobsData = jobsData;
    window.cityCoordinates = cityCoordinates;
}
