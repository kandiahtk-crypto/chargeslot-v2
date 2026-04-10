import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_ANON_KEY
);

app.get("/", (_req, res) => {
res.json({ ok: true, message: "ChargeSlot API running" });
});

app.get("/api/chargers", async (req, res) => {
const city = String(req.query.city || "").trim();

if (!city) {
return res.status(400).json({ error: "City is required" });
}

try {
const geoRes = await fetch(
`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
`${city}, UK`
)}`,
{
headers: { "User-Agent": "ChargeSlot/1.0" }
}
);

if (!geoRes.ok) {
return res.status(500).json({ error: "Failed to geocode city" });
}

const geoData = await geoRes.json();

if (!geoData?.length) {
return res.status(404).json({ error: "City not found" });
}

const lat = Number(geoData[0].lat);
const lon = Number(geoData[0].lon);

const ocmRes = await fetch(
`https://api.openchargemap.io/v3/poi/?output=json&maxresults=20&compact=true&verbose=false&latitude=${lat}&longitude=${lon}&distance=8&distanceunit=KM`,
{
headers: {
"X-API-Key": process.env.OCM_API_KEY
}
}
);

if (!ocmRes.ok) {
return res.status(500).json({ error: "Failed to fetch chargers" });
}

const data = await ocmRes.json();

const chargers = (data || []).map((item, index) => ({
id: item.ID ?? index,
charger_name: item.AddressInfo?.Title || "EV Charger",
charger_address:
item.AddressInfo?.AddressLine1 ||
item.AddressInfo?.Town ||
"No address available",
lat: item.AddressInfo?.Latitude ?? null,
lng: item.AddressInfo?.Longitude ?? null
}));

res.json({ city, chargers });
} catch (err) {
console.error(err);
res.status(500).json({ error: "Failed to fetch chargers" });
}
});

app.post("/api/book", async (req, res) => {
const { charger_name, booking_date, booking_time } = req.body;

const { data, error } = await supabase
.from("bookings")
.insert([{ charger_name, booking_date, booking_time }])
.select();

if (error) {
return res.status(400).json(error);
}

res.json(data);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
console.log(`API running on http://localhost:${PORT}`);
});

