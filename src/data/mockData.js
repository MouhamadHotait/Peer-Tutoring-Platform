// Fake database for Phase 1. In Phase 2, this data will come from the backend.
// Objects reference each other by id (like foreign keys in a database).

// subject is used by the Subject filter on the Session List
export const courses = [
  { id: 1, code: 'CSC443', name: 'Web Programming', subject: 'Computer Science' },
  { id: 2, code: 'CSC310', name: 'Algorithms and Data Structures', subject: 'Computer Science' },
  { id: 3, code: 'MTH201', name: 'Calculus III', subject: 'Mathematics' },
  { id: 4, code: 'PHY211', name: 'Physics I', subject: 'Physics' },
  { id: 5, code: 'ENG202', name: 'Advanced Academic Writing', subject: 'English' },
  { id: 6, code: 'CSC245', name: 'Objects and Data Abstraction', subject: 'Computer Science' },
  { id: 7, code: 'MTH207', name: 'Discrete Structures', subject: 'Mathematics' },
  { id: 8, code: 'MKT201', name: 'Principles of Marketing', subject: 'Marketing' },
  { id: 9, code: 'HTM210', name: 'Introduction to Hospitality', subject: 'Hospitality and Tourism' },
  { id: 10, code: 'ELE201', name: 'Electric Circuits', subject: 'Engineering' },
]

// Users and tutors share one list: a tutor is a user who hosts sessions.
// Passwords in plain text are ONLY acceptable because this is fake data.
export const users = [
  { id: 1, name: 'Demo Student', email: 'demo@lau.edu', password: 'demo1234', major: 'Computer Science', bio: 'Account for testing the app.' },
  { id: 2, name: 'Lara Haddad', email: 'lara@lau.edu', password: 'lara1234', major: 'Computer Science', bio: 'Senior student who loves web development and algorithms.' },
  { id: 3, name: 'Karim Nassar', email: 'karim@lau.edu', password: 'karim1234', major: 'Mathematics', bio: 'Math tutor for three years. Patient with calculus beginners.' },
  { id: 4, name: 'Maya Khoury', email: 'maya@lau.edu', password: 'maya1234', major: 'Physics', bio: 'Physics and math, explained with real-life examples.' },
  { id: 5, name: 'Omar Saleh', email: 'omar@lau.edu', password: 'omar1234', major: 'English', bio: 'Helps with essays, structure, and citations.' },
]

// type: 'tutoring' or 'study-group'   |   mode: 'online' or 'in-person'
// attendeeIds: ids of the users who joined
export const sessions = [
  { id: 1, title: 'React Hooks Crash Course', courseId: 1, hostId: 2, type: 'tutoring', date: '2026-11-12', time: '17:00', mode: 'online', location: 'https://meet.google.com/abc-defg-hij', capacity: 10, attendeeIds: [1, 3], description: 'We go over useState and useEffect with small exercises.' },
  { id: 2, title: 'Calculus III Midterm Review', courseId: 3, hostId: 3, type: 'tutoring', date: '2026-11-14', time: '14:00', mode: 'in-person', location: 'Library, Room 204', capacity: 8, attendeeIds: [1, 4, 5], description: 'Multiple integrals and past exam problems.' },
  { id: 3, title: 'Algorithms Study Group', courseId: 2, hostId: 2, type: 'study-group', date: '2026-11-15', time: '18:30', mode: 'in-person', location: 'Bassil Building, Lab 3', capacity: 6, attendeeIds: [3], description: 'We solve sorting and graph problems together.' },
  { id: 4, title: 'Physics I Problem Solving', courseId: 4, hostId: 4, type: 'tutoring', date: '2026-11-16', time: '16:00', mode: 'online', location: 'https://zoom.us/j/123456789', capacity: 12, attendeeIds: [], description: 'Kinematics and Newton laws, step by step.' },
  { id: 5, title: 'Essay Writing Workshop', courseId: 5, hostId: 5, type: 'tutoring', date: '2026-11-18', time: '12:00', mode: 'in-person', location: 'Writing Center', capacity: 5, attendeeIds: [2, 4], description: 'Thesis statements, structure, and citations.' },
  { id: 6, title: 'Web Programming Project Help', courseId: 1, hostId: 2, type: 'study-group', date: '2026-11-20', time: '19:00', mode: 'online', location: 'https://meet.google.com/xyz-uvwx-rst', capacity: 15, attendeeIds: [1], description: 'Bring your project questions: routing, Tailwind, forms.' },
  { id: 7, title: 'Calculus Study Group', courseId: 3, hostId: 1, type: 'study-group', date: '2026-11-22', time: '10:00', mode: 'in-person', location: 'Library, Room 101', capacity: 6, attendeeIds: [5], description: 'Working through homework sets together.' },
  { id: 8, title: 'Physics Lab Report Review', courseId: 4, hostId: 4, type: 'study-group', date: '2026-11-25', time: '15:00', mode: 'online', location: 'https://zoom.us/j/987654321', capacity: 8, attendeeIds: [2, 3], description: 'Peer review of lab reports before submission.' },
  { id: 9, title: 'Marketing Case Study Practice', courseId: 8, hostId: 5, type: 'study-group', date: '2026-11-19', time: '13:00', mode: 'in-person', location: 'Business Building, Room 12', capacity: 10, attendeeIds: [2], description: 'We analyze real brand campaigns and prepare for the case exam.' },
  { id: 10, title: 'Circuits Problem Session', courseId: 10, hostId: 4, type: 'tutoring', date: '2026-11-21', time: '16:30', mode: 'online', location: 'https://zoom.us/j/555666777', capacity: 12, attendeeIds: [], description: "Kirchhoff's laws and circuit analysis, step by step." },
]