function EmojiConfettiGenerator(params) {

    /**
     * Default values
     */
    var defaults = {
        target: 'confetti-holder', //id of the canvas 
        max: 80, //maximum number of particles produced
        emojis: ['🦕', '🥳'], //emojis
        width: window.innerWidth, //dynamics height
        height: window.innerHeight, //dynamic width
        startVelocity: 3, //starting velocity
        rotate: true,  //if emoji rotates
        gravity: 5,
        sizeLower: 10, //lower bound of emoji size
        sizeHigher: 90, //upper bound of emoji size
        angle: 270/180 * Math.PI, //angle of explosion
        origin: {x: [-200, window.innerWidth + 200],  
                y: [-600, 300]}, //range of origin of explosion
        spread: 0 * Math.PI //spread of explosion
    };

    /**
     * Update default values according to params
     */
    if(params)
        if (params.target != undefined && checkParam(params.target, 'string')) 
            defaults.target = params.target
        if (params.max != undefined && checkParam(params.max, 'number')) 
            defaults.max = params.max
        if (params.startVelocity != undefined && checkParam(params.startVelocity, 'number')) 
            defaults.startVelocity = params.startVelocity
        if (params.gravity != undefined && checkParam(params.gravity, 'number')) 
            defaults.gravity = params.gravity
        if (params.sizeLower != undefined && checkParam(params.sizeLower, 'number')) 
            defaults.sizeLower = params.sizeHigher
        if (params.sizeHigher != undefined && checkParam(params.sizeHigher, 'number')) 
            defaults.sizeHigher = params.sizeHigher
        if (params.spread != undefined && checkParam(params.spread, 'number')) 
            defaults.spread = params.spread
        if (params.angle != undefined && checkParam(params.angle, 'number')) 
            defaults.angle = params.angle
        if (params.emojis != undefined && checkEmojis(params.emojis))
            defaults.emojis = params.emojis
        
        

    var cv = typeof defaults.target == 'object'
    ? defaults.target
    : document.getElementById(defaults.target);
    var ctx = cv.getContext("2d");
    var particles = []; 

    function rand(min, max, floor=false) {
        if (min==max) return min
        var random = Math.random() * (max - min) + min;
        return floor? Math.floor(random) : random
    }

    /**
     * Create new particle
     */
    function emojiFactory() {
        var emoji = defaults.emojis[rand(0, defaults.emojis.length, true)] 
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


    /**
     * Update particle location, angel of rotation and velocity
     * @returns 
     */
    function update() {
        for (var i in particles){
            var emoji = particles[i]
            if (emoji) {
                //Update x, y location 
                emoji.y = emoji.y + emoji.velocityY+ 0.5 * defaults.gravity;
                emoji.x = emoji.x + emoji.velocityX;

                // Update velocity and rotation
                emoji.velocityY += defaults.gravity/100;
                if (defaults.rotate)
                    emoji.rotate += emoji.rotateSpeed;

                // Set particle as undefined if leaves screen
                if(emoji.y > defaults.height) {
                    particles[i] = undefined;
                }
            }
        }

        if (particles.every(function(p) { return p === undefined; })) {
            _clear();
        }
        else {
            return requestAnimationFrame(draw);
        }
    }

    /** 
     * Add particle to canvas
     */
    function draw(){
        ctx.clearRect(0, 0, defaults.width, defaults.height);

        for(var i in particles) {
            var emoji = particles[i]
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

        update();

    }

    /**
     * Render Canvas
     */
    var _render = function() {
        cv.width = defaults.width;
        cv.height = defaults.height;
        for (var i=0; i < defaults.max; i++) {
            particles.push(emojiFactory())
        }
        
        return draw()
    }

    /**
     * Clear Canvas
     */
    var _clear = function() {
    requestAnimationFrame(function() {
        ctx.clearRect(0, 0, cv.width, cv.height);
    //   var w = cv.width;
    //   cv.width = 1;
    //   cv.width = w;
    });
  }
    
    return {
        render: _render,
        clear: _clear 
    }

}

function checkParam(variable, type) {
    if (typeof variable !== type) throw new Error(`${variable} is not a ${type}`)
    return true
}

function checkEmojis(variable) {
    if (!Array.isArray(variable)) throw new Error("Array needed for Emojis")
    if (!variable.every((e) => {return typeof e === "string"})) throw new Error("Strings needed for emoji array")

    return true 
}

export default EmojiConfettiGenerator
