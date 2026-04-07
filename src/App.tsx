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
// 1. Get coordinates from city name
const geoRes = await fetch(
`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
city + ", UK"
)}`
);

if (!geoRes.ok) {
throw new Error("Failed to find city");
}

const geoData = await geoRes.json();

if (!geoData || geoData.length === 0) {
throw new Error("City not found");
}

const lat = geoData[0].lat;
const lon = geoData[0].lon;

// 2. Search chargers near that location
const res = await fetch(
`https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&maxresults=20&compact=true&verbose=false&latitude=${lat}&longitude=${lon}&distance=15&distanceunit=KM`,
{
headers: {
"X-API-Key": "d22a7ea4-b4c5-4ece-9b31-57c15259a97b",
},
}
);

if (!res.ok) {
throw new Error("Failed to fetch chargers");
}

const data = await res.json();

const cleaned: Charger[] = (data || []).map((item: any, index: number) => ({
id: item.ID ?? index,
name: item.AddressInfo?.Title || "EV Charger",
address:
item.AddressInfo?.AddressLine1 ||
item.AddressInfo?.Town ||
"No address available",
}));

setChargers(cleaned);
} catch (err) {
console.error(err);
alert("Failed to load chargers");
setChargers([]);
} finally {
setLoading(false);
}
};

return (
<div
style={{
minHeight: "100vh",
background:
"linear-gradient(180deg, #0b1220 0%, #111827 20%, #eef2f7 20%, #eef2f7 100%)",
padding: "20px 12px 40px",
fontFamily:
'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}}
>
<div style={{ maxWidth: "560px", margin: "0 auto" }}>
<div
style={{
background:
"radial-gradient(circle at top, rgba(249,115,22,0.18), transparent 28%), linear-gradient(135deg, #0f172a, #111827 70%)",
borderRadius: "28px",
padding: "24px",
color: "#fff",
boxShadow: "0 18px 40px rgba(15,23,42,0.28)",
marginBottom: "20px",
}}
>
<div
style={{
display: "inline-block",
padding: "8px 14px",
borderRadius: "999px",
border: "1px solid rgba(249,115,22,0.35)",
background: "rgba(249,115,22,0.08)",
color: "#fdba74",
fontSize: "13px",
fontWeight: 700,
marginBottom: "16px",
}}
>
Smart EV Booking
</div>

<h1
style={{
fontSize: "48px",
lineHeight: 1,
margin: "0 0 10px",
letterSpacing: "-0.04em",
fontWeight: 800,
}}
>
ChargeSlot ⚡
</h1>

<p
style={{
margin: "0 0 20px",
color: "#cbd5e1",
fontSize: "17px",
lineHeight: 1.6,
}}
>
Find EV chargers near you and reserve a slot in seconds.
</p>

<div style={{ display: "flex", gap: "10px" }}>
<input
value={city}
onChange={(e) => setCity(e.target.value)}
placeholder="Enter city e.g. London"
style={{
flex: 1,
padding: "14px 16px",
borderRadius: "16px",
border: "1px solid rgba(255,255,255,0.12)",
background: "rgba(255,255,255,0.06)",
color: "#fff",
fontSize: "16px",
outline: "none",
boxSizing: "border-box",
}}
/>
<button
onClick={searchChargers}
style={{
padding: "14px 18px",
borderRadius: "16px",
border: "1px solid rgba(255,255,255,0.1)",
background: "#fff",
color: "#111827",
fontWeight: 800,
cursor: "pointer",
}}
>
{loading ? "Searching..." : "Search"}
</button>
</div>
</div>

{chargers.length > 0 && (
<section>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "14px",
}}
>
<div>
<div
style={{
fontSize: "13px",
fontWeight: 700,
color: "#f97316",
textTransform: "uppercase",
letterSpacing: "0.08em",
}}
>
Results
</div>
<h2
style={{
margin: "4px 0 0",
fontSize: "28px",
color: "#0f172a",
fontWeight: 800,
}}
>
Available Chargers
</h2>
</div>

<div
style={{
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
}}
>
{chargers.length}
</div>
</div>

{chargers.map((charger) => (
<div
key={charger.id}
style={{
background: "#ffffff",
borderRadius: "24px",
padding: "18px",
marginBottom: "14px",
boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
border: "1px solid #edf2f7",
}}
>
<h3
style={{
fontSize: "28px",
lineHeight: 1.1,
color: "#0f172a",
fontWeight: 800,
marginBottom: "8px",
letterSpacing: "-0.03em",
}}
>
{charger.name}
</h3>

<p
style={{
color: "#64748b",
fontSize: "17px",
lineHeight: 1.5,
marginBottom: "10px",
}}
>
{charger.address}
</p>

<button
onClick={() => alert(`Booking coming next for ${charger.name}`)}
style={{
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
}}
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
