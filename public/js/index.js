//console.log(faceapi.nets);

//console.log(__dirname);
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("models"),
  faceapi.nets.faceExpressionNet.loadFromUri("models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models"),
  faceapi.nets.ageGenderNet.loadFromUri("models")
]).then(initVideo);

function initVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        /*width: 720,
        height: 520*/
      }
    })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.log(err);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    console.log(detections);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    const minProbability = 0.05;
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections, minProbability);
  }, 100);
});
