-- Create alert_history table for persistent alert tracking
CREATE TABLE IF NOT EXISTS alert_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alert_key VARCHAR(255) NOT NULL UNIQUE,
  alert_type VARCHAR(50) NOT NULL,
  alert_message TEXT NOT NULL,
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN NOT NULL DEFAULT 1,
  last_triggered_at DATETIME,
  material_id INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES material(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_alert_history_active ON alert_history(active);
CREATE INDEX IF NOT EXISTS idx_alert_history_key ON alert_history(alert_key);
