CREATE TABLE `post_tags` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`posts_id` int unsigned,
	`tags_id` int unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`users_id` int unsigned,
	`title` varchar(100),
	`content` text,
	`posted_at` timestamp,
	`posted_by` varchar(50),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(50),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	`email` varchar(255),
	`password` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `post_tags` ADD CONSTRAINT `post_tags_posts_id_posts_id_fk` FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_tags` ADD CONSTRAINT `post_tags_tags_id_tags_id_fk` FOREIGN KEY (`tags_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;