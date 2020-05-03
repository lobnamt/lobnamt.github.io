var video;
var in_canvas, out_canvas_1, out_canvas_2, out_canvas_3, out_canvas_4;
var in_context, out_context_1, out_context_2, out_context_3, out_context_4;
var canvas_cantainer;
var showing_canvases = 1;
var initialized = false;
var is_playing = false;
var selected_canvas= 0;
const canvases = document.getElementsByClassName('canvas');
var slider;
var is_slider_open = true;
var is_model_loaded = false;
var slider_width = 0;

var canvas_1_cache, canvas_2_cache , canvas_3_cache, canvas_4_cache;
// const filter_name_ele = document.querySelectorAll('.filter_name');


const filter_type = {
  None: 'none',
  GRAY: 'gray',
  BLUR: 'blur',
  BandW: 'blackandwhite',
  BILATERAL: 'bilateral',
  MEDIAN_BLUR: 'medianblur',
  THRESHOLD: 'threshold',
  ADAPTIVE_THRESHOLD:'adaptivethreshold',
  CANNY:'canny',
  LANDMARK: 'landmark',
  HALLOWEN: 'halloween'
}

const filter_params = {
  FILTTER_TYPE: "filter_type",
  SELECTED_FILTER: "selected_filter",
  KSIZE: "ksize",
  DIAMETER:"diameter",
  SIGMA_COLOR:"sigmacolor",
  THRESH:'thresh',
  BLOCK_SIZE:'blocksize',
  THRESHOLD1: 'threshold1',
  THRESHOLD2:'threshold2',
  POSX: 'posx',
  POSY: 'posy'
}

// var filter_params = {};
// filter_params[filter_params.KSIZE] = 3;
// filter_params[filter_params.DIAMETER]=9;
// filter_params[filter_params.SIGMA_COLOR]=75;
// filter_params[filter_params.SIGMA_SPACE]=75;
// filter_params[filter_params.THRESH]= 100;
// filter_params[filter_params.BLOCK_SIZE]=10;
// filter_params[c]=2;


document.addEventListener("DOMContentLoaded", function(event) {
  init();
  var elems  = document.querySelectorAll("input[type=range]");
  M.Range.init(elems);
  elems = document.querySelectorAll('select');
  var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'top',
      hoverEnabled: true
    });
});

async function load_face_models(){
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");
  console.log("Models loaded")
  is_model_loaded = true;

}

