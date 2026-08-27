CREATE TABLE `pdf_delivery_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`planName` varchar(160) NOT NULL,
	`storageKey` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pdf_delivery_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pdf_delivery_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`status` varchar(40) NOT NULL DEFAULT 'pending_provider_setup',
	`providerMessageId` varchar(255),
	`errorMessage` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pdf_delivery_requests_id` PRIMARY KEY(`id`)
);
