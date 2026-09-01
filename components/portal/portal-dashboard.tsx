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
    integrationsTitle: "جاهزية الربط الإلكتروني",
    integrationsHint: "لا تُحفظ المفاتيح السرية داخل المستودع. يتم الربط بعد اعتماد المزود.",
    usersTitle: "الأدوار ونطاق الوصول",
    partnersTitle: "طلبات انضمام الشركاء",
    vehiclesTitle: "حالة الأسطول",
    reportsTitle: "مؤشرات التشغيل المستهدفة",
    statuses: {
      confirmed: "مؤكد",
      vehicle_ready: "المركبة جاهزة",
      pending_payment: "بانتظار الدفع",
      connected: "متصل",
      testing: "تحت الاختبار",
      not_configured: "بانتظار المزود",
      review: "تحت المراجعة",
      active: "نشط",
    },
  },
  en: {
    adminTitle: "Sayyar Admin Portal",
    partnerTitle: "Sayyar Partner Portal",
    reference: "Development reference data",
    branch: "Branch scope",
    allBranches: "All authorized branches",
    riyadhBranch: "Riyadh - Qurtubah Branch",
    airportBranch: "King Khalid Airport Branch",
    nav: {
      dashboard: "Dashboard",
      bookings: "Bookings",
      partners: "Partners & applications",
      vehicles: "Vehicles",
      ratings: "Branch ratings",
      reports: "Reports",
      users: "Users & permissions",
      integrations: "Integration center",
      settings: "Settings",
    },
    metrics: {
      activeBookings: "Active bookings",
      completionRate: "Booking completion",
      confirmationTime: "Median confirmation",
      branchRating: "Branch rating",
      availableVehicles: "Available vehicles",
      partnerCaused: "Partner-caused cancellations",
    },
    bookingsTitle: "Latest operational bookings",
    bookingColumns: ["Booking", "Customer", "Partner / branch", "Pickup", "Amount", "Status"],
    ratingsTitle: "Branch performance and recurring issues",
    integrationsTitle: "Electronic integration readiness",
    integrationsHint: "Secrets are never stored in the repository. Providers are connected after approval.",
    usersTitle: "Roles and access scope",
    partnersTitle: "Partner applications",
    vehiclesTitle: "Fleet status",
    reportsTitle: "Target operating metrics",
    statuses: {
      confirmed: "Confirmed",
      vehicle_ready: "Vehicle ready",
      pending_payment: "Pending payment",
      connected: "Connected",
      testing: "Testing",
      not_configured: "Provider pending",
      review: "Under review",
      active: "Active",
    },
  },
} as const;

const bookings = [
  { reference: "SYR-260901-A19F", customer: "سارة الحربي", partner: "يلو · قرطبة", pickup: "01 Sep · 18:00", amount: 492, status: "confirmed" },
  { reference: "SYR-260901-B72K", customer: "محمد العتيبي", partner: "ذيب · المطار", pickup: "02 Sep · 10:00", amount: 714, status: "vehicle_ready" },
  { reference: "SYR-260901-C45M", customer: "نورة القحطاني", partner: "لومي · العليا", pickup: "02 Sep · 14:00", amount: 328, status: "pending_payment" },
] as const;

const integrations = [
  { key: "OTP / SMS", status: "not_configured", detail: "Provider adapter ready" },
  { key: "Payment", status: "not_configured", detail: "SAR payment contract ready" },
  { key: "Partner inventory", status: "testing", detail: "API and manual entry modes" },
  { key: "Wasl", status: "not_configured", detail: "Scheduled after portal readiness" },
] as const;

const ratings = [
  { branch: "قرطبة", partner: "يلو", rating: 4.7, completion: 97, issue: "تأخر تسليم محدود" },
  { branch: "مطار الملك خالد", partner: "ذيب", rating: 4.5, completion: 95, issue: "انتظار عند الكاونتر" },
  { branch: "العليا", partner: "لومي", rating: 4.3, completion: 93, issue: "اختلاف فئة المركبة" },
] as const;

const roleRows = [
  { role: "مدير نظام سيّار", scope: "جميع الشركات والفروع", users: 2 },
  { role: "فريق العمليات", scope: "الحجوزات والشركاء والتقارير", users: 6 },
  { role: "مدير حساب الشريك", scope: "شركة الشريك وجميع فروعه", users: 14 },
  { role: "موظف فرع", scope: "الفروع المصرح بها فقط", users: 38 },
] as const;

