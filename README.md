# 📊 Sorting Algorithm Visualizer

An **interactive full-stack web application** that animates and compares sorting algorithms in real time — built with Python Flask and vanilla JavaScript as a 2nd-semester CS project at Nile University.
---

## ✨ Features

- 🎬 **Step-by-step animation** — watch each comparison and swap happen live
- 📈 **Real-time statistics** — track comparisons, swaps, and steps as they happen
- 🎨 **Color-coded visualization** — comparing (yellow), swapping (red), sorted (green)
- ⚡ **5 sorting algorithms** — all implemented from scratch in Python
- 🎛️ **Adjustable speed** — control animation speed in real time
- 🔀 **Custom arrays** — enter your own numbers or generate random ones
- 📱 **Responsive design** — works on desktop and mobile

---

## 🧠 Algorithms Implemented

| Algorithm | Time Complexity (Best) | Time Complexity (Worst) | Space |
|---|---|---|---|
| **Bubble Sort** | O(n) | O(n²) | O(1) |
| **Selection Sort** | O(n²) | O(n²) | O(1) |
| **Insertion Sort** | O(n) | O(n²) | O(1) |
| **Merge Sort** | O(n log n) | O(n log n) | O(n) |
| **Quick Sort** | O(n log n) | O(n²) | O(log n) |

---

## 🏗️ Project Structure

```
sorting-algorithm-visualizer/
├── app.py                    # Flask backend & REST API
├── algorithms/
│   ├── bubble_sort.py        # Bubble sort with step capture
│   ├── selection_sort.py     # Selection sort with step capture
│   ├── insertion_sort.py     # Insertion sort with step capture
│   ├── merge_sort.py         # Merge sort with step capture
│   └── quick_sort.py         # Quick sort with step capture
└── static/
    ├── index.html            # Main UI
    ├── js/app.js             # Animation engine & API calls
    └── css/style.css         # Styling & animations
```

---

## 🚀 How to Run

**Requirements:** Python 3.8+

```bash
# Clone the repository
git clone https://github.com/AbdallaYoussef006/sorting-algorithm-visualizer.git

# Navigate to project
cd sorting-algorithm-visualizer

# Run the app (Flask auto-installs if needed)
python app.py
```

Then open your browser at: **http://localhost:5000**

---

## 🔌 API Endpoint

```http
POST /sort
Content-Type: application/json

{
  "algorithm": "bubble",
  "array": [64, 34, 25, 12, 22, 11, 90]
}
```

**Response:**
```json
{
  "steps": [...],
  "total_comparisons": 21,
  "total_swaps": 15,
  "total_steps": 36
}
```

---

## 📸 Preview
![Concept](Sorting%20Algorithm%20Visualizer%20Concept.png)

---

## 🎓 About

Built as a **2nd Semester Project (CSCI208)** at Nile University, Faculty of Computer Science.  
Demonstrates: REST API design, Python algorithms, full-stack development, real-time UI animation.

**Developer:** Abdalla Mohamed  
**University:** Nile University, Cairo, Egypt  
**Year:** 2026
