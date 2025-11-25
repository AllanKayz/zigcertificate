// All imports at the top
const { jsPDF } = window.jspdf;

// ===== Platform Detection and Initial UI Setup =====
function isMobileDevice() {
  // Regular expression to test for common mobile device keyword
  if(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent)) {
    return true; // Mobile device detected
  }
  return false; // Desktop device detected
}

function setupPlatformUI() {
  const isElectron =
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0;

  if (isElectron) {
    document.querySelector(".status-bar").style.display = "flex";
  } else {
    document.querySelector(".title-bar")?.classList.add("hide");
    document.querySelector(".status-bar")?.style.setProperty("display", "none");
    document.querySelector(".updates")?.classList.add("hide");
    document.querySelector(".app-container")?.style.setProperty(
      "display",
      "flex"
    );
    const footer = document.createElement("div");
    footer.style.cssText = `
      position: fixed; bottom: 0; right: 0; left: 0;
      width: 100%;
      background: var(--bg-secondary);
      color: var(--text-primary); padding: 10px 0px;
      bordor: var(--border-color);
      font-size: 14px; transition: all 0.3s ease;`;
    footer.innerHTML = `<footer><img src='zigLogo.png' width='25' height='25' alt='ZIG'> Rights Reserved | Powered by <a href='allankayz.co.zw'><img src='AKLogo.ico' width='20' height='20' alt='AllanKayz'></a></footer>`;
    document.body.appendChild(footer);

    if(isMobileDevice()) {
      document.querySelector(".app-container")?.style.setProperty(
        "height",
        "85vh"
      );
    } else {
      document.querySelector(".app-container")?.style.setProperty(
        "height",
        "calc(100vh - 35px)"
      );
    }
  }
}
setupPlatformUI();

// ===== DOM Element Selections =====
const $ = (selector) => document.querySelector(selector);
const canvas = $("#canvas");
const ctx = canvas.getContext("2d");
const memberNameInput = $("#memberName");
const membershipCategoryInput = $("#membershipCategory");
const membershipIDInput = $("#membershipID");
const previewPlaceholder = $("#preview-placeholder");
const previewWindow = $("#preview");
const categories = Array.from(
  document.getElementById("categories").getElementsByTagName("option")
);
const modalTitle = $("#modalInfoTitle");
const modalContent = $("#modalInfoContent");
const multiPurposeBtn = $("#multiPurposeBtn");
const year = new Date();

// ===== State =====
let category = "";
let member = "";
let membershipNumber = "";

// ===== Image Loading =====
const image = new Image();
image.src = "ZiGCertTemplate.png";
image.onload = () =>
  drawImage(member, category, membershipNumber);

// ===== Title Bar Controls (Electron) =====
function setupTitleBar() {
  $("#min-btn")?.addEventListener("click", () =>
    window.electronAPI.minimize()
  );
  $("#max-btn")?.addEventListener("click", () => {
    const maximized =
      window.outerWidth === screen.availWidth &&
      window.outerHeight === screen.availHeight;
    maximized
      ? window.electronAPI.unmaximize()
      : window.electronAPI.maximize();
  });
  $("#close-btn")?.addEventListener("click", () => window.electronAPI.close());
}
setupTitleBar();

// ===== Sidebar Controls =====
function toggleSidebar() {
  const sidebar = $(".sidebar");
  if (!sidebar) return;
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("open");
  } else {
    sidebar.classList.toggle("collapsed");
  }
}

// Collapsible sidebar closes on outside click (mobile)
document.addEventListener("click", function (e) {
  const sidebar = $(".sidebar");
  const menuToggle = $(".menu-toggle");
  if (
    window.innerWidth <= 768 &&
    sidebar?.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    sidebar.classList.remove("open");
  }
});

