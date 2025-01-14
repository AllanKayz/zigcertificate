const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const memberName = document.getElementById("memberName");
const membershipCategory = document.getElementById("membershipCategory");
const membershipID = document.getElementById("membershipID");
const downloadBtnPNG = document.getElementById("download-btn-png");
const downloadBtnPDF = document.getElementById('download-btn-pdf');
const year = new Date();

//import jsPDF from "jspdf";
//const { jsPDF } = window.jspdf;
//var pdf = new jsPDF('landscape');

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

  return [value,startX,startY];
}

function drawImage(member, category, membershipNumber) {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  ctx.font = "180px Charm";
  ctx.fillStyle = "#262264";
  let text = centerText(member,1030);
  ctx.fillText(text[0],text[1],text[2]);

  ctx.font = "79px Century Gothic";
  ctx.fillStyle = "#262264";
  const upperCategory = "IS A MEMBER OF ZIMBABWE INSTITUTE OF GEOMATICS";
  let txt = centerText(upperCategory,1200);
  ctx.fillText(txt[0],txt[1],txt[2]);

  let txtCat = centerText(category.toUpperCase(),1300);
  ctx.fillText(txtCat[0],txtCat[1],txtCat[2]);
 
  ctx.font = "88px Liberation Mono";
  ctx.fillStyle = "#262264";
  ctx.fillText(membershipNumber, 480, 1720);
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

downloadBtnPNG.addEventListener("click", function () {
  if (member == "" || category == "" || membershipNumber == "") {
    alert("Missing Information");
  } else if (
    member == "sample" ||
    category == "sample" ||
    membershipNumber == "sample"
  ) {
    alert("Missing Information, fill in Again");
  } else {
    drawImage(member, category, membershipNumber);
    downloadBtnPNG.href = canvas.toDataURL();
    downloadBtnPNG.download = "Certificate - " + member;
  }
});

downloadBtnPDF.addEventListener('click', function() {

    if (member == "" || category == "" || membershipNumber == "") {
        alert("Missing Information");
    } else if (member == "sample" || category == "sample" || membershipNumber == "sample") {
        alert("Missing Information, fill in Again");
    } else {

        drawImage(member, category, membershipNumber);
        let imgData = canvas.toDataURL();
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save("Certificate-"+member+".pdf")
    }

});
