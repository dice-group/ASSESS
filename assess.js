//var rootURL = "http://[2001:638:902:2010:0:168:35:113]:8080/sparql2nl/rest/assess/";
var rootURL = "http://139.18.2.164:5678/assess/assess/";
// var rootURL = "http://localhost:5678/rest/assess/";
var currentQuestion = 0;
var totalCorrect = 0;
var questions;
var correctPositions;
var selectedPositions;
var isEvaluated = false;
var MAX_TIME = 10; // Please provide time in seconds
var timer;

$(document).ready(function() {
	// genrate question on click
	$('#generateQuestionsButton').click(function() {
		// check for choosen domain and question type
		if (!getQuestionTypesAsRestParam().length || !getDomainsAndProperties().length) {
			$('#notify').html('You forgot to set either domains and properties or question type.').slideDown();
			$('#notify').click(function() {
				$(this).slideUp().empty();
			});
			return false;
		} else {
			$("#notify").hide();
			$("#notify").slideUp().empty();
		}
		var l = Ladda.create(this);
		l.start();
		var domainsAndProperties = getDomainsAndProperties();
		console.log(domainsAndProperties);
		$.ajax({
			headers : {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json'
			},
			type : 'POST',
			url : rootURL + 'questions?' + getQuestionTypesAsRestParam() + '&limit=' + $('#numberOfQuestionsField').val(),
			dataType : "json",
			data : JSON.stringify(domainsAndProperties),
			success : function(data) {
				console.log("success" + data);
				var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
				questions = list[0].questions;
				// init
				$("#outerQuizContainer").show();
				$("#flipQuestion").hide();
				MAX_TIME = 600;
				$('#startButton').show();
				resetAllFields();

				// either evaluate the questions, or show the next questions
				$("#flipQuestion").unbind("click");
				$("#flipQuestion").click(function() {
					if (isEvaluated) {
						$("#flipQuestion").html("Submit");
						loadNewQuestion();
					} else {
						$("#flipQuestion").html("Next");
						eval();
					}
				});
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("Status: " + textStatus);
				alert("Error: " + errorThrown);
			}
		}).always(function() {
			l.stop();
		});

	});

	// !!! used for dynamically loading the tree !!!
<<<<<<< HEAD:assess-client/src/main/webapp/assess.js
	 loadTreeData(function(data) {
		 $('#jstree').jstree(data);
	 });
	
//	$("#tree").load("classes.html", function() {
//		$("#treecontainer").show();
//	});
=======
	// loadTreeData(function(data) {
	// $('#tree').tree(data);
	// });
	//$('#tree').tree({
//		dataSourceUrl: 'classes.json'
//	});
//	$("#treecontainer").show();

	$("#tree").load("classes.html", function() {
		$("#treecontainer").show();
	});
>>>>>>> origin/simple_project:assess.js
	$('#tree').tree();
	$('#collapse').click(function() {
		$("#totalScore").html("");
		$("#totalScore").hide();
		$("#questionPanel").hide();
		$("#flipQuestion").hide();
		$("#correctMessage").hide();
		$("#wrongMessage").hide();
		$('#outerQuizContainer').hide();
	});
});

function showTree(data) {
//	$('#jstree').jstree({
//		"checkbox" : {
//			real_checkboxes : true,
//			two_state : true,
//			checked_parent_open : true,
//			override_ui : true
//		},
//		// the `plugins` array allows you to configure the active plugins on
//		// this instance
//		"plugins" : [ "themes", "ui", "crrm", "hotkeys", "checkbox" ],
//		'core' : {
//			'data' : data,
//			// "checkbox" : {
//			// "keep_selected_style" : false
//			// },
//			// set a theme
//			"themes" : {
//				"theme" : "proton",
//				"dots" : false,
//				"icons" : false
//
//			},
//			
//		}
//	});
	$("#jstree").fancytree({
		source : data,
		activeVisible: true, // Make sure, active nodes are visible (expanded).
	    aria: false, // Enable WAI-ARIA support.
	    autoActivate: true, // Automatically activate a node when it is focused (using keys).
	    autoCollapse: false, // Automatically collapse all siblings, when a node is expanded.
	    autoScroll: false, // Automatically scroll nodes into visible area.
	    clickFolderMode: 4, // 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
	    checkbox: true, // Show checkboxes.
	    debugLevel: 0, // 0:quiet, 1:normal, 2:debug
	    disabled: false, // Disable control
	    generateIds: false, // Generate id attributes like <span id='fancytree-id-KEY'>
	    idPrefix: "ft_", // Used to generate node id´s like <span id='fancytree-id-<key>'>.
	    icons: false, // Display node icons.
	    keyboard: true, // Support keyboard navigation.
	    keyPathSeparator: "/", // Used by node.getKeyPath() and tree.loadKeyPath().
	    minExpandLevel: 1, // 1: root node is not collapsible
	    selectMode: 3, // 1:single, 2:multi, 3:multi-hier
	    tabbable: true, // Whole tree behaves as one single control
	    titlesTabbable: false // Node titles can receive keyboard focus

	});
	
}

