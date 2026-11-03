// Shared UI: injects background, navbar, footer on every page; helper functions
const user = session.get();
const PAGES = (user && user.role === "doctor")
  ? [["index.html","Home"],["doctors.html","Doctors"],["doctor.html","Dashboard"]]
  : [["index.html","Home"],["doctors.html","Doctors"],["book.html","Book"],["appointments.html","My appointments"]];

const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function docCard(d){
  const ini = d.name.replace("Dr. ","").split(" ").map(w=>w[0]).join("");
  return `<article class="card doc"><div class="av" style="--h:${d.hue}">${ini}</div>
    <h3>${d.name}</h3><p class="muted">${d.spec}</p><p class="muted">${d.exp} years experience</p>
    <p class="meta"><b>★ ${d.rating}</b><span>₹${d.fee} per visit</span></p>
    <a class="btn sm" href="book.html?doc=${d.id}">Book visit</a></article>`;
}
function toast(msg){
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(), 2500);
}
document.addEventListener("DOMContentLoaded", () => {
  const here = location.pathname.split("/").pop() || "index.html";
  const auth = user
    ? `<li><span class="tag">${user.role === "doctor" ? "Doctor" : "Patient"}</span></li><li><button class="btn sm ghost" id="signout">Sign out</button></li>`
    : `<li><a class="btn sm" href="login.html">Sign in</a></li>`;
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="bg"><span></span><span></span><span></span></div>
     <nav><div class="wrap"><a class="brand" href="index.html"><img src="assets/logo.svg" alt="Carezy logo"><span>Carezy</span></a>
     <ul>${PAGES.map(([h,n])=>`<li><a href="${h}" class="${h===here?"on":""}">${n}</a></li>`).join("")}${auth}</ul></div></nav>`);
  document.body.insertAdjacentHTML("beforeend", `<footer>© 2026 Carezy. College project, not a real medical service.</footer>`);
  const so = document.getElementById("signout");
  if (so) so.onclick = () => { session.clear(); location.href = "index.html"; };
});