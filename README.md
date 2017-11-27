# Image mark up helper for opencv_createsamples
 A helper for [OpenCV Cascade Classifier Training](https://docs.opencv.org/3.3.1/dc/d88/tutorial_traincascade.html): Mark up positive samples in image, and generate description file for opencv_createsamples
 ## How to use
 1. Add an image file
 1. move and resize the select rectangle to mark up one sample, double-click or press enter key to record one.
 1. repeat step 2 until all samples marked up.
 1. repeat step 1 to step 3, until all your sample files marked.
 1. click make*copy button to copy generated descript info to clipboard
 ## Operation hints 💡
 1. you can swtich file by click in the file list
 2. you can location each sample by click in the markers list
 3. you can move the select rectangle by Arraw-keys, and resiz with Shift pressed, and with Alt key pressed you can key the rect to a square.
 4. click on the "X" at the end of a marker list item will delete it.


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
