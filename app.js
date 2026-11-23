// بيانات الفرقة الأولى — نبات عام
const LEVEL_NAME = "الفرقة الأولى";

const SUBJECTS_DATA = [
  {
    id: "general-botany",
    name: "نبات عام",
    description: "محاضرات وملخصات مادة نبات عام للفرقة الأولى.",
    lectures: [
      {
        id: "plant-cell-structure",
        title: "Plant Cell Structure — تركيب الخلية النباتية والبكتيريا",
        blocks: [
          {
            heading: "أولاً: تركيب الخلية النباتية (Plant Cell Structure)",
            images: [
              {
                src: "WhatsApp Image 2026-11-23 at 9.36.33 PM.jpeg",
                caption: "تركيب الخلية النباتية (Plant Cell Structure)",
                isLab: false
              },
              {
                src: "WhatsApp Image 2026-11-23 at 9.08.30 PM.jpeg",
                caption: "العملي: قشرة بصل — Onion Epidermis",
                isLab: true
              }
            ],
            summary:
              "1. Vacuole (الفجوة العصارية)\n2. Mitochondria (الميتوكوندريا)\n3. Nucleus (النواة)\n4. Plasma membrane (الغشاء البلازمي)\n5. Cell wall (الجدار الخلوي)\n6. Chloroplast (البلاستيدة الخضراء)\n\nالعملي:\nقشرة بصل — Onion Epidermis"
          },
          {
            heading: "ثانياً: أشكال البكتيريا (Shape of Bacteria)",
            images: [
              {
                src: "WhatsApp Image 2026-11-23 at 10.02.18 PM.jpeg",
                caption: "رسمة أشكال البكتيريا من الكشكول",
                isLab: false
              },
              {
                src: "WhatsApp Image 2026-11-23 at 10.00.41 PM.jpeg",
                caption: "العملي: فحص البكتيريا تحت الميكروسكوب",
                isLab: true
              }
            ],
            summary:
              "1. Bacilli (العصوية):\n- Mono bacilli (عصوية أحادية)\n- Diplo bacilli (عصوية ثنائية)\n- Strepto bacilli (عصوية سبحية / متسلسلة)\n- Short rods (عصيات قصيرة)\n(Gram positive: بنفسجي/أزرق — موجبة الجرام | Gram negative: أحمر/وردي — سالبة الجرام)\n\n2. Cocci (الكروية):\n- Mono cocci (كروية أحادية)\n- Diplo cocci (كروية ثنائية)\n- Streptococci (كروية سبحية)\n- Staphylococci (كروية عنقودية)\n- Tetrad (كروية رباعية)\n- Sarcina (كروية مكعبة / حزمية)\n\nأشكال أخرى (Other shapes):\n- Flagellated rod (عصوية مزودة بأسواط)\n- Spore forming bacteria (بكتيريا مكونة للجراثيم)\n- Vibrios (ضمّية / واوية)\n- Spirilla (حلزونية)\n- Spirochetes (لولبية)"
          }
        ]
      }
    ]
  }
];

const uiState = {
  isOpen: false,
  subject: "all",
  subjectText: "جميع المواد",
  search: "",
  activeSubjectObj: null
};

const drawerToggle = document.getElementById("drawerToggle");
const topDrawer = document.getElementById("topDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const subjectsChips = document.getElementById("subjectsChips");
const searchInput = document.getElementById("searchInput");
const activeSubjectLabel = document.getElementById("activeSubjectLabel");
const cardsContainer = document.getElementById("cardsContainer");
const scrollProgress = document.getElementById("scrollProgress");

const lectureModal = document.getElementById("lectureModal");
const modalSubjectTitle = document.getElementById("modalSubjectTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const lecturesList = document.getElementById("lecturesList");
const lectureViewer = document.getElementById("lectureViewer");
const backToLecturesBtn = document.getElementById("backToLecturesBtn");
const printLectureBtn = document.getElementById("printLectureBtn");
const viewerTitle = document.getElementById("viewerTitle");
const viewerNotes = document.getElementById("viewerNotes");
const viewerDiagramBox = document.getElementById("viewerDiagramBox");

function pulseBadge(el) {
  if (!el) return;
  el.classList.remove("pulse");
  void el.offsetWidth;
  el.classList.add("pulse");
  setTimeout(() => el.classList.remove("pulse"), 280);
}

function setDrawerState(open) {
  uiState.isOpen = open;
  drawerToggle.setAttribute("aria-expanded", String(open));
  topDrawer.setAttribute("aria-hidden", String(!open));
  topDrawer.classList.toggle("open", open);
  drawerBackdrop.classList.toggle("open", open);
}

function bindSpotlight(el) {
  el.addEventListener("pointermove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--spot-opacity", "1");
  });

  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--spot-opacity", "0");
  });
}

