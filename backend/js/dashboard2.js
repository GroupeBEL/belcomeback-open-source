    //stores the comment IDs
    var comments=new Array();
    var count=1 ;
	var sentiment='';
    function checkForComments() {
        $.getJSON("comment.php", addComments);
    }
    function addComments(data) {
				if(data){
			$('#comments2').empty();
		//$(".new").fadeOut(600, function(){ $(this).remove();});
        //loop through all items in the JSON array
        for (var x = 0; x < data.length; x++) {
            //alert(data[x].id);
            //if(jQuery.inArray(data[x].id, comments)==-1){
                comments[count] = data[x].id;
                //create a container for each comment
				if(data[x].note>0.6)
				{sentiment='<img src="./images/good.png" width=75%>';
					} else {
						if (data[x].note<0.40) 
						{sentiment='<img src="./images/negatif.png" width=75%>';
						} else {
							sentiment='';
						}
					}
					
                var div = $("<div id='"+data[x].id+"'>").addClass("list-item").hide().appendTo("#comments2").show();
                $("<div>").addClass("list-datetime").html('<div class="date" style="font-size:20px">'+sentiment+'</div>').appendTo(div);
				$("<div>").addClass("list-info").html('<object data="https://outlook.office365.com/ews/Exchange.asmx/s/GetUserPhoto?email='+data[x].email+'&size=HR64x64" type="image/jpg" style="width:64px;" class="img-circle img-thumbnail"><img src="./img/avatar.png" alt=" "  ></object>').appendTo(div);
				 $("<div>").addClass("list-text").html('<a href="#" class="list-text-name" style="font-size:19px">'+data[x].name+' : '+data[x].comment+'</a>').appendTo(div);
				//$("<div>").addClass("new").html('NEW').appendTo(div).fadeIn();
				count++;
				sentiment='';
           // } 

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
		$('#questions2').empty();
		if(data){
        //loop through all items in the JSON array
        for (var x = 0; x < data.length; x++) {
            //alert(data[x].id);
            //if(jQuery.inArray(data[x].id, commentsquestion)==-1){
              //  commentsquestion[count] = data[x].id;
				if(data[x].percent==100)
				{
					style='progress-bar-danger';
				} else {
					style='progress-bar-info';
				}
				
                //create a container for each comment
                var div = $("<div id='"+data[x].id+"'>").addClass("list-item").hide().appendTo("#questions2").show();
                $("<div>").addClass("list-text").html('<strong>'+data[x].point+' points - Durée d\'activation : '+data[x].duree+' minutes </strong><p style="font-size:20px;color:#061b32;">'+data[x].question+'</p><div class="progress "><div class="progress-bar '+style+'" role="progressbar" aria-valuenow="'+data[x].percent+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data[x].percent+'%">'+data[x].percent+'%</div></div>').appendTo(div);
			
			//	count++;
            } 
		}
        //}

    }
	
	
	
	
	
	 var Classement=new Array();
	 var count=1 ;
	     function checkForclassement() {
        $.getJSON("Classement.php", Majclassement);
    }
function Majclassement(data) {
	if(data){
		$('#Classement').empty();	
	
        //loop through all items in the JSON array
		
        for (var x = 0; x < data.length; x++) {
            //alert(data[x].id);
         
                Classement[count] = data[x].id;
                //create a container for each comment
       //         var div = $("<div id='"+data[x].id+"'>").addClass("").hide().appendTo("#Classement").fadeIn();
		//		$("<div>").addClass("Position").html('<table width=100%><tr><td width=20%><h4 class="list-group-item-heading">#'+data[x].position+'</h4></td><td width=20% align=left><img class="media-object" src="https://outlook.office365.com/ews/Exchange.asmx/s/GetUserPhoto?email='+data[x].email+'&size=HR64x64" style="width:40px; height:40px; border-radius:50%; border:solid 1px #E1E1E1;"></td><td width=25%>'+data[x].user+'</td><td width=25%>'+data[x].point+' Points</td></tr>').appendTo(div);

				
				 var div = $("<div id='"+data[x].id+"'>").addClass("list-item").hide().appendTo("#Classement").show();
                $("<div>").addClass("list-datetime").html('<div class="date" style="font-size:19px">#'+data[x].position+'</div>').appendTo(div);
				$("<div>").addClass("list-info").html('<object data="https://outlook.office365.com/ews/Exchange.asmx/s/GetUserPhoto?email='+data[x].email+'&size=HR64x64" type="image/jpg" style="width:64px;" class="img-circle img-thumbnail"><img src="./img/avatar.png" alt=" " style="width:64px;" ></object>').appendTo(div);
				$("<div>").addClass("list-text").html('<a href="#" class="list-text-name" style="font-size:20px;">'+data[x].user+' - '+data[x].point+' Points</a>').appendTo(div);

				
				
				
				
				count++;
            

        }
	}
    }

	
	 var analyse=new Array();
	 var count=1 ;
	 function checkForanalyse() {
      $('#canvas').load('analyse.php');
	 };
	 
/*	 var analyse2=new Array();
	 var count=1 ;
	 function checkForanalyse2() {
      $('#canvas2').load('questionGraph.php');
	 };*/
	 
	 var Nbrjoueur=new Array();
	 function checkForjoueurs() {
      $('#canvasJoueur').load('nbr_joueurs.php');
	 };

	 function checkForcomments2() {
      $('#canvasComment').load('Taux-satisfaction.php');
	 };
	  function checkFonbrerep() {
      $('#canvasnbrrep').load('nbr_Reponses.php');
	 };
	 	 function checkForcomments15() {
      $('#canvasComment15').load('Taux-satisfaction15.php');
	 };
	 

$(document).ready(function () {
        checkForjoueurs(); 
		checkForComments();
		checkForcomments2();
		checkForcomments15();
		checkFonbrerep();
		//checkForanalyse();
		checkForclassement();
		checkForQuestions();
		setInterval("checkForComments()", 6000);
		setInterval("checkForcomments2()", 6000);
		setInterval("checkForcomments15()", 6000);
        //setInterval("checkForanalyse2()", 10000);
        setInterval("checkForjoueurs()", 15000);
        setInterval("checkFonbrerep()", 10000);	
        //setInterval("checkForanalyse()", 10000);
        setInterval("checkForclassement()", 10000);
        setInterval("checkForQuestions()", 6000);		
 });

