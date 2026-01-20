import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [logs, setLogs] = useState([]);

  // Change to your backend URL
  const API_URL = 'https://day24-api-caching-system.onrender.com/api/data';

  const fetchData = async () => {
    setLoading(true);
    const start = Date.now();
    
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const end = Date.now();
      
      const totalTime = end - start;
      
      setResponse({ ...data, totalTime });
      
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] Request finished in ${totalTime}ms via ${data.source.toUpperCase()}`, ...prev]);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Ensure backend is running on port 5000!");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      
      {/* 1. HERO SECTION */}
      <section>
        <h1>API Caching System</h1>
        <p>Reduce load. Improve performance. <br/> A demonstration for developers.</p>
        <button className="btn" onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth'})}>
          Start Demo
        </button>
      </section>

      {/* 2. LIVE DEMO SECTION */}
      <section id="demo">
        <h2>Live Interaction</h2>
        <p>Click below. Notice the difference between the <strong>First Click</strong> (Database) and <strong>Next Clicks</strong> (Cache).</p>
        
        <button className="btn" onClick={fetchData} disabled={loading}>
          {loading ? "FETCHING DATA..." : "CALL API ENDPOINT"}
        </button>

        {/* Visualizing the Response */}
        <div className="terminal">
          <div className="terminal-header">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <span style={{marginLeft: '10px', fontSize: '0.8rem', color: '#8b949e'}}>server_response.json</span>
          </div>
          <div className="json-output">
            {response ? (
              <>
                <div style={{marginBottom: '10px'}}>
                    <strong>Source:</strong> 
                    <span className={response.source === 'cache' ? 'status cache' : 'status database'}>
                        {response.source.toUpperCase()}
                    </span>
                    {response.source === 'cache' ? " (⚡ Instant)" : " (🐢 Slow)"}
                </div>
                
                <div><strong>Server Processing Time:</strong> {response.responseTime}ms</div>
                <div><strong>Total Round Trip:</strong> {response.totalTime}ms</div>
                
                <hr style={{borderColor: '#333', margin: '15px 0'}}/>
                
                <div style={{color: '#8b949e'}}>// Data returned from server:</div>
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
                
                <div style={{marginTop: '15px', color: response.source === 'cache' ? '#27c93f' : '#ffbd2e', fontStyle: 'italic'}}>
                   ℹ️ {response.expiryInfo}
                </div>
              </>
            ) : (
              <div style={{color: '#666'}}>// Waiting for you to click the button...</div>
            )}
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: WHY WE NEED THIS */}
      <section>
        <h2>Why Do We Need Caching?</h2>
        <p>Imagine 1 Million users visit Amazon during a sale. If every user queries the database directly, the site crashes.</p>
        
        <div className="grid">
            <div className="card">
                <h3>🚀 Speed</h3>
                <p>Retrieving data from RAM (Cache) takes <strong>nanoseconds</strong>. Reading from a Disk (Database) takes <strong>milliseconds</strong>. Caching is 1000x faster.</p>
            </div>
            <div className="card">
                <h3>🛡️ Protection</h3>
                <p>It protects your main database from being overwhelmed by traffic spikes. It acts as a shield.</p>
            </div>
            <div className="card">
                <h3>💰 Cost</h3>
                <p>Cloud databases charge per read/write. Serving data from cache reduces these costs significantly.</p>
            </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (USER FRIENDLY) */}
      <section>
        <h2>How It Works</h2>
        <div className="grid">
          <div className="card">
            <h3>1. The Request</h3>
            <p>You click the button. The Frontend sends a request to the Backend (Node.js).</p>
          </div>
          <div className="card">
            <h3>2. The Decision</h3>
            <p>The Server checks: "Do I have this data in memory?" AND "Is it less than 30 seconds old?"</p>
          </div>
          <div className="card">
            <h3>3. Hit or Miss</h3>
            <p style={{textAlign: 'left', fontSize: '0.9rem'}}>
               <strong style={{color:'#27c93f'}}>HIT:</strong> Return data instantly. <br/>
               <strong style={{color:'#ffbd2e'}}>MISS:</strong> Fetch from DB (Simulated 2s delay) &rarr; Save to Cache &rarr; Return data.
            </p>
          </div>
        </div>
      </section>

      {/* 5. UNDER THE HOOD (CODE EXPLAINER) */}
      <section>
        <h2>Under the Hood (Backend Logic)</h2>
        <p>This is the actual logic running inside <code>server.js</code> right now.</p>
        
        <div className="code-block-container">
            <div className="code-explain-row">
                <div className="code-text">
                    <h3>1. The "Freshness" Check</h3>
                    <p>This line checks if the data is stale.</p>
                    <pre className="code-snippet">
{`if (cache.data && Date.now() < cache.expiry) {
    return res.json(cache.data); 
}`}
                    </pre>
                    <p className="note">If current time is less than expiry time, serve immediately.</p>
                </div>

                <div className="code-text">
                    <h3>2. Fetching & Storing</h3>
                    <p>If cache is empty or expired, we do the hard work:</p>
                    <pre className="code-snippet">
{`// 1. Fetch from Database (Slow)
const dbData = await fetchFromDatabase();

// 2. Store in Cache
cache.data = dbData;

// 3. Set Expiry (Current Time + 30s)
cache.expiry = Date.now() + (30 * 1000);`}
                    </pre>
                </div>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p style={{fontSize: '0.9rem'}}>
          Built to demonstrate Backend Caching Logic.
        </p>
      </footer>

    </div>
  );
}

export default App;