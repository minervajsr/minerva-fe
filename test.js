const postedJobData = [
  {
    jobTitle: "Software Engineer",
    jobDescription: "We are looking for a skilled software engineer...",
    jobBenefits: ["Healthcare", "401(k)", "Remote Work"],
    jobCategory: "Software Development",
    requiredSkills: ["JavaScript", "Node.js", "React"],
    experienceLevel: "Mid-Senior Level",
    employmentType: "Full-time",
    location: "San Francisco, CA",
    postedDate: "2023-08-20",
  },
  {
    jobTitle: "Marketing Manager",
    jobDescription: "Join our marketing team to lead campaigns...",
    jobBenefits: ["Flexible Hours", "Bonuses", "Career Growth"],
    jobCategory: "Marketing Management",
    requiredSkills: ["Digital Marketing", "SEO", "Team Leadership"],
    experienceLevel: "Senior Level",
    employmentType: "Full-time",
    location: "New York, NY",
    postedDate: "2023-08-22",
  },
  {
    jobTitle: "Data Scientist",
    jobDescription: "Seeking a data scientist to analyze and interpret...",
    jobBenefits: ["Healthcare", "Stock Options", "Flexible Schedule"],
    jobCategory: "Data Science",
    requiredSkills: ["Python", "Machine Learning", "Statistics"],
    experienceLevel: "Mid-Level",
    employmentType: "Contract",
    location: "Seattle, WA",
    postedDate: "2023-08-18",
  },
  {
    jobTitle: "Graphic Designer",
    jobDescription: "Create visually compelling designs for our clients...",
    jobBenefits: ["Creative Environment", "Flexible Hours"],
    jobCategory: "Design",
    requiredSkills: [
      "Adobe Creative Suite",
      "Typography",
      "Visual Communication",
    ],
    experienceLevel: "Junior Level",
    employmentType: "Part-time",
    location: "Los Angeles, CA",
    postedDate: "2023-08-21",
  },
  {
    jobTitle: "Sales Manager",
    jobDescription: "Lead a dynamic sales team to achieve targets...",
    jobBenefits: ["Competitive Salary", "Bonuses", "Career Advancement"],
    jobCategory: "Sales & Management",
    requiredSkills: ["Sales Strategy", "Leadership", "Negotiation"],
    experienceLevel: "Senior Level",
    employmentType: "Full-time",
    location: "Chicago, IL",
    postedDate: "2023-08-19",
  },
  {
    jobTitle: "Frontend Developer",
    jobDescription: "Build user-friendly interfaces for web applications...",
    jobBenefits: ["Remote Work", "Flexible Hours", "Professional Development"],
    jobCategory: "Web Development",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    experienceLevel: "Junior-Mid Level",
    employmentType: "Full-time",
    location: "Remote",
    postedDate: "2023-08-17",
  },
  {
    jobTitle: "Content Writer",
    jobDescription: "Craft engaging content across various topics...",
    jobBenefits: ["Flexible Schedule", "Remote Work"],
    jobCategory: "Content Writing",
    requiredSkills: ["Copywriting", "SEO", "Creative Writing"],
    experienceLevel: "Entry Level",
    employmentType: "Freelance",
    location: "Anywhere",
    postedDate: "2023-08-16",
  },
  {
    jobTitle: "Accountant",
    jobDescription: "Manage financial records and ensure accuracy...",
    jobBenefits: ["Healthcare", "Retirement Plan", "Work-Life Balance"],
    jobCategory: "Finance",
    requiredSkills: ["Financial Reporting", "Taxation", "Bookkeeping"],
    experienceLevel: "Mid-Level",
    employmentType: "Full-time",
    location: "Houston, TX",
    postedDate: "2023-08-15",
  },
  {
    jobTitle: "UI/UX Designer",
    jobDescription: "Design intuitive user interfaces and experiences...",
    jobBenefits: ["Creative Freedom", "Flexible Hours"],
    jobCategory: "Design",
    requiredSkills: ["User-Centered Design", "Wireframing", "Prototyping"],
    experienceLevel: "Mid-Senior Level",
    employmentType: "Full-time",
    location: "Austin, TX",
    postedDate: "2023-08-14",
  },
  {
    jobTitle: "HR Specialist",
    jobDescription: "Handle various human resources functions...",
    jobBenefits: ["Healthcare", "Professional Development", "Remote Work"],
    jobCategory: "Human Resources",
    requiredSkills: ["Recruitment", "Employee Relations", "Labor Law"],
    experienceLevel: "Mid-Level",
    employmentType: "Full-time",
    location: "Denver, CO",
    postedDate: "2023-08-13",
  },
  {
    jobTitle: "Product Manager",
    jobDescription: "Lead product development and strategy...",
    jobBenefits: ["Stock Options", "Career Growth", "Flexible Schedule"],
    jobCategory: "Product Management",
    requiredSkills: [
      "Product Lifecycle",
      "Market Research",
      "Project Management",
    ],
    experienceLevel: "Senior Level",
    employmentType: "Full-time",
    location: "San Diego, CA",
    postedDate: "2023-08-12",
  },
  {
    jobTitle: "Nurse",
    jobDescription: "Provide compassionate patient care and support...",
    jobBenefits: ["Healthcare", "Retirement Plan", "Flexible Shifts"],
    jobCategory: "Healthcare",
    requiredSkills: ["Medical Knowledge", "Empathy", "Critical Thinking"],
    experienceLevel: "Experienced",
    employmentType: "Part-time",
    location: "Miami, FL",
    postedDate: "2023-08-11",
  },
  {
    jobTitle: "Mechanical Engineer",
    jobDescription: "Design and develop mechanical systems...",
    jobBenefits: ["Healthcare", "401(k)", "Flexible Hours"],
    jobCategory: "Engineering",
    requiredSkills: ["CAD", "Mechanical Design", "Problem Solving"],
    experienceLevel: "Mid-Senior Level",
    employmentType: "Full-time",
    location: "Detroit, MI",
    postedDate: "2023-08-10",
  },
  {
    jobTitle: "Social Media Manager",
    jobDescription: "Manage social media accounts and campaigns...",
    jobBenefits: ["Remote Work", "Creative Freedom", "Flexible Schedule"],
    jobCategory: "Social Media",
    requiredSkills: ["Social Media Platforms", "Content Strategy", "Analytics"],
    experienceLevel: "Mid-Level",
    employmentType: "Full-time",
    location: "Remote",
    postedDate: "2023-08-09",
  },
  {
    jobTitle: "Electrician",
    jobDescription: "Install and maintain electrical systems...",
    jobBenefits: ["Competitive Salary", "Job Security", "Flexible Hours"],
    jobCategory: "Electrical Engineering",
    requiredSkills: [
      "Electrical Wiring",
      "Safety Regulations",
      "Troubleshooting",
    ],
    experienceLevel: "Experienced",
    employmentType: "Full-time",
    location: "Phoenix, AZ",
    postedDate: "2023-08-08",
  },
];

