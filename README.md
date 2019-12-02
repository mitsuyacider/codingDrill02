# Demo
[Reference](https://www.youtube.com/watch?v=QHEQuoIKgNE)

![img](./src/assets/demo.gif)

## Algorithm

### setup
* Check black pixel position from black and white image.
* If detected, save the pixel coordinates.

### draw
* Pick up coordinates at random from the saved pixel image.
* Create a circle class based on the picked-up coordinates and add it to the circle list array to draw.
  * Stop adding circles if there is no room to add new circle. (attempting a creation several times)
* Draw all circle from circle list.
* Update size of all circles in circle list array.
* Stop updating circle size when circles overlap.
