// Renders doctor cards. On doctors.html it also filters by specialty chip + name search.
// On the home page, data-limit="3" on #list shows only the top rated doctors.
const list = document.getElementById("list");
const chipsBox = document.getElementById("chips");
const q = document.getElementById("q");
const limit = Number(list.dataset.limit) || 0;
let spec = new URLSearchParams(location.search).get("spec") || "All";
function draw(){
  const text = q ? q.value.toLowerCase() : "";
  let out = DOCTORS.filter(d => (spec==="All" || d.spec===spec) && d.name.toLowerCase().includes(text));
  if (limit) out = [...out].sort((a,b)=>b.rating-a.rating).slice(0, limit);
  list.innerHTML = out.length ? out.map(docCard).join("") : `<p class="muted">No doctors match. Try another specialty.</p>`;
}
if (chipsBox){
  chipsBox.innerHTML = ["All", ...SPECIALTIES].map(s=>`<button class="chip ${s===spec?"on":""}">${s}</button>`).join("");
  chipsBox.onclick = e => { if(!e.target.matches(".chip")) return; spec = e.target.textContent;
    chipsBox.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on", c.textContent===spec)); draw(); };
  q.oninput = draw;
}
draw();