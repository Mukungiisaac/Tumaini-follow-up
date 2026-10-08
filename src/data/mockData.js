export const MOCK_MENTORS = [
  { id: 'm1', name: 'Sarah Johnson', role: 'Head Mentor', avatar: '/assets/mentors/sarah_j.jpg', email: 'sarah.j@tumaini.org' },
  { id: 'm2', name: 'David K.', role: 'Computer & Tech Mentor', avatar: '/assets/children/david_k.jpg', email: 'david.k@tumaini.org' },
  { id: 'm3', name: 'John D.', role: 'Discipleship Mentor', avatar: '/assets/children/samuel_o.jpg', email: 'john.d@tumaini.org' },
  { id: 'm4', name: 'Esther M.', role: 'Arts & Creative Mentor', avatar: '/assets/children/esther_l.jpg', email: 'esther.m@tumaini.org' },
];

export const HOUSE_IDS = ['1', '2', '3', '4', '5', '6'];

export const GRADE_LEVELS = [
  'Playgroup',
  'PP1',
  'PP2',
  ...Array.from({ length: 9 }, (_, index) => `Grade ${index + 1}`)
];

export const MOCK_HOUSES = HOUSE_IDS.map((id) => ({
  id,
  parentOne: '',
  parentTwo: ''
}));

