function WaffleChart()
{

    //Name for visualisation to appear in the menu bar
    this.name = "Waffle Chart";
    
    //Each visualisation must have unique ID with no special characters
    this.id='waffle-chart';
    
    //Property to represent whether data has been loaded
    this.loaded = false;
    
    //Title for chart
    this.title ='Eating Behaviours of British Students';
    
    this.waffles = [];
    
    //Preload the data.This function is called automatically but the gallery when a visualisation is added
    this.preload = function()
    {
        var self = this;
        this.data = loadTable('./data/waffle/finalData.csv', 'csv','header',
        //Callback function to set value
        //this.loaded to true
        function(table)
        {
            self.loaded = true;
        });
        
    }
    
    this.setup = function()
    {
        strokeWeight(1);
        /*Code written exclusively by me*/
        //array for days of the week for each waffle chart
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
		"Sunday"
	   ];
        
        //values of eating behaviour which is also each category
        var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out',
		'Skipped meal', 'Left overs'
	   ]
    
        //array of colours corresponding to each category
        var colours = ["red", "green", "blue", "purple", "yellow", "orange"];
        
        //layout configuration for positioning the waffle charts
        this.layout = 
        {
            startX: 20,
            startY: 20,
            waffleWidth : 200,
            waffleHeight : 200,
            waffleWidthPadding:20,
            waffleHeightPadding:60,
            secondRowPadding:100
        }
        
        /*Code written exclusively by me*/
        var self = this;
        this.buttons = [];
        //creating buttons for each colour to filter each category
        for (var i = 0; i < colours.length; i++) 
        {
            (function(color) 
             { 
                var button = createButton(color.charAt(0).toUpperCase() + color.slice(1));
                button.position(width/2 + i * 80, 600); 
                button.style('background-color', color); 
                button.mousePressed(function() 
                {
                    for (var j = 0; j < self.waffles.length; j++) {
                        self.waffles[j].showOnlyCategory(color);
                    }
                });
                self.buttons.push(button);
            })(colours[i]);

        }
        
        //creating waffle charts for each day of the week
        for (var i=0; i<days.length; i++)
        {
            //first row
            if(i<4) 
            {
            var w_x = this.layout.startX + (i*(this.layout.waffleWidth + this.layout.waffleWidthPadding));
            var w_y = this.layout.startY;
            var w_width = this.layout.waffleWidth;
            var w_height = this.layout.waffleHeight;
            
            var w = new Waffle(w_x,w_y,w_width,w_height,8,8,this.data,days[i],values);
            
            this.waffles.push(w);

            
            }
            //second row
            else 
            {
            var w_x = this.layout.startX + this.layout.secondRowPadding;
            w_x +=((i-4)*(this.layout.waffleWidth+this.layout.waffleWidthPadding));
            
            var w_y = this.layout.startY + this.layout.waffleHeight + this.layout.waffleHeightPadding;
            var w_width = this.layout.waffleWidth;
            var w_height = this.layout.waffleHeight;
            
            var w = new Waffle(w_x,w_y,w_width,w_height,8,8,this.data,days[i],values);
            
            this.waffles.push(w);
            

            }
        }

    }
    
    /*Code written exclusively by me*/
    //method to clean up and remove  buttons and proportion texts
    this.destroy = function()
    {
        // Remove all dynamically created buttons
        for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].remove(); // Remove the button from the DOM
    }

        // Clear the buttons array
        this.buttons = [];
        
        //remove all proportional text 
        for (var i = 0; i < this.waffles.length; i++) {
        this.waffles[i].proportionVisible = false;
    }
}

    
    this.draw = function()
    {   
        if(!this.loaded)
        {
            console.log("Data not yet loaded");
            return;
        }
        
        background(255);
        stroke(0);
        strokeWeight(1);
        //drawing each waffle chart
        for (var i=0; i<this.waffles.length; i++)
        {
            this.waffles[i].draw();
        }
    
        //check if mouse is over any box in waffle charts
        for (var i=0; i<this.waffles.length; i++)
        {
           this.waffles[i].checkMouse(mouseX,mouseY);
        }
        
        /*Code written exclusively by me*/
        //Draw title
        fill(0);
        textSize(24);
        textAlign(CENTER,TOP);
        text(this.title,width/2- 50,520);
        
        /*Code written exclusively by me*/
        //Draw subtitle
        fill(0);
        textSize(14);
        textAlign(CENTER,TOP);
        text("(hover over the charts to see various eating behaviours)", width/2 -50, 550);
        
    }
    
}