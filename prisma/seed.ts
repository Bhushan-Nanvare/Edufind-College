import { PrismaClient, CollegeType, ExamType, CategoryType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* ──────────────────────────── Colleges Catalog ──────────────────────────── */

const colleges: Array<{
  name: string;
  slug: string;
  city: string;
  state: string;
  type: CollegeType;
  fees: number;
  rating: number;
  description: string;
  established: number;
  totalStudents: number;
  campusSize: string;
  logoUrl: string;
  examAccepted: string;
  naacGrade: string;
  nirf: number;
  approvals: string;
  website: string;
}> = [
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "GOVERNMENT",
    fees: 250000,
    rating: 4.8,
    description:
      "IIT Bombay is one of the premier engineering institutes in India, known for its rigorous academics, cutting-edge research, and vibrant campus life.",
    established: 1958,
    totalStudents: 11000,
    campusSize: "550 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/1/1d/IIT_Bombay_Logo.svg",
    examAccepted: "JEE_ADVANCED",
    naacGrade: "A++",
    nirf: 3,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.iitb.ac.in",
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "GOVERNMENT",
    fees: 230000,
    rating: 4.7,
    description:
      "IIT Delhi is a globally recognized institute offering world-class education in engineering, sciences, and management with strong industry connections.",
    established: 1961,
    totalStudents: 9500,
    campusSize: "325 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_Logo.svg",
    examAccepted: "JEE_ADVANCED",
    naacGrade: "A++",
    nirf: 2,
    approvals: "UGC, AICTE, NAAC",
    website: "https://home.iitd.ac.in",
  },
  {
    name: "Indian Institute of Technology Madras",
    slug: "iit-madras",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "GOVERNMENT",
    fees: 225000,
    rating: 4.9,
    description:
      "IIT Madras is consistently ranked #1 in India for engineering. Known for its research parks, startup ecosystem, and beautiful campus inside a national park.",
    established: 1959,
    totalStudents: 10500,
    campusSize: "617 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/69/IIT_Madras_Logo.svg",
    examAccepted: "JEE_ADVANCED",
    naacGrade: "A++",
    nirf: 1,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.iitm.ac.in",
  },
  {
    name: "Indian Institute of Technology Kanpur",
    slug: "iit-kanpur",
    city: "Kanpur",
    state: "Uttar Pradesh",
    type: "GOVERNMENT",
    fees: 220000,
    rating: 4.6,
    description:
      "IIT Kanpur is renowned for its computer science and aerospace engineering programs with a strong focus on fundamental research.",
    established: 1959,
    totalStudents: 8000,
    campusSize: "1055 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a3/IIT_Kanpur_Logo.svg",
    examAccepted: "JEE_ADVANCED",
    naacGrade: "A++",
    nirf: 4,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.iitk.ac.in",
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    slug: "iit-kharagpur",
    city: "Kharagpur",
    state: "West Bengal",
    type: "GOVERNMENT",
    fees: 215000,
    rating: 4.5,
    description:
      "IIT Kharagpur is the oldest IIT, established in 1951. It has the largest campus among all IITs and offers the widest range of courses.",
    established: 1951,
    totalStudents: 12000,
    campusSize: "2100 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/IIT_Kharagpur_Logo.svg",
    examAccepted: "JEE_ADVANCED",
    naacGrade: "A++",
    nirf: 5,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.iitkgp.ac.in",
  },
  {
    name: "Indian Institute of Science Bangalore",
    slug: "iisc-bangalore",
    city: "Bangalore",
    state: "Karnataka",
    type: "GOVERNMENT",
    fees: 35000,
    rating: 4.9,
    description:
      "IISc is India's premier research institution, excelling in science and engineering research. Ranked #1 in research output in India.",
    established: 1909,
    totalStudents: 4500,
    campusSize: "400 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/20/IISc_logo.svg",
    examAccepted: "JEE_ADVANCED",
    naacGrade: "A++",
    nirf: 6,
    approvals: "UGC, NAAC",
    website: "https://www.iisc.ac.in",
  },
  {
    name: "BITS Pilani",
    slug: "bits-pilani",
    city: "Pilani",
    state: "Rajasthan",
    type: "DEEMED",
    fees: 520000,
    rating: 4.4,
    description:
      "BITS Pilani is a premier deemed university known for its unique practice school concept and strong industry connections. One of the top private engineering colleges in India.",
    established: 1964,
    totalStudents: 5000,
    campusSize: "328 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg",
    examAccepted: "JEE_MAIN",
    naacGrade: "A",
    nirf: 25,
    approvals: "UGC, NAAC",
    website: "https://www.bits-pilani.ac.in",
  },
  {
    name: "National Institute of Technology Trichy",
    slug: "nit-trichy",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "GOVERNMENT",
    fees: 175000,
    rating: 4.3,
    description:
      "NIT Trichy is the top-ranked NIT in India, known for excellent placement records, strong alumni network, and affordable quality education.",
    established: 1964,
    totalStudents: 7500,
    campusSize: "800 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/8/8c/NIT_Trichy_Logo.svg",
    examAccepted: "JEE_MAIN",
    naacGrade: "A++",
    nirf: 9,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.nitt.edu",
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    type: "PRIVATE",
    fees: 350000,
    rating: 4.1,
    description:
      "VIT is one of India's top private universities, known for its modern infrastructure, diverse student body, and strong placement records with top companies.",
    established: 1984,
    totalStudents: 30000,
    campusSize: "372 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c4/VIT_logo.svg",
    examAccepted: "JEE_MAIN,MHT_CET",
    naacGrade: "A++",
    nirf: 12,
    approvals: "UGC, AICTE, NAAC",
    website: "https://vit.ac.in",
  },
  {
    name: "Delhi Technological University",
    slug: "dtu-delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "GOVERNMENT",
    fees: 176000,
    rating: 4.2,
    description:
      "DTU (formerly DCE) is one of the oldest and most prestigious engineering colleges in Delhi with excellent placements and industry connections.",
    established: 1941,
    totalStudents: 9000,
    campusSize: "164 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/b/b5/DTU_Logo.svg",
    examAccepted: "JEE_MAIN",
    naacGrade: "A+",
    nirf: 35,
    approvals: "UGC, AICTE, NAAC",
    website: "https://dtu.ac.in",
  },
  {
    name: "College of Engineering Pune",
    slug: "coep-pune",
    city: "Pune",
    state: "Maharashtra",
    type: "GOVERNMENT",
    fees: 120000,
    rating: 4.0,
    description:
      "COEP Technological University is one of the oldest engineering colleges in Asia, offering quality education at affordable fees with strong research programs.",
    established: 1854,
    totalStudents: 5000,
    campusSize: "130 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/50/COEP_Tech_Logo.svg",
    examAccepted: "JEE_MAIN,MHT_CET",
    naacGrade: "A+",
    nirf: 55,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.coep.org.in",
  },
  {
    name: "International Institute of Information Technology Hyderabad",
    slug: "iiit-hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    type: "DEEMED",
    fees: 310000,
    rating: 4.5,
    description:
      "IIIT Hyderabad is a research-driven institute with world-class CS and AI programs. Known for producing top talent for global tech companies.",
    established: 1998,
    totalStudents: 2500,
    campusSize: "66 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/5d/IIIT_Hyderabad_Logo.svg",
    examAccepted: "JEE_MAIN",
    naacGrade: "A++",
    nirf: 15,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.iiit.ac.in",
  },
  {
    name: "Jadavpur University",
    slug: "jadavpur-kolkata",
    city: "Kolkata",
    state: "West Bengal",
    type: "GOVERNMENT",
    fees: 15000,
    rating: 4.3,
    description:
      "Jadavpur University is one of the most prestigious state universities in India, known for its extremely competitive admissions and quality engineering education at minimal fees.",
    established: 1955,
    totalStudents: 11000,
    campusSize: "52 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/90/Jadavpur_University_logo.svg",
    examAccepted: "JEE_MAIN",
    naacGrade: "A",
    nirf: 18,
    approvals: "UGC, AICTE, NAAC",
    website: "http://www.jaduniv.edu.in",
  },
  {
    name: "Manipal Institute of Technology",
    slug: "mit-manipal",
    city: "Manipal",
    state: "Karnataka",
    type: "PRIVATE",
    fees: 450000,
    rating: 4.0,
    description:
      "MIT Manipal is a top private engineering college known for excellent infrastructure, global exposure programs, and strong placement records.",
    established: 1957,
    totalStudents: 8000,
    campusSize: "700 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0b/Manipal_Academy_Logo.svg",
    examAccepted: "JEE_MAIN,MHT_CET",
    naacGrade: "A++",
    nirf: 30,
    approvals: "UGC, AICTE, NAAC",
    website: "https://manipal.edu/mit.html",
  },
  {
    name: "SRM Institute of Science and Technology",
    slug: "srm-chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "DEEMED",
    fees: 400000,
    rating: 3.9,
    description:
      "SRM IST is one of the largest and most reputed private universities in India with strong international collaborations and a wide range of engineering programs.",
    established: 1985,
    totalStudents: 50000,
    campusSize: "250 acres",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.svg",
    examAccepted: "JEE_MAIN",
    naacGrade: "A++",
    nirf: 33,
    approvals: "UGC, AICTE, NAAC",
    website: "https://www.srmist.edu.in",
  },
];