function getLectureSearchText(lec) {
  if (Array.isArray(lec.blocks)) {
    return lec.blocks
      .map((b) => `${b.heading || ""} ${b.summary || ""}`)
      .join(" ");
  }
  return lec.summary || "";
}

function renderSubjectChips() {
  const chipsHtml = [
    `<button class="chip ${uiState.subject === "all" ? "active" : ""}" type="button" data-subject="all">جميع المواد</button>`,
    ...SUBJECTS_DATA.map(
      (subj) =>
        `<button class="chip ${uiState.subject === subj.id ? "active" : ""}" type="button" data-subject="${subj.id}">${subj.name}</button>`
    )
  ].join("");
  subjectsChips.innerHTML = chipsHtml;
}

function getFilteredSubjects() {
  const q = uiState.search.trim().toLowerCase();
  return SUBJECTS_DATA.filter((subj) => {
    const matchesSubject = uiState.subject === "all" || subj.id === uiState.subject;
    const matchesSearch =
      !q ||
      subj.name.toLowerCase().includes(q) ||
      subj.description.toLowerCase().includes(q) ||
      subj.lectures.some(
        (lec) =>
          lec.title.toLowerCase().includes(q) ||
          getLectureSearchText(lec).toLowerCase().includes(q)
      );
    return matchesSubject && matchesSearch;
  });
}

function renderCards() {
  const list = getFilteredSubjects();
  if (list.length === 0) {
    cardsContainer.innerHTML = `<div class="empty-box">لا توجد نتائج مطابقة للبحث أو المادة المحددة.</div>`;
    return;
  }

  cardsContainer.innerHTML = list
    .map(
      (subj) => `
      <article class="subject-card spotlight-card">
        <div>
          <span class="pill pill-outline">${LEVEL_NAME}</span>
          <h2 class="subject-title">${subj.name}</h2>
          <p class="subject-sub">${subj.description}</p>
        </div>
        <div class="subject-foot">
          <span class="lectures-count">${subj.lectures.length} محاضرة</span>
          <button class="btn-primary" type="button" data-open-subject="${subj.id}">عرض المحاضرات</button>
        </div>
      </article>
    `
    )
    .join("");

  cardsContainer.querySelectorAll(".spotlight-card").forEach(bindSpotlight);
}

function openSubjectModal(subjectId) {
  const subj = SUBJECTS_DATA.find((s) => s.id === subjectId);
  if (!subj) return;

  uiState.activeSubjectObj = subj;
  modalSubjectTitle.textContent = subj.name;
  lectureViewer.hidden = true;
  lecturesList.hidden = false;

  lecturesList.innerHTML = subj.lectures
    .map(
      (lec) => `
      <div class="lecture-row">
        <span class="lecture-row-title">${lec.title}</span>
        <button class="btn-secondary" type="button" data-open-lecture="${lec.id}">فتح الملخص</button>
      </div>
    `
    )
    .join("");

  lectureModal.hidden = false;
}

function renderBlockContent(block) {
  const imgs = Array.isArray(block.images) ? block.images : [];
  viewerDiagramBox.innerHTML = imgs
    .map(
      (item) => `
      <div class="media-frame">
        <span class="media-caption">${item.caption}</span>
        <img src="${item.src}" alt="${item.caption}" class="lecture-photo ${item.isLab ? "lab-photo" : ""}" />
      </div>
    `
    )
    .join("");

  viewerNotes.textContent = `${block.heading ? block.heading + "\n\n" : ""}${block.summary || ""}`;
}

function openLectureViewer(lectureId) {
  if (!uiState.activeSubjectObj) return;
  const lec = uiState.activeSubjectObj.lectures.find((l) => l.id === lectureId);
  if (!lec) return;

  viewerTitle.textContent = lec.title;

  if (Array.isArray(lec.blocks) && lec.blocks.length > 0) {
    const existingSwitcher = document.getElementById("blockSwitcher");
    if (existingSwitcher) existingSwitcher.remove();

    const switcher = document.createElement("div");
    switcher.id = "blockSwitcher";
    switcher.className = "chips-row";
    switcher.style.marginBottom = "1rem";
    switcher.innerHTML = lec.blocks
      .map(
        (b, idx) =>
          `<button class="chip ${idx === 0 ? "active" : ""}" type="button" data-block-idx="${idx}">${b.heading}</button>`
      )
      .join("");

    const unifiedCard = lectureViewer.querySelector(".unified-card");
    lectureViewer.insertBefore(switcher, unifiedCard);

    renderBlockContent(lec.blocks[0]);

    switcher.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-block-idx]");
      if (!btn) return;
      switcher.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const idx = Number(btn.dataset.blockIdx);
      renderBlockContent(lec.blocks[idx]);
    });
  } else {
    renderBlockContent(lec);
  }

  lecturesList.hidden = true;
  lectureViewer.hidden = false;
}

