// Doctor data + localStorage helpers (acts as our "database")
const DOCTORS = [
  {id:1,name:"Dr. Ananya Sharma",spec:"Cardiologist",exp:12,fee:800,rating:4.9,hue:170},
  {id:2,name:"Dr. Rohan Mehta",spec:"Dermatologist",exp:8,fee:600,rating:4.7,hue:20},
  {id:3,name:"Dr. Simran Kaur",spec:"Pediatrician",exp:10,fee:500,rating:4.8,hue:200},
  {id:4,name:"Dr. Vikram Singh",spec:"Orthopedic",exp:15,fee:900,rating:4.8,hue:260},
  {id:5,name:"Dr. Neha Gupta",spec:"Gynecologist",exp:11,fee:700,rating:4.9,hue:330},
  {id:6,name:"Dr. Arjun Verma",spec:"General Physician",exp:6,fee:300,rating:4.6,hue:140},
  {id:7,name:"Dr. Priya Nair",spec:"Dentist",exp:9,fee:400,rating:4.7,hue:190},
  {id:8,name:"Dr. Karan Malhotra",spec:"Neurologist",exp:14,fee:1000,rating:4.9,hue:290}
];
const SPECIALTIES = [...new Set(DOCTORS.map(d => d.spec))];
const SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30"];
const store = {
  get(){ try { return JSON.parse(localStorage.getItem("carezy_appts")) || []; } catch { return []; } },
  set(list){ localStorage.setItem("carezy_appts", JSON.stringify(list)); }
};
// ---- Sign-in (demo) ----
const DOCTOR_PASSWORD = "doctor123"; // demo only; a real app checks hashed passwords on a server
const session = {
  get(){ try { return JSON.parse(localStorage.getItem("carezy_user")); } catch { return null; } },
  set(u){ localStorage.setItem("carezy_user", JSON.stringify(u)); },
  clear(){ localStorage.removeItem("carezy_user"); }
};