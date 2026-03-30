const phoneContainer = document.getElementById("phoneContainer");
const detailsContainer = document.getElementById("detailsContainer");
const detailsSection = document.getElementById("detailsSection");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");
const clearBtn = document.getElementById("clearBtn");
const closeDetails = document.getElementById("closeDetails");
const messageEl = document.getElementById("message");
const loadingEl = document.getElementById("loading");
const phoneCountEl = document.getElementById("phoneCount");

let currentController = null;
let activeSlug = null;
let loadingDepth = 0;

function showLoading() {
  if (++loadingDepth === 1) loadingEl.classList.remove("hidden");
}

function hideLoading() {
  if (--loadingDepth <= 0) {
    loadingDepth = 0;
    loadingEl.classList.add("hidden");
  }
}

function showMessage(t) {
  messageEl.textContent = t;
}

function clearMessage() {
  messageEl.textContent = "";
}

function hideDetails() {
  detailsSection.classList.add("hidden");
  detailsContainer.innerHTML = "";
}

function abortCurrent() {
  currentController?.abort();
  currentController = null;
}

function updateCount(n) {
  phoneCountEl.textContent = `${n} device${n !== 1 ? "s" : ""}`;
}

function updateClearBtn() {
  clearBtn.classList.toggle("visible", searchInput.value.length > 0);
}

window.addEventListener("DOMContentLoaded", showAllPhones);

searchInput.addEventListener("input", updateClearBtn);

searchBtn.addEventListener("click", () => {
  const q = searchInput.value.trim();
  if (!q) {
    showMessage("Please enter a phone name.");
    return;
  }
  loadPhones(q);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

showAllBtn.addEventListener("click", showAllPhones);

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  updateClearBtn();
  clearMessage();
  searchInput.focus();
});

closeDetails.addEventListener("click", hideDetails);

async function showAllPhones() {
  abortCurrent();
  clearMessage();
  hideDetails();
  phoneContainer.innerHTML = "";
  activeSlug = null;
  showLoading();

  const controller = new AbortController();
  currentController = controller;

  const terms = ["iphone", "samsung", "oppo", "xiaomi", "huawei", "realme", "vivo", "oneplus"];

  try {
    const results = await Promise.allSettled(
      terms.map(t =>
        fetch(`https://openapi.programming-hero.com/api/phones?search=${t}`, { signal: controller.signal })
          .then(r => r.json())
      )
    );

    if (controller.signal.aborted) return;

    let all = [];

    for (const r of results) {
      if (r.status === "fulfilled" && r.value?.status && Array.isArray(r.value.data)) {
        all = all.concat(r.value.data.slice(0, 6));
      }
    }

    const unique = all.filter((p, i, s) => i === s.findIndex(x => x.slug === p.slug));

    if (!unique.length) {
      showMessage("No phones found.");
      return;
    }

    displayPhones(unique);
    updateCount(unique.length);

    activeSlug = unique[0].slug;
    document.querySelector(".phone-card")?.classList.add("active");
    await loadPhoneDetails(unique[0].slug);

  } catch (err) {
    if (controller.signal.aborted) return;
    showMessage("Something went wrong while loading phones.");
    console.error(err);
  } finally {
    hideLoading();
  }
}

async function loadPhones(query) {
  abortCurrent();
  clearMessage();
  hideDetails();
  phoneContainer.innerHTML = "";
  activeSlug = null;
  showLoading();

  const controller = new AbortController();
  currentController = controller;

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phones?search=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );

    const data = await res.json();

    if (controller.signal.aborted) return;

    if (!data.status || !Array.isArray(data.data) || !data.data.length) {
      showMessage(`No devices found for "${query}".`);
      return;
    }

    displayPhones(data.data);
    updateCount(data.data.length);

    activeSlug = data.data[0].slug;
    document.querySelector(".phone-card")?.classList.add("active");
    await loadPhoneDetails(data.data[0].slug);

  } catch (err) {
    if (controller.signal.aborted) return;
    showMessage("Error fetching phones.");
    console.error(err);
  } finally {
    hideLoading();
  }
}