export const SKILL_LEVELS = {
  NOT_INTRODUCED: { id: 'NOT_INTRODUCED', label: 'Not Yet Introduced', color: 'bg-slate-200 text-slate-600 border-slate-300', dot: 'bg-slate-400', level: 0 },
  LEARNING: { id: 'LEARNING', label: 'Learning', color: 'bg-[#F7F4EE] text-[#75674D] border-[#DCD4C4]', dot: 'bg-[#C2B59B]', level: 1 },
  WITH_HELP: { id: 'WITH_HELP', label: 'Can Do With Help', color: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', level: 2 },
  INDEPENDENT: { id: 'INDEPENDENT', label: 'Independent', color: 'bg-[#EBF5F7] text-[#134E5E] border-[#BBE0E6]', dot: 'bg-[#134E5E]', level: 3 },
  MASTERED: { id: 'MASTERED', label: 'Can Teach Others', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-600', level: 4 }
};

export const MOCK_CHILDREN = [
  {
    id: 'c1',
    name: 'Samuel O.',
    fullName: 'Samuel Omondi',
    age: 13,
    grade: 'Grade 7',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'David K.',
    image: '/assets/children/samuel_o.jpg',
    status: 'ON TRACK',
    keyStrength: 'Computer Engineering',
    personalStatement: "I want to be a computer engineer and build things that help people.",
    overviewMetrics: {
      computer: 85,
      bible: 70,
      mathScience: 80,
      arts: 50,
      music: 65,
      social: 78
    },
    skillsMap: [
      { id: 's1', name: 'Typing Proficiency', category: 'Computer', level: 'INDEPENDENT', note: 'Consistent 40 WPM on standard typing tests with high accuracy. Can type without looking at keyboard.' },
      { id: 's2', name: 'Word Processing', category: 'Computer', level: 'MASTERED', note: 'Advanced formatting, tables, and document structuring. Regularly helps peers format reports.' },
      { id: 's3', name: 'Basic Coding', category: 'Computer', level: 'LEARNING', note: 'Introduced to Scratch and basic HTML concepts. Showing strong algorithmic logic.' },
      { id: 's4', name: 'PowerPoint', category: 'Computer', level: 'INDEPENDENT', note: 'Creates clean presentation slides with custom themes and transitions.' },
      { id: 's5', name: 'Excel', category: 'Computer', level: 'WITH_HELP', note: 'Understands simple sum formulas and table cell formatting.' },
      { id: 's6', name: 'Internet Safety', category: 'Computer', level: 'MASTERED', note: 'Understands password security, online privacy, and safe web browsing.' },
      { id: 's7', name: 'Graphic Design', category: 'Computer', level: 'LEARNING', note: 'Learning Canva layout design and color pairing.' },
      { id: 's8', name: 'Digital Communication', category: 'Computer', level: 'INDEPENDENT', note: 'Composes clear, polite email correspondence and file attachments.' }
    ],
    observations: [
      { id: 'ob1', date: '2026-08-15', area: 'Computer', text: 'Samuel assisted two younger children with folder organization in Linux workspace.', strength: 'Peer Mentorship', challenge: 'Patience when software loads slowly', nextStep: 'Assign him as assistant monitor during Friday IT Lab.' },
      { id: 'ob2', date: '2026-08-10', area: 'Bible & Discipleship', text: 'Memorized Genesis 1:1-27 with clear articulation during morning devotion.', strength: 'Memorization', challenge: 'Slight shyness when speaking aloud', nextStep: 'Encourage him to lead prayer next week.' }
    ],
    goals: [
      { id: 'g1', title: 'Create & present a PowerPoint independently', area: 'Computer', targetDate: '2026-09-01', progress: 85, status: 'In Progress', note: 'Slides drafted, working on oral presentation rehearsal.' },
      { id: 'g2', title: 'Memorize Westminster Shorter Catechism Q1-10', area: 'Bible', targetDate: '2026-09-15', progress: 60, status: 'In Progress', note: 'Currently mastered up to Q6.' }
    ],
    milestones: [
      { id: 'm1', date: '2026-07-20', title: 'Achieved 40 WPM Speed Tag', description: 'Passed official speed certification in Touch Typing.' },
      { id: 'm2', date: '2026-06-12', title: 'Completed Computer Basics Level 1', description: 'Mastered hardware connections, desktop navigation, and peripherals.' }
    ]
  },
  {
    id: 'c2',
    name: 'Elias Kariuki',
    fullName: 'Elias Kariuki',
    age: 12,
    grade: 'Grade 6',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'John D.',
    image: '/assets/children/elias_k.jpg',
    status: 'ON TRACK',
    keyStrength: 'Problem Solving',
    personalStatement: "I love solving math puzzles and learning how computers turn on.",
    overviewMetrics: {
      computer: 60,
      bible: 85,
      mathScience: 75,
      arts: 65,
      music: 70,
      social: 80
    },
    skillsMap: [
      { id: 's1', name: 'Typing Proficiency', category: 'Computer', level: 'LEARNING', note: 'Currently practicing home row finger placement.' },
      { id: 's2', name: 'Word Processing', category: 'Computer', level: 'WITH_HELP', note: 'Can type short paragraphs with guided font adjustments.' },
      { id: 's3', name: 'Basic Coding', category: 'Computer', level: 'NOT_INTRODUCED', note: 'Will start Scratch Jr next term.' }
    ],
    observations: [
      { id: 'ob3', date: '2026-08-14', area: 'Math & Science', text: 'Solved double-digit addition problems ahead of time during class.', strength: 'Speed Math', challenge: 'Needs neat handwriting practice', nextStep: 'Provide grid math exercise books.' }
    ],
    goals: [
      { id: 'g3', title: 'Reach 15 WPM in Typing Club', area: 'Computer', targetDate: '2026-09-10', progress: 40, status: 'In Progress', note: 'Practicing 20 minutes daily.' }
    ],
    milestones: [
      { id: 'm3', date: '2026-08-01', title: 'Recited 10 Psalm Verses', description: 'Awarded Discipleship Certificate for Scripture memory.' }
    ]
  },
  {
    id: 'c3',
    name: 'Amina Hassan',
    fullName: 'Amina Hassan',
    age: 12,
    grade: 'Grade 6',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'Sarah Johnson',
    image: '/assets/children/amina_h.jpg',
    status: 'PROGRESSING',
    keyStrength: 'Leadership',
    personalStatement: "My dream is to become a teacher so every child has a opportunity to learn.",
    overviewMetrics: {
      computer: 70,
      bible: 90,
      mathScience: 65,
      arts: 80,
      music: 85,
      social: 92
    },
    skillsMap: [
      { id: 's1', name: 'Typing Proficiency', category: 'Computer', level: 'INDEPENDENT', note: '32 WPM accuracy level.' },
      { id: 's2', name: 'PowerPoint', category: 'Computer', level: 'INDEPENDENT', note: 'Designed Joy Villa cottage weekly announcements deck.' }
    ],
    observations: [
      { id: 'ob4', date: '2026-08-16', area: 'Mentorship', text: 'Amina organized the Sunday evening song practice with younger cottage girls.', strength: 'Empathy & Initiative', challenge: 'Time management', nextStep: 'Help her set a weekly planner.' }
    ],
    goals: [
      { id: 'g4', title: 'Lead the Genesis Chapter 1-3 Discussion', area: 'Bible', targetDate: '2026-08-28', progress: 90, status: 'In Progress', note: 'Notes prepared, rehearsing discussion prompts.' }
    ],
    milestones: [
      { id: 'm4', date: '2026-07-15', title: 'Appointed Junior Cottage Prefect', description: 'Recognized for exemplary responsibility and leadership.' }
    ]
  },
  {
    id: 'c4',
    name: 'Samuel Ochieng',
    fullName: 'Samuel Ochieng',
    age: 14,
    grade: 'Grade 8',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'Esther M.',
    image: '/assets/children/samuel_och.jpg',
    status: 'NEEDS SUPPORT',
    keyStrength: 'Creative Arts',
    personalStatement: "I like drawing colorful pictures of airplanes and singing songs.",
    overviewMetrics: {
      computer: 50,
      bible: 60,
      mathScience: 55,
      arts: 90,
      music: 75,
      social: 60
    },
    skillsMap: [
      { id: 's1', name: 'Mouse & Keyboard Basics', category: 'Computer', level: 'WITH_HELP', note: 'Can point and click interactive learning games.' }
    ],
    observations: [
      { id: 'ob5', date: '2026-08-17', area: 'Social Development', text: 'Showed frustration when sharing art supplies during afternoon drawing class.', strength: 'Artistic Focus', challenge: 'Emotional regulation & sharing', nextStep: 'Pair him with Amina for guided group activities.' }
    ],
    goals: [
      { id: 'g5', title: 'Complete 5 sharing exercises without conflict', area: 'Social Skills', targetDate: '2026-09-05', progress: 30, status: 'In Progress', note: 'Mentor monitoring during group play.' }
    ],
    milestones: [
      { id: 'm5', date: '2026-06-30', title: 'First Art Showcase Participant', description: 'Exhibited color drawings at Village Art Fair.' }
    ]
  },
  {
    id: 'c5',
    name: 'Grace Wanjiku',
    fullName: 'Grace Wanjiku',
    age: 16,
    grade: 'Grade 9',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'Sarah Johnson',
    image: '/assets/children/grace_w.jpg',
    status: 'ON TRACK',
    keyStrength: 'Mathematics',
    personalStatement: "I want to study data science and lead technology programs in Kenya.",
    overviewMetrics: {
      computer: 95,
      bible: 88,
      mathScience: 94,
      arts: 70,
      music: 82,
      social: 90
    },
    skillsMap: [
      { id: 's1', name: 'Excel & Data Analysis', category: 'Computer', level: 'MASTERED', note: 'Understands formulas, VLOOKUP, pivot tables, and chart creation.' },
      { id: 's2', name: 'Guitar Proficiency', category: 'Music', level: 'INDEPENDENT', note: 'Plays lead rhythm guitar for village choir.' }
    ],
    observations: [
      { id: 'ob6', date: '2026-08-18', area: 'Computer', text: 'Grace created an automated inventory tracker for the village school library using Excel.', strength: 'Practical Engineering', challenge: 'Balancing secondary exam prep', nextStep: 'Introduce basic Python automation.' }
    ],
    goals: [
      { id: 'g6', title: 'Complete HTML/CSS Web Development Portfolio', area: 'Computer', targetDate: '2026-10-01', progress: 75, status: 'In Progress', note: 'Building personal website.' }
    ],
    milestones: [
      { id: 'm6', date: '2026-05-10', title: 'National Math Contest Honor Roll', description: 'Scored top 5% in regional STEM assessment.' }
    ]
  },
  {
    id: 'c6',
    name: 'Sarah M.',
    fullName: 'Sarah Mutua',
    age: 15,
    grade: 'Grade 9',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'David K.',
    image: '/assets/children/sarah_m.jpg',
    status: 'NEEDS SUPPORT',
    keyStrength: 'Creative Writing',
    personalStatement: "I enjoy writing short stories and learning how things work.",
    overviewMetrics: {
      computer: 65,
      bible: 80,
      mathScience: 48,
      arts: 85,
      music: 60,
      social: 70
    },
    skillsMap: [
      { id: 's1', name: 'Word Processing', category: 'Computer', level: 'INDEPENDENT', note: 'Types creative stories with custom headings.' }
    ],
    observations: [
      { id: 'ob7', date: '2026-08-12', area: 'Math & Science', text: 'Struggling with fraction division and mixed numbers.', strength: 'Perseverance', challenge: 'Math anxiety', nextStep: 'Set up 3x weekly peer tutoring with Grace.' }
    ],
    goals: [
      { id: 'g7', title: 'Master fraction operations with 85%+ score', area: 'Math', targetDate: '2026-09-20', progress: 35, status: 'In Progress', note: 'Attending tutoring sessions.' }
    ],
    milestones: []
  },
  {
    id: 'c7',
    name: 'David K.',
    fullName: 'David Kiplagat',
    age: 14,
    grade: 'Grade 8',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'Sarah Johnson',
    image: '/assets/children/david_k.jpg',
    status: 'NEEDS SUPPORT',
    keyStrength: 'Robotics Interest',
    personalStatement: "I want to build robots that can explore space.",
    overviewMetrics: {
      computer: 75,
      bible: 65,
      mathScience: 72,
      arts: 55,
      music: 50,
      social: 45
    },
    skillsMap: [
      { id: 's1', name: 'Basic Coding', category: 'Computer', level: 'WITH_HELP', note: 'Building block code games in Scratch.' }
    ],
    observations: [
      { id: 'ob8', date: '2026-08-11', area: 'Social Development', text: 'Hesitant to participate in team sports or outdoor group discussions.', strength: 'Quiet observation', challenge: 'Social shyness', nextStep: 'Involve him in small paired science projects.' }
    ],
    goals: [
      { id: 'g8', title: 'Present a 2-minute science project to cottage', area: 'Social & Science', targetDate: '2026-09-12', progress: 50, status: 'In Progress', note: 'Preparing solar energy diagram.' }
    ],
    milestones: []
  },
  {
    id: 'c8',
    name: 'Esther L.',
    fullName: 'Esther Lukindo',
    age: 15,
    grade: 'Grade 9',
    houseId: '',
    cottage: 'Unassigned',
    mentor: 'John D.',
    image: '/assets/children/esther_l.jpg',
    status: 'PROGRESSING',
    keyStrength: 'Bible Studies',
    personalStatement: "Faith and diligence guide everything I do.",
    overviewMetrics: {
      computer: 78,
      bible: 95,
      mathScience: 70,
      arts: 75,
      music: 88,
      social: 84
    },
    skillsMap: [
      { id: 's1', name: 'Digital Communication', category: 'Computer', level: 'INDEPENDENT', note: 'Manages chapel presentation slides.' }
    ],
    observations: [
      { id: 'ob9', date: '2026-08-09', area: 'Goals Follow-up', text: 'Reviewed personal development roadmap for Grade 9 term 3.', strength: 'Goal Clarity', challenge: 'Balancing studies and chores', nextStep: 'Check in bi-weekly.' }
    ],
    goals: [
      { id: 'g9', title: 'Complete Westminster Catechism Q1-25', area: 'Bible', targetDate: '2026-09-30', progress: 80, status: 'In Progress', note: 'On track.' }
    ],
    milestones: [
      { id: 'm7', date: '2026-07-04', title: 'Discipleship Excellence Badge', description: 'Awarded for leading weekly junior devotions.' }
    ]
  }
];

export const MOCK_COMPUTER_CURRICULUM = [
  {
    level: 1,
    title: 'Level 1: Computer Basics & Digital Foundations',
    subtitle: 'Grades 4-6 • Essential Hardware, Typing & Navigation',
    modules: [
      { id: 'm1_1', title: 'Computer Hardware & Peripherals', status: 'Active', lessonsCount: 4, project: 'Connect & Boot PC Lab', objectives: ['Identify CPU, Monitor, Mouse, Keyboard', 'Proper power-on & shutdown safety', 'Using external storage drives'] },
      { id: 'm1_2', title: 'Touch Typing & Finger Placement', status: 'Active', lessonsCount: 6, project: 'Reach 25 WPM Speed Benchmark', objectives: ['Home row technique', 'Accuracy over speed', 'Special characters & shift key use'] },
      { id: 'm1_3', title: 'Desktop & File Management', status: 'Active', lessonsCount: 5, project: 'Personal Portfolio Directory Setup', objectives: ['Creating & naming folders', 'Moving, copying, and deleting files', 'Understanding cloud drive storage'] }
    ]
  },
  {
    level: 2,
    title: 'Level 2: Office Productivity & Internet Safety',
    subtitle: 'Grades 6-7 • Word, PowerPoint, Excel & Web Safety',
    modules: [
      { id: 'm2_1', title: 'Microsoft Word & Document Formatting', status: 'Active', lessonsCount: 5, project: 'Formatted Essay & Resume Template', objectives: ['Headings, typography & spacing', 'Inserting tables and header images', 'Exporting PDF documents'] },
      { id: 'm2_2', title: 'PowerPoint & Presentation Design', status: 'Active', lessonsCount: 4, project: 'Personal Career Aspirations Slide Deck', objectives: ['Slide layouts & color contrast', 'Transitions and animation ethics', 'Public speaking with visual aids'] },
      { id: 'm2_3', title: 'Excel & Data Basics', status: 'Active', lessonsCount: 6, project: 'Cottage Budget & Chart Generator', objectives: ['Cells, rows, and data types', 'SUM, AVERAGE, MIN/MAX formulas', 'Creating column & pie charts'] },
      { id: 'm2_4', title: 'Internet Safety & Digital Citizenship', status: 'Active', lessonsCount: 4, project: 'Online Safety Poster Design', objectives: ['Strong password creation', 'Recognizing phishing & web risks', 'Digital footprint awareness'] }
    ]
  },
  {
    level: 3,
    title: 'Level 3: Digital Media & Visual Communication',
    subtitle: 'Grades 7-8 • Design, Photo, Video & Web Tools',
    modules: [
      { id: 'm3_1', title: 'Graphic Design Principles (Canva)', status: 'Active', lessonsCount: 5, project: 'Village Event Announcement Poster', objectives: ['Visual hierarchy & alignment', 'Color theory & brand styling', 'Designing for print & digital'] },
      { id: 'm3_2', title: 'Photo & Image Editing', status: 'Active', lessonsCount: 4, project: 'Child Profile Photo Restoration', objectives: ['Cropping, brightness & color balance', 'Background removal', 'File formats (JPG, PNG, WebP)'] },
      { id: 'm3_3', title: 'Video Editing Basics', status: 'Active', lessonsCount: 5, project: '1-Minute Tumaini Story Showcase', objectives: ['Trimming clips & sequencing', 'Adding background audio & captions', 'Exporting HD video files'] }
    ]
  },
  {
    level: 4,
    title: 'Level 4: Coding, Web Development & Career Prep',
    subtitle: 'Grades 8-9+ • Web Tech, Logic & Digital Entrepreneurship',
    modules: [
      { id: 'm4_1', title: 'Computational Thinking & Scratch Coding', status: 'Active', lessonsCount: 6, project: 'Interactive Educational Game', objectives: ['Loops, variables, & conditional statements', 'Sprite animation & event listeners', 'Debugging code logic'] },
      { id: 'm4_2', title: 'HTML5 & CSS3 Web Development', status: 'Active', lessonsCount: 8, project: 'Personal Child Portfolio Web Page', objectives: ['Semantic HTML structure', 'CSS styling, colors & flexbox', 'Responsive web page design'] },
      { id: 'm4_3', title: 'Digital Entrepreneurship & Employment Prep', status: 'Active', lessonsCount: 5, project: 'Digital CV & Freelance Portfolio', objectives: ['Creating professional resume', 'Email etiquette for IT jobs', 'Basic freelance computer skills'] }
    ]
  }
];

export const MOCK_BIBLE_CURRICULUM = {
  memorizationCards: [
    { verse: 'Genesis 1:1', text: 'In the beginning God created the heavens and the earth.', theme: 'Creation' },
    { verse: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.', theme: 'Trust & Provision' },
    { verse: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart, and do not lean on your own understanding.', theme: 'Guidance' },
    { verse: 'Philippians 4:13', text: 'I can do all things through him who strengthens me.', theme: 'Perseverance' }
  ],
  catechismQuestions: [
    { qNo: 1, question: 'What is the chief end of man?', answer: "Man's chief end is to glorify God, and to enjoy him forever." },
    { qNo: 2, question: 'What rule hath God given to direct us how we may glorify and enjoy him?', answer: 'The Word of God, which is contained in the Scriptures of the Old and New Testaments.' },
    { qNo: 3, question: 'What do the Scriptures principally teach?', answer: 'The Scriptures principally teach what man is to believe concerning God, and what duty God requires of man.' }
  ],
  genesisModules: [
    { title: 'Part 1: Creation & The Fall (Genesis 1-3)', leader: 'John D.', status: 'Active', attendeesCount: 34 },
    { title: 'Part 2: Noah, The Flood & Covenant (Genesis 6-9)', leader: 'Sarah Johnson', status: 'Upcoming', attendeesCount: 28 },
    { title: 'Part 3: The Call of Abraham (Genesis 12-25)', leader: 'John D.', status: 'Upcoming', attendeesCount: 30 }
  ]
};

export const MEETING_LOCATIONS = [
  "At the Field",
  "Dining Hall",
  "Other (Custom location...)"
];

export const MOCK_SCHEDULED_SESSIONS = [
  {
    id: 'session_1',
    childId: 'c7',
    childName: 'David K.',
    childImage: '/assets/children/david_k.jpg',
    mentorId: 'm1',
    mentorName: 'Sarah Johnson',
    date: '2026-08-25',
    time: '14:30',
    location: "Cottage 'B' Study Room",
    topic: 'Social Confidence & Group Participation',
    notes: 'Discuss strategies for speaking up in small group discussions and paired science activities.',
    status: 'Scheduled'
  },
  {
    id: 'session_2',
    childId: 'c6',
    childName: 'Sarah M.',
    childImage: '/assets/children/sarah_m.jpg',
    mentorId: 'm2',
    mentorName: 'David K.',
    date: '2026-08-26',
    time: '10:00',
    location: 'Village Library - Desk 3',
    topic: 'Math Fraction Tutoring Plan',
    notes: 'Review fraction operations prep and coordinate weekly peer tutoring schedule with Grace.',
    status: 'Scheduled'
  },
  {
    id: 'session_3',
    childId: 'c1',
    childName: 'Samuel O.',
    childImage: '/assets/children/samuel_o.jpg',
    mentorId: 'm2',
    mentorName: 'David K.',
    date: '2026-08-22',
    time: '16:00',
    location: 'IT Lab - Gazebo',
    topic: 'Career Aspiration Counseling',
    notes: 'Discuss web development goals, HTML/CSS portfolio, and assistant lab monitor responsibilities.',
    status: 'Completed'
  }
];