// ===== View Navigation =====
const views = {
  create: { title: "Create New Certificate", viewId: "createView" },
  templates: { title: "Templates", viewId: "templatesView" },
  history: { title: "Certificate History", viewId: "historyView" },
  settings: { title: "Settings", viewId: "settingsView" },
  update: { title: "Software Updates", viewId: "updateView" }
};

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) =>
    item.addEventListener("click", function () {
      document
        .querySelectorAll(".nav-item")
        .forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      const viewName = this.getAttribute("data-view");
      const view = views[viewName];
      if (view) {
        $("#pageTitle").textContent = view.title;
        document
          .querySelectorAll(".page-view")
          .forEach((v) => v.classList.remove("active"));
        $("#" + view.viewId).classList.add("active");
        if (window.innerWidth <= 768) {
          $(".sidebar")?.classList.remove("open");
        }
      }
    })
  );
}
setupNavigation();

// ===== Updates Logic =====
function checkForUpdatesFromStatus() {
  document
    .querySelectorAll(".nav-item")
    .forEach((i) => i.classList.remove("active"));
  document
    .querySelector('[data-view="update"]')
    .classList.add("active");
  $("#pageTitle").textContent = "Software Updates";
  document
    .querySelectorAll(".page-view")
    .forEach((v) => v.classList.remove("active"));
  $("#updateView").classList.add("active");
  checkForUpdates();
}

function checkForUpdates() {
  const latestVersionEl = $("#latestVersion");
  const banner = $("#updateAvailableBanner");
  latestVersionEl.textContent = "Checking...";
  setTimeout(() => {
    latestVersionEl.textContent = "1.0.0";
    banner.style.display = "flex";
    // $("#whatsNewSection").style.display = 'block';
  }, 1500);
}

function startUpdate() {
  const progressDiv = $("#updateProgress");
  const progressFill = $("#progressFill");
  const statusText = $("#updateStatus");
  const banner = $("#updateAvailableBanner");

  banner.style.display = "none";
  progressDiv.style.display = "block";

  let progress = 0;
  const statuses = [
    "Preparing download...",
    "Downloading update... (0%)",
    "Downloading update... (25%)",
    "Downloading update... (50%)",
    "Downloading update... (75%)",
    "Downloading update... (100%)",
    "Installing update...",
    "Finalizing installation...",
    "Update complete! Restart required."
  ];

  const interval = setInterval(() => {
    if (progress <= 100) {
      progressFill.style.width = progress + "%";
      const statusIndex = Math.floor((progress / 100) * (statuses.length - 1));
      statusText.textContent = statuses[statusIndex];
      progress += 2;
    } else {
      clearInterval(interval);
      statusText.innerHTML =
        "<strong>Update installed successfully!</strong> Please restart the application.";
    }
  }, 100);
}

// ===== Modal Logic =====
function openModal(modalType) {
  if (modalType === "certificate") {
    $("#certificateModal").classList.add("active");
  } else {
    $("#infoModal").classList.add("active");
    switch (modalType) {
      case "noInfo":
      case "error":
        modalTitle.innerText = "Error";
        modalContent.innerText =
          "Missing Information. Please check all fields.";
        break;
      case "catError":
        modalTitle.innerText = "Error";
        modalContent.innerText = "Insert correct membership category";
        break;
    }
  }
}
function closeModal(modalType) {
  if (modalType === "certificate") {
    $("#certificateModal").classList.remove("active");
  } else {
    $("#infoModal").classList.remove("active");
  }
}

$("#certificateModal").addEventListener("click", function (e) {
  if (e.target === this) closeModal("certificate");
});
$("#infoModal").addEventListener("click", function (e) {
  if (e.target === this) closeModal("info");
});

// ===== Field Validation =====
function validateFields() {
  if (
    !memberNameInput.value ||
    !membershipCategoryInput.value ||
    !membershipIDInput.value
  ) {
    openModal("noInfo");
    return false;
  }
  if (
    !member ||
    !category ||
    !membershipNumber
  ) {
    openModal("error");
    return false;
  }
  if (!categories.some(opt => opt.value.toUpperCase() === membershipCategoryInput.value.toUpperCase())) {
    openModal("catError");
    return false;
  }
  return true;
}

function checkForErrors() {
  if (validateFields()) openModal("certificate");
}

// ===== Drawing and Data Helpers =====
function centerText(value, y) {
  const textWidth = ctx.measureText(value).width;
  const startX = canvas.width / 2 - textWidth / 2;
  return [value, startX, y];
}

