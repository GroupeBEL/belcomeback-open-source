    //stores the comment IDs
    var comments=new Array();
    var count=1 ;
	var sentiment='';
    function checkForComments() {
        $.getJSON("comment.php", addComments);
    }
    function addComments(data) {
		$(".new").fadeOut(600, function(){ $(this).remove();});
        //loop through all items in the JSON array
        for (var x = 0; x < data.length; x++) {
            //alert(data[x].id);
            if(jQuery.inArray(data[x].id, comments)==-1){
                comments[count] = data[x].id;
                //create a container for each comment
				if(data[x].note>0.7)
				{sentiment='good.png';} else { if (data[x].note<0.35) {sentiment='negatif.png';} else {sentiment='bof.png';}}
                var div = $("<div id='"+data[x].id+"'>").addClass("panel panel-default").hide().prependTo("#comments").fadeIn();
                $("<div>").addClass("sentiment").html('<div class="col-md-6"><div class="col-md-2"><img class="media-object" src="https://outlook.office365.com/ews/Exchange.asmx/s/GetUserPhoto?email='+data[x].email+'&size=HR64x64" style="width:40px; height:40px; border-radius:50%; border:solid 1px #E1E1E1;"> </div><div class="col-md-8">'+data[x].name+'</div><div class="col-md-2 pull-right"><img src="./images/'+sentiment+'" width=30px></div></div> ').appendTo(div);
                $("<div>").addClass("panel-body ").html('<h4 class="list-group-item-heading">'+data[x].comment+'</h4>').appendTo(div);
				$("<div>").addClass("new").html('new').appendTo(div).fadeIn();
				count++;
            } 

        }

    }



//script Questions

    //stores the comment IDs
    var commentsquestion=new Array();
    var count=1 ;
	var sentiment='';
    function checkForQuestions() {
        $.getJSON("listquestion.php", addquestions);
    }
    function addquestions(data) {
        //loop through all items in the JSON array
        for (var x = 0; x < data.length; x++) {
            //alert(data[x].id);
            if(jQuery.inArray(data[x].id, commentsquestion)==-1){
                commentsquestion[count] = data[x].id;
                //create a container for each comment
                var div = $("<div id='"+data[x].id+"'>").addClass("panel panel-default").hide().prependTo("#questions").fadeIn();
                $("<div>").addClass("sentiment").html('Nombre de point : '+data[x].point+'').appendTo(div);
                $("<div>").addClass("panel-body").html('<h4 class="list-group-item-heading" style="font-size:15px;">'+data[x].question+'</h4>').appendTo(div);
				
				count++;
            } 

        }

    }
	 var Classement=new Array();
	 var count=1 ;
	     function checkForclassement() {
        $.getJSON("Classement.php", Majclassement);
    }
function Majclassement(data) {
	
		$('#Classement').empty();	
	
        //loop through all items in the JSON array
		
        for (var x = 0; x < data.length; x++) {
            //alert(data[x].id);
         
                Classement[count] = data[x].id;
                //create a container for each comment
                var div = $("<div id='"+data[x].id+"'>").addClass("").hide().appendTo("#Classement").fadeIn();
				$("<div>").addClass("Position").html('<table width=100%><tr><td width=20%><h4 class="list-group-item-heading">#'+data[x].position+'</h4></td><td width=20% align=left><img class="media-object" src="https://outlook.office365.com/ews/Exchange.asmx/s/GetUserPhoto?email='+data[x].email+'&size=HR64x64" style="width:40px; height:40px; border-radius:50%; border:solid 1px #E1E1E1;"></td><td width=25%>'+data[x].user+'</td><td width=25%>'+data[x].point+' Points</td></tr>').appendTo(div);

				
				count++;
            

        }

    }

	
	
	
	 var analyse=new Array();
	 var count=1 ;
	 function checkForanalyse() {
      $('#canvas').load('analyse.php');
	 };

$(document).ready(function () {
        checkForComments();
        setInterval("checkForComments()", 5000);
    });

    $(document).ready(function () {
        checkForQuestions();
        setInterval("checkForQuestions()", 5000);
    });
    $(document).ready(function () {
        checkForclassement();
        setInterval("checkForclassement()", 10000);
    });
	$(document).ready(function () {
        checkForanalyse();
        setInterval("checkForanalyse()", 10000);
    });
	