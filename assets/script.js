let img_width = document.querySelector('.slider').clientWidth;
const imgs_container = document.querySelector('.slider__img-container');
const imgs = document.querySelectorAll('.slide');
const total_imgs = imgs.length;


const arrow_dot_container = document.querySelector('.slider__arrow-nav-container');


const dots_container = document.querySelector('.dot-container');
const prev_btn = document.querySelector('.arrow--prev');
const next_btn = document.querySelector('.arrow--next');


const slide_seconds = 4000;
let current_index = 1; 
let last_index; 
let move_distance; 
let timer;


let mouse_is_down = false; 
let mouse_position_x = [0, 0]; 


function calculateNextDistance() {
  move_distance = -(current_index * img_width); 
  last_index = current_index;


  if (current_index == total_imgs) {
    current_index = 1;
    move_distance = 0;
  } else {
    current_index++;
  }


  slideImages();
}


function calculatePrevDistance() {


  if (current_index > 1) {
    last_index = current_index;
    current_index--;
    move_distance = move_distance + img_width; 
  } else {
    last_index = current_index;
    current_index = total_imgs;
    move_distance = -((total_imgs - 1) * img_width);
  }


  slideImages();
}


function slideImages(drag_distance) {
  clearInterval(timer);


  const distance = drag_distance || move_distance;


  imgs_container.style.transform = `translateX(${distance}px)`;
  document.querySelector(`#dot-${last_index}`).classList.remove('is-active');
  document.querySelector(`#dot-${current_index}`).classList.add('is-active');


  timer = setInterval(calculateNextDistance, slide_seconds);


}


function slideDotImages(e) {
  const dots = this.querySelectorAll('.dot');


  for (var i = 1; i <= dots.length; i++) {
    if (e.target.id == `dot-${i}`) {
      last_index = current_index;
      current_index = i;
      move_distance = -((current_index - 1) * img_width);
    }
  }


  slideImages();
}


function createDraggingEffects(e) {


  mouse_position_x[1] = e.clientX;


  if (mouse_position_x[0] == mouse_position_x[1]) {
    return false;
  }


  let scrolled_distance = Math.abs((mouse_position_x[0] - mouse_position_x[1]));
  const weight = img_width / 12; 


  if (mouse_position_x[0] > mouse_position_x[1]) {  
      scrolled_distance = move_distance - scrolled_distance - weight;
  } else { 
      scrolled_distance = move_distance + scrolled_distance + weight;
  }


  slideImages(scrolled_distance); 


  console.log(current_index)
  console.log(mouse_position_x);
}


function dragAndSlideImages() {
  if (mouse_position_x[0] == mouse_position_x[1]) {
    slideImages();
    return false;
  }


  if (Math.abs(mouse_position_x[0] - mouse_position_x[1]) < 30) {
    slideImages(); 
    return false; 
  }


  if (mouse_position_x[0] > mouse_position_x[1]) {
    calculateNextDistance();
  } else {
    calculatePrevDistance();
  }
}


function init() {
  document.querySelector(`#dot-${current_index}`).classList.remove('is-active');


  img_width = document.querySelector('.slider').clientWidth;
  imgs.forEach(img => img.style.width = `${img_width}px`);
  imgs_container.style.width = `${img_width * total_imgs}px`;


  current_index = total_imgs;
  calculateNextDistance();
}


init();


next_btn.addEventListener('click', calculateNextDistance);
prev_btn.addEventListener('click', calculatePrevDistance);
dots_container.addEventListener('click', slideDotImages);
window.addEventListener('resize', init);


arrow_dot_container.addEventListener('mousedown', (e) => {
  mouse_is_down = true;


  clearInterval(timer);


  mouse_position_x = [e.clientX, 0];
  arrow_dot_container.style.cursor = '-webkit-grabbing';
  console.log(mouse_position_x);
})


arrow_dot_container.addEventListener('mousemove', (e) => {


  if (!mouse_is_down) return false; 
  createDraggingEffects(e);
})


arrow_dot_container.addEventListener('mouseup', (e) => {
  mouse_position_x[1] = e.clientX;
  dragAndSlideImages(e);
  mouse_is_down = false;
  arrow_dot_container.style.cursor = '';


  console.log(current_index);
})


arrow_dot_container.addEventListener('mouseleave', () => {
  if (!mouse_is_down) return false;


  mouse_position_x = [0, 0];
  dragAndSlideImages();
  mouse_is_down = false;
  arrow_dot_container.style.cursor = ''; 
})