async function detect_faces_and_landmarks(input, single_face = false){
  var detections;
  if(!single_face)
     detections = faceapi.detectAllFaces(input,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
  else
      detections = faceapi.detectSingleFace(input,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);

     // console.log(detections);
  return detections;
  // setTimeout(detect_faces_and_landmarks,1,input,output);
}


function init(){

  load_face_models();
  video = document.querySelector("#videoElement");
  // in_canvas = document.getElementById('in_canvas');
  // in_context = in_canvas.getContext('2d');

  in_canvas = document.createElement('canvas');
  in_canvas.id = "in_canvas";
  in_canvas.width = 320;
  in_canvas.height = 240;
  in_context = in_canvas.getContext('2d');

  out_canvas_1 = document.getElementById('out_canvas_1');
  out_context_1 = out_canvas_1.getContext('2d');
  canvas_1_cache = {};
  canvas_1_cache[filter_params.FILTTER_TYPE] = filter_type.None;
  

  out_canvas_2 = document.getElementById('out_canvas_2');
  out_context_2 = out_canvas_2.getContext('2d');
  canvas_2_cache = {};
  canvas_2_cache[filter_params.FILTTER_TYPE] = filter_type.None;

  out_canvas_3 = document.getElementById('out_canvas_3');
  out_context_3 = out_canvas_3.getContext('2d');
  canvas_3_cache = {};
  canvas_3_cache[filter_params.FILTTER_TYPE] = filter_type.None;

  out_canvas_4 = document.getElementById('out_canvas_4');
  out_context_4 = out_canvas_3.getContext('2d');
  canvas_4_cache = {};
  canvas_4_cache[filter_params.FILTTER_TYPE] = filter_type.None;


  slider = document.getElementById("slider_container");
  console.log(slider.clientWidth);
  document.getElementById("btn").style.left = slider.clientWidth+ "px";
  slider_width = slider.clientWidth;


  canvas_container = document.getElementsByClassName('canvas_cantainer')
  initialized = true;
  out_canvas_1.parentNode.style.display = 'block';
  start();


  const canvas_divs = document.getElementsByClassName('canvas_container');

  var ele = document.getElementsByClassName("filter_container")[0];
  ele.addEventListener('click', function(event){
    
    console.log("I am clicked",event.target);
    if (ele === event.target){
      console.log("unlsect",event.target);
      for (var i = 0; i < canvases.length; i++) {
        canvases[i].parentNode.classList.remove("canvas_container_selected");
      }
    
      return;
    } 

  }, false);

  const filter_name_ele = document.querySelectorAll('.filter_name');

  filter_name_ele.forEach(el => el.addEventListener('click', event => {
    console.log(event.target.id);
    if(selected_canvas == 0){
      M.toast({html: 'Please select a canvas', classes: 'rounded msg-toast'});
    }
    else if(selected_canvas.id == "out_canvas_1"){
      canvas_1_cache[filter_params.FILTTER_TYPE] = event.target.id;
      //ask soubhi
      for (var i = 0; i < filter_name_ele.length; i++) {
        filter_name_ele[i].classList.remove("filter_img_selected");
      }
      document.getElementById(event.target.id).classList.add("filter_img_selected");
    }else if(selected_canvas.id == "out_canvas_2"){
      canvas_2_cache[filter_params.FILTTER_TYPE] = event.target.id;
      for (var i = 0; i < filter_name_ele.length; i++) {
        filter_name_ele[i].classList.remove("filter_img_selected");
      }
      document.getElementById(event.target.id).classList.add("filter_img_selected");
    }else if(selected_canvas.id == "out_canvas_3"){
      canvas_3_cache[filter_params.FILTTER_TYPE] = event.target.id;
      for (var i = 0; i < filter_name_ele.length; i++) {
        filter_name_ele[i].classList.remove("filter_img_selected");
      }
      document.getElementById(event.target.id).classList.add("filter_img_selected");
    }else if(selected_canvas.id == "out_canvas_4"){
      canvas_4_cache[filter_params.FILTTER_TYPE] = event.target.id;
      for (var i = 0; i < filter_name_ele.length; i++) {
        filter_name_ele[i].classList.remove("filter_img_selected");
      }
      document.getElementById(event.target.id).classList.add("filter_img_selected");
    }

  }));

}

async function open_slider(){
    slider.classList.remove("slider_closed");
    slider.classList.add("slider_open");
    document.getElementById("slider_outer").classList.remove("s0");
    document.getElementById("slider_outer").classList.add("s2");
    document.getElementsByClassName("slider_icon")[0].classList.remove("closed");
    while(slider.clientWidth<slider_width){ 
      await sleep(10); 
      document.getElementById("btn").style.left = slider.clientWidth + "px";
    }
    $('.filter_div').fadeIn()
    is_slider_open = true;
}

async function close_slider(){
  slider.classList.remove("slider_open");
  slider.classList.add("slider_closed");
  document.getElementsByClassName("slider_icon")[0].classList.add("closed");
  $('.filter_div').fadeOut()
  while(slider.clientWidth>0){ 
    await sleep(1); 
    document.getElementById("btn").style.left = slider.clientWidth -4 + "px";
  }
  console.log(slider.clientWidth);
  document.getElementById("slider_outer").classList.remove("s2");
  // document.getElementById("slider_outer").classList.add("s0");
  is_slider_open = false;
  // document.getElementsByClassName("filter_container").remove("s10");
  // document.getElementsByClassName("filter_container").classList.add("s12");
}


async function sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

function slider_control(){
  if(is_slider_open){
    close_slider();
  }else{
    open_slider();
  }
}

function select_canvas(e){
  console.log("test ...",e);
  selected_canvas = e;
  document.querySelectorAll('.filter_img').forEach(function(e){
    console.log(e);
    e.classList.remove("filter_img_selected");
    });
  if(e.parentNode.classList.contains("canvas_container_selected")){
    console.log("I am already selected *_*");
    e.parentNode.classList.remove("canvas_container_selected");
    selected_canvas = 0;

    return;
  }
  for (var i = 0; i < canvases.length; i++) {
    canvases[i].parentNode.classList.remove("canvas_container_selected");
  }

  // var aa = document.querySelectorAll('.filter_img');
  // for (var i = 0; i < document.querySelectorAll('.filter_name').length; i++) {
  //   aa[i].classList.remove("filter_img_selected");
  // }
  
  e.parentNode.classList.add("canvas_container_selected");
  console.log("jhhjhj", e.id, e.id.slice(4, 12).concat("_cache"))

  console.log(eval( e.id.slice(4, 12).concat("_cache")))

  document.getElementById(eval( e.id.slice(4, 12).concat("_cache"))["filter_type"]).classList.add("filter_img_selected")

  
}

function start(){
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      if(initialized){
        is_playing = true;
        draw(video,in_context,in_canvas.width,in_canvas.height);
        apply_filter(in_canvas, out_canvas_1, canvas_1_cache);
        apply_filter(in_canvas, out_canvas_2, canvas_2_cache);
        apply_filter(in_canvas, out_canvas_3, canvas_3_cache);
        apply_filter(in_canvas, out_canvas_4, canvas_4_cache);

        // canvas_1_cache[filter_params.POSX] = out_canvas_1.getBoundingClientRect().x;
        canvas_1_cache[filter_params.POSY] = out_canvas_1.getBoundingClientRect().y;

        // canvas_2_cache[filter_params.POSX] = out_canvas_1.getBoundingClientRect().x;
        canvas_2_cache[filter_params.POSY] = out_canvas_1.getBoundingClientRect().y;

        // canvas_3_cache[filter_params.POSX] = out_canvas_3.getBoundingClientRect().x;
        canvas_3_cache[filter_params.POSY] = out_canvas_1.getBoundingClientRect().y + 358;

        // canvas_4_cache[filter_params.POSX] = out_canvas_4.getBoundingClientRect().x;
        canvas_4_cache[filter_params.POSY] = out_canvas_1.getBoundingClientRect().y + 358;

        // draw(video,out_context_1,out_canvas_1.width,out_canvas_1.height);
        // blur(in_canvas, out_canvas_1)
        // draw(video,out_context_1,out_canvas_1.width,in_canvas.height);
        // apply_filter("in_canvas","out_canvas_1","GreyScale");
        
        // apply_filter(in_canvas, out_canvas_1,filter_params)
        // draw(video,out_context_2,out_canvas_2.width,in_canvas.height);
        // draw(video,out_context_3,out_canvas_3.width,in_canvas.height);
        // draw(video,out_context_4,out_canvas_4.width,in_canvas.height);

      }else{
        alert("Camera is not ready, try again!");
        is_playing = false;
      }
    })
    .catch(function (err0r) {
      console.log("Something went wrong!: ",err0r);
    });
}
}

