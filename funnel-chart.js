function FunnelChart() {
    //name to the chart
    this.name = "Funnel Chart";
    //unique id for the chart
    this.id = "funnel-chart";
    //flag to check if data from csv is loaded
    this.loaded = false;
    //an array to store data about each funnel in the chart
    this.funnels = []; 
    //sets default shown year to 2023
    this.selectedYear = 2023;
    //to track which year is being selected
    this.selectedFunnel = null;

    //loads data from csv
    this.preload = function() {
        var self = this;
        this.data = loadTable('./data/university/schoolOfComputing.csv', 'csv', 'header', function(table) {
            self.loaded = true;
        });
    }

    this.setup = function() {
        console.log("in setup");
        this.data_setup();
        // Default to column index 3 (2023) for initial display
        this.updateDataForYear(3); 
        
        //adds event listener to the canvas
        canvas.addEventListener('click', this.mousePressedHandler);

    }

    //cleans up the chart when user changes to other charts
    this.destroy = function() {
        // Remove the mousePressed event listener
        canvas.removeEventListener('click', this.mousePressedHandler);

        // Clear data to ensure no further drawing occurs
        this.funnels = [];
        this.selectedFunnel = null;

        // Optionally clear the canvas or reset visual components
        clear();  // This would clear the p5.js canvas, if applicable
        console.log("Funnel chart destroyed and event listener removed.");
        
        console.log("destroyed");
        //clear away the years button
        select('#years2').html("");
    };

    //main drawing function that draws the visual representation of the chart 
   this.draw = function() {
        //checks if data is loaded before drawing
        if (!this.loaded) {
            console.log("Data not loaded yet.");
            return;
        }

        //draw title of the chart
        var title = 'Employment Survey on School of Computing in the year ' + this.selectedYear;
        var title2 = '(click and hover to see more)'
        fill(0);
        textSize(24);
        textAlign(CENTER, TOP);
        text(title, width / 2, 40);
        text(title2,width/2,70);

        //base colors for unshaded part of each funnel chart, representing total number of students enrolled in to each course
        let baseColors = [
            color(200, 200, 200), // Light gray for unshaded part
            color(200, 200, 200), // Light gray for unshaded part
            color(200, 200, 200), // Light gray for unshaded part
            color(200, 200, 200), // Light gray for unshaded part
        ];

        //highlight colors for shaded part of each funnel chart, representing the employment rate calculated from the total number of students enrolled in to each course
        let highlightColors = [
            color(255, 0, 0), // Red for shaded part
            color(51, 153, 255), // Blue for shaded part
            color(0, 255, 0), // Green for shaded part
            color(255, 255, 0), // Yellow for shaded part
        ];

        //remove stroke and center text for drawing
        textAlign(CENTER, CENTER);
        strokeWeight(0);

        //loops through each funnel data and draw it on canvas
        for (let i = 0; i < this.funnels.length; i++) {
            let funnel = this.funnels[i];
            let funnelWidth = funnel.normalizedRate;
            let centerX = funnel.x;
            let startY = funnel.y + 20;
            let topWidth = funnelWidth * 1.2;

            // Determines the width for the shaded part based on employment rate.
            let employmentRateWidth = funnelWidth * (funnel.employmentRate / 100);

            // Check if the mouse is hovering over this funnel
            let isHovered = mouseX > centerX - funnel.width / 2 && mouseX < centerX + funnel.width / 2 &&
                            mouseY > startY && mouseY < startY + funnel.height;

            //bouncing animation when user hovers over to indicate interactivity
            let bounceOffset = 0;
            if (isHovered) {
                bounceOffset = sin(frameCount * 0.1) * 2.5; // Creates a small bouncing effect

            }

            // Draw the unshaded part (light gray color)
            fill(baseColors[i % baseColors.length]);
            beginShape();
            vertex(centerX - topWidth / 2, startY + 20);
            vertex(centerX + topWidth / 2, startY + 20);
            vertex(centerX + funnelWidth / 2, startY + funnel.height - 20);
            vertex(centerX - funnelWidth / 2, startY + funnel.height - 20);
            endShape(CLOSE);
            ellipse(centerX, startY + 20, topWidth, 40); // Top cap
            ellipse(centerX, startY + funnel.height - 20, funnelWidth, 40); // Bottom cap

            // Draw the shaded part (highlight color) with bounce
            fill(highlightColors[i % highlightColors.length]);
            beginShape();
            vertex(centerX - employmentRateWidth / 2, startY + 20 - bounceOffset);
            vertex(centerX + employmentRateWidth / 2, startY + 20 - bounceOffset);
            vertex(centerX + employmentRateWidth / 2, startY + funnel.height - 20 + bounceOffset);
            vertex(centerX - employmentRateWidth / 2, startY + funnel.height - 20 + bounceOffset);
            endShape(CLOSE);
            ellipse(centerX, startY + 20 - bounceOffset, employmentRateWidth, 40); // Top cap
            ellipse(centerX, startY + funnel.height - 20 + bounceOffset, employmentRateWidth, 40); // Bottom cap

            // Courses text
            fill(0); // Set the text color to black
            textSize(14); // Set the text size to 14
            text(funnel.course, 200, startY + 50); // Draw the course name at a specified position

            // Students-enrolled text
            textSize(13); // Smaller text size for detail
            fill(0); // Black color for text
            text(funnel.studentNumber + " students enrolled", centerX, startY + 50);
        }

        // Draw green rectangle for the selected funnel, showing mean salary
        if (this.selectedFunnel) {
            let funnel = this.selectedFunnel;

            //creates dynamic sizing for rectangle based on salary data, scaling it up or down
            let rectWidth = map(funnel.meanSalary, 4000, Math.max(...this.funnels.map(f => f.meanSalary)), 200, 500);
            let rectHeight = map(funnel.meanSalary, 4000, Math.max(...this.funnels.map(f => f.meanSalary)), 50, 200);

            // Map textSize based on meanSalary
            let dynamicTextSize = map(funnel.meanSalary, 4000, Math.max(...this.funnels.map(f => f.meanSalary)), 20, 40);

            //calculating position to always center rectangle along the canvas
            let rectX = width / 2 - rectWidth / 2;
            let rectY = height / 2 + funnel.height + 30;

            //set rectangle color to green and draw the rectangle
            fill(0, 153, 76);
            rect(rectX, rectY, rectWidth, rectHeight);

            // White color for the text
            fill(255); 

            // Apply the dynamic text size
            textSize(dynamicTextSize); 

            // Calculate x and y to center the text within the rectangle
            let textX = rectX + rectWidth / 2;
            let textY1 = rectY + rectHeight / 3; // Center for the first line
            let textY2 = rectY + (2 * rectHeight) / 3; // Center for the second line

            textAlign(CENTER, CENTER); // Align text to be centered horizontally and vertically
            text("Mean Salary", textX, textY1);
            text(funnel.meanSalary, textX, textY2);
        }

        // Check hover and display employment rate
        for (let i = 0; i < this.funnels.length; i++) {
            let funnel = this.funnels[i];

            //check if mouse is within the width and height of each funnel
            if (mouseX > funnel.x - funnel.width / 2 && mouseX < funnel.x + funnel.width / 2 &&
                mouseY > funnel.y && mouseY < funnel.y + funnel.height) {

                fill(0);
                textSize(14);

                // Calculate the text position starting from the end of the funnel
                let textPosX = funnel.x + funnel.width / 2 + 100; // Start just outside the end of the funnel

                // Draw the employment rate text
                text(funnel.employmentRate + "% Employment", textPosX, funnel.textY);
            }
        }
}


    // Function to update data based on the selected year
    this.updateDataForYear = function(yearIndex) {
        
        //updates data based on selected index
        this.selectedYear = this.data.columns[yearIndex];
        let courses = [];
        let employmentRates = [];
        let studentNumbers = [];
        let meanSalaries = [];
        

        //loop through each row in the csv,extracting the data
        for (let i = 0; i < this.data.getRowCount(); i++) {
            let course = this.data.getString(i, 0); // Course name
            let employmentRate = this.data.getString(i + 1, yearIndex); // Employment rate for the selected year
            let studentNumber = this.data.getString(i, yearIndex); // Student number for the selected year
            let meanSalary = this.data.getString(i + 2, yearIndex); // Mean salary for the selected year

            //validating the data is truthy before adding to the array
            if (course && employmentRate && studentNumber) {
                courses.push(course);
                employmentRates.push(parseFloat(employmentRate));
                studentNumbers.push(studentNumber);
                meanSalaries.push(meanSalary); // Add mean salary to the array

                // Skip to the next course, since every 2 lines is a new course (Data structure)
                i += 2; 
            }
        }

        // Calculate the maximum and minimum student numbers for scaling purposes.
        let maxStudents = Math.max(...studentNumbers);
        let minStudents = Math.min(...studentNumbers);
        let normalizedStudentWidths = studentNumbers.map(number => map(number, minStudents, maxStudents, 200, 550));

        //map courses to funnel objects
        this.funnels = courses.map((course, index) => {
            let funnelWidth = normalizedStudentWidths[index];
            let startY = 100 + index * (80 + 10); // Adjust based on the funnel height and spacing
            let centerX = width / 2 - 30;

            // Return a structured object for each funnel.
            return {
                course: course,
                employmentRate: employmentRates[index],
                studentNumber: studentNumbers[index],
                meanSalary: meanSalaries[index], // Include mean salary in the funnel data

                normalizedRate: funnelWidth, // Width now based on student numbers
                x: centerX,
                y: startY,
                width: funnelWidth,
                height: 80, // Funnel height
                textX: centerX,
                textY: startY + 60, // Center of the funnel height
            };
        });

        this.draw(); // Redraw the chart with updated data
    }

    //setup function 
    this.data_setup = function() {
        var courses = [];
        var years = [];
        var yearButtons = [];
        
        //fetch total number of columns in the csv
        let totalColumns = this.data.getColumnCount();
        //fetch first column in the csv
        let firstColumn = this.data.getColumn(0);

        firstColumn.forEach((course) => {
            if (course && !courses.includes(course)) {
                courses.push(course);
            }
        });
        
        // Preserving context for callbacks.
        let self = this; 

        //creating buttons for each year
        for (var i = 3; i < totalColumns; i++) {
            var y = this.data.columns[i];
            years.push(y);
            let originalIndex = i; // store the original index

            let b = createButton(y, y);
            b.parent('years2');
            b.mousePressed(function() {
                console.log(`Year: ${this.elt.value}, Index: ${originalIndex}`);
                self.updateDataForYear(originalIndex); // Update data based on the selected year
            });

            //push button into array
            yearButtons.push(b);
        }

        console.log(courses);
    }

    // Handle mousePressed event within the constructor
    this.mousePressed = function() {
        //loops through each funnel to check for mouse interaction
        for (let i = 0; i < this.funnels.length; i++) {
            let funnel = this.funnels[i];
            let funnelWidth = funnel.normalizedRate;
            let centerX = funnel.x;
            let startY = funnel.y;

            //check if the mouse is wihtin the bounds of the funnel and if true, select that funnel
            if (mouseX > centerX - funnelWidth / 2 && mouseX < centerX + funnelWidth / 2 &&
                mouseY > startY && mouseY < startY + funnel.height) {
                this.selectedFunnel = funnel; // Store the selected funnel
                break;
            } else {
                this.selectedFunnel = null; // Deselect if clicked outside
            }
        }
        this.draw(); // Redraw the chart with the selected funnel
    }

    // Attach this.mousePressed to p5.js mousePressed event
    mousePressed = this.mousePressed.bind(this);
}
