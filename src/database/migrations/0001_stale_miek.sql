CREATE TABLE `posts` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`users_id` int unsigned,
	`title` varchar(100),
	`content` text,
	`posted_at` timestamp NOT NULL DEFAULT (now()),
	`posted_by` timestamp,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`posts_id` int unsigned,
	`name` varchar(50),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `name` varchar(50);--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags` ADD CONSTRAINT `tags_posts_id_posts_id_fk` FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;