function Box(x,y,width,height,category)
{
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.category = category;
    this.visible = true;
    this.mouseOver = function(mouseX, mouseY)
    {
        //checking is the mouse over the box
        if(mouseX > x && mouseX < x+ width && mouseY >y && mouseY < y + height)
        {
            //returning the category name if condition is true
            return  category.name;
        }
        
        return false;
        
    }
    this.draw = function()
    {
        /*Code written exclusively by me*/
        //checking if box is visible
        if(this.visible)
        {
            //if visible fill the box with the category color
            fill(category.colour);
        }
        else
        {
            //else color the box grey
            var g = color(100,100,100,110);
            fill(g);
        }
        //draw each box
        rect(x,y,width,height);
    }

}