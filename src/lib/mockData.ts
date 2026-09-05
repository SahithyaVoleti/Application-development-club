export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'REGISTRATION_CLOSED';
export type AttendanceStatus = 'present' | 'absent' | 'not_marked';

export interface Event {
  id: string;
  title: string;
  category: string;
  branches?: string[];
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  registrationDeadline: string;
  capacity: number;
  posterUrl: string;
  eligibility: string;
  rules: string;
  requirements: string;
  contactPerson: string;
  contactEmail: string;
  status: EventStatus;
  createdAt: string;
  certificateTemplateUrl?: string | null;

  // Financial & Budget Fields
  allocatedBudget?: number | null;
  venueExpense?: number;
  foodExpense?: number;
  certificateExpense?: number;
  prizeExpense?: number;
  marketingExpense?: number;
  equipmentExpense?: number;
  otherExpense?: number;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  email: string;
  mobile: string;
  department: string;
  year: string;
  section: string;
  gender: string;
  skills: string;
  registrationDate: string;
  registrationId: string;
  attendanceStatus: AttendanceStatus;
}

export interface GalleryImage {
  id: string;
  eventId: string;
  imageUrl: string;
  caption: string;
}

// Helper: compute status from date
export function computeStatus(event: Omit<Event, 'status'>): EventStatus {
  const now = new Date('2026-08-18T06:32:08');
  const eventDate = new Date(event.date + 'T' + event.startTime);
  const eventEnd = new Date(event.date + 'T' + event.endTime);
  const deadline = new Date(event.registrationDeadline);
  if (now >= eventDate && now <= eventEnd) return 'ONGOING';
  if (now > eventEnd) return 'COMPLETED';
  if (now > deadline) return 'REGISTRATION_CLOSED';
  return 'UPCOMING';
}

