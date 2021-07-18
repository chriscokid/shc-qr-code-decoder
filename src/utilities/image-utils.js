//Given a blob source, gets the image data
export async function imageDataFromSource (document, source) {
    const image = Object.assign(new Image(), { src: source });
    await new Promise(resolve => image.addEventListener('load', () => resolve()));
    const context = Object.assign(document.createElement('canvas'), {
       width: image.width,
       height: image.height
    }).getContext('2d');
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
 }

 //Given a canvas, returns the image data
 export function getImageData(canvas){
   let imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
   return imageData;
 }