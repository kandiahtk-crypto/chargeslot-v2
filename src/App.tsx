import { useState } from "react";

type Charger = {
id: number;
name: string;
address: string;
};

export default function App() {
const [city, setCity] = useState("");
const [chargers, setChargers] = useState<Charger[]>([]);
const [loading, setLoading] = useState(false);

const searchChargers = async () => {
if (!city.trim()) {
alert("Please enter a city");
return;
}

setLoading(true);

try {
const res = await fetch(
`https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&maxresults=10&compact=true&location=${encodeURIComponent(
city
)}`,
{
headers: {
"X-API-Key": "d22a7ea4-b4c5-4ece-9b31-57c15259a97b",
},
}
);

console.log("Status:", res.status);

if (!res.ok) {
throw new Error("Failed to fetch chargers");
}

const data = await res.json();
console.log("Data:", data);

const cleaned: Charger[] = (data || []).map((item: any, index: number) => ({
id: item.ID ?? index,
name: item.AddressInfo?.Title || "EV Charger",
address: item.AddressInfo?.AddressLine1 || "No address available",
}));

setChargers(cleaned);
} catch (err) {
console.error(err);
alert("Failed to load chargers");
} finally {
setLoading(false);
}
};

return (
<div style={styles.page}>
<div style={styles.shell}>
<div style={styles.hero}>
<div style={styles.heroBadge}>Smart EV Booking</div>
<h1 style={styles.heroTitle}>ChargeSlot ⚡</h1>
<p style={styles.heroText}>
Find EV chargers near you and reserve a slot in seconds.
</p>

<div style={styles.searchRow}>
<input
value={city}
onChange={(e) => setCity(e.target.value)}
placeholder="Enter city e.g. Hillingdon"
style={styles.searchInput}
/>
<button onClick={searchChargers} style={styles.searchButton}>
{loading ? "Searching..." : "Search"}
</button>
</div>
</div>

{chargers.length > 0 && (
<section>
<div style={styles.sectionHeader}>
<div>
<div style={styles.sectionEyebrow}>Results</div>
<h2 style={styles.sectionTitle}>Available Chargers</h2>
</div>
<div style={styles.resultCount}>{chargers.length}</div>
</div>

{chargers.map((charger) => (
<div key={charger.id} style={styles.card}>
<h3 style={styles.cardTitle}>{charger.name}</h3>
<p style={styles.cardSubtitle}>{charger.address}</p>
<button
style={styles.bookNowButton}
onClick={() =>
alert(`Booking coming next for ${charger.name}`)
}
>
Book now
</button>
</div>
))}
</section>
)}
</div>
</div>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background:
"linear-gradient(180deg, #0b1220 0%, #111827 20%, #eef2f7 20%, #eef2f7 100%)",
padding: "20px 12px 40px",
fontFamily:
'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
},
shell: {
maxWidth: "560px",
margin: "0 auto",
},
hero: {
background:
"radial-gradient(circle at top, rgba(249,115,22,0.18), transparent 28%), linear-gradient(135deg, #0f172a, #111827 70%)",
borderRadius: "28px",
padding: "24px",
color: "#fff",
boxShadow: "0 18px 40px rgba(15,23,42,0.28)",
marginBottom: "20px",
},
heroBadge: {
display: "inline-block",
padding: "8px 14px",
borderRadius: "999px",
border: "1px solid rgba(249,115,22,0.35)",
background: "rgba(249,115,22,0.08)",
color: "#fdba74",
fontSize: "13px",
fontWeight: 700,
marginBottom: "16px",
},
heroTitle: {
fontSize: "48px",
lineHeight: 1,
margin: "0 0 10px",
letterSpacing: "-0.04em",
fontWeight: 800,
},
heroText: {
margin: "0 0 20px",
color: "#cbd5e1",
fontSize: "17px",
lineHeight: 1.6,
},
searchRow: {
display: "flex",
gap: "10px",
},
searchInput: {
flex: 1,
padding: "14px 16px",
borderRadius: "16px",
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(255,255,255,0.06)",
color: "#fff",
fontSize: "16px",
outline: "none",
boxSizing: "border-box",
},
searchButton: {
padding: "14px 18px",
borderRadius: "16px",
border: "1px solid rgba(255,255,255,0.1)",
background: "#fff",
color: "#111827",
fontWeight: 800,
cursor: "pointer",
},
sectionHeader: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "14px",
},
sectionEyebrow: {
fontSize: "13px",
fontWeight: 700,
color: "#f97316",
textTransform: "uppercase",
letterSpacing: "0.08em",
},
sectionTitle: {
margin: "4px 0 0",
fontSize: "28px",
color: "#0f172a",
fontWeight: 800,
},
resultCount: {
minWidth: "40px",
height: "40px",
borderRadius: "999px",
background: "#fff7ed",
color: "#ea580c",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 800,
fontSize: "14px",
},
card: {
background: "#ffffff",
borderRadius: "24px",
padding: "18px",
marginBottom: "14px",
boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
border: "1px solid #edf2f7",
},
cardTitle: {
fontSize: "28px",
lineHeight: 1.1,
color: "#0f172a",
fontWeight: 800,
marginBottom: "8px",
letterSpacing: "-0.03em",
},
cardSubtitle: {
color: "#64748b",
fontSize: "17px",
lineHeight: 1.5,
marginBottom: "10px",
},
bookNowButton: {
width: "100%",
marginTop: "16px",
padding: "15px 16px",
borderRadius: "16px",
border: "none",
background: "#111827",
color: "#fff",
fontSize: "18px",
fontWeight: 800,
cursor: "pointer",
},
};