// // !!!wichtig!!!
//function loadTreeData(callback) {
//	var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
//	$.ajax({
//		type : 'GET',
//		url : rootURL + 'entities',
//		dataType : "json",
//		success : function(data) {
//			var tree = new Object();
//			var arrayOfClasses = [];
//			var classes = [];
//			$.each(data, function(index) {
//				var entry = new Object();
//				entry.id = index;
//				entry.parent = "#";
//				entry.text = index.replace("http://dbpedia.org/ontology/", "").replace( rex, '$1$4 $2$3$5' );;
//				var node = new Object();
//				var span = new Object();
//				span.html = index.replace("http://dbpedia.org/ontology/", "");
//				node.span = span;
//				var children = [];
//				$.each(this, function(k) {
//					var child = new Object();
//					child.id = index + this;
//					child.parent = index;
//					child.text = this.replace("http://dbpedia.org/ontology/", "");
//					classes.push(child);
//					var childNode = new Object();
//					var span = new Object();
//					span.html = this.replace("http://dbpedia.org/ontology/", "");
//					childNode.span = span;
////					children.push(childNode);
//				});
////				entry.children = children;
//				node.children = children;
//				arrayOfClasses.push(node);
//				classes.push(entry);
//			});
//			tree.nodes = arrayOfClasses;
//			showTree(classes);
//		},
//		error : function(XMLHttpRequest, textStatus, errorThrown) {
//			alert("Status: " + textStatus);
//			alert("Error: " + errorThrown);
//		}
//	});
//}

//!!!wichtig!!!
function loadTreeData(callback) {
	var rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
	$.ajax({
		type : 'GET',
		url : rootURL + 'entities',
		dataType : "json",
		success : function(data) {
			var classes = [];
			$.each(data, function(index) {
				var entry = new Object();
				entry.key = index;
				entry.title = index.replace("http://dbpedia.org/ontology/", "").replace( rex, '$1$4 $2$3$5' );;
				var children = [];
				entry.children = children;
				$.each(this, function(k) {
					var child = new Object();
					child.key = index + this;
					child.title = this.replace("http://dbpedia.org/ontology/", "");
					children.push(child);
				});
				classes.push(entry);
			});
			showTree(classes);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Status: " + textStatus);
			alert("Error: " + errorThrown);
		}
	});
}

