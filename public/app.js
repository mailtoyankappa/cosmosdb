function showStatus(result, label) {
  $(label).text("Status: " + result);
};

document.addEventListener('DOMContentLoaded', function() {

  //Read data from DB to the myServer
  $("#readDataFromDB").click(function() {
	  var formData = {
			'intent' 			: $('input[name=intent]').val(),
			'entity' 			: $('input[name=entity]').val(),
			'selectResponse' 	: $('select[name=selectResponse]').val(),
			'answertag' 		: $('input[name=answertag]').val(),
			'answer' 			: $('input[name=answer]').val(),
			'entitytype' 		: $('input[name=entitytype]').val(),
			'linkarray' 		: $('input[name=linkarray]').val(),
			'iconarray' 		: $('input[name=iconarray]').val()
		};
		//var myform = document.getElementById("NewIntent");
		//var formData = new FormData(myform);
		//var formData = JSON.stringify($("#NewIntent").serializeArray());
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/readDataFromDB",
	  data 		: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function(res) {
        //Show status
        console.log(res);
        showStatus(res.status, '#readDataFromDBLabel');
      },
      error: function() {
        //Show status
        console.log(res);
        showStatus(res.status, '#readDataFromDBLabel');
      }
    });

  });


   //Delete the chart
  $("#deleteChart").click(function() {
	   var formData = {
			'intent' 			: $('input[name=intent]').val(),
			'entity' 			: $('input[name=entity]').val(),
			'selectResponse' 	: $('select[name=selectResponse]').val(),
			'answertag' 		: $('input[name=answertag]').val(),
			'answer' 			: $('input[name=answer]').val(),
			'entitytype' 		: $('input[name=entitytype]').val(),
			'linkarray' 		: $('input[name=linkarray]').val(),
			'iconarray' 		: $('input[name=iconarray]').val()
		};
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/deleteChart",
	  data 		: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function(res) {
        //Show status
        console.log(res);
        showStatus(res.status, '#deleteChartLabel');
      },
      error: function() {
        //Show status
        console.log(res);
        showStatus(res.status, '#deleteChartLabel');
      }
    });

  });
  
     //Update the chart
  $("#updateChart").click(function() {
	   var formData = {
			'intent' 			: $('input[name=intent]').val(),
			'entity' 			: $('input[name=entity]').val(),
			'selectResponse' 	: $('select[name=selectResponse]').val(),
			'answertag' 		: $('input[name=answertag]').val(),
			'answer' 			: $('input[name=answer]').val(),
			'entitytype' 		: $('input[name=entitytype]').val(),
			'linkarray' 		: $('input[name=linkarray]').val(),
			'iconarray' 		: $('input[name=iconarray]').val()
		};
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/updateChart",
	  data 		: formData,
      dataType: 'json',
      contentType: 'application/json',
      success: function(res) {
        //Show status
        console.log(res);
        showStatus(res.status, '#deleteChartLabel');
      },
      error: function() {
        //Show status
        console.log(res);
        showStatus(res.status, '#deleteChartLabel');
      }
    });

  });
  
  //Create chart 
  $("#sendToHCCloud").click(function() {

    $.ajax({
      type: "GET",
      url: "http://localhost:3000/sendToHCCloud",

      dataType: 'json',
      contentType: 'application/json',
      success: function(res) {
        //Show status
        console.log(res);
        showStatus(res.status, '#sendToHCCloudLabel');
      },
      error: function() {
        //Show status
        console.log(res);
        showStatus(res.status, '#sendToHCCloudLabel');
      }
    });

  });

  //duplicate chart
  $("#duplicateChart").click(function() {

    $.ajax({
      type: "GET",
      url: "http://localhost:3000/duplicateChart",

      dataType: 'json',
      contentType: 'application/json',
      success: function(res) {
        //Show status
        console.log(res);
        showStatus(res.status, '#duplicateChartLabel');
      },
      error: function() {
        //Show status
        console.log(res);
        showStatus(res.status, '#duplicateChartLabel');
      }
    });

  });


}, false);