export const MOCK_EVENTS: Event[] = [
  {
    id: "agentic-ai-day-2026",
    title: "Agentic AI Day Hackathon 2026",
    category: "Agentic AI & App Development",
    branches: ["CSE", "IT", "AI/ML", "ECE"],
    description: "Agentic AI Day 2026 is the flagship hackathon organized by the Application Development Club & Department of Computer Science & Engineering, Vignan University. Student developers build autonomous AI agents, LLM tool-calling applications, and multi-agent workflows for real-world problems.",
    date: "2026-09-28",
    startTime: "09:00",
    endTime: "18:00",
    venue: "N-Block Main Seminar Hall, III Floor, VFSTR",
    organizer: "Application Development Club & Dept. of CSE",
    registrationDeadline: "2026-09-25T23:59",
    capacity: 200,
    posterUrl: "/images/events/remote-event-10.png",
    eligibility: "Open to all CSE, AI/ML, IT and Engineering Students",
    rules: "Objectives & Outcomes:\n✅ Build autonomous AI agents using Antigravity, Python SDK, and LLM tools.\n✅ Teams of 2 to 4 students.\n✅ Real-time evaluation on agent execution speed, reasoning accuracy, and UI completeness.\n✅ Cash prizes + Certificate of Excellence for top podium winners.",
    requirements: "College ID card, Laptop with Python 3.10+, Node.js, and API keys",
    contactPerson: "Prof. U. V. Ramana (HOD CSE)",
    contactEmail: "uvr_cse@vignan.ac.in",
    status: "UPCOMING",
    createdAt: new Date().toISOString()
  },
  {
    id: "remote-event-8",
    title: "SUSTAINABILITY IDEATHON",
    category: "Hackathon",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "The Sustainability Ideathon 2025, held on 11th September 2025 at the Nagarjuna Block, 2nd Floor\r\nConference Hall, was a landmark event aimed at empowering students to contribute innovative, appbased solutions toward sustainable development. The Ideathon provided a platform for students from\r\ndiverse disciplines to collaborate, exchange ideas, and create solutions addressing global and local\r\nsustainability challenges.",
    date: "2025-09-11",
    startTime: "09:30",
    endTime: "17:00",
    venue: "Sangamithra Seminar Hall, II Floor, Nagarjuna Block",
    organizer: "SHAIK JANI, Dept. of CSE",
    registrationDeadline: "2025-09-08T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-8.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe key objectives of the Sustainability Ideathon 2025 were:\r\n✅ Foster innovation and creativity among students by engaging them in real-world\r\nsustainability challenges.\r\n✅Promote interdisciplinary collaboration across various academic departments.\r\n✅Raise awareness on environmental, social, and economic issues.\r\n✅Encourage student leadership and problem-solving skills.\r\n✅Inspire long-term involvement in sustainable practices and initiative",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "SHAIK JANI",
    contactEmail: "shaikjani@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-07-03T05:54:50.204Z"
  },
  {
    id: "remote-event-9",
    title: "Smart India Hackathon-Internal Hackathon-2025",
    category: "Hackathon",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "Smart India Hackathon 2025 is a nationwide initiative to provide students a platform to solve\r\nsome of the pressing problems we face in our daily lives, and thus inculcate a culture of product\r\ninnovation and a mind-set of problem solving. AICTE and MoE launched smart India\r\nHackathon 2025. The previous editions proved to be extremely successful in promoting\r\ninnovation and out-of-the-box thinking in young minds especially engineering students from\r\nacross India.",
    date: "2025-09-12",
    startTime: "09:30",
    endTime: "17:00",
    venue: "Sangamithra Seminar Hall",
    organizer: "Dr G Balu Narasimha Rao, Dept. of CSE",
    registrationDeadline: "2025-09-09T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-9.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe key objectives of the Smart India Internal Hackathon 2025 were:\r\n ✅ Foster innovation and creativity among students by engaging them in real-world\r\nchallenges.\r\n✅ Promote interdisciplinary collaboration across various academic departments.\r\n✅ Encourage student leadership, teamwork, and problem-solving skills.\r\n✅ Prepare students for participation in the National Smart India Hackathon.\r\n✅ Inspire long-term involvement in technology-driven solutions for social impact.",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Dr G Balu Narasimha Rao",
    contactEmail: "drgbalunarasimharao@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-07-03T07:10:39.218Z"
  },
  {
    id: "remote-event-10",
    title: "</> CODE STORM",
    category: "Application Development hackathon",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "Code Storm is a technical event organized by the Department of Computer Science & Engineering with the aim of encouraging students to unleash their coding potential. The event is designed to promote programming skills, problem-solving ability, and competitive spirit among students. It provides an excellent platform for participants to demonstrate their technical knowledge and compete with peers in a challenging environment.",
    date: "2025-09-25",
    startTime: "09:30",
    endTime: "17:00",
    venue: "N-BLOCK, III FLOOR",
    organizer: "Mr N Brahma Naidu, Dept. of CSE",
    registrationDeadline: "2025-09-22T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-10.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe primary objectives of Code Storm are:\r\n•\tTo enhance students’ programming and logical thinking skills\r\n•\tTo provide hands-on experience in competitive coding\r\n•\tTo encourage teamwork, innovation, and analytical thinking\r\n•\tTo identify and reward top coding talent",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Mr N Brahma Naidu",
    contactEmail: "mrnbrahmanaidu@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-07-04T04:26:43.746Z"
  },
  {
    id: "remote-event-6",
    title: "STACK HACK",
    category: "Application Development hackathon",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "Application Development Hackathon to develope applications which are useful for Society and Organization",
    date: "2025-11-06",
    startTime: "09:30",
    endTime: "17:00",
    venue: "N Block",
    organizer: "Panthagani Vijaya Babu, Dept. of CSE",
    registrationDeadline: "2025-11-03T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-6.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\n90 Applications have developed by  approx 300 students, out of that 10 applications have shortlisted, and those applications are using in the department for  automation",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Panthagani Vijaya Babu",
    contactEmail: "panthaganivijayababu@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-07-03T05:23:55.581Z"
  },
  {
    id: "remote-event-5",
    title: "AI Smart Campus Hackathon",
    category: "Hackathon",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "The objective of this event is to enhance students ‘problem-solving abilities, creativity, and innovative thinking’. The hackathon will encourage students to explore AI-driven solutions for smart campus functionalities and develop Agentic AI applications that can improve the efficiency and ease of campus operations.",
    date: "2026-03-14",
    startTime: "09:30",
    endTime: "17:00",
    venue: "N Block Class rooms",
    organizer: "Dr Jhansi Lakshmi P, Dept. of CSE",
    registrationDeadline: "2026-03-11T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-5.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nOut of 310 participated students 8 best projects were selected and those are deployed",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Dr Jhansi Lakshmi P",
    contactEmail: "drjhansilakshmip@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-07-03T04:50:46.249Z"
  },
  {
    id: "remote-event-12",
    title: "LUDUSFORGE",
    category: "Hackathon",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "The LudusForge 2026, held on 30th – 31st March 2026 at the Nagarjuna Block, Vignan University, was a dynamic and intensive 48-hour game development hackathon organized by the ACM Student Chapter, Department of CSE. The event was designed to empower students to showcase their creativity and technical skills by developing innovative games across multiple themes including Arcade, Casual, Shooter, Survival, Racing, Strategy, Puzzle, and Open Theme. It provided a collaborative environment where participants could transform ideas into fully functional gaming experiences within a limited timeframe",
    date: "2026-03-30",
    startTime: "09:30",
    endTime: "17:00",
    venue: "NAGARJUNA BLOCK",
    organizer: "Dr Phanindra Thota, Dept. of CSE",
    registrationDeadline: "2026-03-27T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-12.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe key objectives of LudusForge 2026 were: \r\n•    Foster innovation and creativity among students through game development challenges. •    Encourage hands-on learning in game design, programming, and problem-solving. •    Promote teamwork and collaboration among participants from different batches. •    Provide a platform to apply technical skills in a real-time, competitive environment. •    Enhance creativity by exploring diverse game themes and concepts. •    Inspire students to pursue opportunities in game development and related fields.",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Dr Phanindra Thota",
    contactEmail: "drphanindrathota@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-08-18T04:57:02.839Z"
  },
  {
    id: "remote-event-15",
    title: "Advances in Generative AI and Computer Vision: Research Trends and Emerging Applications",
    category: "Faculty Development Program (FDP)",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "A six-day Faculty Development Program on “Advances in Generative AI and Computer Vision: Research Trends and Emerging Applications” was organized by the Department of Computer Science and Engineering, VFSTR, from 18 to 22 May 2026 in hybrid mode. The program focused on recent advancements in Generative AI, Agentic AI, Computer Vision, Deep Learning, and emerging AI applications, with expert talks, interactive discussions, hands-on sessions, and live demonstrations. The FDP provided participants with exposure to current research trends, AI tools, practical applications, and opportunities for integrating emerging AI technologies into teaching, research, and academic projects.",
    date: "2026-05-18",
    startTime: "09:30",
    endTime: "17:00",
    venue: "N Block, Room 302",
    organizer: "Dr. Satish Kumar Satti and Dr. Vinoj J, Dept. of CSE",
    registrationDeadline: "2026-05-15T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-15.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe FDP enhanced participants’ knowledge and practical skills in Generative AI, Agentic AI, Computer Vision, Deep Learning, and emerging AI applications. It supported faculty in identifying new research directions, exploring AI tools and datasets, and applying emerging technologies in teaching, student projects, and research activities. The programme also promoted interaction and collaboration with experts from premier institutions and industry, while creating awareness of ethical and responsible AI practices. Overall, the FDP strengthened faculty capabilities for curriculum enhancement, research advancement, innovation, and industry-relevant AI education.",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Dr. Satish Kumar Satti and Dr. Vinoj J",
    contactEmail: "drsatishkumarsattianddrvinojj@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-08-18T08:48:41.015Z"
  },
  {
    id: "remote-event-14",
    title: "2026 International Conference on Cognitive Computing and Networking Systems (ICC-CNS 2026)",
    category: "Conference",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "The Department of Computer Science and Engineering, VFSTR organized the 2026 International Conference on Cognitive Computing and Networking Systems (ICC-CNS 2026) during 11–13 June 2026 in hybrid mode, technically co-sponsored by the IEEE Communications Society. The conference brought together academicians, researchers, industry professionals and students to share advancements in cognitive computing, artificial intelligence, intelligent networking, autonomous systems and next-generation communication technologies. The event featured 109 technical presentations, four IEEE Distinguished Lectures, two masterclass sessions, a guest spotlight session on IEEE leadership and an industry interaction session. The conference received 1,752 papers, of which 152 were accepted and 109 registered. The proceedings were subsequently published in IEEE Xplore.",
    date: "2026-06-11",
    startTime: "09:30",
    endTime: "17:00",
    venue: "NB 211, N Block, VFSTR",
    organizer: "Dr. H. James Deva Koresh, Dept. of CSE",
    registrationDeadline: "2026-06-08T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-14.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe conference significantly enhanced international academic and research collaboration by bringing together academicians, researchers, industry professionals, and students from different countries. It provided a platform for sharing recent advancements in cognitive computing, artificial intelligence, intelligent networking, autonomous systems, and next-generation communication technologies through 109 technical presentations, four IEEE Distinguished Lectures, and two masterclass sessions. The conference also promoted interaction with experts from leading academic and industry organizations and provided researchers with opportunities to present and disseminate their work. The successful publication of the conference proceedings in IEEE Xplore further enhanced the international visibility and academic impact of the research contributions.",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Dr. H. James Deva Koresh",
    contactEmail: "drhjamesdevakoresh@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-08-18T08:12:42.235Z"
  },
  {
    id: "remote-event-17",
    title: "Next-Generation AI: Advances in Generative Models and Visual Intelligence",
    category: "Faculty Development Program (FDP)",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "The Faculty Development Programme was organized to equip participants with the latest advancements in Artificial Intelligence, Foundation Models, Generative AI, Computer Vision, and Agentic AI. The programme included expert lectures, interactive discussions, and hands-on workshops covering topics such as Deep Learning, Prompt Engineering, Large Language Models, Retrieval-Augmented Generation (RAG), Vector Databases, Vision Transformers, YOLO, Generative Vision Models, Multimodal AI, Responsible AI, and Agentic AI. Participants also developed practical AI applications using modern frameworks and open-source tools, gaining valuable real-world experience in designing intelligent systems",
    date: "2026-06-29",
    startTime: "09:30",
    endTime: "17:00",
    venue: "N-BLOCK",
    organizer: "Dr. Satish Kumar Satti, Dept. of CSE",
    registrationDeadline: "2026-06-26T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-17.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe Faculty Development Programme significantly enhanced participants' understanding of modern Artificial Intelligence technologies and their practical applications. Faculty members gained hands-on experience in developing AI solutions using Foundation Models, Large Language Models, Computer Vision, Retrieval-Augmented Generation (RAG), Vision-Language Models, and Agentic AI. The programme strengthened participants' technical skills, promoted research and innovation, encouraged the adoption of AI-driven teaching and learning practices, and enabled them to design intelligent applications for solving real-world problems. The capstone project and practical sessions further improved their confidence in implementing advanced AI technologies in academic and research environments.",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Dr. Satish Kumar Satti",
    contactEmail: "drsatishkumarsatti@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-08-20T06:17:59.562Z"
  },
  {
    id: "remote-event-13",
    title: "6-Day Faculty Development Program on Machine Learning Operations (MLOps)",
    category: "Faculty Development Program (FDP)",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "A six-day Faculty Development Program on Machine Learning Operations (MLOps) was organized by the Department of Computer Science and Engineering, Vignan's Foundation for Science, Technology and Research, from 02 July to 08 July 2026, comprising 36 hours. Conducted by Mr. Kalkeseetharaman P K, Learning and Development Manager, byteXL, the FDP provided comprehensive exposure to the machine learning lifecycle, including data preprocessing, model development, deployment, monitoring, and maintenance. The program covered AI fundamentals, supervised and unsupervised learning, automated exploratory data analysis, association rule mining, Retrieval-Augmented Generation (RAG), FAISS-based semantic search, Gradio deployment, MLflow experiment tracking, SHAP explainability, FastAPI-based REST APIs, GitHub Actions CI/CD, Evidently AI monitoring, and Streamlit dashboards. Hands-on sessions using the Chronic Kidney Disease dataset enabled participants to implement real-world MLOps workflows.",
    date: "2026-07-02",
    startTime: "09:30",
    endTime: "17:00",
    venue: "NB 313",
    organizer: "Chavva Ravi Kishore Reddy, Dept. of CSE",
    registrationDeadline: "2026-06-29T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-13.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe FDP significantly enhanced faculty members' practical knowledge of modern MLOps tools and industry best practices. Participants gained hands-on skills in data preprocessing, model development, experiment tracking, explainable AI, API development, deployment automation, model monitoring, and retraining. The program will support curriculum enhancement, laboratory development, student mentoring, and research activities, while strengthening the department's capability to deliver industry-relevant education in Artificial Intelligence and Machine Learning.",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Chavva Ravi Kishore Reddy",
    contactEmail: "chavvaravikishorereddy@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-08-18T06:53:52.790Z"
  },
  {
    id: "remote-event-11",
    title: "Next-Gen Healthcare: Biomedical Imaging through Quantum-Driven Deep Learning (QuBioDL 2K26)",
    category: "Seminar",
    branches: ["CSE","IT","AI/ML","ECE"],
    description: "The Five Day National Seminar titled Next Gen Healthcare Biomedical Imaging through Quantum Driven Deep Learning (QuBioDL 2K26) was conducted from 27 July to 31 July 2026 with the support of ANRF. The seminar brought together academicians researchers industry experts faculty members and students to discuss the latest developments in quantum computing biomedical imaging deep learning and healthcare technologies. A total of 450 participants attended the event including more than 300 online and over 100 offline participants. Throughout the seminar experts delivered keynote lectures technical sessions and hands on workshops covering quantum algorithms biomedical image processing Qiskit programming healthcare applications ethics data privacy and future research opportunities. The event provided both theoretical knowledge and practical exposure through interactive sessions and real world case studies. It successfully encouraged interdisciplinary research collaboration and the application of advanced technologies to develop intelligent and innovative healthcare solutions.",
    date: "2026-07-27",
    startTime: "09:30",
    endTime: "17:00",
    venue: "sa re ga ma seminar hall (N-block)",
    organizer: "Ongole Gandhi, Dept. of CSE",
    registrationDeadline: "2026-07-24T00:00",
    capacity: 150,
    posterUrl: "/images/events/remote-event-11.png",
    eligibility: "Open to all CSE and Engineering Students",
    rules: "Objectives & Outcomes:\nThe seminar successfully enhanced the knowledge and technical skills of participants in the fields of quantum computing biomedical imaging deep learning and healthcare technologies. It provided practical learning through expert lectures interactive sessions and hands on training while encouraging collaboration among academia industry and healthcare professionals. The event motivated participants to pursue interdisciplinary research explore innovative healthcare solutions and apply emerging technologies to address real world healthcare challenges. Overall the seminar strengthened research interest and promoted the development of next generation intelligent healthcare systems.",
    requirements: "College ID card, Laptop with required software tools",
    contactPerson: "Ongole Gandhi",
    contactEmail: "ongolegandhi@vignan.ac.in",
    status: "COMPLETED",
    createdAt: "2026-08-13T09:22:19.668Z"
  },


{
  id: 'event-001',
  title: 'AI & Machine Learning Workshop',
  category: 'AI/ML Workshop',
  branches: ['CSE', 'IT', 'ECE', 'AI/ML'],
  description:
  'A hands-on full-day workshop covering fundamentals of Artificial Intelligence and Machine Learning with Python. Students will build real-world ML models using scikit-learn, TensorFlow, and explore neural network architectures. Includes live coding sessions and project presentations.',
  date: '2026-09-10',
  startTime: '10:00',
  endTime: '16:00',
  venue: 'CSE Seminar Hall, Block A',
  organizer: 'Dr. Ramesh Babu, Dept. of CSE',
  registrationDeadline: '2026-09-07T23:59',
  capacity: 200,
  posterUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop",
  eligibility: 'All CSE, IT, and ECE students from 2nd to 4th year',
  rules: 'Bring your own laptop. Python environment pre-installed. No plagiarism in project submissions.',
  requirements: 'Laptop with Python 3.9+, Google Colab account, Basic programming knowledge',
  contactPerson: 'Dr. Ramesh Babu',
  contactEmail: 'ramesh.babu@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-07-15T10:00:00'
},
{
  id: 'event-002',
  title: 'CSE Hackathon 2026',
  category: 'Hackathon',
  branches: ['CSE', 'IT', 'ECE', 'AI/ML'],
  description:
  '24-hour intensive hackathon where teams of 2–4 build innovative solutions to real-world problems in domains like HealthTech, FinTech, EdTech, and Smart Cities. Top 3 teams win cash prizes and internship opportunities with partner companies.',
  date: '2026-09-20',
  startTime: '09:00',
  endTime: '18:00',
  venue: 'Innovation Lab, CSE Block B',
  organizer: 'CSE Student Association & Dept. of CSE',
  registrationDeadline: '2026-09-15T23:59',
  capacity: 150,
  posterUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
  eligibility: 'All undergraduate CSE students. Teams of 2–4 members.',
  rules: 'Team formation mandatory. All code must be written during the event. External APIs allowed.',
  requirements: 'Laptop, GitHub account, Team registration form',
  contactPerson: 'Prof. Srinivasa Rao',
  contactEmail: 'srinivasa.rao@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-07-20T09:00:00'
},
{
  id: 'event-003',
  title: 'Web Development Bootcamp',
  category: 'Web Development Workshop',
  branches: ['CSE', 'IT', 'AI/ML'],
  description:
  'Intensive bootcamp covering full-stack web development with React, Node.js, and MongoDB. Students will build a complete web application from scratch, covering frontend design, REST API development, database integration, and deployment on cloud platforms.',
  date: '2026-09-28',
  startTime: '09:30',
  endTime: '16:30',
  venue: 'CSE Computer Lab 3, Block A',
  organizer: 'Web Dev Club, Dept. of CSE',
  registrationDeadline: '2026-09-24T23:59',
  capacity: 100,
  posterUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
  eligibility: 'CSE 2nd year and above. Basic HTML/CSS knowledge preferred.',
  rules: 'Attendance mandatory for certificate. Complete all lab exercises.',
  requirements: 'Laptop with Node.js 18+ installed, VS Code, Git',
  contactPerson: 'Ms. Kavitha Reddy',
  contactEmail: 'kavitha.reddy@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-07-25T11:00:00'
},
{
  id: 'event-004',
  title: 'Cloud Computing & DevOps Seminar',
  category: 'Cloud Computing Workshop',
  branches: ['CSE', 'IT', 'ECE', 'EEE'],
  description:
  'Industry expert seminar on modern cloud infrastructure with AWS, Azure, and GCP. Covers containerization with Docker, orchestration with Kubernetes, CI/CD pipelines, and cloud cost optimization strategies. Includes Q&A with working professionals.',
  date: '2026-10-05',
  startTime: '10:00',
  endTime: '13:00',
  venue: 'CSE Auditorium, Block C',
  organizer: 'Dept. of CSE & AWS Academy',
  registrationDeadline: '2026-10-02T23:59',
  capacity: 300,
  posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
  eligibility: 'Open to all students and faculty',
  rules: 'Prior registration required. ID card mandatory.',
  requirements: 'College ID card',
  contactPerson: 'Dr. Venkateswara Rao',
  contactEmail: 'venkat.rao@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-08-01T09:00:00'
},
{
  id: 'event-005',
  title: 'Cyber Security Awareness Event',
  category: 'Cyber Security Event',
  branches: ['CSE', 'IT', 'ECE'],
  description:
  'Interactive cybersecurity event featuring CTF (Capture the Flag) challenges, ethical hacking demonstrations, and sessions on network security, social engineering, and secure coding practices. Certified participants receive cybersecurity awareness certificates.',
  date: '2026-10-15',
  startTime: '09:00',
  endTime: '17:00',
  venue: 'CSE Network Lab, Block B',
  organizer: 'CyberSec Club, Dept. of CSE',
  registrationDeadline: '2026-10-10T23:59',
  capacity: 80,
  posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
  eligibility: 'CSE and IT students, 2nd year and above',
  rules: 'Individual participation only. No external tools except provided VMs.',
  requirements: 'Laptop, basic networking knowledge',
  contactPerson: 'Mr. Aakash Sharma',
  contactEmail: 'aakash.sharma@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-08-05T10:00:00'
},
{
  id: 'event-006',
  title: 'Project Expo & Innovation Fair 2026',
  category: 'Project Expo',
  branches: ['CSE', 'IT', 'ECE', 'EEE', 'Mech', 'Civil'],
  description:
  'Annual project exhibition where final-year and 3rd-year CSE students showcase their capstone projects and research work. Industry judges from top tech companies evaluate projects. Best projects receive funding support and internship offers.',
  date: '2026-10-25',
  startTime: '09:00',
  endTime: '16:00',
  venue: 'Main Auditorium, Admin Block',
  organizer: 'Dept. of CSE & Industry Partners',
  registrationDeadline: '2026-10-18T23:59',
  capacity: 120,
  posterUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop",
  eligibility: '3rd and 4th year CSE students with completed projects',
  rules: 'Team size 2–5. Project abstract submission mandatory before deadline.',
  requirements: 'Project demo ready, poster (3x4 ft), laptop for live demo',
  contactPerson: 'Dr. Padmavathi',
  contactEmail: 'padmavathi@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-08-10T10:00:00'
},
{
  id: 'event-012',
  title: 'AI Hackathon 2.0 — Agentic AI & GenAI Summit',
  category: 'Hackathon',
  branches: ['CSE', 'AI/ML', 'ECE', 'IT', 'Data Science'],
  description:
  '36-hour flagship national AI hackathon focusing on Agentic AI, Autonomous Agents, LLM Fine-Tuning, and Multimodal GenAI applications. Features ₹1,00,000 prize pool, cloud credits from OpenAI & AWS, and direct interview waivers for top 5 teams.',
  date: '2026-11-05',
  startTime: '09:00',
  endTime: '21:00',
  venue: 'Main Innovation Center & CSE Lab 4, Block B',
  organizer: 'AI Research Club & Dept. of CSE',
  registrationDeadline: '2026-11-01T23:59',
  capacity: 250,
  posterUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
  eligibility: 'Open to CSE, AI/ML, ECE, IT, and Data Science students (Teams of 2-4)',
  rules: 'All AI models must be integrated during the event. Use of open-source LLMs & APIs encouraged.',
  requirements: 'Laptop, Python 3.10+, OpenAI/HuggingFace API access, GitHub repo',
  contactPerson: 'Dr. Ramesh Babu',
  contactEmail: 'ramesh.babu@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-08-15T09:00:00'
},
{
  id: 'event-013',
  title: 'Generative AI & LLM Masterclass 2.0',
  category: 'AI/ML Workshop',
  branches: ['CSE', 'AI/ML', 'IT', 'ECE', 'Data Science'],
  description:
  'Hands-on advanced masterclass on building custom RAG systems, LangChain/LlamaIndex pipelines, vector databases (ChromaDB, Pinecone), and fine-tuning open-weight models like Llama 3 & Mistral for domain-specific applications.',
  date: '2026-11-12',
  startTime: '10:00',
  endTime: '16:30',
  venue: 'CSE Seminar Hall, Block A',
  organizer: 'Center for Artificial Intelligence Excellence',
  registrationDeadline: '2026-11-09T23:59',
  capacity: 180,
  posterUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop",
  eligibility: 'CSE, AI/ML, ECE, IT, DS students with Python proficiency',
  rules: 'Mandatory attendance for completion certificate. Lab assignments submission required.',
  requirements: 'Laptop with GPU acceleration or Google Colab Pro account',
  contactPerson: 'Prof. Srinivasa Rao',
  contactEmail: 'srinivasa.rao@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-08-16T10:00:00'
},
{
  id: 'event-014',
  title: 'Autonomous AI Robotics & Vision Challenge 2026',
  category: 'Coding Competition',
  branches: ['CSE', 'AI/ML', 'ECE', 'EEE', 'Mech'],
  description:
  'Compete in real-time object detection, autonomous navigation, and Computer Vision challenges using OpenCV, YOLOv8, and ROS2. Build smart vision systems for real-world robotics and drone automation.',
  date: '2026-11-20',
  startTime: '09:30',
  endTime: '17:00',
  venue: 'Robotics & Embedded Systems Lab, Block C',
  organizer: 'Robotics & AI Student Chapter, Dept. of CSE',
  registrationDeadline: '2026-11-16T23:59',
  capacity: 100,
  posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
  eligibility: 'CSE, AI/ML, ECE, EEE, and Mech students (Solo or Pairs)',
  rules: 'Real-time evaluation on live camera feeds and obstacle courses.',
  requirements: 'Laptop with Python & OpenCV, USB Webcam or IP Camera',
  contactPerson: 'Mr. Aakash Sharma',
  contactEmail: 'aakash.sharma@vignan.ac.in',
  status: 'UPCOMING',
  createdAt: '2026-08-18T10:00:00'
},
// PAST EVENTS
{
  id: 'event-007',
  title: 'Coding Challenge 2026',
  category: 'Coding Competition',
  description:
  'Competitive programming contest featuring algorithmic problems across difficulty levels. Participants solved problems in C++, Java, and Python on an online judge platform. Topics covered: dynamic programming, graph algorithms, string manipulation, and data structures.',
  date: '2026-07-20',
  startTime: '09:00',
  endTime: '13:00',
  venue: 'CSE Computer Lab 1 & 2, Block A',
  organizer: 'Competitive Programming Club, CSE',
  registrationDeadline: '2026-07-17T23:59',
  capacity: 200,
  posterUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop",
  eligibility: 'All CSE students',
  rules: 'Individual competition. Online judge only. No external resources.',
  requirements: 'College ID, knowledge of at least one programming language',
  contactPerson: 'Prof. Nagarjuna',
  contactEmail: 'nagarjuna@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2026-06-20T09:00:00'
},
{
  id: 'event-008',
  title: 'AI Innovation Workshop',
  category: 'AI/ML Workshop',
  description:
  'Two-day workshop on cutting-edge AI applications including generative AI, LLMs, and computer vision. Participants built mini-projects using OpenAI APIs and HuggingFace models. Workshop concluded with a demo day where students presented their AI prototypes.',
  date: '2026-08-05',
  startTime: '09:00',
  endTime: '17:00',
  venue: 'CSE Seminar Hall, Block A',
  organizer: 'AI Research Group, Dept. of CSE',
  registrationDeadline: '2026-08-01T23:59',
  capacity: 150,
  posterUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop",
  eligibility: 'CSE 3rd and 4th year students',
  rules: 'Attendance mandatory both days for certificate.',
  requirements: 'Laptop, Python environment, OpenAI API key (provided for workshop)',
  contactPerson: 'Dr. Ramesh Babu',
  contactEmail: 'ramesh.babu@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2026-07-01T10:00:00'
},
{
  id: 'event-009',
  title: 'Technical Talk: Future of Web3',
  category: 'Technical Talk',
  description:
  'Expert talk by blockchain developers from Polygon Labs on Web3 architecture, decentralized applications, smart contracts, and the evolving landscape of blockchain technology. Interactive session with live demos of DApp development.',
  date: '2026-07-30',
  startTime: '14:00',
  endTime: '16:30',
  venue: 'CSE Auditorium, Block C',
  organizer: 'Dept. of CSE',
  registrationDeadline: '2026-07-28T23:59',
  capacity: 250,
  posterUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
  eligibility: 'Open to all students',
  rules: 'Registration required. Seats limited.',
  requirements: 'College ID',
  contactPerson: 'Ms. Divya Menon',
  contactEmail: 'divya.menon@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2026-07-10T10:00:00'
},
{
  id: 'event-010',
  title: 'Data Science Ideathon',
  category: 'Ideathon',
  description:
  'Teams proposed data-driven solutions to real societal problems. Presentations evaluated on problem statement clarity, data analysis approach, visualization quality, and feasibility. Winning team received ₹15,000 prize and mentorship from industry professionals.',
  date: '2026-08-10',
  startTime: '09:00',
  endTime: '15:00',
  venue: 'Innovation Lab, CSE Block B',
  organizer: 'Data Science Club, CSE',
  registrationDeadline: '2026-08-06T23:59',
  capacity: 100,
  posterUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
  eligibility: 'CSE students, teams of 3–4',
  rules: 'Pre-registered teams only. Presentations max 10 minutes.',
  requirements: 'Presentation slides, dataset pre-prepared',
  contactPerson: 'Dr. Sunita Verma',
  contactEmail: 'sunita.verma@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2026-07-20T09:00:00'
},
{
  id: 'event-011',
  title: 'Career Development Workshop',
  category: 'Career Development Event',
  description:
  'Resume building, interview preparation, and career guidance session conducted by HR professionals from TCS, Infosys, and Wipro. Covers technical interview strategies, aptitude test tips, and soft skills development for campus placements.',
  date: '2026-08-15',
  startTime: '10:00',
  endTime: '13:00',
  venue: 'CSE Seminar Hall, Block A',
  organizer: 'Training & Placement Cell, Vignan University',
  registrationDeadline: '2026-08-12T23:59',
  capacity: 300,
  posterUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
  eligibility: 'Final year CSE students',
  rules: 'Formal attire required. Resume soft copy mandatory.',
  requirements: 'Updated resume (soft copy), college ID',
  contactPerson: 'Mr. Rajesh Kumar',
  contactEmail: 'placement@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2026-08-01T09:00:00'
},
{
  id: 'event-015',
  title: 'Stack Hack 48H — Application Development Hackathon',
  category: 'Hackathon',
  branches: ['CSE', 'IT', 'ECE', 'AI/ML'],
  description:
    '48-hour intensive Application Development Hackathon organized by the Department of CSE in association with ACM. Teams build web and mobile applications for real-world problems. Prize Pool: 1st Prize ₹5,300/-, 2nd Prize ₹3,300/-, 3rd Prize ₹2,000/- plus consolation prizes.',
  date: '2024-10-28',
  startTime: '09:00',
  endTime: '18:00',
  venue: 'Vignan Library 0th Floor, Vignan University',
  organizer: 'Dept. of CSE & ACM Student Chapter',
  registrationDeadline: '2024-10-25T23:59',
  capacity: 150,
  posterUrl: "/images/events/event-015.png",
  eligibility: 'All CSE and Engineering students from 2nd to 4th year',
  rules: 'Continuous 48-hour hackathon. Plagiarism strictly prohibited. Original code required.',
  requirements: 'Laptop with development IDEs, Git repository, team registration',
  contactPerson: 'Dr. T. H. Rajesh & Mr. P. Vijayababu',
  contactEmail: 'stackhack@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2024-10-01T09:00:00'
},
{
  id: 'event-016',
  title: 'Sustainability Ideathon — Building a Sustainable Future with Apps',
  category: 'Ideathon',
  branches: ['CSE', 'IT', 'AI/ML'],
  description:
    'Department of Computer Science & Engineering presents Sustainability Ideathon. Focus areas include Energy & Resource Management, Food & Agriculture, Sustainable Cities & Communities, Environment & Climate Action, and Health, Education & Awareness.',
  date: '2025-09-11',
  startTime: '09:30',
  endTime: '16:30',
  venue: 'Sangamithra Seminar Hall, II Floor, Nagarjuna Block',
  organizer: 'Dept. of CSE & ACM Student Chapter',
  registrationDeadline: '2025-09-08T23:59',
  capacity: 120,
  posterUrl: "/images/events/event-016.png",
  eligibility: 'II & III Year CSE Students (Batch Size: Max 3)',
  rules: 'Maximum batch size of 3 students per team. Slide presentation max 10 minutes.',
  requirements: 'Presentation deck, product abstract, prototype wireframes',
  contactPerson: 'Shaik Aasif / J. Archana',
  contactEmail: 'sustainability.ideathon@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2025-08-20T10:00:00'
},
{
  id: 'event-017',
  title: 'Smart India Hackathon (SIH) 2025 Internal Hackathon',
  category: 'Hackathon',
  branches: ['CSE', 'IT', 'ECE', 'AI/ML', 'EEE', 'Data Science'],
  description:
    'Official internal screening hackathon for Smart India Hackathon (SIH) 2025. Software & Hardware themes: Smart Automation, Fitness & Sports, Agriculture & FoodTech, MedTech/BioTech/HealthTech. Top teams qualify for the national round of SIH.',
  date: '2025-09-12',
  startTime: '08:15',
  endTime: '18:00',
  venue: 'CSE Innovation Labs, Block B',
  organizer: 'Dept. of CSE & SIH Campus Committee',
  registrationDeadline: '2025-09-09T23:59',
  capacity: 200,
  posterUrl: "/images/events/event-017.png",
  eligibility: 'All team members from same college. Cross-branch teams encouraged.',
  rules: 'Team size 6 members (at least 1 female member mandatory as per SIH guidelines). No inter-college teams.',
  requirements: 'Team solution presentation, GitHub repository link, prototype demo',
  contactPerson: 'SIH Campus Coordinators',
  contactEmail: 'sih2025@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2025-08-25T08:00:00'
},
{
  id: 'event-018',
  title: 'Code Storm — Unleash Your Inner Coding',
  category: 'Coding Competition',
  branches: ['CSE'],
  description:
    'Department of Computer Science & Engineering presents Code Storm. Unleash your inner coding skills in data structures, dynamic programming, graph algorithms, and problem solving. Cash prizes for top coders and participation certificates for all.',
  date: '2025-09-25',
  startTime: '09:00',
  endTime: '17:00',
  venue: 'V-Block / H-Block Labs, Vignan University',
  organizer: 'Dept. of CSE & ACM Student Chapter',
  registrationDeadline: '2025-09-22T23:59',
  capacity: 180,
  posterUrl: "/images/events/event-018.png",
  eligibility: 'All CSE 2nd & 3rd Year Students are eligible',
  rules: 'Individual contest on online judge platform. Languages allowed: C, C++, Java, Python.',
  requirements: 'College ID card, familiarity with online judge systems',
  contactPerson: 'Dr. Ramesh Babu',
  contactEmail: 'codestorm@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2025-09-01T09:00:00'
},
{
  id: 'event-019',
  title: 'Stack Hack 72H — Application Development Hackathon',
  category: 'Hackathon',
  branches: ['CSE', 'IT', 'AI/ML', 'ECE'],
  description:
    'Organized by Department of CSE (ABET Accredited). 72-hour continuous application development hackathon. Prize Pool: 1st Prize ₹4,000, 2nd Prize ₹2,000, 3rd Prize ₹1,000 & 5 Consolation Prizes.',
  date: '2025-11-06',
  startTime: '09:00',
  endTime: '18:00',
  venue: 'CSE Nagarjuna Block Labs, Vignan University',
  organizer: 'Department of CSE',
  registrationDeadline: '2025-11-03T23:59',
  capacity: 160,
  posterUrl: "/images/events/event-019.png",
  eligibility: 'Open to all CSE and IT undergraduate students',
  rules: 'Teams of 2–4 members. 72-hour building phase with live mentor reviews.',
  requirements: 'Laptop with full-stack environment, Git repository',
  contactPerson: 'Mr. P. Vijayababu, Mr. P. Venkata Rajulu, Mr. D. Balakotaiah',
  contactEmail: 'stackhack72@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2025-10-10T10:00:00'
},
{
  id: 'event-020',
  title: 'AI Smart Campus Hackathon',
  category: 'Hackathon',
  branches: ['CSE', 'AI/ML', 'IT'],
  description:
    'Department of CSE presents AI Smart Campus Hackathon: Develop • Innovate • Optimize • Future AI. Teams build intelligent campus solutions, smart attendance systems, AI chatbot assistants, and campus energy optimization models.',
  date: '2026-03-14',
  startTime: '09:00',
  endTime: '18:00',
  venue: 'AI Research Lab, Block A, Vignan University',
  organizer: 'Dept. of CSE & AI Research Group',
  registrationDeadline: '2026-03-10T23:59',
  capacity: 150,
  posterUrl: "/images/events/event-020.png",
  eligibility: 'For CSE III Year Students',
  rules: 'Teams of 2–4 students. Must integrate AI/ML models into working applications.',
  requirements: 'Laptop, Python 3.9+, TensorFlow/PyTorch, OpenAI or HuggingFace API key',
  contactPerson: 'Dr. Ramesh Babu',
  contactEmail: 'aismartcampus@vignan.ac.in',
  status: 'COMPLETED',
  createdAt: '2026-02-15T09:00:00'
}];


