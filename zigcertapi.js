const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const memberName = document.getElementById('memberName');
const membershipCategory = document.getElementById('membershipCategory');
const membershipID = document.getElementById('membershipID');
const downloadBtnPNG = document.getElementById('download-btn-png');
const downloadBtnPDF = document.getElementById('download-btn-pdf');
const year = new Date();

//import jsPDF from "jspdf";
const { jsPDF } = window.jspdf;
var pdf = new jsPDF('landscape');

let category = "sample";
let member = "sample";
let membershipNumber = "sample";

const image = new Image();
image.src = "ZiGCertTemplate.png";
image.onload = function() {
    drawImage(member, category, membershipNumber);
}

function drawImage(member, category, membershipNumber) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let x = 1130,
    y = 1030;
    let maxWidth = 1080;

    ctx.font = "180px Charm";
    ctx.fillStyle = "#262264";
    ctx.fillText(member, x, y, maxWidth);

    let textWidth = ctx.measureText(member).with;
    let startX = x - textWidth/2;
    let startY = y - 0;
    ctx.fillText(member, startX, startY, maxWidth);

    ctx.font = "79px Century Gothic";
    ctx.fillStyle = "#262264";
    ctx.fillText("IS A MEMBER OF ZIMBABWE INSTITUTE OF GEOMATICS", 610, 1200)
    ctx.fillText(category.toUpperCase(), 410, 1300);

    ctx.font = "88px Liberation Mono";
    ctx.fillStyle = "#262264";
    ctx.fillText(membershipNumber, 500, 1720);
}

memberName.addEventListener('input', function() {
    memberNam = memberName.value;
    member = memberNam.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

})

membershipCategory.addEventListener('input', function() {
    category = "REGISTERED AS A GEOMATICS " + membershipCategory.value + " UNTIL 31 AUGUST "+ year.getFullYear();
})

membershipID.addEventListener('input', function() {
    membershipNumber = "ZIG" + membershipID.value;
})

downloadBtnPNG.addEventListener('click', function() {

    if (member == "" || category == "" || membershipNumber == "") {
        alert("Missing Information");
    } else if (member == "sample" || category == "sample" || membershipNumber == "sample") {
        alert("Missing Information, fill in Again");
    } else {

        drawImage(member, category, membershipNumber);
        downloadBtnPNG.href = canvas.toDataURL();
        downloadBtnPNG.download = "Certificate - "+member;
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