function closeLectureModal() {
  const existingSwitcher = document.getElementById("blockSwitcher");
  if (existingSwitcher) existingSwitcher.remove();
  lectureModal.hidden = true;
  uiState.activeSubjectObj = null;
}

drawerToggle.addEventListener("click", () => {
  setDrawerState(!uiState.isOpen);
});

drawerBackdrop.addEventListener("click", () => {
  setDrawerState(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!lectureModal.hidden) closeLectureModal();
    else if (uiState.isOpen) setDrawerState(false);
  }
});

subjectsChips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip[data-subject]");
  if (!btn) return;

  uiState.subject = btn.dataset.subject;
  uiState.subjectText = btn.textContent.trim();
  activeSubjectLabel.textContent = uiState.subjectText;
  pulseBadge(activeSubjectLabel);
  renderSubjectChips();
  renderCards();
});

searchInput.addEventListener("input", (e) => {
  uiState.search = e.target.value.trim();
  renderCards();
});

cardsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open-subject]");
  if (btn) openSubjectModal(btn.dataset.openSubject);
});

lecturesList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open-lecture]");
  if (btn) openLectureViewer(btn.dataset.openLecture);
});

backToLecturesBtn.addEventListener("click", () => {
  const existingSwitcher = document.getElementById("blockSwitcher");
  if (existingSwitcher) existingSwitcher.remove();
  lectureViewer.hidden = true;
  lecturesList.hidden = false;
});

printLectureBtn.addEventListener("click", () => {
  window.print();
});

closeModalBtn.addEventListener("click", closeLectureModal);

lectureModal.addEventListener("click", (e) => {
  if (e.target === lectureModal) closeLectureModal();
});

document.querySelectorAll(".spotlight-card").forEach(bindSpotlight);

/* =========================================================
   خلفية DNA ثلاثية الأبعاد (3D) — تتحرك مع السكرول فقط
   + ميلان خفيف (Parallax) مع الماوس + شريط تقدم السكرول
   ========================================================= */
