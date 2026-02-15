// Seed the full CSE curriculum (semester-wise)
const mongoose = require('mongoose');
const { Course } = require('./database/courseSchema');
require('dotenv').config();

const baseYear = new Date().getFullYear() - 1;

const termMap = {
  '1-1': { level: 1, term: 1, semester: 'Spring', year: baseYear },
  '1-2': { level: 1, term: 2, semester: 'Fall', year: baseYear },
  '2-1': { level: 2, term: 1, semester: 'Spring', year: baseYear + 1 },
  '2-2': { level: 2, term: 2, semester: 'Fall', year: baseYear + 1 },
  '3-1': { level: 3, term: 1, semester: 'Spring', year: baseYear + 2 },
  '3-2': { level: 3, term: 2, semester: 'Fall', year: baseYear + 2 },
  '4-1': { level: 4, term: 1, semester: 'Spring', year: baseYear + 3 },
  '4-2': { level: 4, term: 2, semester: 'Fall', year: baseYear + 3 }
};

const isLabCourse = (name, credits) => {
  if (name.toLowerCase().includes('lab')) return true;
  if (credits === 1.5 || credits === 0.75) return true;
  return false;
};

const curriculum = [
  // Level 1 Term I
  { termKey: '1-1', courseCode: 'CSE101', bnqfCode: '0613-101', courseName: 'Structured Programming Language', credits: 3.0, category: 'Program Core Courses', prerequisite: '---' },
  { termKey: '1-1', courseCode: 'CSE102', bnqfCode: '0613-102', courseName: 'Structured Programming Language Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '---' },
  { termKey: '1-1', courseCode: 'ENG101', bnqfCode: '0231-101', courseName: 'English Language', credits: 3.0, category: 'Language, History and Cultures', prerequisite: '---' },
  { termKey: '1-1', courseCode: 'MAT101', bnqfCode: '0541-101', courseName: 'Differential and Integral Calculus', credits: 3.0, category: 'Mathematics', prerequisite: '---' },
  { termKey: '1-1', courseCode: 'PHY101', bnqfCode: '0533-101', courseName: 'Physics I', credits: 3.0, category: 'Basic Sciences and Engineering', prerequisite: '---' },
  { termKey: '1-1', courseCode: 'PHY102', bnqfCode: '0533-102', courseName: 'Physics I Lab', credits: 1.5, category: 'Basic Sciences and Engineering', prerequisite: '---' },
  { termKey: '1-1', courseCode: 'BHC101', bnqfCode: '0222-101', courseName: 'History of the Emergence of Independent Bangladesh', credits: 2.0, category: 'Language, History and Cultures', prerequisite: '---' },
  { termKey: '1-1', courseCode: 'BAN101', bnqfCode: '0231-101', courseName: 'Functional Bengali Language', credits: 2.0, category: 'Language, History and Cultures', prerequisite: '---' },

  // Level 1 Term II
  { termKey: '1-2', courseCode: 'CSE100', bnqfCode: '0613-100', courseName: 'Software Development I', credits: 0.75, category: 'Program Core Courses', prerequisite: '0613-101' },
  { termKey: '1-2', courseCode: 'CSE103', bnqfCode: '0631-103', courseName: 'Discrete Mathematics', credits: 3.0, category: 'Program Core Courses', prerequisite: '---' },
  { termKey: '1-2', courseCode: 'CHE101', bnqfCode: '0531-101', courseName: 'Chemistry', credits: 3.0, category: 'Basic Sciences and Engineering', prerequisite: '---' },
  { termKey: '1-2', courseCode: 'EEE101', bnqfCode: '0612-101', courseName: 'Electrical Technology', credits: 3.0, category: 'Basic Sciences and Engineering', prerequisite: '---' },
  { termKey: '1-2', courseCode: 'EEE102', bnqfCode: '0612-102', courseName: 'Electrical Technology Lab', credits: 1.5, category: 'Basic Sciences and Engineering', prerequisite: '---' },
  { termKey: '1-2', courseCode: 'MAT111', bnqfCode: '0541-111', courseName: 'Coordinate Geometry and Vector Calculus', credits: 3.0, category: 'Mathematics', prerequisite: '0541-101' },
  { termKey: '1-2', courseCode: 'CSE111', bnqfCode: '0631-111', courseName: 'Object Oriented Programming Language', credits: 3.0, category: 'Program Core Courses', prerequisite: '0613-102' },
  { termKey: '1-2', courseCode: 'CSE112', bnqfCode: '0631-112', courseName: 'Object Oriented Programming Language Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0613-102' },

  // Level 2 Term I
  { termKey: '2-1', courseCode: 'CSE205', bnqfCode: '0612-205', courseName: 'Digital Logic Design', credits: 3.0, category: 'Program Core Courses', prerequisite: '' },
  { termKey: '2-1', courseCode: 'CSE206', bnqfCode: '0612-206', courseName: 'Digital Logic Design Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '' },
  { termKey: '2-1', courseCode: 'CSE215', bnqfCode: '0612-215', courseName: 'Computer Architecture', credits: 3.0, category: 'Program Core Courses', prerequisite: '0613-101' },
  { termKey: '2-1', courseCode: 'CSE221', bnqfCode: '0613-221', courseName: 'Data Structure', credits: 3.0, category: 'Program Core Courses', prerequisite: '0613-101' },
  { termKey: '2-1', courseCode: 'CSE222', bnqfCode: '0613-222', courseName: 'Data Structure Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0613-101' },
  { termKey: '2-1', courseCode: 'MAT221', bnqfCode: '0541-221', courseName: 'Linear Algebras, Differential Equations, and Furrier Analysis', credits: 3.0, category: 'Mathematics', prerequisite: '0541-111' },
  { termKey: '2-1', courseCode: 'EEE211', bnqfCode: '0612-211', courseName: 'Electronic Devices and Circuits', credits: 3.0, category: 'Basic Sciences and Engineering', prerequisite: '0612-101' },
  { termKey: '2-1', courseCode: 'EEE212', bnqfCode: '0612-212', courseName: 'Electronic Devices and Circuits Lab', credits: 1.5, category: 'Basic Sciences and Engineering', prerequisite: '0612-101' },

  // Level 2 Term II
  { termKey: '2-2', courseCode: 'CSE200', bnqfCode: '0613-200', courseName: 'Software Development II', credits: 0.75, category: 'Program Core Courses', prerequisite: '0613-200' },
  { termKey: '2-2', courseCode: 'ECO201', bnqfCode: '0311-201', courseName: 'Principles of Economics', credits: 3.0, category: 'General Education', prerequisite: '---' },
  { termKey: '2-2', courseCode: 'CSE207', bnqfCode: '0612-207', courseName: 'Database Systems', credits: 3.0, category: 'Program Core Courses', prerequisite: '0631-103' },
  { termKey: '2-2', courseCode: 'CSE208', bnqfCode: '0612-208', courseName: 'Database Systems Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0631-103' },
  { termKey: '2-2', courseCode: 'CSE209', bnqfCode: '0612-209', courseName: 'Operating Systems', credits: 3.0, category: 'Program Core Courses', prerequisite: '---' },
  { termKey: '2-2', courseCode: 'CSE210', bnqfCode: '0612-210', courseName: 'Operating Systems Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '---' },
  { termKey: '2-2', courseCode: 'CSE231', bnqfCode: '0613-231', courseName: 'Algorithms', credits: 3.0, category: 'Program Core Courses', prerequisite: '0613-221' },
  { termKey: '2-2', courseCode: 'CSE232', bnqfCode: '0613-232', courseName: 'Algorithms Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0613-221' },
  { termKey: '2-2', courseCode: 'MAT231', bnqfCode: '0541-231', courseName: 'Complex Variable and Statistics', credits: 3.0, category: 'Mathematics', prerequisite: '0541-221' },

  // Level 3 Term I
  { termKey: '3-1', courseCode: 'CSE300', bnqfCode: '0613-300', courseName: 'Software Development III', credits: 0.75, category: 'Program Core Courses', prerequisite: '0613-200' },
  { termKey: '3-1', courseCode: 'ENG301', bnqfCode: '0231-301', courseName: 'Technical Writing and Presentation', credits: 1.5, category: 'Language, History and Cultures', prerequisite: '0231-101' },
  { termKey: '3-1', courseCode: 'CSE317', bnqfCode: '0612-317', courseName: 'System Analysis and Design', credits: 3.0, category: 'Program Core Courses', prerequisite: '0612-207' },
  { termKey: '3-1', courseCode: 'CSE318', bnqfCode: '0612-318', courseName: 'System Analysis and Design Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0612-207' },
  { termKey: '3-1', courseCode: 'CSE319', bnqfCode: '0612-319', courseName: 'Computer Networks', credits: 3.0, category: 'Program Core Courses', prerequisite: '0612-309' },
  { termKey: '3-1', courseCode: 'CSE320', bnqfCode: '0612-320', courseName: 'Computer Networks Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0613-221' },
  { termKey: '3-1', courseCode: 'CSE323', bnqfCode: '0612-323', courseName: 'Compiler Design', credits: 3.0, category: 'Program Core Courses', prerequisite: '0631-103' },
  { termKey: '3-1', courseCode: 'CSE324', bnqfCode: '0612-324', courseName: 'Compiler Design Lab', credits: 0.75, category: 'Program Core Courses', prerequisite: '0631-103' },
  { termKey: '3-1', courseCode: 'CSE341', bnqfCode: '0611-341', courseName: 'Advanced Programming', credits: 3.0, category: 'Program Core Courses', prerequisite: '0613-221' },
  { termKey: '3-1', courseCode: 'CSE342', bnqfCode: '0611-342', courseName: 'Advanced Programming Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0613-221' },

  // Level 3 Term II
  { termKey: '3-2', courseCode: 'ACT301', bnqfCode: '0411-301', courseName: 'Accounting and Management', credits: 3.0, category: 'General Education', prerequisite: '---' },
  { termKey: '3-2', courseCode: 'MKT301', bnqfCode: '0413-301', courseName: 'Digital Marketing', credits: 3.0, category: 'General Education', prerequisite: '---' },
  { termKey: '3-2', courseCode: 'CSE321', bnqfCode: '0613-321', courseName: 'Artificial Intelligence and Expert System', credits: 3.0, category: 'Program Core Courses', prerequisite: '---' },
  { termKey: '3-2', courseCode: 'CSE322', bnqfCode: '0613-322', courseName: 'Artificial Intelligence and Expert System Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '---' },
  { termKey: '3-2', courseCode: 'CSE325', bnqfCode: '0311-325', courseName: 'Microprocessor and Microcontroller', credits: 3.0, category: 'Program Core Courses', prerequisite: '0612-205' },
  { termKey: '3-2', courseCode: 'CSE326', bnqfCode: '0311-326', courseName: 'Microprocessor and Microcontroller Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0612-205' },
  { termKey: '3-2', courseCode: 'CSE327', bnqfCode: '0613-327', courseName: 'Software Engineering', credits: 3.0, category: 'Program Core Courses', prerequisite: '0612-317' },
  { termKey: '3-2', courseCode: 'CSE328', bnqfCode: '0211-328', courseName: 'Software Engineering Lab', credits: 0.75, category: 'Program Core Courses', prerequisite: '0612-317' },
  { termKey: '3-2', courseCode: 'CSE400', bnqfCode: '0611-400', courseName: 'Software Development II', credits: 0.75, category: 'Program Core Courses', prerequisite: '0613-300' },

  // Level 4 Term I
  { termKey: '4-1', courseCode: 'MGT401', bnqfCode: '0413-401', courseName: 'Project Management and Professional Ethics', credits: 3.0, category: 'General Education', prerequisite: '---' },
  { termKey: '4-1', courseCode: 'CSE403', bnqfCode: '0613-403', courseName: 'Machine Learning', credits: 3.0, category: 'Program Core Courses', prerequisite: '0613-221' },
  { termKey: '4-1', courseCode: 'CSE404', bnqfCode: '0613-404', courseName: 'Machine Learning Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0613-221' },
  { termKey: '4-1', courseCode: 'CSE441', bnqfCode: '0613-441', courseName: 'Internet of Things (IOT)', credits: 3.0, category: 'Program Core Courses', prerequisite: '0612-319' },
  { termKey: '4-1', courseCode: 'CSE442', bnqfCode: '0613-442', courseName: 'Internet of Things (IOT) Lab', credits: 1.5, category: 'Program Core Courses', prerequisite: '0612-320' },
  { termKey: '4-1', courseCode: 'CSE498', bnqfCode: '0613-498', courseName: 'Capstone Project (1 of 2)', credits: 3.0, category: 'Project and Thesis', prerequisite: 'Up to 6th Semester' },
  { termKey: '4-1', courseCode: 'CSE4XX-OPT2', bnqfCode: '----', courseName: 'Option-II (Elective)', credits: 4.5, category: 'Elective', prerequisite: '' },

  // Level 4 Term II
  { termKey: '4-2', courseCode: 'MGT403', bnqfCode: '0414-401', courseName: 'IT Entrepreneurship', credits: 3.0, category: 'General Education', prerequisite: '---' },
  { termKey: '4-2', courseCode: 'CSE499', bnqfCode: '0613-499', courseName: 'Capstone Project (2 of 2)', credits: 3.0, category: 'Project and Thesis', prerequisite: '0613-498' },
  { termKey: '4-2', courseCode: 'CSE4XX-OPT1', bnqfCode: '----', courseName: 'Option-I (Elective)', credits: 3.0, category: 'Elective', prerequisite: '' },
  { termKey: '4-2', courseCode: 'CSE4XX-OPT2T', bnqfCode: '----', courseName: 'Option-II (Elective)', credits: 3.0, category: 'Elective', prerequisite: '' },
  { termKey: '4-2', courseCode: 'CSE4XX-OPT2L', bnqfCode: '----', courseName: 'Option-II (Elective) Lab', credits: 1.5, category: 'Elective', prerequisite: '' },
  { termKey: '4-2', courseCode: 'CSE4XX-OPT2T2', bnqfCode: '----', courseName: 'Option-II (Elective)', credits: 3.0, category: 'Elective', prerequisite: '' },
  { termKey: '4-2', courseCode: 'CSE4XX-OPT2L2', bnqfCode: '----', courseName: 'Option-II (Elective) Lab', credits: 1.5, category: 'Elective', prerequisite: '' }
];

const buildCourse = (entry) => {
  const mapping = termMap[entry.termKey];
  return {
    courseCode: entry.courseCode,
    courseName: entry.courseName,
    bnqfCode: entry.bnqfCode,
    credits: entry.credits,
    department: 'CSE',
    category: entry.category,
    prerequisite: entry.prerequisite,
    courseType: isLabCourse(entry.courseName, entry.credits) ? 'Lab' : 'Theory',
    level: mapping.level,
    term: mapping.term,
    semester: mapping.semester,
    year: mapping.year,
    isActive: mapping.semester === 'Spring' && mapping.year === baseYear
  };
};

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingCodes = await Course.find({}).distinct('courseCode');
    const newCourses = curriculum
      .map(buildCourse)
      .filter((c) => !existingCodes.includes(c.courseCode));

    if (newCourses.length === 0) {
      console.log('All curriculum courses already exist!');
    } else {
      const result = await Course.insertMany(newCourses);
      console.log(`✅ Added ${result.length} curriculum courses`);
    }

    await mongoose.connection.close();
    console.log('✨ Done');
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();