/* ──────────────────── Courses per college ──────────────────── */

function getCoursesForCollege(
  slug: string,
  type: string,
  exam: string
): Array<{ name: string; duration: number; fees: number }> {
  const base = [
    { name: "B.Tech Computer Science", duration: 4, fees: type === "GOVERNMENT" ? 200000 : 450000 },
    { name: "B.Tech Electrical Engineering", duration: 4, fees: type === "GOVERNMENT" ? 190000 : 420000 },
    { name: "B.Tech Mechanical Engineering", duration: 4, fees: type === "GOVERNMENT" ? 185000 : 400000 },
  ];

  if (slug.startsWith("iit") || slug.startsWith("iisc")) {
    base.push(
      { name: "M.Tech Computer Science", duration: 2, fees: 50000 },
      { name: "PhD (Engineering)", duration: 5, fees: 25000 }
    );
  }

  if (exam.includes("JEE_MAIN") || exam.includes("MHT_CET")) {
    base.push({ name: "B.Tech Electronics & Communication", duration: 4, fees: type === "GOVERNMENT" ? 180000 : 380000 });
  }

  return base;
}

/* ──────────────────── Placement data ──────────────────── */

function getPlacementForCollege(
  rating: number,
  fees: number
): { avgSalary: number; highestSalary: number; placementPercent: number; topRecruiters: string; year: number } {
  const tier = rating >= 4.5 ? "top" : rating >= 4.0 ? "mid" : "base";
  const data = {
    top: { avgSalary: 2200000, highestSalary: 15000000, placementPercent: 96, recruiters: "Google, Microsoft, Amazon, Apple, Goldman Sachs, DE Shaw" },
    mid: { avgSalary: 1200000, highestSalary: 6000000, placementPercent: 88, recruiters: "TCS, Infosys, Wipro, Cognizant, Capgemini, Deloitte" },
    base: { avgSalary: 800000, highestSalary: 3000000, placementPercent: 78, recruiters: "TCS, Infosys, Wipro, Accenture, HCL, Tech Mahindra" },
  };
  const d = data[tier];
  return { avgSalary: d.avgSalary, highestSalary: d.highestSalary, placementPercent: d.placementPercent, topRecruiters: d.recruiters, year: 2024 };
}

