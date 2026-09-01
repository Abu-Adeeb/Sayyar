"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck2,
  CarFront,
  ChevronLeft,
  CircleGauge,
  FileCheck2,
  Languages,
  LayoutDashboard,
  Link2,
  Menu,
  Route,
  Settings,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type PortalKind = "admin" | "partner";
type Locale = "ar" | "en";

const copy = {
  ar: {
    adminTitle: "بوابة إدارة سيّار",
    partnerTitle: "بوابة شريك سيّار",
    reference: "بيانات مرجعية للتطوير",
    branch: "نطاق الفرع",
    allBranches: "جميع الفروع المصرح بها",
    riyadhBranch: "فرع الرياض - قرطبة",
    airportBranch: "فرع مطار الملك خالد",
    nav: {
      dashboard: "لوحة المؤشرات",
      bookings: "الحجوزات",
      partners: "الشركاء والطلبات",
      vehicles: "المركبات",
      ratings: "تقييم الفروع",
      reports: "التقارير",
      users: "المستخدمون والصلاحيات",
      integrations: "مركز التكاملات",
      settings: "الإعدادات",
    },
    metrics: {
      activeBookings: "الحجوزات النشطة",
      completionRate: "نسبة إكمال الحجز",
      confirmationTime: "متوسط التأكيد",
      branchRating: "تقييم الفروع",
      availableVehicles: "المركبات المتاحة",
      partnerCaused: "إلغاءات بسبب الشريك",
    },
    bookingsTitle: "أحدث الحجوزات التشغيلية",
    bookingColumns: ["الحجز", "العميل", "الشريك / الفرع", "الاستلام", "المبلغ", "الحالة"],
    ratingsTitle: "أداء الفروع والملاحظات المتكررة",
    integrationsTitle: "…6251 tokens truncated…ON DELETE no action,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_reference_unique` ON `bookings` (`reference`);--> statement-breakpoint
CREATE INDEX `bookings_organization_status_idx` ON `bookings` (`organization_id`,`status`);--> statement-breakpoint
CREATE INDEX `bookings_branch_status_idx` ON `bookings` (`branch_id`,`status`);--> statement-breakpoint
CREATE INDEX `bookings_customer_mobile_idx` ON `bookings` (`customer_mobile`);--> statement-breakpoint
CREATE TABLE `branch_ratings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer NOT NULL,
	`branch_id` integer NOT NULL,
	`booking_id` integer,
	`score` integer NOT NULL,
	`issue_category` text,
	`comment` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `branch_ratings_branch_idx` ON `branch_ratings` (`branch_id`);--> statement-breakpoint
CREATE INDEX `branch_ratings_organization_idx` ON `branch_ratings` (`organization_id`);--> statement-breakpoint
CREATE TABLE `branches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer NOT NULL,
	`name_ar` text NOT NULL,
	`name_en` text NOT NULL,
	`city` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`rating_basis_points` integer DEFAULT 0 NOT NULL,
	`rating_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `branches_organization_idx` ON `branches` (`organization_id`);--> statement-breakpoint
CREATE INDEX `branches_city_idx` ON `branches` (`city`);--> statement-breakpoint
CREATE TABLE `integration_connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer,
	`kind` text NOT NULL,
	`provider` text,
	`status` text DEFAULT 'not_configured' NOT NULL,
	`secret_reference` text,
	`last_healthcheck_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `integration_connections_org_kind_unique` ON `integration_connections` (`organization_id`,`kind`);--> statement-breakpoint
CREATE INDEX `integration_connections_status_idx` ON `integration_connections` (`status`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name_ar` text NOT NULL,
	`name_en` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE TABLE `partner_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`legal_name` text NOT NULL,
	`commercial_registration` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_mobile` text NOT NULL,
	`contact_email` text NOT NULL,
	`city` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`resume_token_hash` text,
	`submitted_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `partner_applications_reference_unique` ON `partner_applications` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `partner_applications_cr_unique` ON `partner_applications` (`commercial_registration`);--> statement-breakpoint
CREATE INDEX `partner_applications_status_idx` ON `partner_applications` (`status`);--> statement-breakpoint
CREATE TABLE `portal_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer,
	`external_subject` text NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`status` text DEFAULT 'invited' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_users_external_subject_unique` ON `portal_users` (`external_subject`);--> statement-breakpoint
CREATE UNIQUE INDEX `portal_users_email_unique` ON `portal_users` (`email`);--> statement-breakpoint
CREATE INDEX `portal_users_organization_idx` ON `portal_users` (`organization_id`);--> statement-breakpoint
CREATE TABLE `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer,
	`key` text NOT NULL,
	`name_ar` text NOT NULL,
	`name_en` text NOT NULL,
	`scope` text NOT NULL,
	`permissions_json` text DEFAULT '[]' NOT NULL,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_organization_key_unique` ON `roles` (`organization_id`,`key`);--> statement-breakpoint
CREATE INDEX `roles_scope_idx` ON `roles` (`scope`);--> statement-breakpoint
CREATE TABLE `user_role_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`role_id` integer NOT NULL,
	`branch_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `portal_users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_role_assignments_unique` ON `user_role_assignments` (`user_id`,`role_id`,`branch_id`);--> statement-breakpoint
CREATE INDEX `user_role_assignments_branch_idx` ON `user_role_assignments` (`branch_id`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer NOT NULL,
	`branch_id` integer NOT NULL,
	`external_vehicle_id` text,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`model_year` integer NOT NULL,
	`category` text NOT NULL,
	`fuel_type` text NOT NULL,
	`daily_rate` integer NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `vehicles_organization_idx` ON `vehicles` (`organization_id`);--> statement-breakpoint
CREATE INDEX `vehicles_branch_status_idx` ON `vehicles` (`branch_id`,`status`);