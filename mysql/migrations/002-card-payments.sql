-- Run once on an existing LankaHost database (phpMyAdmin -> SQL)
ALTER TABLE orders MODIFY payment_method ENUM('cod','bank','card') NOT NULL;
