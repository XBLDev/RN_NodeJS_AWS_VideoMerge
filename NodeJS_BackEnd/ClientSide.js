// $('#ledon-button').click(function() {
//     $.ajax({
//         type: 'POST',
//         url: 'http://localhost:3000/LEDon'
//     });
// });

// $('#ledoff-button').click(function() {
//     $.ajax({
//         type: 'POST',
//         url: 'http://localhost:3000/LEDoff'
//     });
// });

$('#video-convert-button').click(function() {
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8080/VideoConversion'
        // success:function(data) {
        //     console.log("success");
        // }       
    });
});