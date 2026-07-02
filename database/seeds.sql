USE student_management;

INSERT INTO curriculums (curriculum_name, total_credit) VALUES 
('Information Technology', 130),
('Computer Science', 135),
('Software Engineering', 132),
('Data Science', 128);

INSERT INTO students (student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress) VALUES 
('STU001', 'กานต์', 'การชัย', 'Information Technology', '1/1', 1, 3.75, 75),
('STU002', 'สมดยู', 'คืนเรา', 'Computer Science', '1/1', 2, 3.50, 80),
('STU003', 'วันนา', 'ทากุณ', 'Software Engineering', '1/2', 3, 3.25, 65),
('STU004', 'สัชน', 'ปั่นสูง', 'Data Science', '1/1', 4, 3.80, 85),
('STU005', 'บาลกด์', 'ไงคสตอย', 'Information Technology', '1/2', 1, 3.60, 70);

INSERT INTO students (student_id, first_name, last_name, major, class_group, curriculum_id, gpa, progress) VALUES 
('ADMIN001', 'Admin', 'User', 'Administration', 'Admin', 1, 0, 0);

INSERT INTO users (student_id, password, phone, role, created_at) VALUES 
('ADMIN001', '$2b$10$zRKBUZnVSQ9X8Z9X8Z9X8uKL7LnZoZoZoZoZoZoZoZoZoZoZoZoZ', '0812345678', 'admin', NOW()),
('STU001', '$2b$10$zRKBUZnVSQ9X8Z9X8Z9X8uKL7LnZoZoZoZoZoZoZoZoZoZoZoZoZ', '0898765432', 'student', NOW()),
('STU002', '$2b$10$zRKBUZnVSQ9X8Z9X8Z9X8uKL7LnZoZoZoZoZoZoZoZoZoZoZoZoZ', '0887654321', 'student', NOW()),
('STU003', '$2b$10$zRKBUZnVSQ9X8Z9X8Z9X8uKL7LnZoZoZoZoZoZoZoZoZoZoZoZoZ', '0876543210', 'student', NOW()),
('STU004', '$2b$10$zRKBUZnVSQ9X8Z9X8Z9X8uKL7LnZoZoZoZoZoZoZoZoZoZoZoZoZ', '0865432109', 'student', NOW()),
('STU005', '$2b$10$zRKBUZnVSQ9X8Z9X8Z9X8uKL7LnZoZoZoZoZoZoZoZoZoZoZoZoZ', '0854321098', 'student', NOW());