function displayPhones(phones) {
  phoneContainer.innerHTML = "";

  const fallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='140'%3E%3Crect fill='%23ede7dc' width='100' height='140'/%3E%3Ctext y='78' x='50' text-anchor='middle' fill='%23b8ae9e' font-size='36'%3E📱%3C/text%3E%3C/svg%3E`;

  phones.forEach((phone, i) => {
    const card = document.createElement("div");
    card.classList.add("phone-card");
    card.dataset.slug = phone.slug;

    const num = String(i + 1).padStart(2, "0");

    card.innerHTML = `
      <img class="phone-card-img" src="${phone.image}" alt="${phone.phone_name}" loading="lazy"
           onerror="this.src='${fallback}'">
      <div class="phone-card-body">
        <div class="phone-card-num">№ ${num}</div>
        <div class="phone-card-name">${phone.phone_name}</div>
        <div class="phone-card-brand">${phone.brand}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".phone-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      activeSlug = phone.slug;
      loadPhoneDetails(phone.slug);
    });

    phoneContainer.appendChild(card);
  });
}

async function loadPhoneDetails(id) {
  showLoading();

  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/phone/${id}`);
    const data = await res.json();

    if (!data.status || !data.data) {
      detailsContainer.innerHTML = `<p class="na-text" style="padding:32px">Details unavailable.</p>`;
      detailsSection.classList.remove("hidden");
      return;
    }

    displayPhoneDetails(data.data);

  } catch (err) {
    detailsContainer.innerHTML = `<p class="na-text" style="padding:32px">Unable to load details.</p>`;
    detailsSection.classList.remove("hidden");
    console.error(err);
  } finally {
    hideLoading();
  }
}

function displayPhoneDetails(phone) {
  detailsSection.classList.remove("hidden");

  const v = x => x || "—";

  const fallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='220'%3E%3Crect fill='%23ede7dc' width='160' height='220'/%3E%3Ctext y='120' x='80' text-anchor='middle' fill='%23b8ae9e' font-size='52'%3E📱%3C/text%3E%3C/svg%3E`;

  const sensorsHtml = Array.isArray(phone.mainFeatures?.sensors) && phone.mainFeatures.sensors.length
    ? phone.mainFeatures.sensors.map(s => `<span class="tag">${s}</span>`).join("")
    : `<span class="na-text">Not listed</span>`;

  const conn = phone.others || {};

  const connItems = [
    ["WLAN", conn.WLAN],
    ["Bluetooth", conn.Bluetooth],
    ["GPS", conn.GPS],
    ["NFC", conn.NFC],
    ["Radio", conn.Radio],
    ["USB", conn.USB]
  ].filter(([, val]) => val);

  const connHtml = connItems.length
    ? connItems.map(([k, val]) => `<span class="tag red-tag">${k}: ${val}</span>`).join("")
    : `<span class="na-text">Not listed</span>`;

  const specs = [
    ["Storage", phone.mainFeatures?.storage],
    ["Memory", phone.mainFeatures?.memory],
    ["Display", phone.mainFeatures?.displaySize],
    ["Chipset", phone.mainFeatures?.chipSet]
  ];

  const specRowsHtml = specs.map(([k, val]) => `
    <div class="spec-row">
      <div class="spec-key">${k}</div>
      <div class="spec-val">${v(val)}</div>
    </div>
  `).join("");

  detailsContainer.innerHTML = `
    <div class="details-card">
      <div class="details-layout">
        <div class="details-img-col">
          <img src="${phone.image}" alt="${phone.name}" onerror="this.src='${fallback}'">
          <div class="details-brand-stamp">${v(phone.brand)}</div>
        </div>

        <div class="details-data-col">
          <div class="details-title-block">
            <div class="details-name">${v(phone.name)}</div>
            <div class="details-release">
              ${phone.releaseDate
                ? `Released <span>${phone.releaseDate}</span>`
                : `<span class="na-text">Release date not available</span>`}
            </div>
          </div>

          <div class="spec-table">
            ${specRowsHtml}
          </div>

          <div class="details-extra">
            <div>
              <div class="extra-label">Sensors</div>
              <div class="tag-row">${sensorsHtml}</div>
            </div>

            <div>
              <div class="extra-label">Connectivity</div>
              <div class="tag-row">${connHtml}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  detailsSection.scrollIntoView({ behavior: "smooth" });
}