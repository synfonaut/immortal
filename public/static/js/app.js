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
const map_protocol = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";
const immortal_protocol = "1NvmQsnpinHTf7KinvHmqLCM8hcaYaFbg4";

$(function() {
    init();
    animate();

    const params = new URLSearchParams(window.location.search);
    if (params.has("url")) {
        $("#url").val(params.get("url"));
    }

    $("#submit").submit(function(e) {

        e.preventDefault();

        var submittedUrl = $("#url").val().toLowerCase();

        if (!submittedUrl) {
            $("#error").html("Enter a valid URL you want to snapshot to send to the blockchain").css("display", "block");
            return;
        }

        if (submittedUrl.indexOf("http") != 0) {
            submittedUrl = "http://" + submittedUrl;
            $("#url").val(submittedUrl);
        }

        if (submittedUrl.match(/https?\:\/\/https?\:\/\//)) {
            submittedUrl = submittedUrl.replace(/^https?\:\/\//, "");
            $("#url").val(submittedUrl);
        }

        window.history.replaceState({}, 'ImmortalSV ' + submittedUrl, '/?url=' + submittedUrl);


        resolution = 15;
        speed = 4;

        setTimeout(function() {
            mouseX = Math.random() * 1000;
            mouseY = Math.random() * 1000;
        }, 500);

        $("#screenshot img").attr("src", "");
        $("#screenshot #link").css("display", "none").attr("href", "");
        $("#screenshot").addClass("loading");
        $("#screenshot #confirm").css("display", "none");
        $("#success").css("display", "none");
        $("#error").css("display", "none");

        const watermark = ($("#watermark:checked").val() == "on");

        $.ajax({
            method: "POST",
            url: "/scrape",
            contentType: "application/json",
            data: JSON.stringify({ url: submittedUrl, watermark: watermark }),
        }).done(function( msg ) {
            $("#screenshot").removeClass("loading");
            $("#screenshot #confirm").css("display", "block");

            if (msg.status == "ok" && msg.screenshot) {
                $("#screenshot img").attr("src", msg.screenshot);
                $("#screenshot #link").css("display", "inline").attr("href", msg.screenshot);

                var oReq = new XMLHttpRequest();
                oReq.open("GET", msg.screenshot, true);
                oReq.responseType = "arraybuffer";

                oReq.onload = function(oEvent) {
                    var blob = oReq.response;

                    const data = [
                        bitcom_protocol,
                        blob,
                        msg.mimeType,
                        "binary",
                        submittedUrl,
                        "|",
                        map_protocol,
                        "SET",
                        "url",
                        submittedUrl,
                    ];

                    const signedData = data;

                    databutton.build({
                        data: signedData,
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

                                var viewURL = "https://bico.media/" + msg.txid;

                                $("#success").html("Successfully immortalized " + submittedUrl + " to Bitcoin (BSV), see it <a href='" + viewURL+ "' target='_blank'>here</a>").css("display", "block");
                            }
                        }
                    });
                };

                oReq.send();
            } else {
                $("#error").html("Error while fetching website, please try again or contact synfonaut").css("display", "block");
            }

        });

    });
});

