

$(document).ready(function() {

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // variables used to get mouse position on the canvas
  var $canvas = $("#canvas");
  var canvasOffset = $canvas.offset();
  var offsetX = canvasOffset.left;
  var offsetY = canvasOffset.top;
  var scrollX = $canvas.scrollLeft();
  var scrollY = $canvas.scrollTop();

  // variables to save last mouse position
  // used to see how far the user dragged the mouse
  // and then move the text by that distance
  var startX;
  var startY;

  // an array to hold text objects
  var texts = [];

  // this var will hold the index of the hit-selected text
  var selectedText = -1;

// listen for mouse events
  $("#canvas").mousedown(function (e) {
      handleMouseDown(e);
  });
  $("#canvas").mousemove(function (e) {
      handleMouseMove(e);
  });
  $("#canvas").mouseup(function (e) {
      handleMouseUp(e);
  });
  $("#canvas").mouseout(function (e) {
      handleMouseOut(e);
  });

  function doDraw(checkedList /*textContent, xPos, yPos, font, height*/){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(3, 3, 232, 132);
    for (var i = 0; i < checkedList.length; i++) {
        var checked = checkedList[i];
        var y = texts.length * checked[4] + 20;

        // get the text from the input element
        var text = {
            text: checked[0],
            x: checked[1],
            y: checked[2]
        };

        // calc the size of this text for hit-testing purposes
        ctx.font = checked[3];
        text.width = ctx.measureText(text.text).width;
        text.height = checked[4];
        ctx.fillText(text.text, text.x, text.y);

        // put this new text in the texts array
        texts.push(text);
    }
    

    // redraw everything
    //draw();
  }

  var checkedList = [];
  $("#do-draw").click(function(){
    checkedList = [];
    if($('#dph').is(":checked")){
        var dphSize = $("#dph-size").val();
        checkedList.push(['M.R.P.', 20, 20, 'bold '+dphSize+'px arial', 10, 'discounted heading']);
    }
    if($('#dpv').is(":checked")){
        var dpvSize = $("#dpv-size").val();
        checkedList.push(['00', 20, 60, 'bold '+dpvSize+'px arial', 10, 'discounted value']);
    }
    if($('#ph').is(":checked")){
        var phSize = $("#ph-size").val();
        checkedList.push(['OUR PRICE', 130, 20, 'bold '+phSize+'px arial', 10, 'price heading']);
    }
    if($('#pv').is(":checked")){
        var pvSize = $("#pv-size").val();
        checkedList.push(['00', 145, 80, 'bold '+pvSize+'px arial', 10, 'price value']);
    }
    if($('#pn').is(":checked")){
        var pnSize = $("#pn-size").val();
        checkedList.push(['PRODUCT NAME', 40, 120, 'bold '+pnSize+'px arial', 10, 'product name']);
    }
    if($('#pq').is(":checked")){
        var pqSize = $("#pq-size").val();
        checkedList.push(['00 unit', 95, 100, ''+pqSize+'px arial', 10, 'product quantity']);
    }
    if(checkedList.length > 0){
        doDraw(checkedList);
    }
    
  });

    $("#save-draw").click(function(){
        var labelImg = {};
        var canvasObj = [];
        var canvasItem = {};
        for (var i = 0; i < texts.length; i++) {
            var text = texts[i];
            var checkedItem = checkedList[i];
            canvasItem = {
                'item' : checkedItem[5],
                'text' : text.text,
                'x' : text.x,
                'y' : text.y,
                'style' : checkedItem[3]
            };
            canvasObj.push(canvasItem);
        }
        labelImg = {
            'width': 240,
            'height' : 140,
            'elements' :canvasObj
        };
        console.log(JSON.stringify(labelImg));
    });

   
    // clear the canvas & redraw all texts
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < texts.length; i++) {
            var text = texts[i];
            ctx.fillText(text.text, text.x, text.y);
        }
    }

    function reDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.strokeRect(3, 3, 232, 132);
        for (var i = 0; i < texts.length; i++) {
            var text = texts[i];
            var checkedValue = checkedList[i];
            // ctx.fillText(text.text, text.x, text.y);

            ctx.font = checkedValue[3];
            text.width = ctx.measureText(text.text).width;
            text.height = checkedValue[4];
            ctx.fillText(text.text, text.x, text.y);
        }
    }

    // test if x,y is inside the bounding box of texts[textIndex]
    function textHittest(x, y, textIndex) {
        var text = texts[textIndex];
        // console.log((x +" >= "+ text.x +" && "+ x +" <= "+  (text.x + text.width) +" && "+ y +" >= "+ (text.y - text.height) +" && "+ y +" <= "+ text.y))
        return (x >= text.x && x <= (text.x + text.width) && y >= (text.y - text.height) && y <= text.y);
    }

    // handle mousedown events
    // iterate through texts[] and see if the user
    // mousedown'ed on one of them
    // If yes, set the selectedText to the index of that text
    function handleMouseDown(e) {
        e.preventDefault();
        // console.log(e.clientX+ " - "+ offsetX);
        // console.log(e.clientY+ " - "+ offsetY);
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);
        // Put your mousedown stuff here
        for (var i = 0; i < texts.length; i++) {
            if (textHittest(startX, startY, i)) {
                selectedText = i;
            }
        }

        // console.log(texts)
        // console.log(startX+", "+startY);
        // console.log(textHittest(startX, startY, 0));
    }

    // done dragging
    function handleMouseUp(e) {
        e.preventDefault();
        selectedText = -1;
    }

    // also done dragging
    function handleMouseOut(e) {
        e.preventDefault();
        selectedText = -1;
    }

    // handle mousemove events
    // calc how far the mouse has been dragged since
    // the last mousemove event and move the selected text
    // by that distance
    function handleMouseMove(e) {
        if (selectedText < 0) {
            return;
        }
        e.preventDefault();
        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // Put your mousemove stuff here
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        startX = mouseX;
        startY = mouseY;

        var text = texts[selectedText];
        text.x += dx;
        text.y += dy;
        console.log(text);
        // console.log(selectedText)
        texts[selectedText] = text;
        // console.log(texts);
        reDraw();

        //doDraw(checkedList);
    }
});
