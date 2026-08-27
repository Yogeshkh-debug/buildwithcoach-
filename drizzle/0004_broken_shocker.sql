CREATE TABLE `buyer_access_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`codeHash` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`attempts` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `buyer_access_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_challenge_deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriberId` int NOT NULL,
	`weekKey` varchar(16) NOT NULL,
	`challengeKey` varchar(80) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`providerMessageId` varchar(255),
	`errorMessage` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weekly_challenge_deliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `weekly_challenge_deliveries_subscriber_week_uq` UNIQUE(`subscriberId`,`weekKey`)
);
--> statement-breakpoint
CREATE TABLE `weekly_challenge_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scheduleCronTaskUid` varchar(65) NOT NULL,
	`enabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weekly_challenge_schedules_id` PRIMARY KEY(`id`),
	CONSTRAINT `weekly_challenge_schedules_scheduleCronTaskUid_unique` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
ALTER TABLE `email_subscribers` ADD `isPdfBuyer` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `email_subscribers` ADD `weeklyChallengeOptIn` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `email_subscribers` ADD `timeZone` varchar(64) DEFAULT 'UTC' NOT NULL;--> statement-breakpoint
ALTER TABLE `email_subscribers` ADD `lastWeeklyChallengeWeek` varchar(16);--> statement-breakpoint
ALTER TABLE `email_subscribers` ADD `unsubscribedAt` timestamp;--> statement-breakpoint
CREATE INDEX `buyer_access_codes_email_idx` ON `buyer_access_codes` (`email`);