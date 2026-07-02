USE student_management;

-- Insert Curriculums
INSERT INTO curriculums (curriculum_name, total_credit) VALUES 
('Information Technology', 130),
('Computer Science', 135),
('Software Engineering', 132),
('Data Science', 128);

-- Insert Sample Students
INSERT INTO students (student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress) VALUES 
('STU001', 'กานต์', 'การชัย', 'Information Technology', '1/1', 1, 3.75, 75),
('STU002', 'สมดยู', 'คืนเรา', 'Computer Science', '1/1', 2, 3.50, 80),
('STU003', 'วันนา', 'ทากุณ', 'Software Engineering', '1/2', 3, 3.25, 65),
('STU004', 'สัชน', 'ป่นสืง', 'Data Science', '1/1', 4, 3.80, 85),
('STU005', 'บาลกด๊น', 'ไงค์ตอย', 'Information Technology', '1/2', 1, 3.60, 70);

-- Insert Admin User (password: admin123)
INSERT INTO users (student_id, password, phone, role) VALUES 
('ADMIN001', '$2b$10$Iz8Wz8Qy5FQgGZrJ5Vz9POWz3kGm0kGm0kGm0kGm0kGm0kGm0kGm0', '0812345678', 'admin');

-- Insert Student Users (password: student123)
INSERT INTO users (student_id, password, phone, role) VALUES 
('STU001', '$2b$10$Iz8Wz8Qy5FQgGZrJ5Vz9POWz3kGm0kGm0kGm0kGm0kGm0kGm0kGm0', '0898765432', 'student'),
('STU002', '$2b$10$Iz8Wz8Qy5FQgGZrJ5Vz9POWz3kGm0kGm0kGm0kGm0kGm0kGm0kGm0', '0887654321', 'student'),
('STU003', '$2b$10$Iz8Wz8Qy5FQgGZrJ5Vz9POWz3kGm0kGm0kGm0kGm0kGm0kGm0kGm0', '0876543210', 'student'),
('STU004', '$2b$10$Iz8Wz8Qy5FQgGZrJ5Vz9POWz3kGm0kGm0kGm0kGm0kGm0kGm0kGm0', '0865432109', 'student'),
('STU005', '$2b$10$Iz8Wz8Qy5FQgGZrJ5Vz9POWz3kGm0kGm0kGm0kGm0kGm0kGm0kGm0', '0854321098', 'student');
