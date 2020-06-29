const predictionEl = document.querySelector('#prediction')
let model, webcam, maxPredictions

async function init() {
  const modelURL = './model/model.json'
  const metadataURL = './model/metadata.json'

  model = await tmImage.load(modelURL, metadataURL)
  maxPredictions = model.getTotalClasses()

  webcam = new tmImage.Webcam(200, 200, false) // width, height, flip
  await webcam.setup({
    facingMode: "environment"
  })

  await webcam.play()
  window.requestAnimationFrame(loop)

  document.getElementById('webcam-container').appendChild(webcam.canvas)
}

async function loop() {
  webcam.update() // update the webcam frame
  await predict()
  window.requestAnimationFrame(loop)
}

// run the webcam image through the image model
async function predict() {
  const predictions = await model.predict(webcam.canvas)
  predictions.sort((a, b) => a.probability - b.probability < 0 ? 1 : -1)
  const prediction = predictions[0]

  predictionEl.textContent = `${prediction.className} (${prediction.probability * 100 >> 0}%)`
}

// window.addEventListener('click', () => init())
init()
