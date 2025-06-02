function Food()
{
    //Name for the visualisation to appear in the menu bar
    this.name = 'Food';
    
    //Each visualisation must have a unique ID with no special characters
    this.id = "food";
    
    //Property to represent whether data has been loaded
    this.loaded = false;
        
    var bubbles = [];
    var maxAmt;
    var years = [];
    var yearButtons = [];
    var angleSlider;
    
    //Preload the data.This function is called automatically by the gallery when a visualisation is added
    this.preload = function()
    {
        var self = this;
        this.data = loadTable(
        './data/bubbles/foodData.csv' ,'csv', 'header',
        //Callback function to set the value 
        //this.loaded to true
        function (table)
        {
            self.loaded = true;
        });
    }

//this is called automatically when the user click on the menu button
this.setup = function()
{
    console.log("in set up");
    
    /*Code exclusive by me */
    // Set up the slider
    angleSlider = createSlider(0.55, 1.7, 0.55, 0.01);
    angleSlider.position(350, 30); 
    
    // Create a paragraph to display the slider value
    angleSliderValue = createP();  // Create a p tag for displaying the value
    angleSliderValue.position(350, 35);  // Position it below the slider
    angleSliderValue.style('color', 'white');

    
    this.data_setup();

}

//this is called automatically when the user click on other menu button
this.destroy = function()
{
    /*Code exclusively by me*/
    console.log("destroyed");
    //clear away the years button
    select('#years').html("");
    
    //clear away the slider and the p tag
    if (angleSlider) {
        angleSlider.remove(); 
    }

    if (angleSliderValue) {
        angleSliderValue.remove(); 
    }
}

this.draw = function()
{
    background(0);
    
    if(!this.loaded)
    {
        console.log("data not yet loaded");
        return;
    }
    
    translate(width/2, height/2);
    
    /*Code exclusively by me*/
    //gets value of slider
    let angleValue = angleSlider.value();
    angleSliderValue.html('Angle Value: ' + angleValue.toFixed(2));  
    // Display value with 2 decimal places

    
    for(var i =0; i<bubbles.length; i++)
    {
        bubbles[i].update(bubbles, angleValue);
        bubbles[i].draw();
    }

}

this.data_setup = function() {
    bubbles = [];
    maxAmt = 0;
    years = [];
    yearButtons = [];

    var rows = this.data.getRows();
    var numColumns = this.data.getColumnCount();

    // Starting from column 5, create a button for each year
    for (var i = 5; i < numColumns; i++) {
        var y = this.data.columns[i];
        years.push(y);
        b = createButton(y, y);
        b.parent('years');
        b.mousePressed(function() {
            changeYear(this.elt.value, years, bubbles);
        });
        yearButtons.push(b);
    }

    // Create bubble for each food type
    // Each bubble consists of data value from 1974 till 2016-17
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].get(0) !== "") {
            // Set food name
            var b = new Bubble(rows[i].get(0));

            // Starting from column index 5
            for (var j = 5; j < numColumns; j++) {
                // Get value for each year
                if (rows[i].get(j) != "") {
                    var n = rows[i].getNum(j);
                    if (n > maxAmt) {
                        maxAmt = n; // Keep tally of highest value
                    }
                    b.data.push(n);
                } else {
                    // For empty values do this
                    b.data.push(0);
                }
            }
            bubbles.push(b);
        }
    }

    for (var i = 0; i < bubbles.length; i++) {
        bubbles[i].setMaxAmt(maxAmt);
        bubbles[i].setData(0);
    }

    /*Code written exclusively by me*/
    // Sort bubbles by target size in ascending order
    bubbles.sort(function(a, b) {
        return a.target_size - b.target_size;
    });
}
 
    /*Code written exclusively by me*/
    // Sort bubbles by target size in ascending order
    bubbles.sort(function(a, b) 
    {
        return a.target_size - b.target_size;
    });
    
}


//function to change year when buttons are clicked
function changeYear(year,_years,_bubbles)
{
    var y = _years.indexOf(year);
    
    //set selected year for all the bubbles
    for (var i =0; i<_bubbles.length; i++)
    {
        _bubbles[i].setData(y);
    }
    
    /*Code written exclusively by me*/
   // Sort bubbles by target size in ascending order
    _bubbles.sort(function(a, b) {
        return a.target_size - b.target_size;
    });
    
}