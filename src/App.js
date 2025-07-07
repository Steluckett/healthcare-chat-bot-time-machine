<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fresh Jobs Chat</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lucide-react/0.263.1/lucide-react.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: transparent;
            min-height: 100vh;
        }

        /* Container Styles */
        .chat-container {
            min-height: 100vh;
            position: relative;
            background: transparent;
        }

        .messages-container {
            max-width: 80rem;
            margin: 0 auto;
            padding: 2rem 1.5rem 10rem;
        }

        .messages-list {
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }

        /* CV Status Styles */
        .cv-status {
            margin-bottom: 2rem;
            background: rgba(240, 253, 244, 0.8);
            border: 1px solid #bbf7d0;
            border-radius: 1.5rem;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .cv-status-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .cv-status-icon {
            width: 1.5rem;
            height: 1.5rem;
            color: #16a34a;
        }

        .cv-status-text {
            color: #166534;
            font-weight: 500;
        }

        .cv-status-subtext {
            color: #16a34a;
            font-size: 0.875rem;
            font-weight: 300;
        }

        .cv-status-close {
            color: #16a34a;
            transition: color 0.2s ease;
        }

        .cv-status-close:hover {
            color: #166534;
        }

        /* Message Styles */
        .message-wrapper {
            display: flex;
        }

        .message-wrapper.user {
            justify-content: flex-end;
        }

        .message-wrapper.ai {
            justify-content: flex-start;
        }

        .message-wrapper.initial {
            padding-top: 10rem;
        }

        .message-content {
            max-width: 64rem;
            order: 1;
        }

        .message-content.user {
            order: 2;
        }

        .message-layout {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }

        .message-layout.user {
            flex-direction: row-reverse;
        }

        /* Avatar Styles */
        .avatar {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .avatar.ai {
            background: linear-gradient(to right, #005994, #BFD12F);
        }

        .avatar.user {
            background: #d1d5db;
        }

        .avatar-icon {
            width: 1.5rem;
            height: 1.5rem;
            color: white;
        }

        .avatar-icon.user {
            color: #4b5563;
        }

        /* Message Bubble Styles */
        .message-bubble {
            flex: 1;
            display: inline-block;
            border-radius: 1.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .message-bubble.user {
            background: rgb(0, 89, 148);
            color: white;
            padding: 1.5rem;
            text-align: right;
        }

        .message-bubble.ai {
            background: rgba(255, 255, 255, 0.8);
            color: #1f2937;
            border: 1px solid rgba(229, 231, 235, 0.5);
            padding: 2.5rem;
            text-align: left;
        }

        .message-text {
            white-space: pre-wrap;
            line-height: 1.6;
            font-weight: 300;
            font-size: 1rem;
        }

        .message-timestamp {
            font-size: 0.875rem;
            color: #9ca3af;
            margin-top: 1rem;
            font-weight: 300;
        }

        .message-timestamp.user {
            text-align: right;
        }

        .message-timestamp.ai {
            text-align: left;
        }

        /* Quick Actions Styles */
        .quick-actions {
            margin-top: 2rem;
        }

        .quick-actions-intro {
            color: #4b5563;
            font-size: 0.875rem;
            margin-bottom: 1rem;
            font-weight: 300;
        }

        .quick-actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }

        .quick-action-btn {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e5e7eb;
            border-radius: 1.5rem;
            padding: 1.5rem;
            text-align: left;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .quick-action-btn:hover {
            background: white;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .quick-action-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }

        .quick-action-icon {
            width: 2rem;
            height: 2rem;
            flex-shrink: 0;
            transition: color 0.2s ease;
        }

        .quick-action-icon.upload {
            color: #2563eb;
        }

        .quick-action-icon.mental-health {
            color: #ef4444;
        }

        .quick-action-icon.support {
            color: #16a34a;
        }

        .quick-action-icon.entry-level {
            color: #9333ea;
        }

        .quick-action-btn:hover .quick-action-icon.upload {
            color: #1d4ed8;
        }

        .quick-action-btn:hover .quick-action-icon.mental-health {
            color: #dc2626;
        }

        .quick-action-btn:hover .quick-action-icon.support {
            color: #15803d;
        }

        .quick-action-btn:hover .quick-action-icon.entry-level {
            color: #7c3aed;
        }

        .quick-action-title {
            color: #111827;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        .quick-action-description {
            color: #4b5563;
            font-size: 0.875rem;
            font-weight: 300;
        }

        /* Job Cards Styles */
        .job-cards-container {
            margin-top: 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .job-card {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 1.5rem;
            padding: 1.5rem;
            border: 1px solid rgba(229, 231, 235, 0.5);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .job-card:hover {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .job-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .job-card-category {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(219, 234, 254, 0.8);
            color: #1d4ed8;
            font-size: 0.875rem;
            border-radius: 1.5rem;
            font-weight: 400;
        }

        .job-card-posted {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 300;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .job-card-posted-icon {
            width: 1rem;
            height: 1rem;
        }

        .job-card-title {
            color: #111827;
            margin-bottom: 0.75rem;
            font-size: 1rem;
            line-height: 1.3;
            font-weight: 500;
        }

        .job-card-description {
            color: #4b5563;
            font-size: 0.875rem;
            margin-bottom: 1rem;
            font-weight: 300;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .job-card-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 1rem;
            font-weight: 300;
        }

        .job-card-meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .job-card-meta-icon {
            width: 1rem;
            height: 1rem;
        }

        .job-card-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .job-card-skill {
            background: rgba(243, 244, 246, 0.8);
            color: #374151;
            padding: 0.5rem 0.75rem;
            border-radius: 1rem;
            font-weight: 300;
            font-size: 0.75rem;
        }

        .job-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .job-card-salary {
            color: #111827;
            font-size: 1rem;
            font-weight: 500;
        }

        .job-card-view-btn {
            background: linear-gradient(to right, #005994, #BFD12F);
            color: white;
            padding: 0.75rem 1.25rem;
            border-radius: 1rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 400;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .job-card-view-btn:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .job-card-view-icon {
            width: 1rem;
            height: 1rem;
        }

        /* Loading Indicator */
        .loading-container {
            display: flex;
            justify-content: flex-start;
        }

        .loading-layout {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }

        .loading-bubble {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 1.5rem;
            padding: 2.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(229, 231, 235, 0.5);
        }

        .loading-dots {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .loading-dot {
            width: 0.75rem;
            height: 0.75rem;
            background: #9ca3af;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
        }

        .loading-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .loading-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }

        /* Input Container */
        .input-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding-top: 2rem;
        }

        .input-wrapper {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 1.5rem 2rem;
        }

        .input-relative {
            position: relative;
        }

        .input-textarea {
            width: 100%;
            resize: none;
            border: 0;
            border-radius: 9999px;
            padding: 2rem 2.5rem;
            padding-right: 8rem;
            outline: none;
            background: white;
            color: #374151;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            font-size: 1.125rem;
            font-weight: 300;
            font-family: 'Figtree', sans-serif;
            min-height: 72px;
            max-height: 140px;
        }

        .input-textarea:focus {
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .input-textarea::placeholder {
            color: #9ca3af;
        }

        .input-textarea:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .file-input {
            display: none;
        }

        .upload-btn {
            position: absolute;
            right: 5rem;
            top: 1.25rem;
            color: #6b7280;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .upload-btn:hover {
            color: #374151;
            background: #f9fafb;
        }

        .upload-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .upload-btn-icon {
            width: 1.25rem;
            height: 1.25rem;
        }

        .tooltip {
            position: absolute;
            right: 3.5rem;
            top: 0;
            transform: translateY(-100%);
            background: white;
            color: #1f2937;
            padding: 0.75rem 1rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            white-space: nowrap;
            font-size: 0.875rem;
            font-weight: 500;
            z-index: 50;
            margin-bottom: 0.5rem;
        }

        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 4px solid white;
        }

        .send-btn {
            position: absolute;
            right: 1rem;
            top: 1.25rem;
            background: rgb(0, 89, 148);
            color: white;
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .send-btn:hover {
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .send-btn-icon {
            width: 1.5rem;
            height: 1.5rem;
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            z-index: 999999999 !important;
        }

        .modal-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 1.5rem;
            max-width: 48rem;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(229, 231, 235, 0.5);
        }

        .modal-inner {
            padding: 2.5rem;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2.5rem;
        }

        .modal-header-content {
            flex: 1;
        }

        .modal-category {
            display: inline-block;
            padding: 0.75rem 1.25rem;
            background: rgba(219, 234, 254, 0.8);
            color: #1d4ed8;
            font-size: 1rem;
            border-radius: 1.5rem;
            margin-bottom: 1.5rem;
            font-weight: 400;
        }

        .modal-title {
            font-size: 2.25rem;
            color: #111827;
            margin-bottom: 1rem;
            line-height: 1.1;
            font-weight: 500;
        }

        .modal-company {
            color: #4b5563;
            font-size: 1.25rem;
            font-weight: 300;
        }

        .modal-close {
            color: #9ca3af;
            font-size: 1.875rem;
            width: 3rem;
            height: 3rem;
            border-radius: 1.5rem;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 300;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-close:hover {
            color: #4b5563;
            background: rgba(243, 244, 246, 0.5);
        }

        .modal-body {
            margin-bottom: 2.5rem;
        }

        .modal-meta {
            display: flex;
            align-items: center;
            gap: 2.5rem;
            color: #4b5563;
            flex-wrap: wrap;
            margin-bottom: 2rem;
            font-weight: 300;
        }

        .modal-meta-item {
            display: flex;
            align-items: center;
            font-size: 1.125rem;
            gap: 1rem;
        }

        .modal-meta-icon {
            width: 1.5rem;
            height: 1.5rem;
            color: #9ca3af;
        }

        .modal-salary {
            font-size: 1.875rem;
            color: #111827;
            font-weight: 400;
            margin-bottom: 2rem;
        }

        .modal-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .modal-skill {
            background: rgba(243, 244, 246, 0.8);
            color: #374151;
            padding: 0.75rem 1.25rem;
            border-radius: 1.5rem;
            font-size: 1rem;
            font-weight: 300;
        }

        .modal-description-section {
            margin-bottom: 2.5rem;
        }

        .modal-description-title {
            font-size: 1.5rem;
            color: #111827;
            margin-bottom: 1.5rem;
            font-weight: 400;
        }

        .modal-description-text {
            color: #374151;
            line-height: 1.6;
            white-space: pre-line;
            font-size: 1.125rem;
            font-weight: 300;
        }

        .modal-footer {
            border-top: 1px solid rgba(229, 231, 235, 0.5);
            padding-top: 2.5rem;
        }

        .modal-apply-btn {
            width: 100%;
            background: linear-gradient(to right, #005994, #BFD12F);
            color: white;
            padding: 1.25rem 2.5rem;
            border-radius: 1.5rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-size: 1.25rem;
            font-weight: 400;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .modal-apply-btn:hover {
            box-shadow: 0 35px 60px rgba(0, 0, 0, 0.2);
        }

        .modal-apply-icon {
            width: 1.5rem;
            height: 1.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .messages-container {
                padding: 1rem 1rem 8rem;
            }

            .message-layout {
                gap: 0.75rem;
            }

            .avatar {
                width: 2.5rem;
                height: 2.5rem;
            }

            .message-bubble.ai {
                padding: 1.5rem;
            }

            .quick-actions-grid {
                grid-template-columns: 1fr;
            }

            .job-cards-container {
                grid-template-columns: 1fr;
            }

            .input-textarea {
                padding: 1.5rem 2rem;
                padding-right: 6rem;
                font-size: 1rem;
            }

            .upload-btn {
                right: 4rem;
                top: 1rem;
            }

            .send-btn {
                right: 0.75rem;
                top: 1rem;
                width: 3rem;
                height: 3rem;
            }

            .modal-inner {
                padding: 1.5rem;
            }

            .modal-title {
                font-size: 1.75rem;
            }

            .modal-meta {
                gap: 1.5rem;
            }

            .modal-meta-item {
                font-size: 1rem;
            }

            .modal-salary {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useRef, useEffect } = React;
        const { Send, MapPin, Clock, Briefcase, Sparkles, ArrowRight, User, Upload, FileText, X, Heart } = lucide;

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

            const handleSendMessage = () => {
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

                // Simulate AI response with job matching
                setTimeout(() => {
                    const aiMessage = {
                        id: Date.now() + 1,
                        type: 'ai',
                        content: "I'd be happy to help you explore healthcare opportunities at Cygnet Group! Here are some roles that might interest you based on your inquiry.",
                        matchingJobs: [1, 2, 4], // Show some sample jobs
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, aiMessage]);
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
                <div className="chat-container">
                    {/* Messages Container */}
                    <div className="messages-container">
                        
                        {/* CV Status */}
                        {userCV && (
                            <div className="cv-status">
                                <div className="cv-status-content">
                                    <FileText className="cv-status-icon" />
                                    <div>
                                        <p className="cv-status-text">{userCV.name}</p>
                                        <p className="cv-status-subtext">
                                            CV uploaded and analyzed
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setUserCV(null)}
                                    className="cv-status-close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <div className="messages-list">
                            {messages.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={`message-wrapper ${message.type} ${message.id === 1 ? 'initial' : ''}`}
                                >
                                    <div className={`message-content ${message.type}`}>
                                        <div className={`message-layout ${message.type}`}>
                                            {/* Avatar */}
                                            <div className={`avatar ${message.type}`}>
                                                {message.type === 'ai' ? (
                                                    <Sparkles className="avatar-icon" />
                                                ) : (
                                                    <User className="avatar-icon user" />
                                                )}
                                            </div>
                                            
                                            {/* Message Content */}
                                            <div className="flex-1">
                                                <div className={`message-bubble ${message.type}`}>
                                                    <div className="message-text">
                                                        {message.content}
                                                    </div>
                                                    
                                                    {/* Quick Action Prompts - only show after initial message */}
                                                    {message.id === 1 && (
                                                        <div className="quick-actions">
                                                            <p className="quick-actions-intro">
                                                                Choose an option to get started:
                                                            </p>
                                                            <div className="quick-actions-grid">
                                                                <button
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                    className="quick-action-btn"
                                                                >
                                                                    <div className="quick-action-content">
                                                                        <Upload className="quick-action-icon upload" />
                                                                        <div>
                                                                            <h4 className="quick-action-title">Upload Your CV</h4>
                                                                            <p className="quick-action-description">
                                                                                Get personalized job matches based on your experience
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => {
                                                                        setInputValue("I'm looking for mental health nursing roles");
                                                                        document.querySelector('.input-textarea').focus();
                                                                    }}
                                                                    className="quick-action-btn"
                                                                >
                                                                    <div className="quick-action-content">
                                                                        <Heart className="quick-action-icon mental-health" />
                                                                        <div>
                                                                            <h4 className="quick-action-title">Mental Health Roles</h4>
                                                                            <p className="quick-action-description">
                                                                                Explore nursing and support positions in mental health
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => {
                                                                        setInputValue("Show me support worker positions for learning disabilities");
                                                                        document.querySelector('.input-textarea').focus();
                                                                    }}
                                                                    className="quick-action-btn"
                                                                >
                                                                    <div className="quick-action-content">
                                                                        <User className="quick-action-icon support" />
                                                                        <div>
                                                                            <h4 className="quick-action-title">Support Worker Roles</h4>
                                                                            <p className="quick-action-description">
                                                                                Find opportunities in learning disabilities support
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => {
                                                                        setInputValue("I'm new to healthcare - what entry level positions are available?");
                                                                        document.querySelector('.input-textarea').focus();
                                                                    }}
                                                                    className="quick-action-btn"
                                                                >
                                                                    <div className="quick-action-content">
                                                                        <Sparkles className="quick-action-icon entry-level" />
                                                                        <div>
                                                                            <h4 className="quick-action-title">New to Healthcare</h4>
                                                                            <p className="quick-action-description">
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
                                                        <div className="job-cards-container">
                                                            {sampleJobs
                                                                .filter(job => message.matchingJobs.includes(job.id))
                                                                .map(job => (
                                                                    <div key={job.id} className="job-card">
                                                                        <div className="job-card-header">
                                                                            <div className="job-card-category">
                                                                                {job.category}
                                                                            </div>
                                                                            <span className="job-card-posted">
                                                                                <Clock className="job-card-posted-icon" />
                                                                                {job.posted}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        <h4 className="job-card-title">{job.title}</h4>
                                                                        <p className="job-card-description">{job.description}</p>
                                                                        
                                                                        <div className="job-card-meta">
                                                                            <span className="job-card-meta-item">
                                                                                <MapPin className="job-card-meta-icon" />
                                                                                {job.location}
                                                                            </span>
                                                                            <span className="job-card-meta-item">
                                                                                <Briefcase className="job-card-meta-icon" />
                                                                                {job.type}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        <div className="job-card-skills">
                                                                            {job.skills.slice(0, 2).map((skill, index) => (
                                                                                <span key={index} className="job-card-skill">
                                                                                    {skill}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        
                                                                        <div className="job-card-footer">
                                                                            <div className="job-card-salary">{job.salary}</div>
                                                                            <button
                                                                                onClick={() => handleJobClick(job)}
                                                                                className="job-card-view-btn"
                                                                            >
                                                                                <span>View Details</span>
                                                                                <ArrowRight className="job-card-view-icon" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Timestamp */}
                                                <div className={`message-timestamp ${message.type}`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="loading-container">
                                    <div className="loading-layout">
                                        <div className="avatar ai">
                                            <Sparkles className="avatar-icon" />
                                        </div>
                                        <div className="loading-bubble">
                                            <div className="loading-dots">
                                                <div className="loading-dot"></div>
                                                <div className="loading-dot"></div>
                                                <div className="loading-dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Fixed Input */}
                    <div className="input-container">
                        <div className="input-wrapper">
                            <div className="input-relative">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about healthcare roles, locations, or get career advice..."
                                    className="input-textarea"
                                    rows="1"
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
                                    className="file-input"
                                />
                                
                                {/* CV Upload Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    className="upload-btn"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <Upload className="upload-btn-icon" />
                                </button>
                                
                                {/* Tooltip */}
                                {showTooltip && (
                                    <div className="tooltip">
                                        Share your CV and I'll find the best role matches for you
                                    </div>
                                )}
                                
                                {/* Send Button */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !inputValue.trim()}
                                    className="send-btn"
                                >
                                    <Send className="send-btn-icon" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Job Modal */}
                    {showJobModal && selectedJob && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div className="modal-inner">
                                    <div className="modal-header">
                                        <div className="modal-header-content">
                                            <div className="modal-category">
                                                {selectedJob.category}
                                            </div>
                                            <h2 className="modal-title">{selectedJob.title}</h2>
                                            <p className="modal-company">{selectedJob.company}</p>
                                        </div>
                                        <button
                                            onClick={closeJobModal}
                                            className="modal-close"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="modal-meta">
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
                                                <span key={index} className="modal-skill">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="modal-description-section">
                                        <h3 className="modal-description-title">Job Description</h3>
                                        <div className="modal-description-text">
                                            {selectedJob.fullDescription || selectedJob.description}
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            onClick={() => handleApply(selectedJob)}
                                            className="modal-apply-btn"
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

        ReactDOM.render(<FreshJobsChat />, document.getElementById('root'));
    </script>
</body>
</html>
