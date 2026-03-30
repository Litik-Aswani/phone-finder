# 📱 Phone Finder — Device Catalog

## Overview
Phone Finder is a responsive web application that allows users to search, explore, and view detailed specifications of mobile devices using the Programming Hero Phone API. The application provides a clean, user-friendly interface with dynamic data fetching and interactive components.

---

## Features

### 🔍 Search Functionality
- Users can search for phones by brand or model (e.g., iPhone, Samsung, Oppo).
- Results are dynamically fetched from the API based on user input.
- Displays relevant phones and handles cases where no results are found.

### 📦 Default “Show All” View
- On page load, the application automatically displays phones from multiple brands.
- Data is fetched using multiple search queries and combined into one dataset.
- Duplicate phones are removed using their unique identifiers.

### 🧾 Phone Cards
- Phones are displayed in a responsive grid layout.
- Each card includes:
  - Phone image
  - Phone name
  - Brand
- Clicking a card highlights it and loads detailed information.

### 📊 Detailed Phone Information
- Displays detailed specifications for each phone, including:
  - Name and brand
  - Release date
  - Storage, memory, display, and chipset
  - Sensors
  - Connectivity features (Bluetooth, GPS, WLAN, etc.)
- Handles missing data gracefully.

### 🔁 Interactive UI
- Automatically shows details of the first phone on load and after search.
- “Show All” button reloads the full dataset.
- Clear button resets the search input.
- Close button hides the details section.

### ⏳ Loading Indicator
- Displays a loading animation during API requests.
- Prevents UI glitches using controlled loading state.

---

## Technologies Used

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Fetch API  
- DOM Manipulation  

---

## JavaScript Functionalities Used

- Fetch API for retrieving data  
- Async/Await for handling asynchronous operations  
- AbortController to cancel previous requests  
- Event listeners for user interactions  
- Dynamic DOM rendering  
- Array methods such as map, filter, findIndex, and join  
- Optional chaining for safe property access  

---

## API Used

Search Phones:  
https://openapi.programming-hero.com/api/phones?search=oppo  

Phone Details:  
https://openapi.programming-hero.com/api/phone/{slug}  

---

## Project Structure

project-folder/
│
├── index.html  
├── style.css  
├── script.js  
└── README.md  

---

## How It Works

1. On page load, the application fetches phones from multiple brands.  
2. The results are merged, filtered, and displayed as cards.  
3. The first phone’s details are automatically shown.  
4. Users can search for phones, click cards to view details, or use “Show All” to reload all phones.  
5. All updates happen dynamically without refreshing the page.  

---

## Limitations

- The API does not provide a direct endpoint to fetch all phones.  
- The “Show All” feature is implemented by combining multiple search queries.  
- Some phone data may be incomplete depending on the API response.  

---
 

---

## GitHub Repository

https://github.com//phone-finder  

---

## Author

Litik Aswani 
Middlesex University Dubai  
