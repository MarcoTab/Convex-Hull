/* This script implements the fast convex hull algorithm for a set of points in the cartesian 2D plane.
   Anything containing the debug variable is not needed to run the algorithm adn is just there for debugging purposes. 
   I kept it in cause it looks better (for me)
   Also I have the canvas set to the maximum length and it is still not enough to have all the messages show up if you use all of the possible points*/


let points = [];
let name = 0;
let title = 0;   // Serves to only print stuff once
let debug = 0;


function setup() {
  createCanvas(1000, 10000);
  textSize(15);
}


function draw() {
  if (title == 0) {
    text("Left click to place dots, press h/H to run convex hull algorithm.", 20, 20);
    strokeWeight(2);
    line(20, 28, 589, 28);
    line(589, 28, 589, 600);
    line(20, 600, 589, 600);
    line(20, 28, 20, 600);
    title++;
  }
  if (key === 'h') {
    CH(points); // does convex hull
  }
}

function mouseClicked() {
  if (mouseButton === LEFT) {
    name++;
    strokeWeight(10);
    point(mouseX, mouseY);
    text(name, mouseX-20, mouseY+20); // put a point on the screen alongside its name
    points.push(new Point(mouseX, mouseY, name));  // Init new point object

  }
}

function CH(points) {
  strokeWeight(2);
  if (debug == 0) {
    text("Starting Upper Hull Calculation", 600, 20);
  }
  
  // Start Upper Hull
  points.sort(comparePoints);              // Sort points in ascending x value order
  let listup;
  if (points[0].x != points[1].x && points.length > 2) {
    listup = [points[0], points[1]];     // Place first two points in the listup array (list of points in the upper hull)
  } else {
    let ind = 1;
    for (ind; ind < points.length && points[0].x == points[ind].x; ind++);
    listup = [points[0], points[ind]];
  }
  
  let i = 2;
  for (i = 2; i < points.length; i++) {
    if (listup[listup.length-1].x != points[i].x && i != points.length-1) { // Check that the penultimate listup point isn't on the same x value as the next point we check. Also check we're not looking at last point.
      listup.push(points[i]);                                               // Push the point to the listup
      debug++;
      text("Current upper hull list:", 600, 20+debug*18);
      for (let p = 0; p < listup.length; p++) {
        debug++;
        text(listup[p].name + " = (" + listup[p].x+","+listup[p].y+")", 625, 20+debug*18);
      } 
       
      while(listup.length > 2 && !checkLastThreeU(listup)) {                // While there are at least 2 points in the list and at least one of the last three points are violating hull properties
        const index = listup.length-2;                                      // get index of middle point                                                  
        debug++;                                       
        text("Removing " + listup[index].name, 600, 20+debug*18);  
        listup.splice(index, 1);                                          // remove it  
        
        
        debug++;
        text("Current upper hull list:", 600, 20+debug*18);
        for (let p = 0; p < listup.length; p++) {
          debug++;
          text(listup[p].name + " = (" + listup[p].x+","+listup[p].y+")", 625, 20+debug*18);
        }
      }
    }
  }
  
  listup.push(points[i-1]);                                                 // Do one more repetition of this to catch the vertical leftmost edge case.
  debug++;
  text(" Current upper hull list:", 600, 20+debug*18);
  for (let p = 0; p < listup.length; p++) {
    debug++;
    text(listup[p].name + " = (" + listup[p].x+","+listup[p].y+")", 625, 20+debug*18);
  } 
  while(listup.length > 2 && !checkLastThreeU(listup)) {
    const index = listup.length-2;
    debug++;
    text("Removing " + listup[index].name, 600, 20+debug*18);
    listup.splice(index, 1);

    debug++;
    text("Current upper hull list:", 600, 20+debug*18);
    for (let p = 0; p < listup.length; p++) {
      debug++;
      text(listup[p].name + " = (" + listup[p].x+","+listup[p].y+")", 625, 20+debug*18);
    }
      
  }
  
  if (title == 1) {
    let j = 1;
  
    for (j; j < listup.length; j++) {
      line(listup[j-1].x, listup[j-1].y, listup[j].x, listup[j].y);
      text("Upper Hull Point " + j + ": " + listup[j-1].name, 20, 600 + j*18); // Print the name of all the points in the upper hull
    }
    text("Upper Hull Point " + j + ": " + listup[j-1].name, 20, 600 + j*18); // Don't forget the last one
  
    let l = 0;
    for (j = 0; j < points.length; j++) {
      if (listup.indexOf(points[j]) < 0) {
        l++;
        text("Non Upper Hull Point " + l + ": " + points[j].name, 20, 610+listup.length*18 + l*18); // Print the name of all the points not in the upper hull
      }
    }
    title++;
  }


  // Start Lower Hull
    debug++;
    text("Starting Lower Hull Calculation", 600, 20+debug*18);
    



  points.sort(comparePointsRev);
  let listdown;
  if (points[0].x != points[1].x && points.length > 2) {
    listdown = [points[0], points[1]];     // Place first two points in the listdown array (list of points in the lower hull)
  } else {
    ind = 1;
    for (ind; ind < points.length && points[0].x == points[ind].x; ind++);
    listdown = [points[0], points[ind]];
  }
  i = 2;
  for (i = 2; i < points.length; i++) {
    if (listdown[listdown.length-1].x != points[i].x && i != points.length-1) { // Check that the penultimate listdown point isn't on the same x value as the next point we check. Also check we're not looking at last point.
      listdown.push(points[i]);                                               // Push the point to the listdown
      debug++;
      text("Current lower hull list:", 600, 20+debug*18);
      for (let p = 0; p < listdown.length; p++) {
        debug++;
        text(listdown[p].name + " = (" + listdown[p].x+","+listdown[p].y+")", 625, 20+debug*18);
      }

      while(listdown.length > 2 && !checkLastThreeD(listdown)) {                // While there are at least 2 points in the list and at least one of the last three points are violating hull properties
        const index = listdown.length-2;                                      // get index of middle point                                                
        debug++;
        text("Removing " + listdown[index].name, 600, 20+debug*18);
        listdown.splice(index, 1);                                          // remove it
      
        debug++;
        text("Current lower hull list:", 600, 20+debug*18);
        for (let p = 0; p < listdown.length; p++) {
          debug++;
          text(listdown[p].name + " = (" + listdown[p].x+","+listdown[p].y+")", 625, 20+debug*18);
        }
      
      }
    }
  }
  
  listdown.push(points[i-1]);                                                 // Do one more repetition of this to catch the vertical rightmost edge case.
  
  debug++;
      text("Current lower hull list:", 600, 20+debug*18);
      for (let p = 0; p < listdown.length; p++) {
        debug++;
        text(listdown[p].name + " = (" + listdown[p].x+","+listdown[p].y+")", 625, 20+debug*18);
      }
  
  while(listdown.length > 2 && !checkLastThreeD(listdown)) {
    const index = listdown.length-2;
    debug++;
    text("Removing " + listdown[index].name, 600, 20+debug*18);
    listdown.splice(index, 1);

    debug++;
    text("Current lower hull list:", 600, 20+debug*18);
    for (let p = 0; p < listdown.length; p++) {
      debug++;
      text(listdown[p].name + " = (" + listdown[p].x+","+listdown[p].y+")", 625, 20+debug*18);
    }
  }
  
  if (title == 2) {
    j = 1;
  
    for (j; j < listdown.length; j++) {
      line(listdown[j-1].x, listdown[j-1].y, listdown[j].x, listdown[j].y);
      text("Lower Hull Point " + j + ": " + listdown[j-1].name, 250, 600 + j*18); // Print the name of all the points in the lower hull
    }
    text("Lower Hull Point " + j + ": " + listdown[j-1].name, 250, 600 + j*18); // Don't forget the last one
  
    let k = 0;
    for (j = 0; j < points.length; j++) {
      if (listdown.indexOf(points[j]) < 0) {
        k++;
        text("Non Lower Hull Point " + k + ": " + points[j].name, 250, 610+listdown.length*18 + k*18); // Print the name of all the points not in the lower hull
      }
    }
    title++;
  }
  
}

