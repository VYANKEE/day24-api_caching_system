# ⚡ API Caching System – Performance Optimization Demo

> **Day 24 of 45-Day Coding Challenge**

![Status](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Focus](https://img.shields.io/badge/Focus-Backend_Optimization-orange)

### 🔗 Live Demo
**Frontend Application:** [https://day24-api-caching-system.vercel.app/](https://day24-api-caching-system.vercel.app/)  
**Backend API:** [https://day24-api-caching-system.onrender.com/api/data](https://day24-api-caching-system.onrender.com/api/data)

---

## 📖 Project Overview

This project is a full-stack engineering demonstration designed to visualize and explain the impact of **Server-Side Caching** on application performance.

In a traditional architecture, every API request triggers a database query. As traffic scales, this leads to increased latency and database strain. This project implements an **In-Memory Caching Layer** (simulating Redis logic) to demonstrate how high-performance systems reduce load times from seconds to milliseconds.

### 🎯 Key Objectives
- To demonstrate the difference between **Database Retrieval** (Disk I/O) and **Cached Retrieval** (Memory).
- To implement **Time-To-Live (TTL)** logic for cache invalidation.
- To visualize **Response Time Metrics** on a developer-centric frontend.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Node.js & Express.js | REST API handling and custom middleware. |
| **Caching** | In-Memory (Map/Object) | Custom caching logic with TTL expiration. |
| **Frontend** | React + Vite | Interactive UI to trigger and visualize API calls. |
| **Styling** | Pure CSS | Developer-themed, responsive design. |
| **Deployment** | Render (Backend) / Vercel (Frontend) | Cloud hosting infrastructure. |

---

## ⚙️ How It Works (Architecture)

The system operates on a "Stale-While-Revalidate" inspired logic using a custom caching middleware.

1.  **Incoming Request:** The client requests data via `GET /api/data`.
2.  **Cache Check:** The server checks its internal memory:
    * *Is data present?*
    * *Is the timestamp valid (within the 30-second window)?*
3.  **Condition A: Cache HIT (⚡ Fast)**
    * If valid data exists, the server returns the response immediately from RAM.
    * **Latency:** < 10ms.
4.  **Condition B: Cache MISS (🐢 Slow)**
    * If data is missing or expired, the server queries the database (simulated with a 2-second delay).
    * The new data is stored in the cache with a new expiry timestamp.
    * **Latency:** ~2000ms.

---

## 🔌 API Reference

### Get Data
Retrieves the mock dataset.

```http
GET /api/data
