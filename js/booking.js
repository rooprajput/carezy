// Booking page: pick doctor, date, slot; validate; save to localStorage
const $ = id => document.getElementById(id);
const sel = $("doctor"), date = $("date"), box = $("slots");
let slot = null;
sel.innerHTML = DOCTORS.map(d=>`<option value="${d.id}">${d.name} (${d.spec})</option>`).join("");
const pre = new URLSearchParams(location.search).get("doc"); if (pre) sel.value = pre;
const u = session.get();
if (u && u.role === "patient") { $("name").value = u.name; $("phone").value = u.phone; }
const today = new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
date.min = today; date.value = today;

function summary(){
  const d = DOCTORS.find(x=>x.id==sel.value);
  $("sum").innerHTML = `<li><span>Doctor</span><b>${d.name}</b></li><li><span>Date</span><b>${date.value||"-"}</b></li>
    <li><span>Time</span><b>${slot||"Select a slot"}</b></li><li><span>Fee</span><b>₹${d.fee}</b></li>`;
}
// true if the slot time has already passed (only matters when the chosen date is today)
function isPast(t){
  if (date.value !== today) return false;
  const [h, m] = t.split(":").map(Number), now = new Date();
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}
function drawSlots(){
  slot = null;
  const taken = store.get().filter(a=>a.docId==sel.value && a.date===date.value && a.status==="Booked").map(a=>a.time);
  box.innerHTML = SLOTS.map(t=>`<button type="button" class="slot" data-t="${t}" ${taken.includes(t)||isPast(t)?"disabled":""}>${t}</button>`).join("");
  $("err").textContent = (date.value === today && SLOTS.every(isPast)) ? "No slots left today. Choose another date." : "";
  summary();
}
box.onclick = e => {
  const b = e.target.closest(".slot"); if (!b || b.disabled) return;
  box.querySelectorAll(".slot").forEach(x=>x.classList.remove("on"));
  b.classList.add("on"); slot = b.dataset.t; summary();
};
sel.onchange = date.onchange = drawSlots;

$("form").onsubmit = e => {
  e.preventDefault();
  const name = $("name").value.trim(), phone = $("phone").value.trim(), err = $("err");
  if (name.length < 3) return err.textContent = "Enter your full name (at least 3 letters).";
  if (!/^[6-9]\d{9}$/.test(phone)) return err.textContent = "Enter a valid 10-digit mobile number.";
  if (!date.value || date.value < today) return err.textContent = "Choose today or a future date.";
  if (!slot) return err.textContent = "Pick a time slot.";
  if (isPast(slot)) { drawSlots(); return err.textContent = "That time has already passed. Pick a later slot."; }
  err.textContent = "";
  const d = DOCTORS.find(x=>x.id==sel.value);
  const appt = {id:"CZ"+Date.now().toString().slice(-6), docId:d.id, doctor:d.name, spec:d.spec, fee:d.fee,
    patient:name, phone, reason:$("reason").value.trim(), date:date.value, time:slot, status:"Booked"};
  const all = store.get(); all.push(appt); store.set(all);
  $("formWrap").style.display = "none"; $("done").style.display = "block";
  $("ref").textContent = appt.id;
  $("doneText").textContent = `${d.name} on ${appt.date} at ${appt.time}`;
};
drawSlots();