const partnerApplications = [
  { reference: "PAR-1042", company: "شركة المسار للتأجير", city: "الرياض", submitted: "31 Aug 2026", status: "review" },
  { reference: "PAR-1041", company: "أسطول الشرق", city: "الدمام", submitted: "30 Aug 2026", status: "review" },
] as const;

const vehicles = [
  { name: "Toyota Yaris 2026", branch: "قرطبة", category: "اقتصادية", status: "متاحة", rate: 128 },
  { name: "Hyundai Elantra 2026", branch: "المطار", category: "مدمجة", status: "محجوزة", rate: 164 },
  { name: "Kia Sportage 2026", branch: "العليا", category: "SUV", status: "متاحة", rate: 238 },
] as const;

function portalNavigation(kind: PortalKind) {
  return kind === "admin"
    ? ["dashboard", "bookings", "partners", "ratings", "reports", "users", "integrations", "settings"] as const
    : ["dashboard", "bookings", "vehicles", "ratings", "reports", "users", "integrations", "settings"] as const;
}

const navIcons = {
  dashboard: LayoutDashboard,
  bookings: CalendarCheck2,
  partners: Building2,
  vehicles: CarFront,
  ratings: Star,
  reports: BarChart3,
  users: Users,
  integrations: Link2,
  settings: Settings,
} as const;

export function PortalDashboard({ kind }: { kind: PortalKind }) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [active, setActive] = useState<keyof typeof copy.ar.nav>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = copy[locale];
  const isArabic = locale === "ar";
  const nav = portalNavigation(kind);

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#173d38]" dir={isArabic ? "rtl" : "ltr"} lang={locale}>
      <div className="flex min-h-screen">
        <aside className={cn(
          "fixed inset-y-0 z-40 w-72 bg-[#073f39] p-4 text-white transition-transform lg:static lg:translate-x-0",
          isArabic ? "right-0" : "left-0",
          mobileMenuOpen ? "translate-x-0" : isArabic ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}>
          <div className="flex items-center justify-between gap-3 px-2 py-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#f6c56f] text-[#073f39]"><Route className="size-5" /></span>
              <span><strong className="block text-xl">سيّار</strong><small className="text-white/60">Sayyar</small></span>
            </Link>
            <Button type="button" size="icon-sm" variant="ghost" className="text-white lg:hidden" onClick={() => setMobileMenuOpen(false)}><X /></Button>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/7 p-3">
            <p className="text-xs text-white/60">{kind === "admin" ? t.adminTitle : t.partnerTitle}</p>
            <p className="mt-1 text-sm font-bold">{kind === "admin" ? "Sayyar Operations" : "شركة التأجير التجريبية"}</p>
          </div>
          <nav className="mt-5 space-y-1" aria-label={kind === "admin" ? t.adminTitle : t.partnerTitle}>
            {nav.map((key) => {
              const Icon = navIcons[key];
              return (
                <button key={key} type="button" onClick={() => { setActive(key); setMobileMenuOpen(false); }} className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active === key ? "bg-[#f6c56f] text-[#073f39]" : "text-white/75 hover:bg-white/8 hover:text-white",
                )}>
                  <Icon className="size-4" />{t.nav[key]}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-[#dbe5e1] bg-white/95 backdrop-blur">
            <div className="flex min-h-18 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <Button type="button" size="icon" variant="outline" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}><Menu /></Button>
                <div>
                  <h1 className="text-lg font-black sm:text-xl">{t.nav[active]}</h1>
                  <p className="text-xs text-[#71827f]">{t.reference}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {kind === "partner" && (
                  <Select defaultValue="all">
                    <SelectTrigger className="hidden w-56 sm:flex"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allBranches}</SelectItem>
                      <SelectItem value="11">{t.riyadhBranch}</SelectItem>
                      <SelectItem value="12">{t.airportBranch}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button type="button" size="icon" variant="ghost" aria-label="Notifications"><Bell /></Button>
                <Button type="button" variant="outline" onClick={() => setLocale(isArabic ? "en" : "ar")}><Languages />{isArabic ? "English" : "العربية"}</Button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {active === "dashboard" && <DashboardOverview kind={kind} locale={locale} />}
            {active === "bookings" && <BookingsPanel locale={locale} />}
            {active === "partners" && <PartnersPanel locale={locale} />}
            {active === "vehicles" && <VehiclesPanel locale={locale} />}
            {active === "ratings" && <RatingsPanel locale={locale} />}
            {active === "reports" && <ReportsPanel locale={locale} />}
            {active === "users" && <UsersPanel locale={locale} />}
            {active === "integrations" && <IntegrationsPanel locale={locale} />}
            {active === "settings" && <SettingsPanel locale={locale} />}
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardOverview({ kind, locale }: { kind: PortalKind; locale: Locale }) {
  const t = copy[locale];
  const metrics = kind === "admin"
    ? [
        [t.metrics.activeBookings, "284", "+18%", CalendarCheck2],
        [t.metrics.completionRate, "95.8%", "+2.1%", CircleGauge],
        [t.metrics.confirmationTime, "12 min", "هدف ≤15", FileCheck2],
        [t.metrics.partnerCaused, "3.4%", "هدف ≤5%", ShieldCheck],
      ] as const
    : [
        [t.metrics.activeBookings, "42", "+9%", CalendarCheck2],
        [t.metrics.availableVehicles, "118", "من 146", CarFront],
        [t.metrics.branchRating, "4.6 / 5", "+0.2", Star],
        [t.metrics.confirmationTime, "11 min", "هدف ≤15", FileCheck2],
      ] as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, detail, Icon]) => (
          <Card key={label} className="border-[#dce5e1] shadow-sm">
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div><p className="text-xs font-semibold text-[#6e817c]">{label}</p><p className="mt-2 text-2xl font-black text-[#123a35]">{value}</p><p className="mt-1 text-xs font-bold text-[#b47b2d]">{detail}</p></div>
              <span className="grid size-10 place-items-center rounded-2xl bg-[#e8f2ef] text-[#0c5b50]"><Icon className="size-5" /></span>
            </CardContent>
          </Card>
        ))}
      </div>
      <BookingsPanel locale={locale} compact />
      <div className="grid gap-5 xl:grid-cols-2"><RatingsPanel locale={locale} compact /><IntegrationsPanel locale={locale} compact /></div>
    </div>
  );
}

