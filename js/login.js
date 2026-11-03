// Sign in page: Patient / Doctor tabs. Session saved in localStorage.
const $ = id => document.getElementById(id);
$("docSel").innerHTML = DOCTORS.map(d=>`<option value="${d.id}">${d.name} (${d.spec})</option>`).join("");

document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.toggle("on", x === t));
  $("patientForm").style.display = t.dataset.role === "patient" ? "block" : "none";
  $("doctorForm").style.display  = t.dataset.role === "doctor" ? "block" : "none";
  $("err").textContent = "";
});

$("patientForm").onsubmit = e => {
  e.preventDefault();
  const name = $("pname").value.trim(), phone = $("pphone").value.trim();
  if (name.length < 3) return $("err").textContent = "Enter your full name (at least 3 letters).";
  if (!/^[6-9]\d{9}$/.test(phone)) return $("err").textContent = "Enter a valid 10-digit mobile number.";
  session.set({role:"patient", name, phone});
  location.href = "doctors.html";
};

$("doctorForm").onsubmit = e => {
  e.preventDefault();
  if ($("pass").value !== DOCTOR_PASSWORD) return $("err").textContent = "Wrong password. Try again.";
  const d = DOCTORS.find(x => x.id == $("docSel").value);
  session.set({role:"doctor", docId:d.id, name:d.name});
  location.href = "doctor.html";
};