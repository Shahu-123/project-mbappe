var gamePanel = document.querySelector('canvas');
var introPanel = document.querySelector('.intro');
var btnStart = document.querySelector('.start');
btnStart.onclick = function() {
  introPanel.style.display = 'none';
  startGame();
}
var myGamePiece;
var myObstacles = [];
var myJelly = [];
var points = 0;
var gameSpeed = 4;
var fps = 50/gameSpeed;
var myScore;
var playerImage = "turtleoffclick.tiff";
var onplayerImage = "turtleonclick.tiff";
var plasticImage = "plastic.webp";
var jellyImage = "jelly.webp";
var mbappeImage = "mbappeoffclick.tiff";
var onmbappeImage = "mbappeonclick.tiff";
var tmntImage = 'tmnt.tiff';
function startGame() {
    myGamePiece = new component(80, 80, playerImage, 10, 120, "image");
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, fps);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 3;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
	if (((myGameArea.frameNo + points) > 700) && (this == myGamePiece)) {
            this.image.src = mbappeImage;
    	} else if (((myGameArea.frameNo + points) > 500) && (this == myGamePiece)) {
            this.image.src = tmntImage;
	}
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
	} else if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
	this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.hitTop = function() {
	var rocktop = 0;
	if (this.y < rocktop) {
            this.y = rocktop;
            this.gravitySpeed = 3;
	}
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y + 20;
        var mybottom = this.y + (this.height) - 10;
        var otherleft = otherobj.x + (otherobj.width/3.5);
        var otherright = otherobj.x + (otherobj.width * 0.71);
        var othertop = otherobj.y + (otherobj.height/6);
        var otherbottom = otherobj.y + (otherobj.height * 0.65);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, minHeight, maxHeight, size, yPos;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }    
    for (i = 0; i < myJelly.length; i += 1) {
        if (myGamePiece.crashWith(myJelly[i])) {
            points += 500;
            myJelly.splice(i, 1);
        } 
    }
	
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = myGameArea.canvas.height/14;
        maxHeight = myGameArea.canvas.height/2;
        size = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	yPos = Math.floor(Math.random()*(myGameArea.canvas.height - (size/2)));
	myObstacles.push(new component(size, size, plasticImage, x, yPos, "image"));
    }
    if (myGameArea.frameNo == 1 || everyinterval(400)) {
        x = myGameArea.canvas.width;
        minHeight = myGameArea.canvas.height/14;
        maxHeight = myGameArea.canvas.height/3;
        size = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	yPos = Math.floor(Math.random()*(myGameArea.canvas.height - (size/2)));
	myJelly.push(new component(size, size, jellyImage, x, yPos, "image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1 * gameSpeed;
        myObstacles[i].update();
    }
    for (i = 0; i < myJelly.length; i += 1) {
        myJelly[i].x += -1 * gameSpeed;
        myJelly[i].update();
    }
    myScore.text="SCORE: " + (myGameArea.frameNo + points);
    myScore.update();
    gameSpeed = ((myGameArea.frameNo/800) + 1);
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}
function whenclick() {
    if (myGamePiece.image.src == ("https://shahu-123.github.io/" + mbappeImage)) {
	    myGamePiece.image.src = "https://shahu-123.github.io/mbappeonclick.tiff";
    }
    if (myGamePiece.image.src == ("https://shahu-123.github.io/" + playerImage)) {
            myGamePiece.image.src = onplayerImage;    
    }
    myGamePiece.update();
}
function whennotclick() {
    if (myGamePiece.image.src == ("https://shahu-123.github.io/" + onplayerImage)) {
            myGamePiece.image.src = playerImage;    
    }
    if (myGamePiece.image.src == ("https://shahu-123.github.io/" + onmbappeImage)) {
	    myGamePiece.image.src = "https://shahu-123.github.io/mbappeoffclick.tiff";    
    }
    myGamePiece.update();
}
