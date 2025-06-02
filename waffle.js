function Waffle(x ,y, width, height, boxes_across, boxes_down, table, columnHeading, possibleValues) 
{
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.boxes_down = boxes_down;
    this.boxes_across = boxes_across;
    
    //extract column from table based on column heading
    var column = table.getColumn(columnHeading);
    var possibleValues = possibleValues;
     
    //set of colours used for different categories
    var colours = ["red", "green", "blue", "purple", "yellow", "orange"];
    
    var categories = [];
    var boxes =[];
    
    /*Code written exclusively by me*/
    //properties for text visibility for proportion text 
    this.proportionText ="";
    this.proportionVisible = false;
    
    
    //function to find the index of a category by searching the name 
    function categoryLocation(categoryName)
    {
        for(var i=0; i<categories.length; i++)
        {
            if (categoryName == categories[i].name)
            {
                return i; 
            }
        }
        
        return -1;
    }
    
    //function to add categories 
    function addCategories() 
    {
        for (var i=0; i<possibleValues.length; i++)
        {
            categories.push({
                "name" : possibleValues[i],
                "count":0,
                "colour": colours[i % colours.length]
            })
        }
        
        //count the occurences of each category in the column
        for (var i=0; i<column.length; i++)
        {
            var catLocation = categoryLocation(column[i])
            
            if(catLocation != -1)
            {
                categories[catLocation].count++;
            }
        }
        
        //iterate over categories and add proportions
        for (var i=0; i<categories.length; i++)
        {
            categories[i].boxes = round((categories[i].count /column.length) * (boxes_down * boxes_across));
        }
    }
    
    //add boxes to waffle chart
    function addBoxes()
    {
        var currentCategory = 0;
        var currentCategoryBox = 0;
        var boxWidth = width / boxes_across;
        var boxHeight = height / boxes_down;
        
        //creating 2d array of boxes
        for (var i=0; i<boxes_down; i++)
        {
            boxes.push([]);
            for(var j=0; j<boxes_across; j++)
            {
                if(currentCategoryBox == categories[currentCategory].boxes)
                {
                    currentCategoryBox = 0;
                    currentCategory++;
                }
                
                //add new box to current row
                boxes[i].push(new Box(x + (j* boxWidth), y + (i*boxHeight), boxWidth, boxHeight, categories[currentCategory]));
                
                currentCategoryBox++;
                
            }
        }
        
    }
    
    addCategories(); 
    addBoxes();
    
    this.draw = function()
    {
        //draw waffle diagram
        fill(0);
        strokeWeight(1);
        textSize(20);
        textAlign(LEFT,BOTTOM);
        text(columnHeading,this.x,this.y);
        for (var i=0; i< boxes.length; i++)
        {
            for (var j=0; j<boxes[i].length; j++)
            {   
                if(boxes[i][j].category != undefined)
                {
                    boxes[i][j].draw();
                }
            }    
            
        }
        
        /*Code written exclusively by me*/
        //draw proportion text if proportion visible is true
        if (this.proportionVisible) {
            fill(0);
            textSize(16);
            text(this.proportionText, this.x+ 10, this.y + this.height +20); 
        } 
        
    }
    
    // Method to check if the mouse is over any box and display the category name
    this.checkMouse = function(mouseX, mouseY)
    {
        for (var i=0; i<boxes.length; i++)
        {
            for (var j=0; j<boxes[i].length; j++)
            {
                if(boxes[i][j].category != undefined)
                {
                    var mouseOver = boxes[i][j].mouseOver(mouseX, mouseY);
                
                    if(mouseOver !== false)
                    {
                        push();
                        fill(0);
                        textSize(20);
                        var tWidth = textWidth(mouseOver);
                        textAlign(LEFT, TOP);
                        rect(mouseX, mouseY, tWidth +20, 40);
                        fill(255);
                        text(mouseOver,mouseX + 10, mouseY +10);
                        pop();
                        break;
                    }
                }
            }
        }
    }
    
    /*Code written exclusively by me*/
    //method to show boxes of a specific category when the same coloured button is pressed
    this.showOnlyCategory = function (color) {
        var visibleCount = 0;
        var totalCount = 0;

        for (var i = 0; i < boxes.length; i++) {
            for (var j = 0; j < boxes[i].length; j++) {
                if (boxes[i][j].category) {
                    totalCount++;
                    if (boxes[i][j].category.colour === color) {
                        boxes[i][j].visible = true;
                        visibleCount++;
                    } else {
                        boxes[i][j].visible = false;
                    }
                }
            }
        }

        //updates proportion text making it visible
        this.visibleCount = visibleCount;
        this.totalCount = totalCount;
        this.proportionText = `${visibleCount} / ${totalCount}`;
        this.proportionVisible = true;
    };


}