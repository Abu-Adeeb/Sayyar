"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  CarFront,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Fuel,
  Gauge,
  KeyRound,
  Languages,
  MapPin,
  Navigation,
  Route,
  Search,
  ShieldCheck,
  Truck,
  UserRound,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Locale = "ar" | "en";
type PickupMode = "branch" | "delivery" | "taxi";
type CityKey = "riyadh" | "jeddah" | "dammam" | "makkah" | "madinah";

const content = {
  ar: {
    brand: "سيّار",
    partnerPortal: "بوابة شركاء سيّار",
    customerLogin: "دخول عملاء سيّار",
    eyebrow: "مقارنة وحجز مركبات من شركاء موثوقين",
    title: "مركبتك الأقرب،\nبحجز أوضح.",
    subtitle: "قارن خيارات التأجير واختر طريقة الاستلام التي تناسبك.",
    support: ["احجز مركبتك", "وثّق حالة مركبتك", "انطلق بأمان"],
    receiveQuestion: "كيف تفضّل استلام مركبتك؟",
    modes: {
      branch: { title: "أستلمها من الفرع", hint: "الأقرب لموقعك" },
      delivery: { title: "أوصلوا المركبة إليّ", hint: "إلى موقعك المحدد" },
      taxi: { title: "طلب تكسي يوصلني للفرع", hint: "نرتّب لك مشوار الوصول" },
    },
    pickupCity: "مدينة الاستلام",
    pickupCityHint: "تعرض الفروع الأقرب أولًا",
    pickupDate: "تاريخ الاستلام",
    days: "عدد الأيام",
    day: "يوم",
    daysWord: "أيام",
    pickupTime: "وقت الاستلام",
    returnDate: "تاريخ الإعادة",
    differentCity: "إعادة المركبة في مدينة مختلفة",
    returnCity: "مدينة الإعادة",
    search: "ابحث عن مركبتك",
    intermediary: "سيّار منصة وسيطة للمقارنة والحجز، ويصدر عقد التأجير من شركة التأجير المختارة.",
    cities: {
      riyadh: "الرياض",
      jeddah: "جدة",
      dammam: "الدمام",
      makkah: "مكة المكرمة",
      madinah: "المدينة المنورة",
    },
    resultsEyebrow: "نتائج البحث",
    resultsTitle: "الفئات المتاحة لمسارك",
    resultsFor: "استلام من",
    resultsTo: "إعادة في",
    demoLabel: "بيانات تجريبية للواجهة",
    perDay: "لليوم",
    total: "الإجمالي المبدئي",
    choose: "اختيار الفئة",
    chosen: "تم الاختيار مبدئيًا",
    automatic: "أوتوماتيك",
    seats: "مقاعد",
    bags: "حقائب",
    mileage: "كيلومترات مرنة",
    categories: {
      economy: { name: "اقتصادية", note: "عملية للتنقل داخل المدينة" },
      compact: { name: "مدمجة", note: "راحة أكبر واستهلاك متوازن" },
      family: { name: "عائلية SUV", note: "مساحة مناسبة للعائلة والأمتعة" },
    },
    trust: [
      { title: "شركاء موثوقون", text: "خيارات من شركات تأجير مرخصة" },
      { title: "حجز واضح", text: "تفاصيل السعر والاستلام قبل التأكيد" },
      { title: "انطلق بأمان", text: "تقرير مصوّر لحالة المركبة عند الاستلام" },
    ],
    heroAlt: "مركبة حديثة على طريق في الرياض وقت الشروق",
    languageLabel: "English",
    mainNav: "التنقل الرئيسي",
  },
  en: {
    brand: "Sayyar",
    partnerPortal: "Sayyar Partner Portal",
    customerLogin: "Customer Sign In",
    eyebrow: "Compare and book vehicles from trusted partners",
    title: "The nearest car.\nA clearer booking.",
    subtitle: "Compare rental options and choose the pickup method that suits you.",
    support: ["Book your vehicle", "Document its condition", "Drive with confidence"],
    receiveQuestion: "How would you like to receive your vehicle?",
    modes: {
      branch: { title: "Pick up from the branch", hint: "Nearest to your location" },
      delivery: { title: "Deliver the vehicle to me", hint: "To your selected location" },
      taxi: { title: "Request a taxi to the branch", hint: "We arrange your ride" },
    },
    pickupCity: "Pickup city",
    pickupCityHint: "Nearest branches are shown first",
    pickupDate: "Pickup date",
    days: "Number of days",
    day: "day",
    daysWord: "days",
    pickupTime: "Pickup time",
    returnDate: "Return date",
    differentCity: "Return the vehicle in a different city",
    returnCity: "Return city",
    search: "Search for a vehicle",
    intermediary: "Sayyar is a comparison and booking intermediary. The rental agreement is issued by the selected rental company.",
    cities: {
      riyadh: "Riyadh",
      jeddah: "Jeddah",
      dammam: "Dammam",
      makkah: "Makkah",
      madinah: "Al Madinah",
    },
    resultsEyebrow: "Search results",
    resultsTitle: "Available categories for your trip",
    resultsFor: "Pickup in",
    resultsTo: "Return in",
    demoLabel: "Interface demo data",
    perDay: "per day",
    total: "Estimated total",
    choose: "Select category",
    chosen: "Provisionally selected",
    automatic: "Automatic",
    seats: "seats",
    bags: "bags",
    mileage: "Flexible mileage",
    categories: {
      economy: { name: "Economy", note: "Practical for city driving" },
      compact: { name: "Compact", note: "More comfort with balanced efficiency" },
      family: { name: "Family SUV", note: "Room for family and luggage" },
    },
    trust: [
      { title: "Trusted partners", text: "Options from licensed rental companies" },
      { title: "Clear booking", text: "Price and pickup details before confirmation" },
      { title: "Drive with confidence", text: "A photo condition report at pickup" },
    ],
    heroAlt: "A modern vehicle driving through Riyadh at sunrise",
    languageLabel: "العربية",
    mainNav: "Main navigation",
  },
} as const;

