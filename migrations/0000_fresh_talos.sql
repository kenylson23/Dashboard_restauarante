CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"address" text,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"total_spent" numeric(10, 2) DEFAULT '0' NOT NULL,
	"last_visit" timestamp,
	"preferences" text,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"current_stock" numeric(10, 2) NOT NULL,
	"unit" text NOT NULL,
	"min_threshold" numeric(10, 2) NOT NULL,
	"max_threshold" numeric(10, 2) NOT NULL,
	"price_per_unit" numeric(10, 2),
	"supplier" text,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"category" text NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_number" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"items" text NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"customer_name" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"order_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" text NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"email" text,
	"phone" text,
	"status" text DEFAULT 'active' NOT NULL,
	"shift_start" text,
	"shift_end" text,
	"hourly_rate" numeric(10, 2),
	CONSTRAINT "staff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tables" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"capacity" integer NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"reserved_by" text,
	"reserved_at" timestamp,
	CONSTRAINT "tables_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
