CREATE DATABASE IF NOT EXISTS student_management;

USE student_management;

-- Curriculums Table
CREATE TABLE IF NOT EXISTS curriculums (
  id INT PRIMARY KEY AUTO_INCREMENT,
  curriculum_name VARCHAR(255) NOT NULL,
  total_credit INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  student_id VARCHAR(50) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  major VARCHAR(255),
  class_group VARCHAR(50),
  curriculum_id INT,
  gpa DECIMAL(4, 2) DEFAULT 0.00,
  progress INT DEFAULT 0,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for better performance
CREATE INDEX idx_student_id ON users(student_id);
CREATE INDEX idx_curriculum_id ON students(curriculum_id);
CREATE INDEX idx_class_group ON students(class_group);
