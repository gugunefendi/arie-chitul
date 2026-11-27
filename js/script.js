(function () {
  "use strict";
  var WA = "6289652396794";

  var year = document.getElementById("tahun");
  if (year) year.textContent = new Date().getFullYear();

  // Menu mobile
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.textContent = isOpen ? "✕" : "☰";
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.textContent = "☰";
      }
    });
  }

  // Hero carousel: otomatis berpindah setiap 5 detik
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dot"));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-pressed", i === current ? "true" : "false");
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    timer = window.setInterval(function () { showSlide(current + 1); }, 5000);
  }
  function stopAutoSlide() {
    if (timer) window.clearInterval(timer);
  }

  var prev = document.querySelector(".carousel-arrow.prev");
  var next = document.querySelector(".carousel-arrow.next");
  if (prev) prev.addEventListener("click", function () { showSlide(current - 1); startAutoSlide(); });
  if (next) next.addEventListener("click", function () { showSlide(current + 1); startAutoSlide(); });
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () { showSlide(i); startAutoSlide(); });
  });

  var carousel = document.querySelector(".hero-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", startAutoSlide);
    carousel.addEventListener("focusin", stopAutoSlide);
    carousel.addEventListener("focusout", startAutoSlide);
  }
  showSlide(0);
  startAutoSlide();

    // Geser (swipe) carousel di layar sentuh
  var startX = null;
  if (carousel) {
    carousel.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) { showSlide(current + (diff < 0 ? 1 : -1)); startAutoSlide(); }
      startX = null;
    });
  }

  // Tabel responsive: isi label tiap sel otomatis dari judul kolom
  document.querySelectorAll("table").forEach(function (table) {
    var heads = Array.prototype.map.call(table.querySelectorAll("thead th"), function (th) {
      return th.textContent.trim();
    });
    table.querySelectorAll("tbody tr").forEach(function (row) {
      Array.prototype.forEach.call(row.children, function (cell, i) {
        if (heads[i]) cell.setAttribute("data-label", heads[i]);
      });
    });
  });

  // Pastikan nomor WA terpusat dan mudah diganti bila diperlukan.
  document.querySelectorAll('a[href*="wa.me/"]').forEach(function (link) {
    var url = new URL(link.href);
    url.pathname = "/" + WA;
    link.href = url.toString();
  });
})();

  // Lightbox portofolio
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var pics = Array.prototype.slice.call(document.querySelectorAll(".portfolio-grid img"));
  var lbIndex = 0;

  function openLightbox(i) {
    lbIndex = (i + pics.length) % pics.length;
    lbImg.src = pics[lbIndex].currentSrc || pics[lbIndex].src;
    lbImg.alt = pics[lbIndex].alt;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(function () { lb.classList.add("show"); });
  }
  function closeLightbox() {
    lb.classList.remove("show");
    document.body.style.overflow = "";
    window.setTimeout(function () { lb.hidden = true; lbImg.src = ""; }, 250);
  }

  if (lb && pics.length) {
    pics.forEach(function (img, i) {
      img.addEventListener("click", function () { openLightbox(i); });
    });
    lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(lbIndex - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(lbIndex + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
    });
  }
