CREATE TABLE `story_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`story` text NOT NULL,
	`photoKey` varchar(500) NOT NULL,
	`photoUrl` varchar(600) NOT NULL,
	`photoName` varchar(260) NOT NULL,
	`photoMime` varchar(80) NOT NULL,
	`consent` int NOT NULL DEFAULT 0,
	`status` varchar(40) NOT NULL DEFAULT 'pending_review',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `story_submissions_id` PRIMARY KEY(`id`)
);