/* ──────────────────── Rank cutoffs ──────────────────── */

function getRankCutoffs(
  slug: string,
  exam: string,
  nirf: number | null
): Array<{ exam: ExamType; category: CategoryType; closingRank: number; year: number }> {
  const cutoffs: Array<{ exam: ExamType; category: CategoryType; closingRank: number; year: number }> = [];
  const base = (nirf ?? 50) * 200;

  if (exam.includes("JEE_ADVANCED")) {
    cutoffs.push(
      { exam: "JEE_ADVANCED", category: "GENERAL", closingRank: base, year: 2024 },
      { exam: "JEE_ADVANCED", category: "OBC", closingRank: Math.round(base * 1.5), year: 2024 },
      { exam: "JEE_ADVANCED", category: "SC", closingRank: Math.round(base * 3), year: 2024 },
      { exam: "JEE_ADVANCED", category: "ST", closingRank: Math.round(base * 4), year: 2024 }
    );
  }

  if (exam.includes("JEE_MAIN")) {
    cutoffs.push(
      { exam: "JEE_MAIN", category: "GENERAL", closingRank: base * 5, year: 2024 },
      { exam: "JEE_MAIN", category: "OBC", closingRank: Math.round(base * 7), year: 2024 }
    );
  }

  if (exam.includes("MHT_CET")) {
    cutoffs.push(
      { exam: "MHT_CET", category: "GENERAL", closingRank: Math.round(base * 2), year: 2024 }
    );
  }

  return cutoffs;
}

