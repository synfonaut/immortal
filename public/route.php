<?

$route =  @$_REQUEST["route"];

$seconds = ($route * 60);

?>

<style>
#countdown {
    display: block;
    text-align: center;
    padding: 350px;
    font-size: 144px;
    font-family: Helvetica;
    font-weight: 300;
}
</style>


<p id="countdown">Ready!</p>

<script>
// Set the date we're counting down to
var countDownDate = null;

// Update the count down every 1 second
function update() {

    if (!countDownDate) {
        countDownDate = new Date().getTime() + <?= ($seconds * 1000) ?>;
    }

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var output = [];

   if (days > 0) { output.push(days + "d "); }
   if (hours > 0) { output.push(hours + "h "); }
   if (minutes > 0) { output.push(minutes + "m "); }
   if (seconds > 0) { output.push(seconds + "s "); }

  document.getElementById("countdown").innerHTML = output.join(" ");

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "-";
  }
}

setTimeout(function() {
    var x = setInterval(update, 250);
}, 650);

document.getElemmentById("countdown").innerHTML = "Ready!";

</script>
