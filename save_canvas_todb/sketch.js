var database;
var drawing = [];
var currentPath = [];
var isDrawing =true;
function setup() {
  
  canvas = createCanvas(400,400);
  
  
  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);
  
  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);
  
  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);
  
  
  var config = { //accessed https://console.firebase.google.com/project/savecanvas/overview
    apiKey: "AIzaSyB6vp0Zo24JBzKZ4Wx3R_T_MjHROWe95Pk",
    authDomain: "savecanvas.firebaseapp.com",
    databaseURL: "https://savecanvas.firebaseio.com",
    storageBucket: "savecanvas.appspot.com",
    messagingSenderId: "715693392111"
  };
  firebase.initializeApp(config);
  database = firebase.database();
  
  var params = getURLParams();
  console.log(params);
  if(params.id){
	  console.log(params.id);
	  showDrawing(params.id);
	  
  }
  
  var ref = database.ref('savecanvas');
  ref.on('value', getData, errData);
  console.log(firebase);
}


function startPath(){
  isDrawing=true;
  currentPath = [];
  drawing.push(currentPath);
  
}

function endPath(){
  isDrawing = false;
}
//*//

function draw() {
  background(51);
  //find ways to store points as mouse is clicked & dragged..
  if(isDrawing){
    var point = {
      x: mouseX,
      y: mouseY
    }
    currentPath.push(point);
  }
  
  
  stroke(255);
  strokeWeight(4);
  noFill();
  for(var i = 0; i < drawing.length; i++ ){
    var path = drawing[i];
    beginShape();
    for(var j = 0; j < path.length; j++ ){
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
  
}


function saveDrawing(){
	var ref = database.ref('savecanvas');
	var data = {
		name: "test3",
		drawing: drawing
	}
	var result = ref.push(data, dataSent);
	console.log(result.key);
	function dataSent(err, status){
	  console.log(status);
	}
	
}

function getData(data) {
	//clear the listing
	var elts = selectAll('.listing');
	for(var i = 0; i < elts.length; i++){
		elts[i].remove();
	}
	
	
	var drawings = data.val();
	var keys = Object.keys(drawings);
	for(var i = 0; i < keys.length; i++){
		var key = keys[i];
		//console.log(key);
		var li = createElement('li', '');
		li.class('listing');
		var ahref = createA('#', key);
		ahref.mousePressed(showDrawing);
		ahref.parent(li);
		
		var perma = createA('?id='+key, 'permalink');
		perma.parent(li);
		perma.style('padding', '4px');
		li.parent('drawinglist');
		
	}
	
}

function errData(err){
	console.log(err);
}

function showDrawing(key){ //this returns an array with your name and drawing
  if(key instanceof MouseEvent){
	  var key = this.html();
  }
	var ref = database.ref('savecanvas/'+key);
	ref.on('value', oneDrawing, errData);
  
  function oneDrawing(data){
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    console.log(drawing);
  }
}


function clearDrawing(){
	drawing = [];
	
}
