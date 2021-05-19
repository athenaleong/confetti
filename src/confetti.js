export default function EmojiConfettiGenerator(params) {

    var defaults = {
        target: 'confetti-holder', //id of the canvas 
        max: 50,
        animate: true,
        emojis: ['🍍', '💛'],
        width: window.innerWidth,
        height: window.innerHeight,
        startVelocity: 3,
        rotate: true,
        gravity: 5,
        sizeLower: 10,
        sizeHigher: 90,
        angle: 90/ 180 * Math.PI,
        origin: {x: [500, 500], 
                y: [300, 300]},
        spread: 0.5 * Math.PI
    };


    var cv = typeof defaults.target == 'object'
    ? defaults.target
    : document.getElementById(defaults.target);
    var ctx = cv.getContext("2d");
    var particles = []; 1.8

    function rand(min, max, floor=false) {
        if (min==max) 
            return min
        var random = Math.random() * (max - min) + min;
        return floor? Math.floor(random) : random
    }



    function emojiFactory() {
        var emoji = defaults.emojis[rand(0, defaults.props.length, true)] 
        var velocity = rand(defaults.startVelocity * 0.7, defaults.startVelocity * 3)
        var angle = rand(defaults.angle - defaults.spread, defaults.angle + defaults.spread)
        var velocityY = (angle % 360 > Math.PI) ? velocity * Math.sin(2 * Math.PI - angle) : velocity * - Math.sin(angle) 
        var velocityX =  (Math.PI / 2 < angle % 360 == angle % 360 < Math.PI * 3/2) ? velocity * - Math.cos(Math.abs(Math.PI - angle)) : velocity * Math.cos(2* Math.PI - angle) 
        var p = {
            emo : emoji,
            x: rand(defaults.origin.x[0], defaults.origin.x[1]),
            y: rand(defaults.origin.y[0], defaults.origin.y[1]),
            velocityX: velocityX,
            velocityY: velocityY,
            rotate: rand(0, 2 * Math.PI),
            rotateSpeed: (rand(-1, 1) < 0 ? -1 : 1) * rand(0.005, 0.03),
            size: rand(defaults.sizeLower, defaults.sizeHigher, true),
            
        }

        return p
    }

    function emojiDraw(emoji) {
        if (emoji){
            ctx.save();
            ctx.font = emoji.size + "px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline= "middle";
            if (defaults.rotate) {
                ctx.translate(emoji.x, emoji.y);
                ctx.rotate(emoji.rotate);
                ctx.translate(-1 * emoji.x, -1 * emoji.y);
            }
            ctx.fillText(emoji.emo, emoji.x, emoji.y);
            ctx.restore();
        }
    }

    function update() {
        for (var i in particles){
            var emoji = particles[i]
            if (emoji) {

                //Update x, y location
                var angle = emoji.angle - Math.PI; 
                emoji.y = emoji.y + emoji.velocityY+ 0.5 * defaults.gravity;
                emoji.x = emoji.x + emoji.velocityX;

                // Update velocity and rotation
                emoji.velocityY += defaults.gravity/100;
                emoji.rotate += emoji.rotateSpeed;

                // Update emoji if 
                if(emoji.y > defaults.height) {
                    particles[i] = undefined;
                }
            }
        }

        if (particles.every(function(p) { return p === undefined; })) {
            _clear();
        }

        return requestAnimationFrame(draw);
    }

    function draw(){
        ctx.clearRect(0, 0, defaults.width, defaults.height);

        for(var i in particles)
          emojiDraw(particles[i]);

        update(particles);

    }

    var _render = function() {
        cv.width = defaults.width;
        cv.height = defaults.height;
        for (var i=0; i < defaults.max; i++) {
            particles.push(emojiFactory())
        }
        for(var i in particles) {
            emojiDraw(particles[i])
        }
        update()

        requestAnimationFrame(draw)
    }

    var _clear = function() {
    defaults.animate = false;
    requestAnimationFrame(function() {
        ctx.clearRect(0, 0, cv.width, cv.height);
      var w = cv.width;
      cv.width = 1;
      cv.width = w;
    });
  }
    
    return {
        render: _render,
        clear: _clear 
    }

}
