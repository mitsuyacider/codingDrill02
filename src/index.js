import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './style.scss';

import Particles from './js/particles/Particles.js'

var circles;
var spots;

function Circle(x, y, p5) {
  this.x = x;
  this.y = y;
  this.r = 1;
  this.growing = true;
  this.p5 = p5;
  this.growingSpeed = p5.random(10) / 50;
  this.red = p5.random(0, 255);
  this.green = p5.random(0, 255);
  this.blue = p5.random(0, 255);

  this.grow = function() {
    if (this.growing) {
      this.r += this.growingSpeed;

      // if (this.r >= 15) {
      //   this.r = 15;
      //   this.growing = false;
      // } 
    }
  }

  this.show = function() {
    this.p5.stroke(this.red, this.green, this.blue);
    this.p5.noFill();

    this.p5.strokeWeight(2);
    this.p5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  this.edges = function() {
    return (this.x + this.r >= this.p5.width || this.x - this.r <= 0 || this.y + this.r >= this.p5.height || this.y - this.r <= 0)
  }
}

function newCircle(p5) {
  var r = Math.floor(p5.random(0, spots.length));
  const spot = spots[r];
  var x = spot.x;
  var y = spot.y;
  var valid = true;
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    var d = p5.dist(x, y, circle.x, circle.y);
    if (d < circle.r) {
      valid = false;
      break;
    }
  }
  if (valid) {
    return new Circle(x, y, p5);
  } else {
    return null;
  }
}

window.onload = function () {

  // NOTE: Set canvas size.
  //       This size is set in css. See style.scss.
  const initialCanvas = document.getElementById('canvas');
  const width = initialCanvas.clientWidth;
  const height = initialCanvas.clientHeight;

  const sketch = (p5) => {
    // make library globally available
    window.p5 = p5;
  
    let particles = {}
    let img = {};
    p5.preload = () => {
      console.log('preload')
      img = p5.loadImage('./assets/2020.png');
    }
    p5.setup = () => {
      const canvas = p5.createCanvas(width, height)
      const context = canvas.elt.getContext('2d');

      circles = [];
      spots = [];
      
      // NOTE: Fit p5 canvas with parent container. 
      //       Now p5 canvas will be set as fullscreen inside parent.
      canvas.parent('canvas');
      
      // // NOTE: Image Setting
      // p5.imageMode(p5.CENTER);
      // p5.fill(255, 255, 0)
      img.loadPixels();
      // const colr = img.get(0, 0)
      // console.log(colr)
      for (let x = 0; x < img.width; x += 1) {
        for (let y = 0; y < img.height; y += 1) {
          // const c = img.get(x, y);

          const index = (x + y * img.width) * 4;
          // const c = img.pixels[index];
          // const b = p5.brightness(c);
          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];
          var a = img.pixels[index + 3];
          // var r = c[0];
          // var g = c[1];
          // var b = c[2];
          // var a = c[3];

          var brightness = (r + g + b + a) / 4;          
          // console.log(brightness)
          if (brightness < 1) {
            // spots.push(p5.createVector(x, y));
          } else {
            spots.push(p5.createVector(x, y));

          }
        }
      }
    }
  
    p5.draw = () => {
      p5.background(0);
      // console.log(img.width)
      // p5.image(img, p5.width / 2, p5.height / 2);


      p5.frameRate(20)

      var total = 5;
      var count = 0;
      var attempts = 0;
    
      while (count < total) {
        var newC = newCircle(p5);
        if (newC !== null) {
          circles.push(newC);
          count++;
        }
        attempts++;
        if (attempts > 100) {
          p5.noLoop();
          console.log("finished");
          break;
        }
      }
    
      for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
    
        if (circle.growing) {
          if (circle.edges()) {
            circle.growing = false;
          } else {
            for (var j = 0; j < circles.length; j++) {
              var other = circles[j];
              if (circle !== other) {
                var d = p5.dist(circle.x, circle.y, other.x, other.y);
                var distance = circle.r + other.r;
    
                if (d - 2 < distance) {
                  circle.growing = false;
                  break;
                }
              }
            }
          }
        }
    
        circle.show();
        circle.grow();
      }      
    }
  }
  
  new p5(sketch);
}