export const MOCK_REGISTRATIONS: Registration[] = [];


// Registered counts per event (simulated from DB)
export const REGISTERED_COUNTS: Record<string, number> = {
  // Finished / Completed events with full participation stats
  'remote-event-7': 250,
  'remote-event-8': 160,
  'remote-event-9': 210,
  'remote-event-10': 185,
  'remote-event-6': 300,
  'remote-event-5': 310,
  'remote-event-12': 175,
  'remote-event-15': 140,
  'remote-event-14': 220,
  'remote-event-17': 150,
  'remote-event-13': 130,
  'remote-event-11': 450,
  'event-007': 180,
  'event-008': 120,
  'event-009': 198,
  'event-010': 85,
  'event-011': 247,
  'event-015': 142,
  'event-016': 110,
  'event-017': 195,
  'event-018': 165,
  'event-019': 152,
  'event-020': 138,

  // Upcoming events — start at 0 and update live when students register
  'event-001': 0,
  'event-002': 0,
  'event-003': 0,
  'event-004': 0,
  'event-005': 0,
  'event-006': 0,
  'event-012': 0,
  'event-013': 0,
  'event-014': 0,
};

// Attended counts for completed events
export const ATTENDED_COUNTS: Record<string, number> = {
  'remote-event-7': 230,
  'remote-event-8': 145,
  'remote-event-9': 195,
  'remote-event-10': 168,
  'remote-event-6': 275,
  'remote-event-5': 285,
  'remote-event-12': 158,
  'remote-event-15': 128,
  'remote-event-14': 202,
  'remote-event-17': 136,
  'remote-event-13': 118,
  'remote-event-11': 410,
  'event-007': 162,
  'event-008': 108,
  'event-009': 175,
  'event-010': 74,
  'event-011': 221,
  'event-015': 130,
  'event-016': 98,
  'event-017': 182,
  'event-018': 150,
  'event-019': 140,
  'event-020': 125,
};