(() => {
  const canvas = document.getElementById("dnaCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let dpr = 1;

  let targetScroll = window.scrollY || 0;
  let currentScroll = targetScroll;

  let targetTiltX = 0;
  let currentTiltX = 0;

  let rafId = null;

  function updateScrollProgress(scrollPos) {
    if (!scrollProgress) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.max(0, Math.min(100, (scrollPos / maxScroll) * 100));
    scrollProgress.style.width = `${pct.toFixed(2)}%`;
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateScrollProgress(currentScroll);
    renderFrame(currentScroll, currentTiltX);
  }

  function project3D(x3, y3, z3, centerX, centerY, tiltX) {
    const cosT = Math.cos(tiltX);
    const sinT = Math.sin(tiltX);
    const rx = x3 * cosT + z3 * sinT;
    const rz = -x3 * sinT + z3 * cosT;

    const fov = 520;
    const scale = fov / (fov + rz);
    return {
      x: centerX + rx * scale,
      y: centerY + y3 * scale,
      z: rz,
      scale
    };
  }

  function renderFrame(scrollPos, tiltX) {
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.52;

    const twistAngle = scrollPos * 0.0085;
    const verticalOffset = (((scrollPos * 0.22) % 34) + 34) % 34;

    const radiusX = Math.min(width * 0.22, 175);
    const radiusZ = 125;
    const stepY = 34;
    const totalPairs = Math.ceil(height / stepY) + 8;
    const startY = -height * 0.5 - stepY * 4 + verticalOffset;

    const nodesA = [];
    const nodesB = [];
    const rungs = [];

    for (let i = 0; i < totalPairs; i++) {
      const y3 = startY + i * stepY;
      const angle = i * 0.42 + twistAngle;

      const ax3 = Math.cos(angle) * radiusX;
      const az3 = Math.sin(angle) * radiusZ;
      const pA = project3D(ax3, y3, az3, centerX, centerY, tiltX);

      const bx3 = Math.cos(angle + Math.PI) * radiusX;
      const bz3 = Math.sin(angle + Math.PI) * radiusZ;
      const pB = project3D(bx3, y3, bz3, centerX, centerY, tiltX);

      nodesA.push(pA);
      nodesB.push(pB);

      const midX3 = (ax3 + bx3) * 0.5;
      const midZ3 = (az3 + bz3) * 0.5;
      const pMid = project3D(midX3, y3, midZ3, centerX, centerY, tiltX);

      rungs.push({
        a: pA,
        b: pB,
        mid: pMid,
        depth: (az3 + bz3) * 0.5
      });
    }

    for (let i = 0; i < rungs.length; i++) {
      const r = rungs[i];
      const depthNorm = (r.depth + radiusZ) / (radiusZ * 2);
      const alpha = Math.max(0.08, Math.min(0.45, 0.08 + depthNorm * 0.35));

      ctx.beginPath();
      ctx.moveTo(r.a.x, r.a.y);
      ctx.lineTo(r.b.x, r.b.y);
      ctx.strokeStyle = `rgba(96, 165, 250, ${alpha.toFixed(3)})`;
      ctx.lineWidth = Math.max(1, 2.2 * r.mid.scale);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(r.mid.x, r.mid.y, Math.max(1.4, 2.6 * r.mid.scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 197, 253, ${(alpha * 1.1).toFixed(3)})`;
      ctx.fill();
    }

    const spheres = [];
    for (let i = 0; i < nodesA.length; i++) {
      spheres.push({
        p: nodesA[i],
        z: nodesA[i].z,
        colorRgb: "96, 165, 250"
      });
      spheres.push({
        p: nodesB[i],
        z: nodesB[i].z,
        colorRgb: "37, 110, 232"
      });
    }
    spheres.sort((s1, s2) => s1.z - s2.z);

    function drawStrand(nodes, rgb) {
      for (let i = 0; i < nodes.length - 1; i++) {
        const p1 = nodes[i];
        const p2 = nodes[i + 1];
        const avgZ = (p1.z + p2.z) * 0.5;
        const depthNorm = (avgZ + radiusZ) / (radiusZ * 2);
        const alpha = Math.max(0.14, Math.min(0.75, 0.14 + depthNorm * 0.58));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(1.5, 3.6 * ((p1.scale + p2.scale) * 0.5));
        ctx.stroke();
      }
    }

    drawStrand(nodesA, "96, 165, 250");
    drawStrand(nodesB, "37, 110, 232");

    for (let i = 0; i < spheres.length; i++) {
      const { p, z, colorRgb } = spheres[i];
      const depthNorm = (z + radiusZ) / (radiusZ * 2);
      const radius = Math.max(2.2, 6.2 * p.scale * (0.65 + depthNorm * 0.55));
      const alpha = Math.max(0.22, Math.min(0.95, 0.22 + depthNorm * 0.72));

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRgb}, ${alpha.toFixed(3)})`;
      ctx.fill();

      if (depthNorm > 0.55) {
        ctx.beginPath();
        ctx.arc(p.x - radius * 0.3, p.y - radius * 0.3, radius * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(depthNorm * 0.38).toFixed(3)})`;
        ctx.fill();
      }
    }
  }

  function stepAnimation() {
    const scrollDiff = targetScroll - currentScroll;
    const tiltDiff = targetTiltX - currentTiltX;

    if (Math.abs(scrollDiff) < 0.05 && Math.abs(tiltDiff) < 0.0005) {
      currentScroll = targetScroll;
      currentTiltX = targetTiltX;
      updateScrollProgress(currentScroll);
      renderFrame(currentScroll, currentTiltX);
      rafId = null;
      return;
    }

    currentScroll += scrollDiff * 0.12;
    currentTiltX += tiltDiff * 0.08;
    updateScrollProgress(currentScroll);
    renderFrame(currentScroll, currentTiltX);
    rafId = requestAnimationFrame(stepAnimation);
  }

  function startLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(stepAnimation);
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      targetScroll = window.scrollY || 0;
      startLoop();
    },
    { passive: true }
  );

  window.addEventListener(
    "pointermove",
    (e) => {
      if (width <= 0) return;
      const normX = (e.clientX / width) * 2 - 1;
      targetTiltX = normX * 0.28;
      startLoop();
    },
    { passive: true }
  );

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
})();

renderSubjectChips();
renderCards();