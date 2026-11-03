// Doctor dashboard: only for signed-in doctors; shows that doctor's appointments
const me = session.get();
if (!me || me.role !== "doctor") {
  location.replace("login.html");            // route guard: kick out non-doctors
} else {
  const out = document.getElementById("appts"), stats = document.getElementById("stats"), chips = document.getElementById("chips");
  let filter = "Booked";
  document.getElementById("hello").textContent = "Signed in as " + me.name;

  const draw = () => {
    const mine = store.get().filter(a => a.docId === me.docId);
    const n = s => mine.filter(a => a.status === s).length;
    stats.innerHTML = [["Upcoming", n("Booked")], ["Completed", n("Completed")], ["Cancelled", n("Cancelled")]]
      .map(([l, v]) => `<div class="card"><h3>${v}</h3><p class="muted">${l}</p></div>`).join("");
    const list = mine.filter(a => filter === "All" || a.status === filter)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    out.innerHTML = list.length ? list.map(a => {
      const cls = {Cancelled:"x", Completed:"done"}[a.status] || "";
      return `<div class="card row"><div><h3>${esc(a.patient)}</h3>
        <p>${a.date} at ${a.time}. Booking ID ${a.id}</p>
        <p class="muted">Mobile ${esc(a.phone)}${a.reason ? ". Reason: " + esc(a.reason) : ""}</p></div>
        <div><span class="tag ${cls}">${a.status}</span><br><br>
        ${a.status === "Booked" ? `<div class="acts"><button class="btn sm" data-id="${a.id}" data-s="Completed">Mark completed</button>
        <button class="btn sm ghost" data-id="${a.id}" data-s="Cancelled">Cancel</button></div>` : ""}</div></div>`;
    }).join("") : `<div class="card"><p class="muted">No appointments here yet.</p></div>`;
  };

  out.onclick = e => {
    const id = e.target.dataset.id; if (!id) return;
    store.set(store.get().map(a => a.id === id ? {...a, status: e.target.dataset.s} : a));
    toast("Marked " + e.target.dataset.s.toLowerCase()); draw();
  };
  chips.onclick = e => {
    const c = e.target.closest(".chip"); if (!c) return;
    filter = c.dataset.f;
    chips.querySelectorAll(".chip").forEach(x => x.classList.toggle("on", x === c));
    draw();
  };
  draw();
}