function getDomainsAndProperties() {
<<<<<<< HEAD:assess-client/src/main/webapp/assess.js
	var nodes = $("#jstree").fancytree('getTree').getSelectedNodes();
	var domains = {}; 

		$(nodes).each(function() {

		var cls = this.parent.key;
		var property = this.key.replace(cls, '');
		if (cls in domains) {
			domains[cls].push(property);
		} else {
			domains[cls] = [];
			domains[cls].push(property);
=======
	var domains = [];
	$('#tree > ul > li > input').each(function() {
		if (this.checked) {
			var next = $(this).next();
			var Class = new Object();
			Class.className = "http://dbpedia.org/ontology/"+ next.html();
			var properties = [];
			$(next).siblings("ul").children().children().each(function() {
				if (this.checked) {
					properties.push("http://dbpedia.org/ontology/"+ $(this).next().text());
				}
			});
			Class.properties = properties;
			domains.push(Class);
>>>>>>> origin/simple_project:assess.js
		}
	});
	var domains2 = [];
	for ( var key in domains) {
		console.log("Key:" + key);
		var cls = new Object();
		cls.className = key;
		var properties = domains[key];
		cls.properties = properties;
		domains2.push(cls);
	}
	return domains2;
	
//	var domains = [];
//	$('#tree > ul > li > input').each(function() {
//		if (this.checked) {
//			var next = $(this).next();
//			var Class = new Object();
//			Class.className = next.html();
//			var properties = [];
//			$(next).siblings("ul").children().children().each(function() {
//				if (this.checked) {
//					properties.push($(this).next().text());
//				}
//			});
//			Class.properties = properties;
//			domains.push(Class);
//		}
//	});
//	return domains;

}

$('[rel=tooltip]').tooltip({
	container : 'body'
});

$("#numberOfQuestionsField").TouchSpin({
	min : 0,
	max : 100,
	step : 1,
	decimals : 0,
	boostat : 5,
	maxboostedstep : 10
});

// returns a string for the URL param of the chosen question types
function getQuestionTypesAsRestParam() {
	var param = '';
	if ($('#questionTypesField-0').prop('checked')) {
		param += 'type=mc';
	}
	if ($('#questionTypesField-1').prop('checked')) {
		param += '&type=jeopardy';
	}
	if ($('#questionTypesField-2').prop('checked')) {
		param += '&type=truefalse';
	}
	return param;
}

function countDown() {
	MAX_TIME = MAX_TIME - 1;
	var timeRemain = pad(Math.floor((MAX_TIME / 3600))) + " : " + pad(Math.floor((MAX_TIME % 3600) / 60)) + " : " + pad(Math.floor((MAX_TIME % 3600) % 60));
	document.getElementById("countDown").innerHTML = timeRemain;
	if (MAX_TIME <= 0) {
		window.clearInterval(timer);
		$("#totalScore").show();
		$("#totalScore").html("TIME OUT! Total Score " + totalCorrect + " out of " + questions.length);
		$("#questionPanel").hide();
		$("#flipQuestion").hide();
		$("#correctMessage").hide();
		$("#wrongMessage").hide();
	}
}
function pad(n) {
	return n < 10 ? '0' + n : n;
}

function slideDown() {
	$("#questionPanel").slideToggle("medium");
}

function resetAllFields() {
	document.getElementById("wrongMessage").style.display = "none";
	document.getElementById("correctMessage").style.display = "none";
	document.getElementById("option0").className = "unselected";
	document.getElementById("option1").className = "unselected";
	document.getElementById("option2").className = "unselected";
	document.getElementById("option3").className = "unselected";
	document.getElementById("option4").className = "unselected";
	document.getElementById("option0").style.display = "block";
	document.getElementById("option1").style.display = "block";
	document.getElementById("option2").style.display = "block";
	document.getElementById("option3").style.display = "block";
	document.getElementById("option4").style.display = "block";
}

// start the quiz, i.e. show the first question
function beginQuiz(startButton) {
	resetAllFields();
	currentQuestion = 0;
	totalCorrect = 0;
	isEvaluated = false;

	correctPositions = [];
	selectedPositions = [];

	$('#collapse').click();

	timer = window.setInterval("countDown()", 1000);
	MAX_TIME = 600;
	$('#startButton').hide();
	$('#outerQuizContainer').show();
	$("#totalScore").show().html("Total Score");
	$("#questionPanel").show();
	$("#flipQuestion").show();
	$("#correctMessage").show();
	$("#wrongMessage").show();
	document.getElementById("questionPanel").style.display = "block";
	document.getElementById("outerQuizContainer").style.height = "380px";
	document.getElementById("flipQuestion").style.display = "inline";

	loadNewQuestion();
}

// show a new question
function loadNewQuestion() {
	resetAllFields();
	if (questions.length == currentQuestion) {
		document.getElementById("questionPanel").style.display = "none";
		document.getElementById("totalScore").style.display = "block";
		document.getElementById("flipQuestion").style.display = "none";
		document.getElementById("totalScore").innerHTML = "Total Score " + totalCorrect + " out of " + questions.length + ". Time left: " + MAX_TIME + " seconds!";
	} else {
		var question = questions[currentQuestion];

		document.getElementById("questionTitle").innerHTML = question.question;
		correctPositions = [];
		if (question.questionType == "truefalse") {
			document.getElementById("option2").style.display = "none";
			document.getElementById("option3").style.display = "none";
			document.getElementById("option4").style.display = "none";
		} else {
			document.getElementById("option2").style.display = "block";
			document.getElementById("option3").style.display = "block";
			document.getElementById("option4").style.display = "block";
		}
		$(question.correctAnswers).each(function(i, val) {
			correctPositions.push(i);
		});
		var answers = question.correctAnswers.concat(question.wrongAnswers);
		$(answers).each(function(i, val) {
			var answer = this.answer;
			// var hint = this.answerHint;
			if (answers[i] != "") {
				document.getElementById("option" + i).innerHTML = answer;
			} else {
				document.getElementById("option" + i).style.display = "none";
			}
		});

		document.getElementById("proceeding").innerHTML = "Question " + (currentQuestion + 1) + "/" + questions.length;
		document.getElementById("totalCorrectAnswers").innerHTML = totalCorrect + " correct answers";
		currentQuestion++;
	}
	isEvaluated = false;
	$("#questionPanel .unselected").shuffle();
}

// highlight the correct and wrong answers
function eval() {
	var totallyCorrect = true;
	$(correctPositions).each(function(i, val) {
		var selected = $('#option' + i).attr('class') == "selected";
		if (selected) {
			document.getElementById('option' + i).className = 'correctAnswer';
		} else {
			document.getElementById('option' + i).className = 'correctAnswerNotSelected';
			totallyCorrect = false;
		}
	});

	$('.selected').each(function(i, val) {
		var correct = false;
		var id = this.id;
		$(correctPositions).each(function(i, val) {
			if (id == 'option' + i) {
				correct;
			}
		});
		if (!correct) {
			this.className = 'wrongAnswer';
			totallyCorrect = false;
		}
	});
	if (totallyCorrect) {
		totalCorrect++;
	}
	isEvaluated = true;
}

// Invoked when user click on any answer options
function selectAnswer(button, option) {
	if (button.className == 'selected') {
		button.className = 'unselected';
	} else {
		button.className = 'selected';
	}
}
//http://css-tricks.com/snippets/jquery/shuffle-dom-elements/
(function($){
	 
    $.fn.shuffle = function() {
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
 
    };
 
})(jQuery);
