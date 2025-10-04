"use strict";

const { jsPDF } = window.jspdf;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const memberNameInput = document.getElementById("memberName");
const membershipCategoryInput = document.getElementById("membershipCategory");
const membershipIDInput = document.getElementById("membershipID");
const downloadBtnPNG = document.getElementById("download-btn-png");
const downloadBtnPDF = document.getElementById("download-btn-pdf");

const year = new Date();
const categories = Array.from(
  document.getElementById("categories").getElementsByTagName("option")
).map((option) => option.value);

const modalTitle = document.getElementById("allPurposeLabel");
const modalContent = document.getElementById("modalContent");
const multiPurposeBtn = document.getElementById("multiPurposeBtn");

let downloadOption = "";
let member = "sample";
let category = "sample";
let membershipNumber = "sample";

const image = new Image();
image.src = "ZiGCertTemplate.png";
image.onload = () => drawImage(member, category, membershipNumber);

function centerText(value, y) {
  const textWidth = ctx.measureText(value).width;
  const startX = canvas.width / 2 - textWidth / 2;
  return { text: value, x: startX, y: y };
}

function drawImage(member, category, membershipNumber) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Member Name
  const memberNameText = centerText(member, 545);
  ctx.font = "90px Charm";
  ctx.fillStyle = "#262264";
  ctx.fillText(memberNameText.text, memberNameText.x, memberNameText.y);

  // Membership Details
  ctx.font = "40px Century-Gothic";
  const membershipText = centerText(
    "IS A MEMBER OF ZIMBABWE INSTITUTE OF GEOMATICS",
    630
  );
  ctx.fillText(membershipText.text, membershipText.x, membershipText.y);

  const categoryText = centerText(category.toUpperCase(), 680);
  ctx.fillText(categoryText.text, categoryText.x, categoryText.y);

  // Membership ID
  ctx.font = "44px Liberation-Mono";
  ctx.fillText(membershipNumber, 240, 860);
}

function updateCategory() {
  const isDatePassed = hasDatePassed(`${year.getFullYear()}-06-01`);
  const nextYear = isDatePassed ? year.getFullYear() + 1 : year.getFullYear();
  category = `REGISTERED AS A GEOMATICS ${membershipCategoryInput.value} UNTIL 31 AUGUST ${nextYear}`;
}

function hasDatePassed(dateString) {
  return new Date(dateString) < new Date();
}

function updateModalContent(errorType) {
  switch (errorType) {
    case "none":
      modalTitle.textContent = `Download Certificate as ${downloadOption}`;
      modalContent.textContent =
        "Insert Passkey to continue...[feature under development go ahead and download for now]";
      multiPurposeBtn.textContent = "Download";
      break;
    case "noInfo":
      modalTitle.textContent = "Error";
      modalContent.textContent =
        "Missing Information. Please check the information entered and ensure all fields are filled.";
      break;
    case "catError":
      modalTitle.textContent = "Error";
      modalContent.textContent = "Insert correct membership category.";
      break;
    default:
      modalTitle.textContent = "Error";
      modalContent.textContent = "Re-enter information again.";
      break;
  }
}

function handleDownloadOption(type) {
  downloadOption = type;
  if (!member || !category || !membershipNumber || categories.includes(category)) {
    updateModalContent("noInfo");
  } else {
    updateModalContent("none");
  }
}

function downloadCertificate(format) {
  drawImage(member, category, membershipNumber);

  if (format === "PNG") {
    const imageData = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `Certificate - ${member}.png`;
    link.click();
  } else if (format === "PDF") {
    const imgData = canvas.toDataURL();
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`Certificate - ${member}.pdf`);
  }
}

// Event Listeners
memberNameInput.addEventListener("input", () => {
  member = memberNameInput.value
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
    .trim();
});

membershipCategoryInput.addEventListener("input", updateCategory);

membershipIDInput.addEventListener("input", () => {
  membershipNumber = `ZIG${membershipIDInput.value}`;
});

downloadBtnPNG.addEventListener("click", () => handleDownloadOption("PNG"));
downloadBtnPDF.addEventListener("click", () => handleDownloadOption("PDF"));
multiPurposeBtn.addEventListener("click", () =>
  downloadCertificate(downloadOption)
);