function BookingsPanel({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = copy[locale];
  return <Card className="border-[#dce5e1] shadow-sm"><CardHeader className="flex-row items-center justify-between"><CardTitle>{t.bookingsTitle}</CardTitle><Badge variant="outline">10 min hold</Badge></CardHeader><CardContent><Table><TableHeader><TableRow>{t.bookingColumns.map((column) => <TableHead key={column} className={locale === "ar" ? "text-right" : "text-left"}>{column}</TableHead>)}</TableRow></TableHeader><TableBody>{bookings.slice(0, compact ? 3 : undefined).map((booking) => <TableRow key={booking.reference}><TableCell className="font-mono text-xs font-bold" dir="ltr">{booking.reference}</TableCell><TableCell>{booking.customer}</TableCell><TableCell>{booking.partner}</TableCell><TableCell dir="ltr">{booking.pickup}</TableCell><TableCell><bdi>{booking.amount}</bdi> SAR</TableCell><TableCell><StatusBadge status={booking.status} locale={locale} /></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}

function RatingsPanel({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = copy[locale];
  return <Card className="border-[#dce5e1] shadow-sm"><CardHeader><CardTitle>{t.ratingsTitle}</CardTitle></CardHeader><CardContent className="space-y-4">{ratings.slice(0, compact ? 3 : undefined).map((item) => <div key={item.branch} className="rounded-2xl border border-[#e1e7e4] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">{item.partner} · {item.branch}</p><p className="mt-1 text-xs text-[#778783]">{item.issue}</p></div><Badge className="bg-amber-100 text-amber-900"><Star className="fill-current" />{item.rating}</Badge></div><Progress value={item.completion} className="mt-3" /></div>)}</CardContent></Card>;
}

function IntegrationsPanel({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = copy[locale];
  return <Card className="border-[#dce5e1] shadow-sm"><CardHeader><CardTitle>{t.integrationsTitle}</CardTitle><p className="text-xs leading-5 text-[#71827f]">{t.integrationsHint}</p></CardHeader><CardContent className="space-y-3">{integrations.slice(0, compact ? 4 : undefined).map((item) => <div key={item.key} className="flex items-center justify-between gap-4 rounded-2xl border border-[#e1e7e4] p-3.5"><div><p className="font-bold">{item.key}</p><p className="mt-1 text-xs text-[#778783]">{item.detail}</p></div><StatusBadge status={item.status} locale={locale} /></div>)}</CardContent></Card>;
}

function UsersPanel({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <Card className="border-[#dce5e1] shadow-sm"><CardHeader><CardTitle>{t.usersTitle}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">{roleRows.map((row) => <div key={row.role} className="rounded-2xl border border-[#e1e7e4] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{row.role}</p><p className="mt-1 text-xs leading-5 text-[#71827f]">{row.scope}</p></div><Badge variant="secondary">{row.users}</Badge></div></div>)}</CardContent></Card>;
}

function PartnersPanel({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <Card className="border-[#dce5e1] shadow-sm"><CardHeader><CardTitle>{t.partnersTitle}</CardTitle></CardHeader><CardContent className="space-y-3">{partnerApplications.map((application) => <div key={application.reference} className="flex flex-col justify-between gap-3 rounded-2xl border border-[#e1e7e4] p-4 sm:flex-row sm:items-center"><div><p className="font-mono text-xs font-bold text-[#0c5b50]">{application.reference}</p><p className="mt-1 font-black">{application.company}</p><p className="mt-1 text-xs text-[#71827f]">{application.city} · {application.submitted}</p></div><div className="flex items-center gap-2"><StatusBadge status={application.status} locale={locale} /><Button size="sm" variant="outline">{locale === "ar" ? "مراجعة الطلب" : "Review"}<ChevronLeft /></Button></div></div>)}</CardContent></Card>;
}

function VehiclesPanel({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <div><h2 className="mb-4 text-xl font-black">{t.vehiclesTitle}</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{vehicles.map((vehicle) => <Card key={vehicle.name} className="border-[#dce5e1] shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-[#e8f2ef] text-[#0c5b50]"><CarFront /></span><Badge className={vehicle.status === "متاحة" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}>{vehicle.status}</Badge></div><h3 className="mt-4 font-black">{vehicle.name}</h3><p className="mt-1 text-xs text-[#71827f]">{vehicle.category} · {vehicle.branch}</p><p className="mt-4 text-xl font-black text-[#0c5b50]">{vehicle.rate} <span className="text-xs">SAR/day</span></p></CardContent></Card>)}</div></div>;
}

function ReportsPanel({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const goals = [["Booking completion", 96, "≥95%"], ["Vehicle/category match", 98, "≥98%"], ["On-time pickup", 95, "≥95%"], ["Complaints per 100", 70, "≤3"]] as const;
  return <Card className="border-[#dce5e1] shadow-sm"><CardHeader><CardTitle>{t.reportsTitle}</CardTitle></CardHeader><CardContent className="grid gap-5 md:grid-cols-2">{goals.map(([label, value, target]) => <div key={label} className="rounded-2xl border border-[#e1e7e4] p-4"><div className="mb-3 flex justify-between gap-4"><span className="font-bold">{label}</span><Badge variant="outline">{target}</Badge></div><Progress value={value} /></div>)}</CardContent></Card>;
}

function SettingsPanel({ locale }: { locale: Locale }) {
  return <Card className="border-[#dce5e1] shadow-sm"><CardContent className="grid min-h-64 place-items-center p-8 text-center"><div><Settings className="mx-auto size-10 text-[#0c5b50]" /><h2 className="mt-4 text-xl font-black">{locale === "ar" ? "إعدادات البوابة" : "Portal settings"}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#71827f]">{locale === "ar" ? "تُفعل إعدادات الهوية والإشعارات والسياسات بعد اعتماد مزودي الخدمات وبيئة الإنتاج." : "Brand, notification, and policy settings are enabled after providers and the production environment are approved."}</p></div></CardContent></Card>;
}

function StatusBadge({ status, locale }: { status: string; locale: Locale }) {
  const labels = copy[locale].statuses as Record<string, string>;
  const tone = status === "connected" || status === "confirmed" || status === "active" ? "bg-emerald-100 text-emerald-800" : status === "vehicle_ready" || status === "testing" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-900";
  return <Badge className={tone}>{labels[status] ?? status}</Badge>;
}