function resume(){
  if(is_playing){
    return;    
  }
  is_playing = true;
  draw(video,in_context,in_canvas.width,in_canvas.height);
  draw(video,out_context_1,out_canvas_1.width,in_canvas.height);
  draw(video,out_context_2,out_canvas_2.width,in_canvas.height);
  draw(video,out_context_3,out_canvas_3.width,in_canvas.height);
}

function draw(v,c,w,h){
  if(is_playing){
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
  }
}
// function link_click(filter_name){
//   console.log(filter_name)
//   apply_filter(in_canvas, selected_canvas,filter_name, filter_params)
// }

const getOverlayValues = landmarks => {
  const nose = landmarks.getNose()
  const jawline = landmarks.getJawOutline()

  const jawLeft = jawline[0]
  const jawRight = jawline.splice(-1)[0]
  const adjacent = jawRight.x - jawLeft.x
  const opposite = jawRight.y - jawLeft.y
  const jawLength = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))

  // Both of these work. The chat believes atan2 is better.
  // I don't know why. (It doesn’t break if we divide by zero.)
  // const angle = Math.round(Math.tan(opposite / adjacent) * 100)
  const angle = Math.atan2(opposite, adjacent) * (180 / Math.PI)
  const width = jawLength * 2.2

  return {
      width,
      angle,
      leftOffset: jawLeft.x - width * 0.27,
      topOffset: nose[0].y - width * 0.47,
  }
}


