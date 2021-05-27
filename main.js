var myGamePiece;
var bullet_Piece=[];
var virus_Piece =[];
var arr_speeds = [-4,-3,4,3];
function startGame(){
    myGameArea;
    myGamePiece;
    bullet_Piece=[];
    virus_Piece =[];
    opened = true;
    document.getElementById("start_btn").style.display= "none";
    myGameArea.start();
    myGamePiece = new get_piece("hand-sanitizer.png",(myGameArea.game_canvas.width/2)-32,myGameArea.game_canvas.height-64);
    myscore = new get_score();
}

var myGameArea = {
    game_canvas : document.createElement("canvas"),
    start : function(){
        this.game_canvas.setAttribute('id','game_canvas');
        this.game_canvas.width = screen.width;
        this.game_canvas.height = window.innerHeight*0.95;
        this.state = false;
        this.frameNo =0;
        this.frameNo_v =0;
        this.context = this.game_canvas.getContext("2d");
        document.body.insertBefore(this.game_canvas,document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea,20);
        this.game_canvas.addEventListener('mousedown',function(e){
            if ((e.pageX-myGamePiece.x <= 40 && e.pageX-myGamePiece.x >=10 ) && (e.pageY-myGamePiece.y <= 64 && e.pageY-myGamePiece.y >=0)){
                this.state = true;
                myGameArea.x = e.pageX;
            }
        })
        this.game_canvas.addEventListener('mouseup',function(e){
            this.state = false;
            myGameArea.x = false;
        })
        this.game_canvas.addEventListener('mousemove',function(e){
            if (this.state){
                myGameArea.x = e.pageX;
            }
        })
        this.game_canvas.addEventListener('touchstart', function (e) {
            if ((e.touches[0].clientX-myGamePiece.x <= 45 && e.touches[0].clientX-myGamePiece.x >=10 ) && (e.touches[0].clientY-myGamePiece.y <= 64 && e.touches[0].clientY-myGamePiece.y >=0)){
                this.state = true;
                myGameArea.x = e.touches[0].clientX;
            }
        })
        this.game_canvas.addEventListener('touchend', function (e) {
            this.state = false;
            myGameArea.x = false;
        })
        this.game_canvas.addEventListener('touchmove', function (e) {
            if (this.state){
                myGameArea.x = e.touches[0].clientX;
            }
        })
    },
    clear : function(){
        this.context.clearRect(0,0,this.game_canvas.width,this.game_canvas.height);
    }
    
}

function get_piece(img,x,y){
    this.image = new Image();
    this.image.src = img;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx_game = myGameArea.context;
        ctx_game.drawImage(this.image,this.x,this.y);
    }
}

function get_bullet(x,y){
    this.bullet = new Image();
    this.bullet.src = "raindrop.png";
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx_bullet = myGameArea.context;
        ctx_bullet.drawImage(this.bullet,this.x,this.y,15,15);
    }
}

function get_score(){
    this.score = 0;
    this.x = (myGameArea.game_canvas.width/2)-30;
    this.y = 60;
    this.update = function(){
        ctx_score = myGameArea.context;
        ctx_score.font = "30px Comic Sans MS";
        ctx_score.fillStyle = "black";
        ctx_score.textAlign = "center";
        ctx_score.fillText("Score :"+this.score, this.x, this.y); 
    }
}

function get_virus(){
    this.virus = new Image();
    this.virus.src = "coronavirus.png";
    this.speedx = arr_speeds[Math.floor(Math.random()*4)];
    this.speedy = arr_speeds[Math.floor(Math.random()*4)];
    this.gravity = 0.3;
    this.gravity_speed = 0;
    this.radius = Math.floor(Math.random()*40)+60;
    this.x = Math.floor(Math.random()*myGameArea.game_canvas.width*0.8);
    this.y = 0;
    this.update = function(){
        ctx_virus = myGameArea.context;
        ctx_virus.drawImage(this.virus,this.x,this.y,this.radius,this.radius);
    }
}

function restart_game(){
    document.getElementById("start_btn").style.display= "block";
    document.getElementById("start_btn").innerHTML = "Restart Game";
}

function updateGameArea(){
    var i,j;
    myGameArea.clear();
    if (myGameArea.x){
        if (myGameArea.x >=16 && myGameArea.x <= myGameArea.game_canvas.width-16){
            myGamePiece.x = myGameArea.x - 32
        }
        myGameArea.frameNo+=1;
        if (myGameArea.frameNo == 1 || everyinterval(3,myGameArea.frameNo)){
            bullet_Piece.push(new get_bullet(myGamePiece.x+20,myGamePiece.y));   
        }
    }
    for (i=0;i<bullet_Piece.length;i++){
        if (bullet_Piece[i].y < 0){
            bullet_Piece.splice(i,1);
            continue;
        }
        bullet_Piece[i].y-=15;
        bullet_Piece[i].update();
    }
    myGameArea.frameNo_v+=1;
    if (myGameArea.frameNo_v == 1 || everyinterval(300,myGameArea.frameNo_v) || virus_Piece.length == 0) {
        virus_Piece.push(new get_virus());
    }
    for (i=0;i<virus_Piece.length;i++){
        if (myGamePiece.x >= virus_Piece[i].x-32 && myGamePiece.x <= virus_Piece[i].x+virus_Piece[i].radius-16){
            if (myGamePiece.y >=virus_Piece[i].y-16 && myGamePiece.y <= virus_Piece[i].y+virus_Piece[i].radius-16){
                clearInterval(myGameArea.interval);
                restart_game();
            }
        }
        if (virus_Piece[i].x <= 0 || virus_Piece[i].x >= myGameArea.game_canvas.width-virus_Piece[i].radius){
            virus_Piece[i].speedx*=-1;
        }
        if (virus_Piece[i].y <= 0 || virus_Piece[i].y >= myGameArea.game_canvas.height){
            virus_Piece[i].speedy*=-1;
            virus_Piece[i].gravity_speed*=-1;
        }
        for (j=0;j<bullet_Piece.length;j++){
            if (bullet_Piece[j].x >= virus_Piece[i].x-7 && bullet_Piece[j].x <= virus_Piece[i].x+virus_Piece[i].radius+5){
                if (bullet_Piece[j].y >=virus_Piece[i].y-5 && bullet_Piece[j].y <= virus_Piece[i].y+virus_Piece[i].radius+5){
                    virus_Piece[i].radius -= 1;
                    bullet_Piece.splice(j,1);
                    myscore.score+=1;
                }
            }
        }
        if (virus_Piece[i].radius < 60){
            virus_Piece.splice(i,1);
        }
        else{
            virus_Piece[i].gravity_speed+=virus_Piece[i].gravity;
            virus_Piece[i].x+=virus_Piece[i].speedx;
            virus_Piece[i].y+=virus_Piece[i].speedy+virus_Piece[i].gravity_speed;
            virus_Piece[i].update();
        }
    }
    myscore.update();
    myGamePiece.update();
}

function everyinterval(n,f_no) {
    if ((f_no / n) % 1 == 0) {return true;}
    return false;
}



