import { useMemo, useState } from "react";

type Charger = {
id: number;
name: string;
address: string;
};

type Screen = "search" | "confirm" | "success";

export default function App() {
const [city, setCity] = useState("");
const [chargers, setChargers] = useState<Charger[]>([]);
const [loading, setLoading] = useState(false);

const [screen, setScreen] = useState<Screen>("search");
const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
const [selectedDate, setSelectedDate] = useState(
new Date().toISOString().split("T")[0]
);
const [selectedTime, setSelectedTime] = useState("");

const bookingFee = 2.99;

const timeSlots = useMemo(
() => [
"09:00",
"09:30",
"10:00",
"10:30",
"11:00",
"11:30",
"12:00",
"12:30",
"13:00",
"13:30",
"14:00",
"14:30",
"15:00",
"15:30",
"16:00",
"16:30",
"17:00",
"17:30",
],
[]
);

const searchChargers = async () => {
if (!city.trim()) {
alert("Please enter a city");
return;
}

setLoading(true);

try {
const res = await fetch(
`https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&maxresults=10&compact=true&verbose=false&location=${encodeURIComponent(
city
)}`
);

if (!res.ok) {
throw new Error("Failed to fetch chargers");
}

const data = await res.json();

const cleaned: Charger[] = (data || []).map((item: any, index: number) => ({
id: item.ID ?? index,
name: item.AddressInfo?.Title || "EV Charger",
address: item.AddressInfo?.AddressLine1 || "No address available",
}));

setChargers(cleaned);
} catch (error) {
console.error(error);
alert("Failed to load chargers");
} finally {
setLoading(false);
}
};

const handleBookNow = (charger: Charger) => {
setSelectedCharger(charger);
setSelectedTime("");
setScreen("confirm");
};

const confirmBooking = async () => {
if (!selectedCharger) return;

if (!selectedDate || !selectedTime) {
alert("Please choose a date and time");
return;
}

setScreen("success");
};

const backToSearch = () => {
setScreen("search");
setSelectedCharger(null);
setSelectedTime("");
};

const renderSearchScreen = () => (
<>
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
placeholder="Enter city e.g. London"
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
onClick={() => handleBookNow(charger)}
style={styles.bookNowButton}
>
Book now
</button>
</div>
))}
</section>
)}
</>
);

const renderConfirmScreen = () => {
if (!selectedCharger) return null;

return (
<div style={styles.confirmWrap}>
<div style={styles.sectionEyebrow}>Booking</div>
<h2 style={styles.sectionTitle}>Confirm your reservation</h2>

<div style={styles.card}>
<h3 style={styles.cardTitle}>{selectedCharger.name}</h3>
<p style={styles.cardSubtitle}>{selectedCharger.address}</p>

<div style={{ marginTop: 20 }}>
<div style={styles.slotTitle}>Select date</div>
<input
type="date"
value={selectedDate}
onChange={(e) => setSelectedDate(e.target.value)}
style={styles.dateInput}
/>

<div style={styles.slotTitle}>Select time</div>
<div style={styles.slotGrid}>
{timeSlots.map((time) => (
<button
key={time}
onClick={() => setSelectedTime(time)}
style={{
...styles.slotButton,
border:
selectedTime === time
? "2px solid #ea7b35"
: "1px solid #ddd",
background: selectedTime === time ? "#fff7ed" : "#fff",
}}
>
{time}
</button>
))}
</div>
</div>

<div style={styles.summaryBox}>
<div style={styles.summaryRow}>
<span>Reservation fee</span>
<span>£{bookingFee.toFixed(2)}</span>
</div>
<div style={styles.summaryRow}>
<span>Date</span>
<span>{selectedDate}</span>
</div>
<div style={styles.summaryRow}>
<span>Time</span>
<span>{selectedTime || "Not selected"}</span>
</div>
<div style={styles.summaryRow}>
<span>Status</span>
<span>Pending confirmation</span>
</div>
</div>

<div style={styles.actionRow}>
<button onClick={backToSearch} style={styles.ghostButton}>
Back
</button>

<button onClick={confirmBooking} style={styles.bookNowButton}>
Confirm booking
</button>
</div>
</div>
</div>
);
};

const renderSuccessScreen = () => {
if (!selectedCharger) return null;

return (
<div style={styles.confirmWrap}>
<div style={styles.successCircle}>✓</div>
<div style={styles.sectionEyebrow}>Success</div>
<h2 style={styles.sectionTitle}>Booking confirmed</h2>
<p style={styles.heroText}>
Your charging reservation has been created successfully.
</p>

<div style={styles.card}>
<h3 style={styles.cardTitle}>{selectedCharger.name}</h3>
<p style={styles.cardSubtitle}>{selectedCharger.address}</p>

<div style={styles.summaryBox}>
<div style={styles.summaryRow}>
<span>Reservation fee</span>
<span>£{bookingFee.toFixed(2)}</span>
</div>
<div style={styles.summaryRow}>
<span>Date</span>
<span>{selectedDate}</span>
</div>
<div style={styles.summaryRow}>
<span>Time slot</span>
<span>{selectedTime}</span>
</div>
<div style={styles.summaryRow}>
<span>Status</span>
<span>Confirmed</span>
</div>
</div>

<button onClick={backToSearch} style={styles.bookNowButton}>
Back to chargers
</button>
</div>
</div>
);
};

return (
<div style={styles.page}>
<div style={styles.shell}>
{screen === "search" && renderSearchScreen()}
{screen === "confirm" && renderConfirmScreen()}
{screen === "success" && renderSuccessScreen()}
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
confirmWrap: {
background: "#ffffff",
borderRadius: "28px",
padding: "24px",
boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
},
slotTitle: {
fontWeight: 800,
marginBottom: "10px",
color: "#111827",
fontSize: "16px",
},
slotGrid: {
display: "flex",
gap: "10px",
flexWrap: "wrap",
},
slotButton: {
padding: "10px 14px",
borderRadius: "12px",
fontWeight: 700,
background: "#fff",
cursor: "pointer",
},
dateInput: {
width: "100%",
padding: "12px 14px",
borderRadius: "12px",
border: "1px solid #ddd",
fontSize: "16px",
boxSizing: "border-box",
marginBottom: "14px",
},
summaryBox: {
marginTop: "18px",
borderTop: "1px solid #e5e7eb",
paddingTop: "14px",
},
summaryRow: {
display: "flex",
justifyContent: "space-between",
gap: "12px",
padding: "8px 0",
color: "#334155",
fontSize: "16px",
fontWeight: 600,
},
actionRow: {
display: "flex",
gap: "10px",
flexWrap: "wrap",
marginTop: "18px",
},
ghostButton: {
flex: 1,
minWidth: "150px",
padding: "14px 16px",
borderRadius: "16px",
border: "1px solid #dbe2ea",
background: "#fff",
color: "#111827",
fontWeight: 800,
cursor: "pointer",
},
successCircle: {
width: "72px",
height: "72px",
borderRadius: "999px",
background: "#16a34a",
color: "#fff",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "34px",
fontWeight: 900,
marginBottom: "16px",
boxShadow: "0 12px 24px rgba(22,163,74,0.22)",
},
};
