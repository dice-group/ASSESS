//var rootURL = "http://[2001:638:902:2010:0:168:35:113]:8080/sparql2nl/rest/assess/";
//var rootURL = "http://139.18.2.56:8080/sparql2nl/rest/assess/";
var rootURL = "http://localhost:5678/rest/assess/";
var currentQuestion = 0;
var totalCorrect = 0;
var totalWrong = 0;
var questions;
var correctPositions;
var selectedPositions;
var isAnswered = false;
var isEvaluated = false;
var MAX_TIME = 600; // Please provide time in seconds
var timer;

$(document).ready(function() {
	// genrate question on click
	$('#generateQuestionsButton').click(function() {
		var l = Ladda.create(this);
		l.start();
		var domainsAndProperties = getDomainsAndProperties();
		var json = JSON.stringify(domainsAndProperties);
		console.log(json);
		$.ajax({
			headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
//			type : 'GET',
//			url : rootURL + 'questions?domain=http://dbpedia.org/ontology/Person' + getQuestionTypesAsRestParam() + '&limit=' + $('#numberOfQuestionsField').val(),
//new call
			type : 'POST',
			url : rootURL + 'questions?' + getQuestionTypesAsRestParam() + '&limit=' + $('#numberOfQuestionsField').val(),//domain=' + json+ 
			dataType : "json",
			data: JSON.stringify(domainsAndProperties),
		        
			// data type of response
			success : function(data) {
				var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
				questions = list[0].questions;
				document.getElementById("outerQuizContainer").style.display = "block";
				document.getElementById("flipQuestion").style.display = "none";
				// renderList
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("Status: " + textStatus);
				alert("Error: " + errorThrown);
			}
		}).always(function() {
			l.stop();
		});

	});

	// either evaluate the questions, or show the next questions
	$("#flipQuestion").click(function() {
		if (isEvaluated) {
			loadNewQuestion();
		} else {
			eval();
		}

		// $("#questionPanel").slideToggle("medium");
		// if(questions.length!=currentQuestion){
		// var t=setTimeout(slideDown,200);
		// }
		// t=setTimeout(loadNewQuestion,250);
	});
	// used for dynamically loading the tree
	// loadTreeData(function(data) {
	// $('#tree').tree(data);
	// });
	$("#tree").load("classes.html");
	$('#tree').tree();

	// });
});
// wichtig
function loadTreeData(callback) {
	$.ajax({
		type : 'GET',
		url : rootURL + 'entities',
		dataType : "json",
		success : function(data) {
			var tree = new Object();
			var arrayOfClasses = [];
			$.each(data, function(index) {
				var node = new Object();
				var span = new Object();
				span.html = index.replace("http://dbpedia.org/ontology/", "");
				node.span = span;
				var children = [];
				$.each(this, function(k) {
					var childNode = new Object();
					var span = new Object();
					span.html = this.replace("http://dbpedia.org/ontology/", "");
					childNode.span = span;
					children.push(childNode);
				});
				node.children = children;
				arrayOfClasses.push(node);
			});
			tree.nodes = arrayOfClasses;
			return callback(tree);

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Status: " + textStatus);
			alert("Error: " + errorThrown);
		}
	});
}
function getDomainsAndProperties() {
	var domains = [];
	$('#tree > ul > li > input').each(function() {
		if (this.checked) {
			var next = $(this).next();
			var Class = new Object();
			Class.className = next.html();
			var properties = [];
			$(next).siblings("ul").children().children().each(function() {
				if(this.checked){
					properties.push($(this).next().text());
				}
			});
			Class.properties = properties;
			domains.push(Class);
		}
	});
	return domains;

}

$('[rel=tooltip]').tooltip({
	container : 'body'
});

$('#form-submit').click(function(e) {
	alert('click');
	e.preventDefault();
	var l = Ladda.create(this);
	l.start();
	$.post("your-url", {
		data : data
	}, function(response) {
		console.log(response);
	}, "json").always(function() {
		l.stop();
	});
	return false;
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
		document.getElementById("questionPanel").style.display = "none";
		document.getElementById("totalScore").style.display = "block";
		document.getElementById("flipQuestion").style.display = "none";
		document.getElementById("totalScore").innerHTML = "TIME OUT! Total Score " + totalCorrect + " out of " + response.feed.entry.length;
		document.getElementById("correctMessage").style.display = "none";
		document.getElementById("wrongMessage").style.display = "none";
	}
}
function pad(n) {
	return n < 10 ? '0' + n : n
}

// generate the question and store them in a global variable
function generateQuestions(domain) {
	console.log('generating questions...');

	$.ajax({
		type : 'GET',
		url : rootURL + '?domain=' + domain,
		dataType : "json", // data type of response
		success : function(data) {
			var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
			questions = list[0].questions;
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Status: " + textStatus);
			alert("Error: " + errorThrown);
		}

	}).always(function() {
		l.stop();
	});
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
	isAnswered = false;
}

// start the quiz, i.e. show the first question
function beginQuiz(startButton) {
	$('.collapse').collapse();
	timer = window.setInterval("countDown()", 1000);
	startButton.style.display = "none";
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
		document.getElementById("totalScore").innerHTML = "Total Score " + totalCorrect + " out of " + questions.length+". Time left: "+ MAX_TIME + " seconds!";
	} else {
		var question = questions[currentQuestion];

		document.getElementById("questionTitle").innerHTML = question.question;
		correctPositions = [];
		$(question.correctAnswers).each(function(i, val) {
			correctPositions.push(i);
		});
		var answers = question.correctAnswers.concat(question.wrongAnswers);
		$(answers).each(function(i, val) {
			var answer = this.answer;
			var hint = this.answerHint;
			if (answers[i] != "") {
				document.getElementById("option" + i).innerHTML = answer;
			} else {
				document.getElementById("option" + i).style.display = "none";
			}
		});

		document.getElementById("proceeding").innerHTML = "Question " + (currentQuestion + 1) + "/" + questions.length;
		document.getElementById("totalCorrectAnswers").innerHTML = totalCorrect + " correct answers";
		// document.getElementById("flipQuestion").style.display="none";
		currentQuestion++;
	}
	isEvaluated = false;
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
	} else {
		totalWrong++;
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