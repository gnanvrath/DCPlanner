import React, { useMemo, useState } from "react";

// ——————————— Types ———————————
type Category = "Art" | "Science" | "History" | "Other";

type Museum = {
  id: string;
  name: string;
  org: string; // Smithsonian, National Gallery of Art, Independent, etc.
  category: Category;
  neighborhood: string; // National Mall, Penn Quarter, Dupont, etc.
  free: boolean;
  timedEntry?: boolean; // requires/uses timed passes
  kidFriendly?: boolean;
  accessibility?: { wheelchair: boolean; captioning?: boolean };
  website?: string;
  booking?: string; // booking or timed-pass link
  address?: string;
  metro?: string;
  hours?: string; // simple human-readable
  description?: string;
  tags?: string[];
};

// ——————————— Seed data (editable) ———————————
const MUSEUMS: Museum[] = [
  {
    id: "nasm-mall",
    name: "National Air and Space Museum (Mall)",
    org: "Smithsonian",
    category: "Science",
    neighborhood: "National Mall",
    free: true,
    timedEntry: true,
    kidFriendly: true,
    accessibility: { wheelchair: true },
    website: "https://airandspace.si.edu/",
    booking: "https://airandspace.si.edu/visit/museum-dc/timed-entry-passes",
    address: "600 Independence Ave SW, Washington, DC 20560",
    metro: "L'Enfant Plaza",
    hours: "10am–5:30pm (check site)",
    description:
      "Iconic spacecraft, aviation history, Apollo artifacts. Timed entry frequently required.",
    tags: ["space", "aircraft", "apollo", "family"]
  },
  {
    id: "nmah",
    name: "National Museum of American History",
    org: "Smithsonian",
    category: "History",
    neighborhood: "National Mall",
    free: true,
    kidFriendly: true,
    accessibility: { wheelchair: true },
    website: "https://americanhistory.si.edu/",
    address: "1300 Constitution Ave NW, Washington, DC 20560",
    metro: "Smithsonian",
    hours: "10am–5:30pm (check site)",
    description:
      "From the Star‑Spangled Banner to pop culture, a walk through how the U.S. was made.",
    tags: ["american", "flag", "transport", "inventions"]
  },
  {
    id: "nmnh",
    name: "National Museum of Natural History",
    org: "Smithsonian",
    category: "Science",
    neighborhood: "National Mall",
    free: true,
    kidFriendly: true,
    accessibility: { wheelchair: true },
    website: "https://naturalhistory.si.edu/",
    address: "10th St. & Constitution Ave. NW, Washington, DC 20560",
    metro: "Smithsonian",
    hours: "10am–5:30pm (check site)",
    description:
      "Dinosaurs, gems (Hi, Hope Diamond), oceans, and nature in all its dazzling forms.",
    tags: ["dinosaurs", "gems", "ocean", "family"]
  },
  {
    id: "nmaahc",
    name: "National Museum of African American History and Culture",
    org: "Smithsonian",
    category: "History",
    neighborhood: "National Mall",
    free: true,
    timedEntry: true,
    accessibility: { wheelchair: true },
    website: "https://nmaahc.si.edu/",
    booking: "https://nmaahc.si.edu/visit/passes",
    address: "1400 Constitution Ave NW, Washington, DC 20560",
    metro: "Smithsonian",
    hours: "10am–5:30pm (check site)",
    description:
      "Powerful, layered storytelling of African American life, history, and culture.",
    tags: ["civil rights", "culture", "identity"]
  },
  {
    id: "hirshhorn",
    name: "Hirshhorn Museum and Sculpture Garden",
    org: "Smithsonian",
    category: "Art",
    neighborhood: "National Mall",
    free: true,
    accessibility: { wheelchair: true },
    website: "https://hirshhorn.si.edu/",
    address: "Independence Ave SW & 7th St SW, Washington, DC 20560",
    metro: "L'Enfant Plaza",
    hours: "10am–5:30pm (check site)",
    description:
      "Modern & contemporary art in a striking round museum; outdoor sculpture garden is a gem.",
    tags: ["modern", "contemporary", "sculpture"]
  },
  {
    id: "freer-sackler",
    name: "National Museum of Asian Art (Freer & Sackler)",
    org: "Smithsonian",
    category: "Art",
    neighborhood: "National Mall",
    free: true,
    accessibility: { wheelchair: true },
    website: "https://asia.si.edu/",
    address: "1050 Independence Ave SW, Washington, DC 20560",
    metro: "Smithsonian",
    hours: "10am–5:30pm (check site)",
    description:
      "Masterworks from across Asia, from ancient to modern, in beautifully calm galleries.",
    tags: ["asia", "freer", "sackler"]
  },
  {
    id: "nga-west",
    name: "National Gallery of Art (West & East Buildings)",
    org: "National Gallery of Art",
    category: "Art",
    neighborhood: "National Mall",
    free: true,
    accessibility: { wheelchair: true },
    website: "https://www.nga.gov/",
    address: "Constitution Ave NW, Washington, DC 20565",
    metro: "Archives–Navy Mem'l / Smithsonian",
    hours: "10am–5pm (check site)",
    description:
      "One of the country’s premier art museums—Old Masters to modern, plus a famous sculpture garden.",
    tags: ["paintings", "sculpture", "gardens"]
  },
  {
    id: "saam-npg",
    name: "Smithsonian American Art Museum & National Portrait Gallery",
    org: "Smithsonian",
    category: "Art",
    neighborhood: "Penn Quarter",
    free: true,
    accessibility: { wheelchair: true },
    website: "https://americanart.si.edu/",
    address: "8th and G Streets, NW, Washington, DC 20001",
    metro: "Gallery Place–Chinatown",
    hours: "11:30am–7pm (check site)",
    description:
      "Two museums in one gorgeous building; portrait hall includes U.S. presidents.",
    tags: ["portraits", "presidents", "american art"]
  },
  {
    id: "renwick",
    name: "Renwick Gallery",
    org: "Smithsonian",
    category: "Art",
    neighborhood: "Downtown",
    free: true,
    accessibility: { wheelchair: true },
    website: "https://americanart.si.edu/visit/renwick",
    address: "Pennsylvania Ave at 17th St NW, Washington, DC 20006",
    metro: "Farragut West/North",
    hours: "10am–5:30pm (check site)",
    description:
      "Contemporary craft and wonder-filled installations steps from the White House.",
    tags: ["craft", "installation", "contemporary"]
  },
  {
    id: "holocaust",
    name: "United States Holocaust Memorial Museum",
    org: "Independent (Federal charter)",
    category: "History",
    neighborhood: "National Mall",
    free: true,
    timedEntry: true,
    accessibility: { wheelchair: true },
    website: "https://www.ushmm.org/",
    booking: "https://www.ushmm.org/visit",
    address: "100 Raoul Wallenberg Pl SW, Washington, DC 20024",
    metro: "Smithsonian / L'Enfant Plaza",
    hours: "10am–5:30pm (check site)",
    description:
      "Essential and sobering. Timed passes generally required for the Permanent Exhibition.",
    tags: ["history", "wwii", "memorial"]
  },
  {
    id: "spy",
    name: "International Spy Museum",
    org: "Independent",
    category: "History",
    neighborhood: "L'Enfant Plaza / Wharf",
    free: false,
    kidFriendly: true,
    accessibility: { wheelchair: true },
    website: "https://www.spymuseum.org/",
    booking: "https://www.spymuseum.org/plan-your-visit/tickets/",
    address: "700 L'Enfant Plaza SW, Washington, DC 20024",
    metro: "L'Enfant Plaza",
    hours: "10am–6pm (check site)",
    description:
      "Hands-on espionage fun with gadgets, history, and code-breaking. Paid admission.",
    tags: ["espionage", "gadgets", "family"]
  },
  {
    id: "planet-word",
    name: "Planet Word",
    org: "Independent",
    category: "Other",
    neighborhood: "Downtown / Franklin Park",
    free: true,
    timedEntry: true,
    kidFriendly: true,
    accessibility: { wheelchair: true },
    website: "https://planetwordmuseum.org/",
    booking: "https://planetwordmuseum.org/visit/",
    address: "925 13th St NW, Washington, DC 20005",
    metro: "McPherson Square",
    hours: "10am–5pm (check site)",
    description:
      "Interactive museum dedicated to the power, fun, and beauty of language.",
    tags: ["language", "interactive", "family"]
  },
  {
    id: "phillips",
    name: "The Phillips Collection",
    org: "Independent",
    category: "Art",
    neighborhood: "Dupont Circle",
    free: false,
    accessibility: { wheelchair: true },
    website: "https://www.phillipscollection.org/",
    address: "1600 21st St NW, Washington, DC 20009",
    metro: "Dupont Circle",
    hours: "10am–5pm (check site)",
    description:
      "America’s first modern art museum—Rothko Room, Renoir’s Luncheon of the Boating Party.",
    tags: ["modern", "impressionism", "rothko"]
  },
  {
    id: "women-arts",
    name: "National Museum of Women in the Arts",
    org: "Independent",
    category: "Art",
    neighborhood: "Downtown",
    free: false,
    accessibility: { wheelchair: true },
    website: "https://nmwa.org/",
    address: "1250 New York Ave NW, Washington, DC 20005",
    metro: "Metro Center",
    hours: "10am–5pm (check site)",
    description:
      "Championing art by women—collection, exhibitions, and a grand Beaux-Arts building.",
    tags: ["women", "collection", "exhibitions"]
  },
  {
    id: "building-museum",
    name: "National Building Museum",
    org: "Independent",
    category: "Other",
    neighborhood: "Judiciary Square",
    free: false,
    accessibility: { wheelchair: true },
    website: "https://www.nbm.org/",
    address: "401 F St NW, Washington, DC 20001",
    metro: "Judiciary Square",
    hours: "10am–4pm (check site)",
    description:
      "Architecture, engineering, design—and a jaw‑dropping Great Hall.",
    tags: ["architecture", "design", "family"]
  },
  {
    id: "artechouse",
    name: "ARTECHOUSE DC",
    org: "Independent",
    category: "Other",
    neighborhood: "Southwest / Wharf",
    free: false,
    timedEntry: true,
    accessibility: { wheelchair: true },
    website: "https://www.artechouse.com/location/dc/",
    booking: "https://tickets.artechouse.com/",
    address: "1238 Maryland Ave SW, Washington, DC 20024",
    metro: "Smithsonian / L'Enfant Plaza",
    hours: "Varies by exhibition (check site)",
    description:
      "Immersive, tech‑driven art shows—great for photos and sensory play.",
    tags: ["immersive", "digital", "projection"]
  },
  {
    id: "postalmuseum",
    name: "Smithsonian National Postal Museum",
    org: "Smithsonian",
    category: "History",
    neighborhood: "Near Union Station",
    free: true,
    accessibility: { wheelchair: true },
    website: "https://postalmuseum.si.edu/",
    address: "2 Massachusetts Ave NE, Washington, DC 20002",
    metro: "Union Station",
    hours: "10am–5:30pm (check site)",
    description:
      "Surprisingly delightful deep dive into mail, stamps, and moving a nation’s letters.",
    tags: ["stamps", "trains", "mail"]
  },
  {
    id: "museum-bible",
    name: "Museum of the Bible",
    org: "Independent",
    category: "History",
    neighborhood: "Southwest / Federal Center",
    free: false,
    accessibility: { wheelchair: true },
    website: "https://www.museumofthebible.org/",
    address: "400 4th St SW, Washington, DC 20024",
    metro: "Federal Center SW",
    hours: "10am–5pm (check site)",
    description:
      "Expansive look at the history and impact of the Bible. Paid admission.",
    tags: ["history", "religion", "scrolls"]
  }
];

