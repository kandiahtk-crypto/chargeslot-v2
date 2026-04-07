import { useState } from "react";

export default function App() {
const [city, setCity] = useState("");
const [chargers, setChargers] = useState<any[]>([]);
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

if (!res.ok) {
throw new Error("Failed to fetch chargers");
}

const data = await res.json();
setChargers(data);
} catch (err) {
console.error(err);
alert("Failed to load chargers");
} finally {
setLoading(false);
}
};

return (
<div
style={{
minHeight: "100vh",
background: "#0b1120",
color: "#fff",
padding: "40px",
fontFamily: "sans-serif",
}}
>
<h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
ChargeSlot ⚡
</h1>

<p style={{ marginBottom: "30px", color: "#ccc" }}>
Find EV chargers near you
</p>

<div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
<input
type="text"
placeholder="Enter city..."
value={city}
onChange={(e) => setCity(e.target.value)}
style={{
padding: "12px",
borderRadius: "10px",
border: "none",
width: "250px",
}}
/>

<button
onClick={searchChargers}
style={{
padding: "12px 20px",
borderRadius: "10px",
border: "none",
background: "#22c55e",
color: "#fff",
fontWeight: "bold",
cursor: "pointer",
}}
>
{loading ? "Searching..." : "Search"}
</button>
</div>

{/* Results */}
<div>
{chargers.length === 0 && !loading && (
<p style={{ color: "#888" }}>No results yet</p>
)}

{chargers.map((charger, index) => (
<div
key={index}
style={{
background: "#111827",
padding: "15px",
borderRadius: "12px",
marginBottom: "10px",
}}
>
<h3>
{charger.AddressInfo?.Title || "Unknown Location"}
</h3>
<p style={{ color: "#ccc" }}>
{charger.AddressInfo?.AddressLine1}
</p>
</div>
))}
</div>
</div>
);
}
