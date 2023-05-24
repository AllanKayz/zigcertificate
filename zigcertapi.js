const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const memberName = document.getElementById('memberName');
const membershipCategory = document.getElementById('membershipCategory');
const membershipID = document.getElementById('membershipID');
const downloadBtn = document.getElementById('download-btn');

let category = "";
let member = "";
let membershipID = "";

const image = new Image();
image.src = "ZiGCertTemplate.png";
image.onload = function() {
    drawImage();
}

function drawImage(fontsize,fonttype, fontcolor) {
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    ctx.font = fontsize +" " + fonttype;
    console.log(ctx.font)
    ctx.fillStyle = fontcolor;
    //ctx.fillText(textfill, 40, 180);
}

memberName.addEventListener('input', function(){
    const member = memberName.value;
    drawImage("150px","Charm","#262264");
    ctx.fillText(member, 40, 180);
})

membershipCategory.addEventListener('input', function(){
    const category = membershipCategory.value;
    drawImage("79px","Century Gothic","#262264");
    ctx.fillText(category, 60, 180);
})

membershipID.addEventListener('input', function(){
    const IdNumber = membershipID.value;
    drawImage("88px","Liberation Mono","#262264", IdNumber);
})

downloadBtn.addEventListener('click', function(){
    downloadBtn.href = canvas.toDataURL();
    downloadBtn.download = "Certificate - "+memberName.value;
})