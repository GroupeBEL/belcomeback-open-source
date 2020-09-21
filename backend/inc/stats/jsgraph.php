<script>
$( document ).ready(function() {
	( function ( $ ) {
    "use strict";
//['January', 'February', 'March', 'April', 'May', 'June', 'July']
//[65, 59, 84, 84, 51, 55, 40]

    // Counter Number
    $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

 
    //WidgetChart 4
    var ctx = document.getElementById( "widgetChartAvg" );
    ctx.height = 150;
    var myChart = new Chart( ctx, {
        type: 'bar',
        data: {
            labels: <?php echo $label;?>,
            datasets: [
                {
                    label: "Inscris",
                    data: <?php echo $data;?>,
                    borderColor: "rgba(0, 123, 255, 0.9)",
                    //borderWidth: "0",
                    backgroundColor: "rgba(255,255,255,.3)"
                }
            ]
        },
        options: {
              maintainAspectRatio: true,
              legend: {
                display: true
            },
            scales: {
                xAxes: [{
                  display: true,
                  categoryPercentage: 1,
                  barPercentage: 0.5
                }],
                yAxes: [ {
                    display: true
                } ]
            }
        }
    } );



} )( jQuery );
});
</script>