const cityKeys: CityKey[] = ["riyadh", "jeddah", "dammam", "makkah", "madinah"];

const categoryData = [
  { key: "economy", price: 128, seats: 5, bags: 2, tone: "from-amber-50 to-stone-100" },
  { key: "compact", price: 164, seats: 5, bags: 3, tone: "from-emerald-50 to-stone-100" },
  { key: "family", price: 238, seats: 7, bags: 4, tone: "from-slate-100 to-stone-200" },
] as const;

const modeIcons = {
  branch: Building2,
  delivery: Truck,
  taxi: Navigation,
} as const;

function riyadhToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [pickupMode, setPickupMode] = useState<PickupMode>("branch");
  const [pickupCity, setPickupCity] = useState<CityKey>("riyadh");
  const [returnCity, setReturnCity] = useState<CityKey>("riyadh");
  const [pickupDate, setPickupDate] = useState(riyadhToday);
  const [days, setDays] = useState(1);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [differentCity, setDifferentCity] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const copy = content[locale];
  const isArabic = locale === "ar";
  const returnDate = useMemo(() => addDays(pickupDate, days), [pickupDate, days]);
  const effectiveReturnCity = differentCity ? returnCity : pickupCity;
  const ArrowIcon = isArabic ? ChevronLeft : ChevronRight;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic, locale]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setSelectedCategory(null);
    window.setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#f5f2eb] text-[#13332f]"
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
    >
      <header className="relative z-30 border-b border-black/5 bg-[#fbfaf7]/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <a href="#top" className="flex items-center gap-2.5" aria-label={copy.brand}>
            <span className="grid size-10 place-items-center rounded-2xl bg-[#0c5b50] text-[#f6c56f] shadow-[0_8px_24px_rgba(12,91,80,0.2)]">
              <Route className="size-5" aria-hidden="true" />
            </span>
            <span className="text-2xl font-black tracking-tight text-[#0b453e]">{copy.brand}</span>
          </a>

          <nav className="flex items-center gap-1.5 sm:gap-2" aria-label={copy.mainNav}>
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-xl px-3 text-[#27564f] hover:bg-[#e9f0ed] sm:px-4"
              onClick={() => setLocale(isArabic ? "en" : "ar")}
            >
              <Languages className="size-4" />
              <span className="hidden sm:inline">{copy.languageLabel}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="hidden h-10 rounded-xl px-4 text-[#27564f] hover:bg-[#e9f0ed] lg:inline-flex"
            >
              <Building2 className="size-4" />
              {copy.partnerPortal}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-[#0c5b50]/25 bg-white px-3 text-[#0c5b50] shadow-none hover:bg-[#eef5f2] sm:px-4"
            >
              <UserRound className="size-4" />
              <span className="hidden md:inline">{copy.customerLogin}</span>
            </Button>
          </nav>
        </div>
      </header>

      <section id="top" className="relative isolate min-h-[720px] overflow-hidden bg-[#0a423b] lg:min-h-[690px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- Vinext serves this static hero directly without Next's image optimizer. */}
        <img
          src="/sayyar-hero.png"
          alt={copy.heroAlt}
          className="absolute inset-0 h-full w-full object-cover object-[42%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,37,34,0.04)_0%,rgba(4,37,34,0.3)_42%,rgba(4,37,34,0.94)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#082f2b]/80 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1440px] items-start justify-end px-4 py-10 sm:px-6 lg:min-h-[690px] lg:px-10 lg:py-14">
          <div className="w-full max-w-[650px]">
            <div className="mb-6 text-white lg:mb-7">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wide text-[#f6cf88] sm:text-sm">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {copy.eyebrow}
              </p>
              <h1 className="whitespace-pre-line text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.35rem]">
                {copy.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">{copy.subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-white/90 sm:text-sm">
                {copy.support.map((item, index) => (
                  <span key={item} className="flex items-center gap-2">
                    {index > 0 && <span className="hidden size-1 rounded-full bg-[#f6c56f] sm:block" />}
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-white/45 bg-[#fffdf9]/97 p-4 shadow-[0_30px_80px_rgba(3,32,29,0.35)] backdrop-blur sm:p-5"
            >
              <fieldset>
                <legend className="mb-3 text-sm font-extrabold text-[#163d38] sm:text-base">{copy.receiveQuestion}</legend>
                <RadioGroup
                  value={pickupMode}
                  onValueChange={(value) => setPickupMode(value as PickupMode)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {(Object.keys(copy.modes) as PickupMode[]).map((mode) => {
                    const Icon = modeIcons[mode];
                    const active = pickupMode === mode;
                    return (
                      <label
                        key={mode}
                        className={cn(
                          "group relative flex min-h-[82px] cursor-pointer items-start gap-2.5 rounded-2xl border p-3 transition sm:flex-col sm:gap-1.5",
                          active
                            ? "border-[#0c5b50] bg-[#e9f3ef] shadow-[0_6px_18px_rgba(12,91,80,0.1)]"
                            : "border-[#dfe5e1] bg-white hover:border-[#0c5b50]/45 hover:bg-[#f7faf8]",
                        )}
                      >
                        <RadioGroupItem value={mode} className="sr-only" />
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-xl",
                            active ? "bg-[#0c5b50] text-[#f9d18d]" : "bg-[#eef2ef] text-[#52726d]",
                          )}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xs font-extrabold leading-5 text-[#163d38] sm:text-[13px]">{copy.modes[mode].title}</span>
                          <span className="mt-0.5 block text-[11px] leading-4 text-[#6a7f7b]">{copy.modes[mode].hint}</span>
                        </span>
                        {active && (
                          <span
                            className={cn(
                              "absolute top-2.5 grid size-5 place-items-center rounded-full bg-[#0c5b50] text-white",
                              isArabic ? "left-2.5" : "right-2.5",
                            )}
                          >
                            <Check className="size-3" aria-hidden="true" />
                          </span>
                        )}
                      </label>
                    );
                  })}
                </RadioGroup>
              </fieldset>

              <div className="mt-4 rounded-2xl border border-[#e0e5e1] bg-white p-3.5 sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold text-[#355a55]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[#bc7c25]" aria-hidden="true" />
                        {copy.pickupCity}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-[#71827f]">
                        <Navigation className="size-3" aria-hidden="true" />
                        {copy.pickupCityHint}
                      </span>
                    </span>
                    <Select value={pickupCity} onValueChange={(value) => setPickupCity(value as CityKey)}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-[#d9e0dc] bg-[#fbfcfb] text-[#173d38] shadow-none focus:ring-[#0c5b50]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cityKeys.map((city) => (
                          <SelectItem key={city} value={city}>{copy.cities[city]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label>
                    <FieldLabel icon={CalendarDays} text={copy.pickupDate} />
                    <Input
                      required
                      type="date"
                      min={riyadhToday()}
                      value={pickupDate}
                      onChange={(event) => setPickupDate(event.target.value)}
                      className="h-11 rounded-xl border-[#d9e0dc] bg-[#fbfcfb] text-[#173d38] shadow-none focus-visible:ring-[#0c5b50]/20"
                    />
                  </label>

                  <label>
                    <FieldLabel icon={KeyRound} text={copy.days} />
                    <Select value={String(days)} onValueChange={(value) => setDays(Number(value))}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-[#d9e0dc] bg-[#fbfcfb] text-[#173d38] shadow-none focus:ring-[#0c5b50]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((value) => (
                          <SelectItem key={value} value={String(value)}>
                            {value} {value === 1 ? copy.day : copy.daysWord}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label>
                    <FieldLabel icon={Clock3} text={copy.pickupTime} />
                    <Select value={pickupTime} onValueChange={setPickupTime}>
                      <SelectTrigger className="h-11 w-full rounded-xl border-[#d9e0dc] bg-[#fbfcfb] text-[#173d38] shadow-none focus:ring-[#0c5b50]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label>
                    <FieldLabel icon={CalendarDays} text={copy.returnDate} />
                    <Input
                      readOnly
                      type="date"
                      value={returnDate}
                      className="h-11 cursor-default rounded-xl border-[#d9e0dc] bg-[#f1f4f2] text-[#48645f] shadow-none"
                    />
                  </label>
                </div>

                <div className="mt-3 border-t border-[#e5e8e6] pt-3">
                  <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-[#365b56]">
                    <Checkbox
                      checked={differentCity}
                      onCheckedChange={(checked) => setDifferentCity(checked === true)}
                      className="border-[#9fb2ad] data-[state=checked]:border-[#0c5b50] data-[state=checked]:bg-[#0c5b50]"
                    />
                    {copy.differentCity}
                  </label>

                  {differentCity && (
                    <label className="mt-3 block">
                      <span className="mb-1.5 block text-xs font-bold text-[#355a55]">{copy.returnCity}</span>
                      <Select value={returnCity} onValueChange={(value) => setReturnCity(value as CityKey)}>
                        <SelectTrigger className="h-11 w-full rounded-xl border-[#d9e0dc] bg-[#fbfcfb] text-[#173d38] shadow-none focus:ring-[#0c5b50]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cityKeys.map((city) => (
                            <SelectItem key={city} value={city}>{copy.cities[city]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-4 h-13 w-full rounded-2xl bg-[#0c5b50] text-base font-extrabold text-white shadow-[0_12px_30px_rgba(12,91,80,0.25)] hover:bg-[#094c43]"
              >
                <Search className="size-5" />
                {copy.search}
                <ArrowIcon className="size-4" />
              </Button>
              <p className="mt-3 text-center text-[11px] leading-5 text-[#6a7d79]">{copy.intermediary}</p>
            </form>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-8 max-w-[1180px] px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[24px] border border-[#e2dfd6] bg-[#fffdf9] shadow-[0_18px_50px_rgba(43,65,59,0.1)] md:grid-cols-3">
          {copy.trust.map((item, index) => {
            const Icon = [ShieldCheck, Check, CarFront][index];
            return (
              <div key={item.title} className="flex items-center gap-3 border-b border-[#ece8df] p-4 last:border-0 md:border-b-0 md:border-e">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#edf4f1] text-[#0c5b50]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-sm font-extrabold text-[#173d38]">{item.title}</strong>
                  <span className="mt-0.5 block text-xs leading-5 text-[#6e817c]">{item.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {submitted && (
        <section id="search-results" className="scroll-mt-5 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-extrabold tracking-wide text-[#ad7020]">{copy.resultsEyebrow}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#123a35] sm:text-4xl">{copy.resultsTitle}</h2>
                <p className="mt-3 text-sm text-[#687e79]">
                  {copy.resultsFor} <strong className="text-[#274f49]">{copy.cities[pickupCity]}</strong>
                  <span className="mx-2 text-[#b9c2bf]">•</span>
                  {copy.resultsTo} <strong className="text-[#274f49]">{copy.cities[effectiveReturnCity]}</strong>
                  <span className="mx-2 text-[#b9c2bf]">•</span>
                  <bdi>{pickupDate}</bdi> — <bdi>{returnDate}</bdi>
                </p>
              </div>
              <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">{copy.demoLabel}</span>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {categoryData.map((category) => {
                const details = copy.categories[category.key];
                const selected = selectedCategory === category.key;
                return (
                  <article
                    key={category.key}
                    className={cn(
                      "overflow-hidden rounded-[26px] border bg-[#fffdf9] transition",
                      selected
                        ? "border-[#0c5b50] shadow-[0_20px_50px_rgba(12,91,80,0.14)] ring-2 ring-[#0c5b50]/10"
                        : "border-[#dfddd5] shadow-[0_12px_36px_rgba(43,65,59,0.07)] hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(43,65,59,0.12)]",
                    )}
                  >
                    <div className={cn("relative grid h-44 place-items-center bg-gradient-to-br", category.tone)}>
                      <CarFront className="size-28 stroke-[1.15] text-[#315c56] drop-shadow-sm" aria-hidden="true" />
                      <span
                        className={cn(
                          "absolute top-4 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-[#52716c] backdrop-blur",
                          isArabic ? "right-4" : "left-4",
                        )}
                      >
                        {details.note}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-[#173d38]">{details.name}</h3>
                          <p className="mt-1 text-xs text-[#71827f]">{copy.automatic}</p>
                        </div>
                        <div className={isArabic ? "text-left" : "text-right"}>
                          <p className="text-2xl font-black text-[#0c5b50]"><bdi>{category.price}</bdi> <span className="text-xs">SAR</span></p>
                          <p className="text-[11px] text-[#7c8c88]">{copy.perDay}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#4e6b66]">
                        <Spec icon={Users} text={category.seats + " " + copy.seats} />
                        <Spec icon={KeyRound} text={category.bags + " " + copy.bags} />
                        <Spec icon={Gauge} text={copy.mileage} />
                        <Spec icon={Fuel} text={copy.automatic} />
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#e8e6df] pt-4">
                        <div>
                          <p className="text-[11px] text-[#7a8986]">{copy.total}</p>
                          <p className="mt-0.5 text-lg font-black text-[#173d38]"><bdi>{category.price * days}</bdi> <span className="text-xs">SAR</span></p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setSelectedCategory(category.key)}
                          variant={selected ? "secondary" : "default"}
                          className={cn(
                            "rounded-xl px-4 font-extrabold",
                            selected
                              ? "bg-[#e5f1ed] text-[#0c5b50] hover:bg-[#e5f1ed]"
                              : "bg-[#0c5b50] text-white hover:bg-[#094c43]",
                          )}
                        >
                          {selected ? <Check className="size-4" /> : <CarFront className="size-4" />}
                          {selected ? copy.chosen : copy.choose}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-[#dcdad2] bg-[#eeece5] px-4 py-6 text-center text-xs text-[#667a75] sm:px-6">
        <p>© {new Date().getFullYear()} {copy.brand} · {copy.intermediary}</p>
      </footer>
    </main>
  );
}

function FieldLabel({
  icon: Icon,
  text,
}: {
  icon: typeof CalendarDays;
  text: string;
}) {
  return (
    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#355a55]">
      <Icon className="size-3.5 text-[#bc7c25]" aria-hidden="true" />
      {text}
    </span>
  );
}

function Spec({
  icon: Icon,
  text,
}: {
  icon: typeof Users;
  text: string;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-xl bg-[#f3f5f2] px-2.5 py-2">
      <Icon className="size-3.5" aria-hidden="true" />
      {text}
    </span>
  );
}
