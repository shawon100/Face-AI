const imageUpload = document.getElementById('imageUpload')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(' https://shawon100.github.io/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri(' https://shawon100.github.io/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri(' https://shawon100.github.io/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri(' https://shawon100.github.io/models'),
  faceapi.nets.faceExpressionNet.loadFromUri(' https://shawon100.github.io/models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  container.width=400
  container.height=350
  container.style.marginTop="50px"
  document.getElementById('uploads').append(container)
  
  let image
  let canvas
  //document.getElementById('uploads').append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    image.width=400
    image.height=350
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    
    
  })
}


