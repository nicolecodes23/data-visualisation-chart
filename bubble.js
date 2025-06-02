function Bubble(_name) {
    //initial size of bubble
    this.size = 20;
    //target size for bubble to graduatually adjust to
    this.target_size = 20;
    this.pos = createVector(0, 0);
    this.direction = createVector(0, 0);
    this.name = _name;
    this.maxAmt = 0;
    this.color = color(random(0, 255), random(0, 255), random(0, 255));
    this.data = [];
    /*Code written exclusively by me*/
    //random text offset for label positioning to avoid texts clashing 
    this.textOffset = Math.round(random(-6,10));
    

    this.draw = function() {
        
        push();
        //drawing bubbles
        textAlign(CENTER);
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
        
        //drawing text
        fill(255);
        textSize(14);
        text(this.name, this.pos.x, this.pos.y + this.textOffset);
        pop();
    };

    /*Code written exclusively by me*/
    this.update = function(_bubbles,angleValue) {
    // Define spiral parameters
    var index = _bubbles.indexOf(this); // Use the sorted index
    var angle = index * angleValue; // This value to controls the tightness of the spiral
    var radius = 15 + index * 12.5; // This value is to control the spacing and starting point

    // Calculate the position based on spiral equation
    this.pos.x = radius * cos(angle);
    this.pos.y = radius * sin(angle);

    // Adjust size gradually towards target size
    if (this.size < this.target_size) {
        this.size += 1;
    } else if (this.size > this.target_size) {
        this.size -= 1;
    }
};

    //method to set the data for bubble to adjust to its target size
    this.setData = function(i) {
        // Map the data value to a size between 15 and 147 based on maxAmt
        this.target_size = map(this.data[i], 0, this.maxAmt, 15, 147);
    };

    //method to set the maximum amount for normalisation
    this.setMaxAmt = function(_maxAmt) {
        this.maxAmt = _maxAmt;
    };
}
