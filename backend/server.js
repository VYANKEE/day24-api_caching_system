const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so our frontend can talk to this backend
app.use(cors());

// --- MOCK DATABASE ---
// In the real world, this would be MongoDB or PostgreSQL.
// We use a predefined dataset here.
const MOCK_DB_DATA = {
    id: 1,
    message: "This is heavy data fetched from the primary database.",
    stats: {
        users: 1050,
        active: 300,
        revenue: "$12,500"
    },
    lastUpdated: new Date().toISOString()
};

// --- CACHE LAYER (In-Memory) ---
// Ideally, you'd use Redis here. For this demo, we use a Javascript Object.
let cache = {
    data: null,
    expiry: null
};

const CACHE_TTL_SECONDS = 30; // Time-To-Live: 30 Seconds

// --- SIMULATED DATABASE CALL ---
// We use a Promise with setTimeout to simulate a slow DB query (2 seconds delay)
const fetchFromDatabase = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_DB_DATA);
        }, 2000); // 2000ms = 2 seconds delay
    });
};

// --- API ENDPOINT ---
app.get('/api/data', async (req, res) => {
    const startTime = Date.now();

    // 1. CHECK CACHE
    // Is there data? Is the current time LESS than the expiry time?
    if (cache.data && Date.now() < cache.expiry) {
        const endTime = Date.now();
        
        console.log(`[CACHE HIT] served in ${endTime - startTime}ms`);
        
        return res.json({
            data: cache.data,
            source: 'cache',
            responseTime: endTime - startTime, // How long server took
            expiryInfo: `Cache expires in ${Math.round((cache.expiry - Date.now()) / 1000)} seconds`
        });
    }

    // 2. CACHE MISS -> FETCH FROM DB
    console.log(`[CACHE MISS] Fetching from DB...`);
    
    const dbData = await fetchFromDatabase();

    // 3. UPDATE CACHE
    cache.data = dbData;
    cache.expiry = Date.now() + (CACHE_TTL_SECONDS * 1000);

    const endTime = Date.now();

    return res.json({
        data: dbData,
        source: 'database',
        responseTime: endTime - startTime,
        expiryInfo: `Fresh data cached for ${CACHE_TTL_SECONDS} seconds`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});