function drawImage(member, category, membershipNumber) {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.font = "90px Charm";
  ctx.fillStyle = "#262264";
  let text = centerText(capitalizeWords(member), 545);
  ctx.fillText(...text);

  ctx.font = "40px Century Gothic Paneuropean";
  ctx.fillStyle = "#262264";
  let txt = centerText("IS A MEMBER OF ZIMBABWE INSTITUTE OF GEOMATICS", 630);
  ctx.fillText(...txt);

  let txtCat = centerText(category.toUpperCase(), 680);
  ctx.fillText(...txtCat);

  ctx.font = "44px Liberation Mono";
  ctx.fillStyle = "#262264";
  ctx.fillText(membershipNumber, 240, 860);
}

function capitalizeWords(str) {
  return str.replace(/\b\w+/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

function hasDatePassed(dateString) {
  return new Date(dateString) < new Date();
}

// ===== Inputs and Data Flow =====
memberNameInput.addEventListener("input", function () {
  member = capitalizeWords(memberNameInput.value.trim());
});

membershipCategoryInput.addEventListener("change", function () {
  const inputValue = membershipCategoryInput.value.toUpperCase();
  // Validate against category options
  if (!categories.some(opt => opt.value === inputValue)) {
    openModal("catError");
    membershipCategoryInput.value = "";
    category = "";
    return;
  }
  membershipCategoryInput.value = inputValue;
  // Set category text
  const endYear =
    hasDatePassed(year.getFullYear() + "-06-01")
      ? year.getFullYear() + 1
      : year.getFullYear();
  category =
    "REGISTERED AS A GEOMATICS " +
    membershipCategoryInput.value +
    " UNTIL 31 AUGUST " +
    endYear;
});

membershipIDInput.addEventListener("input", function () {
  membershipNumber = "ZIG" + membershipIDInput.value.trim();
});

// ===== Preview, Save, Reset =====
function preview() {
  previewPlaceholder.classList.add("hide");
  drawImage(member, category, membershipNumber);
  const dataURL = canvas.toDataURL();
  const img = new Image();
  img.src = dataURL;
  previewWindow.innerHTML = "";
  previewWindow.appendChild(img);
}

function saveCertificate(downloadFileType) {
  drawImage(member, category, membershipNumber);
  const imgData = canvas.toDataURL();
  switch (downloadFileType) {
    case "PDF": {
      const certpdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      certpdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      certpdf.save(`Certificate-${capitalizeWords(member)}.pdf`);
      break;
    }
    case "PNG": {
      multiPurposeBtn.href = imgData;
      multiPurposeBtn.download = `Certificate-${capitalizeWords(member)}.png`;
      break;
    }
  }
}

function reset() {
  memberNameInput.value = "";
  membershipCategoryInput.value = "";
  membershipIDInput.value = "";
  member = "";
  category = "";
  membershipNumber = "";
  previewWindow.innerHTML = "";
  previewPlaceholder.classList.remove("hide");
}

// ===== Appearance Settings =====
let settings = {
  theme: "dark",
  accentColor: "#667eea",
  fontSize: "medium"
};

function loadSettings() {
  try {
    const savedSettings = localStorage.getItem("certificateMakerSettings");
    if (savedSettings) {
      settings = { ...settings, ...JSON.parse(savedSettings) };
    }
  } catch {
    // fallback
    settings = settings;
  }
  applySettings();
}

function saveSettings() {
  localStorage.setItem(
    "certificateMakerSettings",
    JSON.stringify(settings)
  );
  applySettings();
}

function applySettings() {
  applyTheme(settings.theme);
  applyAccentColor(settings.accentColor);
  applyFontSize(settings.fontSize);
  updateFormControls();
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  const styles =
    theme === "light"
      ? {
          "--bg-primary": "#ffffff",
          "--bg-secondary": "#f5f5f5",
          "--bg-tertiary": "#e5e5e5",
          "--text-primary": "#333333",
          "--text-secondary": "#666666",
          "--border-color": "#dddddd"
        }
      : {
          "--bg-primary": "#1e1e1e",
          "--bg-secondary": "#252526",
          "--bg-tertiary": "#2d2d30",
          "--text-primary": "#cccccc",
          "--text-secondary": "#858585",
          "--border-color": "#3c3c3c"
        };
  for (const [key, value] of Object.entries(styles)) {
    document.body.style.setProperty(key, value);
  }
  if (theme === "system" && window.matchMedia) {
    applyTheme(
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
    );
  }
}

function applyAccentColor(color) {
  const darkerColor = shadeColor(color, -30);
  document.documentElement.style.setProperty("--accent-primary", color);
  document.documentElement.style.setProperty("--accent-secondary", darkerColor);
  document.documentElement.style.setProperty(
    "--accent-gradient",
    `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`
  );
  const preview = $(".color-preview");
  if (preview) preview.style.background = `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`;
}

function shadeColor(color, percent) {
  let R = parseInt(color.substr(1, 2), 16);
  let G = parseInt(color.substr(3, 2), 16);
  let B = parseInt(color.substr(5, 2), 16);
  R = Math.min(255, Math.floor((R * (100 + percent)) / 100));
  G = Math.min(255, Math.floor((G * (100 + percent)) / 100));
  B = Math.min(255, Math.floor((B * (100 + percent)) / 100));
  return (
    "#" +
    R.toString(16).padStart(2, "0") +
    G.toString(16).padStart(2, "0") +
    B.toString(16).padStart(2, "0")
  );
}

function applyFontSize(size) {
  const sizes = {
    small: "14px",
    medium: "18px",
    large: "22px"
  };
  document.documentElement.style.setProperty(
    "--base-font-size",
    sizes[size] ?? sizes.medium
  );
  updateFontSizeSpecifics(size);
}

function updateFontSizeSpecifics(size) {
  const scale = { small: 0.9, medium: 1, large: 1.1 }[size] ?? 1;
  $(".app-title") && ($(".app-title").style.fontSize = `${12 * scale}px`);
  $(".sidebar-title") && ($(".sidebar-title").style.fontSize = `${11 * scale}px`);
  document.querySelectorAll(".nav-item").forEach(
    (item) => (item.style.fontSize = `${13 * scale}px`)
  );
  $(".content-title") && ($(".content-title").style.fontSize = `${16 * scale}px`);
  document.querySelectorAll(".section-title").forEach(
    (el) => (el.style.fontSize = `${14 * scale}px`)
  );
  document.querySelectorAll(".form-label").forEach(
    (label) => (label.style.fontSize = `${12 * scale}px`)
  );
  document
    .querySelectorAll(".form-input, .form-select, .btn")
    .forEach((el) => (el.style.fontSize = `${13 * scale}px`));
}

function updateFormControls() {
  const themeSelect = $('select[name="theme"]');
  if (themeSelect) themeSelect.value = settings.theme;
  const colorPicker = $(".color-picker");
  if (colorPicker) colorPicker.value = settings.accentColor;
  const fontSizeSelect = $('select[name="fontSize"]');
  if (fontSizeSelect) fontSizeSelect.value = settings.fontSize;
}

// ===== Settings Event Listeners =====
document.addEventListener("DOMContentLoaded", function () {
  loadSettings();
  $('select[name="theme"]')?.addEventListener("change", function () {
    settings.theme = this.value;
    saveSettings();
  });
  $(".color-picker")?.addEventListener("input", function () {
    settings.accentColor = this.value;
    saveSettings();
  });
  $('select[name="fontSize"]')?.addEventListener("change", function () {
    settings.fontSize = this.value;
    saveSettings();
  });
  $(".save-appearance")?.addEventListener("click", function () {
    saveSettings();
    showNotification("Settings saved successfully!");
  });
});

// ===== Notification =====
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
      position: fixed; top: 50px; right: 20px;
      background: var(--accent-gradient, linear-gradient(135deg,#667eea 0%,#764ba2 100%));
      color: white; padding: 12px 20px; border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000;
      font-size: 14px; transition: all 0.3s ease;`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== System Theme Listener =====
if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    if (settings.theme === "system") applyTheme("system");
  });
}

// Export public API if needed (ES6 modules) or attach to window for legacy scripts
window.certificateMaker = {
  checkForErrors,
  preview,
  saveCertificate,
  reset,
  checkForUpdatesFromStatus,
  startUpdate,
  settings,
};