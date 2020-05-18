let logo, score, dropdownMenu, downloadThumbnail, seriesDescription, sfFont, cnv, txtbg, gradient;
let scoreRatio, scoreWidth, scoreHeight, heightOffset, widthOffset;
const ASPECTRATIO = 1920 / 1080;

function preload() {

  gradient = loadImage('gradients/sf-gradient.png')
  sfFont = loadFont('raleway/Raleway-Regular.ttf')

}

function setup() {
  cnv = createCanvas(1920, 1080);
  cnv.position(0, 30);

  background(80);
  pixelDensity(1);

  txtbg = createGraphics(width, height)
  txtbg.filter(BLUR, 2);

  cnv.drop(gotFile);

  seriesDescription = createInput('drag & drop score')
  seriesDescription.changed(() => {
    generateCanvasContent()
    console.log(seriesDescription.value())
  })

  logo = loadImage('logos/sf.png', logoLoaded)

  dropdownMenu = createSelect()
  dropdownMenu.option('score follower');
  dropdownMenu.option('incipitsify');
  dropdownMenu.option('mediated scores');

  dropdownMenu.changed(() => {
    switch (dropdownMenu.value()) {
      case 'score follower':
        gradient = loadImage('gradients/sf-gradient.png', () => {
          logo = loadImage('logos/sf.png', logoLoaded)
        })
        break;
      case 'incipitsify':
        gradient = loadImage('gradients/inc-gradient.png', () => {
          logo = loadImage('logos/in.png', logoLoaded)
        })
        break;
      case 'mediated scores':
        gradient = loadImage('gradients/ms-gradient.png', () => {
          logo = loadImage('logos/ms.png', logoLoaded)
        })
        break;
    }
  })

  downloadThumbnail = createButton('download thumbnail');
  downloadThumbnail.mouseClicked(() => {
    saveCanvas(cnv, 'thumbnail', 'png');
  })
}

function gotFile(file) {
  if (file.type === 'image') {
    score = loadImage(file.data, imageLoaded)
  } else {
    console.log('Not an image file!');
  }
  // console.log(this.file.width());
}

function logoLoaded() {
  generateCanvasContent()
}

function imageLoaded() {
  generateCanvasContent()
}

function generateCanvasContent() {
  textFont(sfFont);
  fill(255);
  noStroke();
  textSize(135.14);
  //completely eliminate contents of off-canvas graphics
  txtbg.noCanvas()
  txtbg = createGraphics(width, height)
  txtbg.textFont(sfFont);
  txtbg.background(255, 0);
  txtbg.noStroke();
  txtbg.textSize(135.14);
  txtbg.text(seriesDescription.value(), 50, 150);
  txtbg.filter(BLUR, 5);

  //if a score has been dragged onto canvas, display it
  if (score) {
    scoreRatio = score.width / score.height;
    console.log(scoreRatio);
    widthOffset = heightOffset = 0;
    if (scoreRatio >= ASPECTRATIO) {
      scoreWidth = width;
      scoreHeight = width / scoreRatio;
      heightOffset = height / 2 - scoreHeight / 2
      // image(score, 0, heightOffset, scoreWidth, scoreHeight)
    } else {
      scoreHeight = height;
      scoreWidth = height * scoreRatio;
      widthOffset = width / 2 - scoreWidth / 2;
      // image(score, 0, heightOffset, scoreWidth, scoreHeight)
    }
    background(255);
    image(score, widthOffset, heightOffset, scoreWidth, scoreHeight)
    blendMode(MULTIPLY);
  }
  //MULTIPLY colors of gradient with colors of score

  image(gradient, 0, 0, width, height)

  //REVERT blend mode back to normal
  blendMode(NORMAL);

  //DRAW BLURRED TEXT
  image(txtbg, 5, 5)

  //DRAW LOGO
  image(logo, 0, height - 600, 600, 600)
  textAlign(LEFT);

  //DRAW TEXT
  text(seriesDescription.value(), 50, 150);

}