async function apply_filter(in_canvas_id,out_canvas_id, params){

    let src = cv.imread(in_canvas_id);
    let dst = new cv.Mat();
  
    // let filter = filter_type.ADAPTIVE_THRESHOLD;
    // console.log(params[filter_params.FILTTER_TYPE])

    let ftype = params[filter_params.FILTTER_TYPE]

  switch(ftype){ // params["filter_type"]
    //done
    case filter_type.None:{
      cv.imshow(out_canvas_id,src);
    } break;

    //done
    case filter_type.ADAPTIVE_THRESHOLD:{
      var blocksize=params[filter_params.BLOCK_SIZE];
      if(!blocksize){
        blocksize = 3;
      }
      if(blocksize % 2 == 0)
        blocksize = blocksize + 1;
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      // You can try more different parameters
      cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, blocksize, 2);
      cv.imshow(out_canvas_id, dst);
    }break;

    //done
    case filter_type.THRESHOLD:{
      let thresh = params[filter_params.THRESH];
      if(!thresh){
        thresh = 150;
      }
      cv.threshold(src, dst, thresh, 200, cv.THRESH_BINARY);
      cv.imshow(out_canvas_id, dst);
    } break;

    //done
    case filter_type.GRAY:{
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      cv.imshow(out_canvas_id, dst);
    } break;

    //done
    case filter_type.BLUR: {
      let ksize = params[filter_params.KSIZE];
      if(ksize%2 == 0){
        ksize = ksize + 1;
      }
      if(!ksize){
          ksize = 10;
        }
      let kernel = new cv.Size(ksize, ksize);
      let anchor = new cv.Point(-1, -1);
      cv.blur(src, dst, kernel, anchor, cv.BORDER_DEFAULT);
      cv.imshow(out_canvas_id, dst);
    } break;
    
    //done
    case filter_type.BILATERAL: {
      let diameter= params[filter_params.DIAMETER]
      let sigmacolor=params[filter_params.SIGMA_COLOR]
      if(!sigmacolor){
        sigmacolor = 75;
      }
      if(!diameter){
        diameter = 9;
      }
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
      // You can try more different parameters
      cv.bilateralFilter(src, dst, diameter, sigmacolor, 75, cv.BORDER_DEFAULT);
      cv.imshow(out_canvas_id, dst);
    } break;
    //done
    case filter_type.MEDIAN_BLUR: {
      let ksize = params[filter_params.KSIZE];
      if(ksize%2 == 0)
        ksize = ksize + 1;
        if(!ksize){
          ksize = 3;
        }
      cv.medianBlur(src, dst, ksize);
      cv.imshow(out_canvas_id, dst);
    } break; 
    case filter_type.CANNY: {
      let threshold1 = params[filter_params.THRESHOLD1];
      let threshold2 = params[filter_params.THRESHOLD2];
      if(!threshold1){
        threshold1 = 50;
      }
      if(!threshold2){
        threshold2= 100;
      }
      cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
      // You can try more different parameters
      cv.Canny(src, dst, threshold1, threshold2, 3, false);
      cv.imshow(out_canvas_id, dst);
    } break;

    case filter_type.LANDMARK:{
      if(is_model_loaded){
        cv.imshow("out_canvas_1",src);

        const detections = await detect_faces_and_landmarks(in_canvas_id);
        // console.log(detections)
        faceapi.draw.drawDetections(out_canvas_id, detections);
        faceapi.draw.drawFaceLandmarks(out_canvas_id, detections);
      }else{
        // show msg
        // Model is not loaded, refersh the page ...
      }

      

    }break;

    case filter_type.HALLOWEN:{
      if(is_model_loaded){
        cv.imshow(out_canvas_id,src);
        const detections = await detect_faces_and_landmarks(in_canvas_id,true);
        if (!detections){
          break;
        }
        const overlayValues = getOverlayValues(detections.landmarks);
        const scale = out_canvas_id.offsetWidth/out_canvas_id.width;
        const overlay = document.querySelector("#out_overlay_"+out_canvas_id.id.split("_")[2]);
        overlay.src = "images/mask_4.png";
        const startx = out_canvas_id.getBoundingClientRect().x;
        const starty = eval( out_canvas_id.id.slice(4, 12).concat("_cache"))[filter_params.POSY];//out_canvas_id.getBoundingClientRect().y;
        const width = out_canvas_id.getBoundingClientRect().width;
        overlay.style.cssText = `
        position: absolute;
        left: ${startx + overlayValues.leftOffset * scale}px;
        top: ${ starty + overlayValues.topOffset * scale}px;
        width: ${overlayValues.width * scale}px;
        transform: rotate(${overlayValues.angle}deg);
        `;
      }else{
        // show msg
        // Model is not loaded, refersh the page ...
      }
    }break;


  }
  src.delete();
  dst.delete();
  setTimeout(apply_filter,0,in_canvas_id,out_canvas_id, params);

}

