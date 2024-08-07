gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const frames = {
    currentIndex: 0,
    maxIndex: 382
};

let imagesLoaded = 0;
const images = []; 

function preloadImages() {
    for (let i = 1; i <= frames.maxIndex; i++) {
        const imageUrl = `./Frames/frame_${i.toString().padStart(4, "0")}.jpeg`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === frames.maxIndex) {
                loadImage(frames.currentIndex);
                startAnimation();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${imageUrl}`);
        };
        images.push(img);
    }
}

function loadImage(index) {
    if (index >= 0 && index < frames.maxIndex) {
        const img = images[index];
        if (img) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const scaleX = canvas.width / img.width;
            const scaleY = canvas.height / img.height;
            const scale = Math.max(scaleX, scaleY);

            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            const offsetX = (canvas.width - newWidth) / 2;
            const offsetY = (canvas.height - newHeight) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
            context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
            frames.currentIndex = index;
        } else {
            console.error(`Image at index ${index} is undefined`);
        }
    } else {
        console.error(`Index ${index} is out of bounds`);
    }
}

function startAnimation() {
    gsap.timeline({
        scrollTrigger: {
            trigger: ".parent",
            start: "top top",
            scrub: 2,
            end: "bottom bottom",
            markers: false
        }
    })
    .to(frames, {
        currentIndex: frames.maxIndex - 1, 
        onUpdate: function() {
            const index = Math.floor(frames.currentIndex);
            loadImage(index);
        }
    });
}

preloadImages();