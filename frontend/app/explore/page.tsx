"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

import Navbar from "@/components/navbar/Navbar";
import HeroCarousel from "@/components/carousel/HeroCarousel";
import ProductCard from "@/components/product/ProductCard";
import CardSkeleton from "@/components/product/CardSkeleton";
import FiltersSidebar from "@/components/filters/FiltersSidebar";

import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { buildParams } from "@/lib/utils/buildParams";

const API = "http://localhost:5000";

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  thumbnail: string;
  category: string;
  discountPercentage?: number;
}

interface FiltersData {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
}

interface CarouselItem {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FilterState {
  priceRange: [number, number];
  rating: number;
  brands: string[];
  sort: string;
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 15000],
    rating: 0,
    brands: [],
    sort: "default",
  });

  const observerRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────
  // Debounce Search
  // ─────────────────────────

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ─────────────────────────
  // Load Carousel + Filters
  // ─────────────────────────

  useEffect(() => {
    axios
      .get(`${API}/carousel`)
      .then((r) => setCarousel(r.data.data ?? r.data))
      .catch(() => {});

    axios
      .get(`${API}/products/filters`)
      .then((r) => {
        const raw = r.data.data ?? r.data;

        const d: FiltersData = {
          ...raw,
          categories: raw.categories.map((c: any) =>
            typeof c === "string" ? c : (c.slug ?? c.name),
          ),
        };

        setFiltersData(d);

        setFilters((f) => ({
          ...f,
          priceRange: [
            Math.floor(d.priceRange.min),
            Math.ceil(d.priceRange.max),
          ],
        }));
      })
      .catch(() => {});
  }, []);

  // ─────────────────────────
  // Fetch Products
  // ─────────────────────────

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setLoading(true);

    const params = buildParams({
      page: 1,
      search: debouncedSearch,
      category: activeCategory,
      filters,
      filtersData,
    });

    axios
      .get(`${API}/products`, { params })
      .then((r) => {
        setProducts(r.data.data ?? r.data);
        setPagination(r.data.pagination ?? null);
      })
      .finally(() => setLoading(false));
  }, [
    debouncedSearch,
    activeCategory,
    filters.sort,
    filters.rating,
    filters.brands,
    filters.priceRange,
  ]);

  // ─────────────────────────
  // Infinite Scroll
  // ─────────────────────────

  const loadMore = useCallback(() => {
    if (!pagination || page >= pagination.pages || loadingMore) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    const params = buildParams({
      page: nextPage,
      search: debouncedSearch,
      category: activeCategory,
      filters,
      filtersData,
    });

    axios
      .get(`${API}/products`, { params })
      .then((r) => {
        setProducts((prev) => [...prev, ...(r.data.data ?? r.data)]);
        setPagination(r.data.pagination ?? null);
        setPage(nextPage);
      })
      .finally(() => setLoadingMore(false));
  }, [pagination, page, loadingMore, debouncedSearch, activeCategory, filters]);

  // ─────────────────────────
  // Intersection Observer
  // ─────────────────────────

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });

    obs.observe(el);

    return () => obs.disconnect();
  }, [loadMore]);

  // ─────────────────────────
  // Reset Filters
  // ─────────────────────────

  const resetFilters = () => {
    setFilters({
      priceRange: filtersData
        ? [
            Math.floor(filtersData.priceRange.min),
            Math.ceil(filtersData.priceRange.max),
          ]
        : [0, 15000],
      rating: 0,
      brands: [],
      sort: "default",
    });

    setActiveCategory("");
    setSearch("");
  };

  const activeFilterCount = [
    filters.brands.length > 0,
    filters.rating > 0,
    filters.sort !== "default",
  ].filter(Boolean).length;

  // ─────────────────────────
  // UI
  // ─────────────────────────

  return (
    <div
      className="min-h-screen bg-[#faf7f3]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar search={search} setSearch={setSearch} />

      <div className="max-w-[1600px] mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto p-5 bg-white border-r border-[#e8e3dd]">
          <FiltersSidebar
            filtersData={filtersData}
            filters={filters}
            setFilters={(f) => {
              setFilters(f);
              setPage(1);
              setProducts([]);
            }}
            onReset={resetFilters}
          />
        </aside>

        {/* Main */}

        <main className="flex-1 min-w-0 p-5 space-y-5">
          {/* Top bar: categories */}
          <div className="flex items-center gap-3">
            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none flex-1">
              {/* All */}
              <button
                onClick={() => setActiveCategory("")}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border transition-all duration-200 ${
                  activeCategory === ""
                    ? "bg-[#0a0a0f] text-[#f5f0eb] border-[#0a0a0f]"
                    : "bg-white text-[#8a7f78] border-[#e8e3dd] hover:border-[#0a0a0f]/20 hover:text-[#0a0a0f]"
                }`}
              >
                All
              </button>

              {(filtersData?.categories ?? []).map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? "" : cat)
                  }
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border transition-all duration-200 capitalize ${
                    activeCategory === cat
                      ? "bg-[#c8622a] text-white border-[#c8622a]"
                      : "bg-white text-[#8a7f78] border-[#e8e3dd] hover:border-[#c8622a]/40 hover:text-[#0a0a0f]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <HeroCarousel items={carousel} />

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              : products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
          </div>

          <div ref={observerRef} className="h-4" />

          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 size={16} className="animate-spin text-[#c8622a]" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
