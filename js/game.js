var WIDTH=1000, HEIGHT=950, pi=Math.PI;
   var UpArrow = 38, DownArrow = 40;
   var canvas, ctx, keystate;
   var player, ai, ball;
   var player1score,player2score;
   var player1points=0,player2points=0;
   var music = new Audio('./audio/music.ogg');
   var levelup = new Audio('./audio/levelup.ogg');
   var leveldown = new Audio('./audio/leveldown.ogg');
   var pong2 = new Audio('./audio/pong2.ogg');
   var pong3 = new Audio('./audio/pong3.ogg');
   var win1 = new Audio('./audio/player1w.ogg');
   var win2 = new Audio('./audio/player2w.ogg');
   music.play();

  
// Player 1 setup
   player = {
     x: null,
     y: null,
     width: 20,
     height: 100,

     update: function() {
      // Player 1 speed
       if (keystate[UpArrow]) this.y -= 10;
       if (keystate[DownArrow]) this.y += 10;


     },
     // Draw Player 1
     draw: function() {
       ctx.fillRect(this.x, this.y, this.width, this.height);
     }
   };

   // Player 1 score setup
   player1score = {
     x: null,
     y: null,

     update: function() {
      player1points++;

      if (player1points == 5 || player2points == 5) {
        if (player1points > player2points) {
          win1.play();
          alert("Player 1 is the Winner")
        } else {
          win2.play();
          alert("Player 2 is the Winner");
        }
        location.reload();
      }

     },
     // Draw Player 1
     draw: function() {
        ctx.font="90px atari full";
        ctx.fillText(player1points,400,80);
     }
   };

// Player 2 setup
   ai ={
     x: null,
     y: null,
     width: 20,
     height: 100,

     update: function() {
       var desty = ball.y - (this.height - ball.side)*0.5;
       this.y += (desty - this.y) * 0.1;
     },
     draw: function() {
       ctx.fillRect(this.x, this.y, this.width, this.height);
     }
   };

      // Player 2 score setup
   player2score = {
     x: null,
     y: null,

     update: function() {
      player2points++;
      if (player1points == 5 || player2points == 5) {
        if (player1points > player2points) {
          win1.play();
          alert("Player 1 is the Winner")
        } else {
          win2.play();
          alert("Player 2 is the Winner");
        }
        location.reload();
      }

     },
     // Draw Player 2
     draw: function() {
        ctx.font="90px atari full";
        ctx.fillText(player2points,550,80);
     }
   };

   ball ={
     x: null,
     y: null,
     vel: null,
     side: 20,
     speed: 13,

     serve: function(side) {

       var r = Math.random();
       this.x = side===1 ? player.x : ai.x - this.side;
       this.y = (HEIGHT - this.side)*r;

       var phi = 0.1*pi*(1 - 2*r);
       this.vel = {
         x: side*this.speed*Math.cos(phi),
         y: this.speed*Math.sin(phi)
       }
     },
     update: function() {
       this.x += this.vel.x;
       this.y += this.vel.y;


       if (0 > this.y || this.y+this.side > HEIGHT) {
         pong2.play();
         var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y+this.side);
         this.y += 2*offset;
         this.vel.y *= -1;

       }

       var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
         return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
       };

       var pdle = this.vel.x < 0 ? player : ai;
       if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height,
         this.x, this.y, this.side, this.side)
         ) {
        pong2.play();
        this.x = pdle===player ? player.x+player.width : ai.x - this.side;
        var n = (this.y+this.side - pdle.y) / (pdle.height+this.side);
        var phi = 0.25*pi*(2*n - 1);
       var smash = Math.abs(phi) > 0.2*pi ? 1.5 : 1;
       this.vel.x = smash*(pdle===player ? 1 : -1)*this.speed*Math.cos(phi);
       this.vel.y = smash*this.speed*Math.sin(phi);
     }

     if (0 > this.x+this.side || this.x > WIDTH) {
         this.serve(pdle===player ? 1 : -1);
        // When player 1 makes a point
         if (this.x > 500 ) {
          player1score.update();
          levelup.play();
        } 
        // when player 2 makes a point
        else {
          player2score.update();
          leveldown.play();
        }
     }
 },
 draw: function() {
   ctx.fillRect(this.x, this.y, this.side, this.side);
 }
};
function main() {
 canvas = document.createElement("canvas");
 canvas.width = WIDTH;
 canvas.height = HEIGHT;
 ctx = canvas.getContext("2d");
 document.getElementById('game-area').appendChild(canvas);


 keystate = {};
 document.addEventListener("keydown", function(evt) {
   keystate[evt.keyCode] = true;
 });
 document.addEventListener("keyup", function(evt) {
   delete keystate[evt.keyCode];
 });

 init();

 var loop = function() {
   update();
   draw();

   window.requestAnimationFrame(loop, canvas);
 };
 window.requestAnimationFrame(loop, canvas);
}


function init() {
 player.x = player.width;
 player.y = (HEIGHT - player.height)/2;

 ai.x = WIDTH - (player.width + ai.width);
 ai.y = (HEIGHT - ai.height)/2;

 ball.serve(1);

}

function update() {
 ball.update();
 player.update();
 ai.update();
}

function draw() {
 ctx.fillRect(0, 0, WIDTH, HEIGHT);

 ctx.save();
 ctx.fillStyle = "#fff";

 ball.draw();
 player.draw();
 player1score.draw();
 player2score.draw();
 ai.draw();

 var w = 4;
 var x = (WIDTH - w)*0.5;
 var y = 0;
 var step = HEIGHT/20;
 while (y < HEIGHT) {
   ctx.fillRect(x, y+step*0.25, w, step*0.5);
   y += step;
 }

 ctx.restore();
}

main();