function pause() {
  if(!is_playing){
    return;    
  }
  is_playing = false;

  in_context.fillStyle="blue";
  in_context.fillRect(0, 0, in_canvas.width, in_canvas.height);

}

function add_canvas(){

  if(showing_canvases==1){
    out_canvas_2.parentNode.style.display="block";
    out_canvas_1.parentNode.classList.remove("m10");
    out_canvas_1.parentNode.classList.add("m5");
    showing_canvases++;
  }
  else if(showing_canvases==2) {
    out_canvas_3.parentNode.style.display="block"; 
    showing_canvases++;
  }
  else if(showing_canvases==3) {
    out_canvas_4.parentNode.style.display="block"; 
    out_canvas_3.parentNode.classList.remove("m10");
    out_canvas_3.parentNode.classList.add("m5");
    showing_canvases++;

  }
  else{
    M.toast({html: 'no more then four canvases', classes: 'rounded msg-toast'});
    // document.getElementById("add_del_canvas").children[0].innerHTML = "remove";

  }

}


function remove_canvas(){

  if(showing_canvases==4){

    out_canvas_4.parentNode.style.display="none";
    out_canvas_3.parentNode.classList.remove("m5");
    out_canvas_3.parentNode.classList.add("m10");
    showing_canvases--;
    if(selected_canvas=out_canvas_2){
      out_canvas_2.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }
    
  }
  else if(showing_canvases==3) {
    out_canvas_3.parentNode.style.display="none"; 
    showing_canvases--;
    if(selected_canvas=out_canvas_3){
      out_canvas_1.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }
  }
  else if(showing_canvases==2) {
    out_canvas_2.parentNode.style.display="none"; 
    out_canvas_1.parentNode.classList.remove("m5");
    out_canvas_1.parentNode.classList.add("m10");
    showing_canvases--;
    if(selected_canvas=out_canvas_2){
      out_canvas_2.parentNode.classList.remove("canvas_container_selected");
      selected_canvas=0;
    }

  }
  else{
    M.toast({html: 'no less than one canvas', classes: 'rounded msg-toast'});

  }

}
