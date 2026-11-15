import { describe, expect, it } from "vitest";
import {
  deviceClass,
  facetCounts,
  filterProjects,
  formatDate,
  formatDateRange,
  isPlaceholder,
  readingMinutes,
  referrerHost,
  slugify,
  stripPlaceholder,
} from "@/lib/utils";

describe("placeholders", () => {
  it("detects the PLACEHOLDER: prefix, ignoring leading whitespace", () => {
    expect(isPlaceholder("PLACEHOLDER: add screenshots")).toBe(true);
    expect(isPlaceholder("  PLACEHOLDER: x")).toBe(true);
    expect(isPlaceholder("Real content mentioning PLACEHOLDER: later")).toBe(false);
    expect(isPlaceholder(null)).toBe(false);
    expect(isPlaceholder(undefined)).toBe(false);
  });

  it("strips the prefix", () => {
    expect(stripPlaceholder("PLACEHOLDER:   add a demo")).toBe("add a demo");
  });
});

describe("formatDate", () => {
  it("never shows more precision than known", () => {
    expect(formatDate("2026-01-01", "year")).toBe("2026");
    expect(formatDate("2025-11-01", "month")).toBe("Nov 2025");
    expect(formatDate("2025-11-07", "day")).toBe("7 Nov 2025");
  });

  it("is timezone-stable for ISO timestamps", () => {
    expect(formatDate("2025-05-01T23:30:00+05:30", "month")).toBe("May 2025");
  });
});

describe("formatDateRange", () => {
  const now = new Date("2026-11-15T00:00:00Z");
  it("handles ongoing roles", () => {
    expect(formatDateRange("2023-11-01", null, now)).toBe("Nov 2023 – Present");
  });
  it("marks future end dates as expected", () => {
    expect(formatDateRange("2023-11-01", "2027-08-31", now)).toBe("Nov 2023 – Aug 2027 (expected)");
  });
  it("formats past ranges", () => {
    expect(formatDateRange("2026-07-01", "2026-08-31", now)).toBe("Jul 2026 – Aug 2026");
  });
  it("collapses same-month ranges", () => {
    expect(formatDateRange("2026-07-01", "2026-07-20", now)).toBe("Jul 2026");
  });
});

describe("slugify", () => {
  it("creates URL-safe slugs", () => {
    expect(slugify("HearMe — Women's Safety!")).toBe("hearme-women-s-safety");
    expect(slugify("  Crème Brûlée  ")).toBe("creme-brulee");
    expect(slugify("---")).toBe("");
  });
  it("caps length", () => {
    expect(slugify("a".repeat(200))).toHaveLength(80);
  });
});

describe("readingMinutes", () => {
  it("rounds to at least one minute", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("word ".repeat(450))).toBe(2);
  });
});

describe("project filtering", () => {
  const projects = [
    { slug: "a", categories: ["social-impact", "mobile"], tech: ["React Native", "Supabase"] },
    { slug: "b", categories: ["iot"], tech: ["ESP8266"] },
    { slug: "c", categories: ["social-impact", "ai-ml"], tech: ["Python"] },
  ];

  it("returns everything with no filter", () => {
    expect(filterProjects(projects, {})).toHaveLength(3);
  });
  it("filters by category and tech together (AND)", () => {
    expect(filterProjects(projects, { category: "social-impact" }).map((p) => p.slug)).toEqual(["a", "c"]);
    expect(filterProjects(projects, { category: "social-impact", tech: "Python" }).map((p) => p.slug)).toEqual(["c"]);
    expect(filterProjects(projects, { category: "iot", tech: "Python" })).toEqual([]);
  });
  it("counts facets by popularity then name", () => {
    expect(facetCounts(projects.map((p) => p.categories))).toEqual([
      { value: "social-impact", count: 2 },
      { value: "ai-ml", count: 1 },
      { value: "iot", count: 1 },
      { value: "mobile", count: 1 },
    ]);
  });
});

describe("analytics helpers", () => {
  it("buckets devices coarsely", () => {
    expect(deviceClass(360)).toBe("mobile");
    expect(deviceClass(768)).toBe("tablet");
    expect(deviceClass(1440)).toBe("desktop");
  });
  it("keeps only external referrer hostnames", () => {
    expect(referrerHost("https://www.linkedin.com/in/someone?x=1", "deb.dev")).toBe("www.linkedin.com");
    expect(referrerHost("https://deb.dev/projects", "deb.dev")).toBeNull();
    expect(referrerHost("", "deb.dev")).toBeNull();
    expect(referrerHost("not a url", "deb.dev")).toBeNull();
  });
});
