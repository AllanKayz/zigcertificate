const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const memberName = document.getElementById("memberName");
const membershipCategory = document.getElementById("membershipCategory");
const membershipID = document.getElementById("membershipID");
const downloadBtnPNG = document.getElementById("download-btn-png");
const downloadBtnPDF = document.getElementById("download-btn-pdf");
const year = new Date();

const categories = document
  .getElementById("categories")
  .getElementsByTagName("option");
let modalTitle = document.getElementById("allPurposeLabel");
let modalContent = document.getElementById("modalContent");
let multiPurposeBtn = document.getElementById("multiPurposeBtn");
let downloadOption = "";

//import jsPDF from "jspdf";
//const { jsPDF } = window.jspdf;

let category = "sample";
let member = "sample";
let membershipNumber = "sample";

const image = new Image();
image.src = "ZiGCertTemplate.png";
image.onload = function () {
  drawImage(member, category, membershipNumber);
};

function centerText(value, y) {
  let textWidth = ctx.measureText(value).width;
  let startX = canvas.width / 2 - textWidth / 2;
  let startY = y - 0;

  return [value, startX, startY];
}

getData = function (elem) {
  const optionVals = [];

  for (i = 0; i < categories.length; i++) {
    optionVals.push(categories[i].value);
  }

  if (optionVals.indexOf(elem.value) > -1) {
    return elem;
  } else {
    controlModalContent("catError");
    membershipCategory.value = "";
  }
};

function drawImage(member, category, membershipNumber) {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  ctx.font = "90px Charm";
  ctx.fillStyle = "#262264";
  let text = centerText(member, 1030/2);
  ctx.fillText(text[0], text[1], text[2]);

  ctx.font = "40px Century Gothic";
  ctx.fillStyle = "#262264";
  const upperCategory = "IS A MEMBER OF ZIMBABWE INSTITUTE OF GEOMATICS";
  let txt = centerText(upperCategory, 1200/2);
  ctx.fillText(txt[0], txt[1], txt[2]);

  let txtCat = centerText(category.toUpperCase(), 1300/2);
  ctx.fillText(txtCat[0], txtCat[1], txtCat[2]);

  ctx.font = "44px Liberation Mono";
  ctx.fillStyle = "#262264";
  ctx.fillText(membershipNumber, 480/2, 1720/2);
}

memberName.addEventListener("input", function () {
  memberNam = memberName.value;
  member = memberNam.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
});

membershipCategory.addEventListener("input", function () {
  category =
    "REGISTERED AS A GEOMATICS " +
    membershipCategory.value +
    " UNTIL 31 AUGUST " +
    year.getFullYear();
});

membershipID.addEventListener("input", function () {
  membershipNumber = "ZIG" + membershipID.value;
});

function controlModalContent(errorType) {
  if (errorType == "none") {
    modalTitle.innerText = "Download Certificate as " + downloadOption;
    modalContent.innerText =
      "Insert Passkey to continue...[feature under development go ahead and download for now]";
    multiPurposeBtn.innerText = "Download";
    //multiPurposeBtn.setAttribute("hidden", false);

    if (multiPurposeBtn.innerText == "Download") {
      switch (downloadOption) {

        case "PNG":
          multiPurposeBtn.addEventListener("click", function () {
            drawImage(member, category, membershipNumber);
            multiPurposeBtn.href = canvas.toDataURL();
            multiPurposeBtn.download = "Certificate - " + member;
            downloadOption = "";
          });
          break;
        case "PDF":
          drawImage(member, category, membershipNumber);
          let imgData = canvas.toDataURL();

          const certpdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
          });

          certpdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            canvas.width,
            canvas.height,
            "FAST"
          );
          certpdf.save("Certificate-" + member + ".pdf");
          downloadOption = "";
          break;
      }
    }
  } else if (errorType == "noInfo") {
    modalTitle.innerText = "Error";
    modalContent.innerText =
      "Missing Information, Please check the information entered and make sure all fields are filled";
    //multiPurposeBtn.setAttribute("hidden", true);
  } else if (errorType == "catError") {
    modalTitle.innerText = "Error";
    modalContent.innerText = "Insert correct membership category";
    //multiPurposeBtn.setAttribute("hidden", true);
  } else {
    modalTitle.innerText = "Error";
    modalContent.innerText = "Re-enter information again";
    //multiPurposeBtn.setAttribute("hidden",true);
  }
}

downloadBtnPNG.addEventListener("click", function () {
  downloadOption = "PNG";
  if (member == "" || category == "" || membershipNumber == "") {
    controlModalContent("noInfo");
  } else if (
    member == "sample" ||
    category == "sample" ||
    membershipNumber == "sample"
  ) {
    controlModalContent("noInfo");
  } else {
    if (getData(membershipCategory)) {
      controlModalContent("none");
    } else {
      controlModalContent("catError");
    }
  }
});

downloadBtnPDF.addEventListener("click", function () {
  downloadOption = "PDF";
  if (member == "" || category == "" || membershipNumber == "") {
    controlModalContent("noInfo");
  } else if (
    member == "sample" ||
    category == "sample" ||
    membershipNumber == "sample"
  ) {
    controlModalContent("noInfo");
  } else {
    if (getData(membershipCategory)) {
      controlModalContent("none");
    } else {
      controlModalContent("catError");
    }
  }
});