function checkLastThreeU(listup) { // Just here for legibility
  let k = listup.length-1;
  return toTheRight(listup[k-2], listup[k-1], listup[k]);
}

function toTheRight(p1, p2, p3) { // Checks if p3 is to the right of p1 and p2. It looks like it's backwards because the coordinate system in p5.js has y growing as you go down the screen.
  debug++;
  text("Right Comparing " + p1.name+ ", " + p2.name+ ", "  + p3.name, 600, 20+debug*18);
  text(p2.y+(p3.x-p2.x)*((p1.y - p2.y)/(p1.x-p2.x)) <= p3.y, 800, 20+debug*18);
  return p2.y+(p3.x-p2.x)*((p1.y - p2.y)/(p1.x-p2.x)) <= p3.y;
}

function checkLastThreeD(listdown) { // Just here for legibility
  let k = listdown.length-1;
  return toTheLeft(listdown[k-2], listdown[k-1], listdown[k]);
}

function toTheLeft(p1, p2, p3) { // Similar to toTheRight, but checks if p3 is to the left of p1 and p2.
  debug++;
  text("Left Comparing " + p3.name +", "+ p2.name+ ", " + p1.name, 600, 20+debug*18);
  text(p2.y+(p3.x-p2.x)*((p1.y - p2.y)/(p1.x-p2.x)) >= p3.y, 800, 20+debug*18);
  return p2.y+(p3.x-p2.x)*((p1.y - p2.y)/(p1.x-p2.x)) >= p3.y;
}

function comparePoints(a, b) {  // Used to sort points
  return (a.x - b.x) || (a.y-b.y);
}

function comparePointsRev(a, b) { // Used to reverse sort points
  return (b.x - a.x) || (b.y-a.y);
}

class Point {               // A point class, complete with a name
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
  }
}