export const GALLERY_IMAGES: GalleryImage[] = [
  // remote-event-7 & event-015 (STACK HACK 2024 / 48H)
  { id: 'gal-re7-1', eventId: 'remote-event-7', imageUrl: "/images/events/remote-event-7.png", caption: 'Official event poster for STACK HACK 2024' },
  { id: 'gal-re7-2', eventId: 'remote-event-7', imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop", caption: 'Student teams brainstorming application architecture during Stack Hack 2024' },
  { id: 'gal-re7-3', eventId: 'remote-event-7', imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop", caption: 'Live coding and prototype development session at Vignan Library' },
  { id: 'gal-re7-4', eventId: 'remote-event-7', imageUrl: "https://images.unsplash.com/photo-1542744094-3a3172720180?w=800&auto=format&fit=crop", caption: 'App demo presentation to CSE department faculty judges' },

  // remote-event-8 & event-016 (SUSTAINABILITY IDEATHON)
  { id: 'gal-re8-1', eventId: 'remote-event-8', imageUrl: "/images/events/remote-event-8.png", caption: 'Official poster for Sustainability Ideathon 2025' },
  { id: 'gal-re8-2', eventId: 'remote-event-8', imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop", caption: 'Inaugural address at Sangamithra Seminar Hall for Sustainability Ideathon' },
  { id: 'gal-re8-3', eventId: 'remote-event-8', imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop", caption: 'Participants presenting eco-friendly app concepts for sustainable development' },
  { id: 'gal-re8-4', eventId: 'remote-event-8', imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop", caption: 'Jury evaluating student project proposals on green technology' },

  // remote-event-9 & event-017 (Smart India Hackathon 2025)
  { id: 'gal-re9-1', eventId: 'remote-event-9', imageUrl: "/images/events/remote-event-9.png", caption: 'Smart India Internal Hackathon 2025 banner' },
  { id: 'gal-re9-2', eventId: 'remote-event-9', imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop", caption: 'Student developers building hardware and software solutions for SIH 2025' },
  { id: 'gal-re9-3', eventId: 'remote-event-9', imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop", caption: 'Internal evaluation panel reviewing prototype demonstrations' },
  { id: 'gal-re9-4', eventId: 'remote-event-9', imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop", caption: 'Top teams shortlisted for National Smart India Hackathon' },

  // remote-event-10 & event-018 (CODE STORM)
  { id: 'gal-re10-1', eventId: 'remote-event-10', imageUrl: "/images/events/remote-event-10.png", caption: 'Code Storm technical event official flyer' },
  { id: 'gal-re10-2', eventId: 'remote-event-10', imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop", caption: 'Participants solving algorithmic problems during Code Storm in N-Block' },
  { id: 'gal-re10-3', eventId: 'remote-event-10', imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop", caption: 'Real-time competitive coding dashboard and scoring' },

  // remote-event-6 & event-019 (STACK HACK 72H)
  { id: 'gal-re6-1', eventId: 'remote-event-6', imageUrl: "/images/events/remote-event-6.png", caption: 'STACK HACK application development event flyer' },
  { id: 'gal-re6-2', eventId: 'remote-event-6', imageUrl: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=800&auto=format&fit=crop", caption: 'Over 300 students participating in application development hackathon' },
  { id: 'gal-re6-3', eventId: 'remote-event-6', imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop", caption: 'Demonstration of selected campus automation web applications' },

  // remote-event-5 & event-020 (AI Smart Campus Hackathon)
  { id: 'gal-re5-1', eventId: 'remote-event-5', imageUrl: "/images/events/remote-event-5.png", caption: 'AI Smart Campus Hackathon poster graphic' },
  { id: 'gal-re5-2', eventId: 'remote-event-5', imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop", caption: 'Students designing Agentic AI assistants for smart campus operations' },
  { id: 'gal-re5-3', eventId: 'remote-event-5', imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop", caption: 'Demonstration of AI-based automated attendance and chatbot system' },

  // remote-event-12 (LUDUSFORGE Game Hackathon)
  { id: 'gal-re12-1', eventId: 'remote-event-12', imageUrl: "/images/events/remote-event-12.png", caption: 'LudusForge 2026 Game Hackathon flyer' },
  { id: 'gal-re12-2', eventId: 'remote-event-12', imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop", caption: '48-hour continuous game development session in Nagarjuna Block' },
  { id: 'gal-re12-3', eventId: 'remote-event-12', imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop", caption: 'Playtesting session where judges test arcade and survival games' },

  // remote-event-15 (Advances in Generative AI FDP)
  { id: 'gal-re15-1', eventId: 'remote-event-15', imageUrl: "/images/events/remote-event-15.png", caption: 'Generative AI & Computer Vision FDP official poster' },
  { id: 'gal-re15-2', eventId: 'remote-event-15', imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop", caption: 'Keynote speech on Generative AI & Vision Transformers by expert speaker' },
  { id: 'gal-re15-3', eventId: 'remote-event-15', imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop", caption: 'Faculty participants engaged in hands-on PyTorch & RAG coding labs' },

  // remote-event-14 (ICC-CNS 2026 IEEE Conference)
  { id: 'gal-re14-1', eventId: 'remote-event-14', imageUrl: "/images/events/remote-event-14.png", caption: 'ICC-CNS 2026 IEEE Conference brochure graphic' },
  { id: 'gal-re14-2', eventId: 'remote-event-14', imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop", caption: 'IEEE technical session opening ceremony at NB 211, N-Block' },
  { id: 'gal-re14-3', eventId: 'remote-event-14', imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop", caption: 'Researchers presenting technical papers on cognitive computing & 5G networks' },

  // remote-event-17 (Next-Gen AI FDP)
  { id: 'gal-re17-1', eventId: 'remote-event-17', imageUrl: "/images/events/remote-event-17.png", caption: 'Next-Generation AI FDP banner' },
  { id: 'gal-re17-2', eventId: 'remote-event-17', imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop", caption: 'Interactive session on Foundation Models and Vision-Language Architectures' },
  { id: 'gal-re17-3', eventId: 'remote-event-17', imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop", caption: 'Hands-on lab training on Prompt Engineering and Vector Databases' },

  // remote-event-13 (6-Day MLOps FDP)
  { id: 'gal-re13-1', eventId: 'remote-event-13', imageUrl: "/images/events/remote-event-13.png", caption: 'MLOps 6-Day FDP schedule flyer' },
  { id: 'gal-re13-2', eventId: 'remote-event-13', imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop", caption: 'Mr. Kalkeseetharaman (byteXL) delivering MLOps architecture lecture' },
  { id: 'gal-re13-3', eventId: 'remote-event-13', imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop", caption: 'Faculty building end-to-end ML CI/CD pipelines with GitHub Actions' },

  // remote-event-11 (QuBioDL 2K26 Healthcare Seminar)
  { id: 'gal-re11-1', eventId: 'remote-event-11', imageUrl: "/images/events/remote-event-11.png", caption: 'QuBioDL 2K26 National Seminar flyer' },
  { id: 'gal-re11-2', eventId: 'remote-event-11', imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop", caption: 'Inaugural session at Sa Re Ga Ma Seminar Hall with over 450 participants' },
  { id: 'gal-re11-3', eventId: 'remote-event-11', imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop", caption: 'Biomedical imaging demo analyzing MRI & CT scans with quantum AI models' },

  // event-007 (Coding Challenge 2026)
  { id: 'gal-001', eventId: 'event-007', imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop", caption: 'Students solving competitive programming problems in CSE Lab 1' },
  { id: 'gal-002', eventId: 'event-007', imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop", caption: 'Top performers receiving trophies at the prize distribution ceremony' },
  { id: 'gal-003', eventId: 'event-007', imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop", caption: 'Team collaboration and problem analysis during contest' },

  // event-008 (AI Innovation Workshop)
  { id: 'gal-004', eventId: 'event-008', imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop", caption: 'AI model training and deep learning hands-on session in progress' },

  // event-009 (Technical Talk: Future of Web3)
  { id: 'gal-006', eventId: 'event-009', imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop", caption: 'Polygon Labs speaker presenting on Web3 architecture and smart contracts' },

  // event-010 (Data Science Ideathon)
  { id: 'gal-007', eventId: 'event-010', imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop", caption: 'Data Science Ideathon analytics dashboard presentation' },

  // event-011 (Career Development Workshop)
  { id: 'gal-008', eventId: 'event-011', imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop", caption: 'Career guidance and interview strategy session with HR experts' }
];


export const CATEGORY_COLORS: Record<string, {bg: string;text: string;}> = {
  'Hackathon': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Coding Competition': { bg: 'bg-red-50', text: 'text-red-700' },
  'Workshop': { bg: 'bg-cyan-50', text: 'text-cyan-700' },
  'Seminar': { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'Technical Talk': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Guest Lecture': { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  'Project Expo': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Ideathon': { bg: 'bg-pink-50', text: 'text-pink-700' },
  'Quiz': { bg: 'bg-teal-50', text: 'text-teal-700' },
  'AI/ML Workshop': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Web Development Workshop': { bg: 'bg-violet-50', text: 'text-violet-700' },
  'Cloud Computing Workshop': { bg: 'bg-sky-50', text: 'text-sky-700' },
  'Cyber Security Event': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'Career Development Event': { bg: 'bg-green-50', text: 'text-green-700' }
};