// My appointments: read from localStorage, allow cancel
const out = document.getElementById("appts");
const me = session.get();
function draw(){
  let all = store.get().reverse();
  if (me && me.role === "patient") all = all.filter(a => a.phone === me.phone); // only my bookings
  if (!all.length){ out.innerHTML = `<div class="card"><p>No appointments yet.</p><br><a class="btn sm" href="doctors.html">Find a doctor</a></div>`; return; }
  out.innerHTML = all.map(a=>{
    const cls = {Cancelled:"x", Completed:"done"}[a.status] || "";
    return `<div class="card row"><div><h3>${a.doctor}</h3><p class="muted">${a.spec}</p>
    <p>${a.date} at ${a.time}. Booking ID ${a.id}</p></div>
    <div><span class="tag ${cls}">${a.status}</span><br><br>
    ${a.status==="Booked" ? `<button class="btn sm ghost" data-id="${a.id}">Cancel</button>` : ""}</div></div>`;
  }).join("");
}
out.onclick = e => {
  const id = e.target.dataset.id; if (!id) return;
  store.set(store.get().map(a => a.id===id ? {...a, status:"Cancelled"} : a));
  toast("Appointment cancelled"); draw();
};
draw();