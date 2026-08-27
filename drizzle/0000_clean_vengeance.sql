CREATE TABLE `booking_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`customer_first_name` text NOT NULL,
	`customer_last_name` text NOT NULL,
	`customer_mobile` text NOT NULL,
	`pickup_mode` text NOT NULL,
	`pickup_city` text NOT NULL,
	`return_city` text NOT NULL,
	`pickup_date` text NOT NULL,
	`return_date` text NOT NULL,
	`pickup_time` text NOT NULL,
	`days` integer NOT NULL,
	`vehicle_category` text NOT NULL,
	`daily_rate` integer NOT NULL,
	`estimated_total` integer NOT NULL,
	`locale` text NOT NULL,
	`status` text DEFAULT 'pending_verification' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `booking_requests_reference_unique` ON `booking_requests` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `booking_requests_idempotency_key_unique` ON `booking_requests` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `booking_requests_mobile_idx` ON `booking_requests` (`customer_mobile`);--> statement-breakpoint
CREATE INDEX `booking_requests_status_idx` ON `booking_requests` (`status`);--> statement-breakpoint
CREATE INDEX `booking_requests_created_at_idx` ON `booking_requests` (`created_at`);