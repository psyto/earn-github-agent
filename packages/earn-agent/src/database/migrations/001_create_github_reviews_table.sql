-- Create github_reviews table
CREATE TABLE IF NOT EXISTS github_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_url VARCHAR(500) NOT NULL,
  bounty_id VARCHAR(255) NOT NULL,
  score INT,
  notes TEXT,
  labels JSON,
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_submission_bounty (submission_url, bounty_id),
  INDEX idx_bounty_id (bounty_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