// ——————————— Helpers ———————————
const CATEGORIES: Category[] = ["Art", "Science", "History", "Other"];

function classNames(...xs: (string | false | undefined | null)[]) {
  return xs.filter(Boolean).join(" ");
}

// Build a Google Maps multi-stop link from addresses
function mapsRouteLink(addresses: string[]): string | null {
  const clean = addresses
    .filter((a) => (a ?? "").toString().trim().length > 0)
    .map((a) => a.toString().trim());
  if (!clean.length) return null;
  // If only one stop, open a search link; with 2+ stops, build a route
  if (clean.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clean[0])}`;
  }
  const [origin, ...rest] = clean;
  const destination = rest.pop()!;
  const base = "https://www.google.com/maps/dir/?api=1";
  const params = new URLSearchParams({
    origin,
    destination,
    travelmode: "walking",
  });
  if (rest.length) params.set("waypoints", rest.join("|"));
  return `${base}&${params.toString()}`;
}

// ——————————— Component ———————————
export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyTimed, setOnlyTimed] = useState(false);
  const [kidFriendly, setKidFriendly] = useState(false);
  const [neighborhood, setNeighborhood] = useState("All");
  const [sortBy, setSortBy] = useState<"Relevance" | "A-Z" | "Neighborhood">(
    "Relevance"
  );
  const [planIds, setPlanIds] = useState<string[]>([]);

  // Compute neighborhoods for filter
  const neighborhoods = useMemo(() => {
    const set = new Set(MUSEUMS.map((m) => m.neighborhood));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    let items = MUSEUMS.slice();

    // Category
    if (category !== "All") items = items.filter((m) => m.category === category);

    // Neighborhood
    if (neighborhood !== "All")
      items = items.filter((m) => m.neighborhood === neighborhood);

    // Toggles
    if (onlyFree) items = items.filter((m) => m.free);
    if (onlyTimed) items = items.filter((m) => m.timedEntry);
    if (kidFriendly) items = items.filter((m) => m.kidFriendly);

    // Search
    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter((m) => {
        const hay = [
          m.name,
          m.org,
          m.neighborhood,
          m.description ?? "",
          ...(m.tags ?? [])
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    // Sort
    if (sortBy === "A-Z") items.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Neighborhood")
      items.sort((a, b) => a.neighborhood.localeCompare(b.neighborhood));

    return items;
  }, [category, neighborhood, onlyFree, onlyTimed, kidFriendly, query, sortBy]);

  const plannedMuseums = useMemo(
    () => planIds.map((id) => MUSEUMS.find((m) => m.id === id)!).filter(Boolean),
    [planIds]
  );

  const routeLink = useMemo(
    () => mapsRouteLink(plannedMuseums.map((m) => m.address || m.name)),
    [plannedMuseums]
  );

  function togglePlan(id: string) {
    setPlanIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function clearPlan() {
    setPlanIds([]);
  }

  // Preset itineraries (edit these to taste)
  const presets = [
    {
      key: "mall-classics",
      name: "Mall Classics (1 day)",
      ids: ["nmnh", "nmah", "nga-west", "hirshhorn"],
      note: "Natural & American History, National Gallery, and Hirshhorn—easy walking."
    },
    {
      key: "art-lover",
      name: "Art Lover Loop",
      ids: ["nga-west", "hirshhorn", "freer-sackler", "saam-npg", "renwick"],
      note: "National Gallery to Hirshhorn & Asian Art, then Penn Quarter to Renwick."
    },
    {
      key: "kids-wow",
      name: "Kids Wow Day",
      ids: ["nmnh", "nasm-mall", "planet-word", "spy"],
      note: "Dinos & space, then interactive language and spy gadgets."
    }
  ];

  function applyPreset(ids: string[]) {
    setPlanIds(ids);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header / Hero */}
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-900/40">🏛️</div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold leading-tight">DC Museums Planner</h1>
            <p className="text-slate-400 text-xs md:text-sm -mt-0.5">Find what to see • Build a route • Breeze the Mall like a pro</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">Art</span>
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">Science</span>
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">History</span>
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">Other</span>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-5">
        <div className="grid md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, org, neighborhood, tags…"
                className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">⌘K</span>
            </div>
          </div>

          {/* Category */}
          <div className="md:col-span-3 flex gap-2">
            {(["All", ...CATEGORIES] as (Category | "All")[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={classNames(
                  "px-3 py-2 rounded-xl border text-sm",
                  category === c
                    ? "bg-indigo-500 border-indigo-400 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
            >
              <option>Relevance</option>
              <option>A-Z</option>
              <option>Neighborhood</option>
            </select>
          </div>

          {/* Neighborhood */}
          <div className="md:col-span-2">
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
            >
              {neighborhoods.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <label className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
            />
            <span>Free only</span>
          </label>
          <label className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <input
              type="checkbox"
              checked={onlyTimed}
              onChange={(e) => setOnlyTimed(e.target.checked)}
            />
            <span>Requires timed entry</span>
          </label>
          <label className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <input
              type="checkbox"
              checked={kidFriendly}
              onChange={(e) => setKidFriendly(e.target.checked)}
            />
            <span>Kid‑friendly</span>
          </label>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-28 grid md:grid-cols-12 gap-6">
        {/* Results */}
        <section className="md:col-span-8 lg:col-span-9">
          <div className="text-slate-400 text-sm mb-2">
            Showing <span className="text-slate-200">{filtered.length}</span> of {MUSEUMS.length}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => {
              const inPlan = planIds.includes(m.id);
              return (
                <article
                  key={m.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition shadow-sm"
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold leading-tight text-slate-100">
                          {m.name}
                        </h3>
                        <div className="text-xs text-slate-400">{m.org} • {m.neighborhood}</div>
                      </div>
                      <span
                        className={classNames(
                          "text-[11px] px-2 py-1 rounded-full border",
                          m.category === "Art" && "border-pink-400 text-pink-300",
                          m.category === "Science" && "border-cyan-400 text-cyan-300",
                          m.category === "History" && "border-amber-400 text-amber-300",
                          m.category === "Other" && "border-lime-400 text-lime-300"
                        )}
                      >
                        {m.category}
                      </span>
                    </div>
                    {m.description && (
                      <p className="text-sm text-slate-300 line-clamp-3">{m.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className={classNames("px-2 py-1 rounded-full border", m.free ? "border-emerald-400 text-emerald-300" : "border-slate-700 text-slate-400")}>{m.free ? "Free" : "Paid"}</span>
                      {m.timedEntry && (
                        <span className="px-2 py-1 rounded-full border border-sky-400 text-sky-300">Timed Entry</span>
                      )}
                      {m.kidFriendly && (
                        <span className="px-2 py-1 rounded-full border border-fuchsia-400 text-fuchsia-300">Kid‑friendly</span>
                      )}
                      {m.accessibility?.wheelchair && (
                        <span className="px-2 py-1 rounded-full border border-indigo-400 text-indigo-300">Wheelchair</span>
                      )}
                    </div>

                    {m.hours && (
                      <div className="text-xs text-slate-400">Hours: {m.hours}</div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-1">
                      {m.website && (
                        <a
                          href={m.website}
                          target="_blank"
                          className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500"
                        >
                          Website ↗
                        </a>
                      )}
                      {m.booking && (
                        <a
                          href={m.booking}
                          target="_blank"
                          className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500"
                        >
                          Book/Passes ↗
                        </a>
                      )}
                      {m.address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address)}`}
                          target="_blank"
                          className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500"
                        >
                          Map ↗
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        onClick={() => togglePlan(m.id)}
                        className={classNames(
                          "text-xs px-3 py-1.5 rounded-xl border",
                          inPlan
                            ? "border-emerald-500 text-emerald-300 bg-emerald-500/10"
                            : "border-slate-700 text-slate-300 hover:border-slate-500"
                        )}
                      >
                        {inPlan ? "Added to Plan" : "Add to Plan"}
                      </button>
                      <div className="text-xs text-slate-500 truncate max-w-[55%]">
                        {m.metro && <>🚇 {m.metro}</>}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Planner */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Your Plan</h2>
                {planIds.length > 0 && (
                  <button
                    onClick={clearPlan}
                    className="text-xs px-2 py-1 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500"
                  >
                    Clear
                  </button>
                )}
              </div>

              {plannedMuseums.length === 0 ? (
                <p className="text-slate-400 text-sm mt-2">
                  Add museums to build a route. Tip: keep things walkable by grouping the
                  <span className="text-slate-200"> National Mall</span> picks together.
                </p>
              ) : (
                <ol className="mt-3 space-y-2">
                  {plannedMuseums.map((m, i) => (
                    <li
                      key={m.id}
                      className="flex items-start gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-2"
                    >
                      <div className="mt-0.5 text-xs text-slate-500 w-6">{i + 1}.</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-100">{m.name}</div>
                        <div className="text-xs text-slate-400">{m.neighborhood} • {m.category}</div>
                      </div>
                      <button
                        onClick={() => togglePlan(m.id)}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={routeLink ?? "#"}
                  target={routeLink ? "_blank" : undefined}
                  rel={routeLink ? "noopener noreferrer" : undefined}
                  className={classNames(
                    "text-sm px-3 py-2 rounded-xl text-center",
                    routeLink
                      ? "bg-emerald-500/90 hover:bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {routeLink ? "Open route in Google Maps" : "Add at least one stop"}
                </a>
                <details className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-sm text-slate-300">
                  <summary className="cursor-pointer select-none">Share / Save</summary>
                  <p className="mt-2 text-slate-400">
                    Copy this plan as IDs (for now). In a real build, we’d sync to the URL or cloud.
                  </p>
                  <div className="mt-2 font-mono text-xs break-all bg-slate-900 rounded p-2 border border-slate-800">
                    {JSON.stringify(planIds)}
                  </div>
                </details>
              </div>
            </div>

            {/* Presets */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 mt-4">
              <h3 className="font-semibold mb-2">Suggested Itineraries</h3>
              <ul className="space-y-2">
                {presets.map((p) => (
                  <li key={p.key} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.note}</div>
                    <button
                      onClick={() => applyPreset(p.ids)}
                      className="mt-2 text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500"
                    >
                      Use this plan
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-xs text-slate-400">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 justify-between">
            <p>
              Built for DC explorers. Data is illustrative—always check the official site for hours and passes.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://washington.org/"
                target="_blank"
                className="px-2 py-1 rounded-lg border border-slate-800 hover:border-slate-600"
              >
                washington.org ↗
              </a>
              <a
                href="https://www.si.edu/visit"
                target="_blank"
                className="px-2 py-1 rounded-lg border border-slate-800 hover:border-slate-600"
              >
                Smithsonian Visit ↗
              </a>
              <a
                href="https://www.nga.gov/visit.html"
                target="_blank"
                className="px-2 py-1 rounded-lg border border-slate-800 hover:border-slate-600"
              >
                National Gallery Visit ↗
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