/* ──────────────────── Review templates ──────────────────── */

const reviewTemplates = [
  { rating: 5, text: "World-class faculty and excellent research opportunities. The campus infrastructure is top-notch and the peer group is incredibly talented." },
  { rating: 4, text: "Great college with strong academics and placement records. The campus life is vibrant with numerous clubs and events throughout the year." },
  { rating: 5, text: "Outstanding learning environment with cutting-edge labs and facilities. The alumni network is incredibly strong and helpful for career growth." },
  { rating: 4, text: "Excellent academic rigor and practical exposure through projects and internships. The placement cell is very active and supportive." },
  { rating: 3, text: "Good college with decent facilities. Some departments are stronger than others. The location could be better but overall a solid choice." },
  { rating: 5, text: "Transformative experience! The exposure to research, industry interactions, and extracurricular activities helped me grow both professionally and personally." },
  { rating: 4, text: "Strong academics backed by experienced professors. The startup culture on campus is inspiring and there are plenty of entrepreneurship opportunities." },
  { rating: 4, text: "Good infrastructure and well-maintained campus. The library and computing facilities are excellent. Placement season brings top companies." },
  { rating: 3, text: "Decent college with improving standards. The new initiatives by the administration are promising. Some courses need curriculum updates." },
  { rating: 5, text: "Best decision of my life! The interdisciplinary approach to learning and strong industry partnerships make this institute truly exceptional." },
  { rating: 4, text: "Solid engineering education with emphasis on practical skills. Lab facilities are modern and well-equipped. Good hostel and mess facilities." },
  { rating: 4, text: "Well-rounded education with a good mix of theory and practice. The cultural and technical festivals are highlights of campus life." },
  { rating: 3, text: "Average in some aspects but excels in specific departments. The recent infrastructure upgrades have significantly improved the campus." },
  { rating: 5, text: "Phenomenal research output and innovation ecosystem. The mentorship from senior faculty members is invaluable for academic and career growth." },
  { rating: 4, text: "Great placement records and strong alumni connections. The collaborative learning environment pushes you to achieve more than you thought possible." },
];

/* ──────────────────── Main Seed ──────────────────── */

async function main() {
  const existing = await prisma.college.count();
  if (existing > 0) {
    console.log(
      "Database already seeded. Truncate tables first to reload the catalog."
    );
    return;
  }

  console.log(`Seeding ${colleges.length} colleges...`);

  for (const college of colleges) {
    const created = await prisma.college.create({ data: college });
    const courses = getCoursesForCollege(
      created.slug,
      created.type,
      created.examAccepted ?? ""
    );
    const placement = getPlacementForCollege(created.rating, created.fees);
    const cutoffs = getRankCutoffs(
      created.slug,
      created.examAccepted ?? "",
      created.nirf
    );

    await prisma.course.createMany({
      data: courses.map((c) => ({ ...c, collegeId: created.id })),
    });
    await prisma.placement.create({
      data: { ...placement, collegeId: created.id },
    });
    if (cutoffs.length > 0) {
      await prisma.rankCutoff.createMany({
        data: cutoffs.map((c) => ({ ...c, collegeId: created.id })),
      });
    }
  }

  // Demo user
  const hashedPassword = await bcrypt.hash("Demo@1234", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@edufind.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@edufind.com",
      password: hashedPassword,
    },
  });

  // Seed reviews for top colleges
  const topColleges = await prisma.college.findMany({
    orderBy: { nirf: "asc" },
    take: 15,
  });
  for (let i = 0; i < topColleges.length; i++) {
    const template = reviewTemplates[i % reviewTemplates.length];
    await prisma.review.create({
      data: {
        userId: demoUser.id,
        collegeId: topColleges[i].id,
        rating: template.rating,
        text: template.text,
      },
    });
  }

  console.log("Seed complete. Demo login: demo@edufind.com / Demo@1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