const userObject = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  location: "Los Angeles, CA",
  education: "Bachelor's Degree in Computer Science",
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Team Leadership",
    "Communication",
    "Problem Solving",
    "Python",
    "Machine Learning",
    "Statistics",
  ],
};
// Handle division by zero
function calculateMatchingScore(userSkills, jobRequiredSkills, memo) {
  const memoKey = userSkills.join(",") + "|" + jobRequiredSkills.join(",");
  if (memo[memoKey] !== undefined) {
    return memo[memoKey]; // Return cached value
  }

  if (jobRequiredSkills.length === 0) {
    return 0; // Avoid division by zero
  }

  const matchingSkills = [];
  for (const skill of userSkills) {
    if (jobRequiredSkills.includes(skill)) {
      matchingSkills.push(skill);
    }
  }

  const matchingScore = matchingSkills.length / jobRequiredSkills.length;
  memo[memoKey] = matchingScore;
  return matchingScore;
}

function normalizeSkills(skills) {
  return skills.map((skill) => skill.toLowerCase());
}

function filterAndSortJobs(userObject, postedJobData) {
  const userSkills = normalizeSkills(userObject.skills);

  const memo = {}; // Memoization object

  const filteredAndScoredJobs = postedJobData.map((job) => {
    const normalizedRequiredSkills = normalizeSkills(job.requiredSkills);
    const matchingScore = calculateMatchingScore(
      userSkills,
      normalizedRequiredSkills,
      memo
    );
    return { ...job, matchingScore };
  });

  // Custom sorting algorithm based on matching score (counting sort)
  const scoreCounts = Array(101).fill(0);
  for (const job of filteredAndScoredJobs) {
    const normalizedScore = Math.floor(job.matchingScore * 100);
    scoreCounts[normalizedScore]++;
  }

  let currentIndex = 0;
  for (let i = 100; i >= 0; i--) {
    while (scoreCounts[i] > 0) {
      filteredAndScoredJobs[currentIndex].matchingScore = i / 100;
      currentIndex++;
      scoreCounts[i]--;
    }
  }

  return filteredAndScoredJobs;
}

try {
  const filteredAndSortedJobs = filterAndSortJobs(userObject, postedJobData);
  console.log(filteredAndSortedJobs);
} catch (error) {
  console.error("An error occurred:", error);
}
