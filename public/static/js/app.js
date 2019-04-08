// wave particles - https://codepen.io/deathfang/pen/WxNVoq

var mouseX = 85, mouseY = -342;

var SEPARATION = 100,
    AMOUNTX = 100,
    AMOUNTY = 70;

var container;
var camera, scene, renderer;

var particles, particle, count = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function init() {

    container = document.getElementById("particles");

    camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    particles = new Array();

    var PI2 = Math.PI * 2;
    var material = new THREE.ParticleCanvasMaterial({

        color: 0xe1e1e1,
        program: function(context) {

            context.beginPath();
            context.arc(0, 0, .6, 0, PI2, true);
            context.fill();

        }

    });

    var i = 0;

    for (var ix = 0; ix < AMOUNTX; ix++) {

        for (var iy = 0; iy < AMOUNTY; iy++) {

            particle = particles[i++] = new THREE.Particle(material);
            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scene.add(particle);

        }

    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //document.addEventListener('mousemove', onDocumentMouseMove, false);
    //document.addEventListener('touchstart', onDocumentTouchStart, false);
    //document.addEventListener('touchmove', onDocumentTouchMove, false);
    //window.addEventListener('resize', onWindowResize, false);
}

//
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

//
function animate() {
    requestAnimationFrame(animate);
    renderDots();
    renderText();
}

function renderDots() {
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY - camera.position.y) * .05;
    camera.lookAt(scene.position);

    var i = 0;

    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
            particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
        }
    }

    renderer.render(scene, camera);
    count += 0.1;
}


// text particle - https://codepen.io/anon/pen/PgGKJG
//
//

// basic setup  :) 

canvas = document.getElementById("text-canvas");
var ctx = canvas.getContext('2d');
W = canvas.width;
H = canvas.height;

gridX = 5;
gridY = 5;

colors = [
"#00A3EE", "#00BFF0", "#00D6DA",
"#40BAF2", "#80D1F7", "#BFE8FB",
"#40CFF4", "#80DFF8", "#BFEFFB",
"#40E0E3", "#80EBED", "#BFF5F6",
];

fieldvalue = "BSV";
gravity = parseFloat(0);
duration =  parseFloat(0.1);
resolution = parseFloat(5);
speed = parseFloat(0.1);
radius = parseFloat(2);

var message = new shape(W / 2, H / 2 + 50, fieldvalue);

message.getValue();

function renderText() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < message.placement.length; i++) {
        message.placement[i].update();
    }

    if (speed > 0.1) { speed -= 0.05; }
    if (speed < 0.1) { speed = 0.1; }

    if (resolution > 5) { resolution -= 0.2; }
    if (resolution < 5) { resolution = 5; }
}


const tip_address = "16srSTytNdk11V8xBKYuJQFZKGThzN4GzU";
const bitcom_protocol = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut";

$(function() {
    init();
    animate();

    $(".call-to-action").click(function() {

        const submittedUrl = $("#url").val();

        if (!submittedUrl) {
            alert("Enter a valid URL you want to snapshot to send to the blockchain");
            return;
        }

        resolution = 15;
        speed = 4;

        setTimeout(function() {
            mouseX = Math.random() * 1000;
            mouseY = Math.random() * 1000;
        }, 500);

        $("#screenshot img").attr("src", "");
        $("#screenshot").addClass("loading");
        $("#screenshot #confirm").css("display", "none");

        $.ajax({
            method: "POST",
            url: "https://immortalsv.com/scrape",
            contentType: "application/json",
            data: JSON.stringify({ url: submittedUrl }),
        }).done(function( msg ) {
            $("#screenshot").removeClass("loading");
            $("#screenshot #confirm").css("display", "block");

            if (msg.status == "ok" && msg.screenshot) {
                $("#screenshot img").attr("src", msg.screenshot);

                var oReq = new XMLHttpRequest();
                oReq.open("GET", msg.screenshot, true);
                oReq.responseType = "arraybuffer";

                oReq.onload = function(oEvent) {
                    var blob = oReq.response;

                    databutton.build({
                        data: [
                            bitcom_protocol,
                            blob,
                            msg.mimeType,
                            "binary",
                            submittedUrl,
                        ],
                        button: {
                            $el: "#money-button",
                            label: "Immortalize",
                            $pay: {
                                to: [{
                                    address: tip_address,
                                    value: 50000,
                                }]
                            },
                            onPayment: function(msg) {
                                console.log(msg);
                                console.log("https://bico.media/" + msg.txid);
                                console.log("https://www.bitpaste.app/tx/" + msg.txid);
                                console.log("https://www.bitcoinfiles.org/" + msg.txid);
                            }
                        }
                    });
                };

                oReq.send();
            }
        });

    });
});

