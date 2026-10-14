const Jimp = require('jimp');

async function processImage(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    console.log('Processing: ' + inputPath);
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      const dist = Math.sqrt(Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2));
      
      // Increased thresholds to handle off-white backgrounds (specifically for real_girl)
      const maxDist = 120; 
      const minDist = 20;  
      
      if (dist < minDist) {
        this.bitmap.data[idx + 3] = 0;
      } else if (dist < maxDist) {
        const alpha = Math.floor(((dist - minDist) / (maxDist - minDist)) * 255);
        this.bitmap.data[idx + 3] = alpha;
        this.bitmap.data[idx + 0] = Math.min(255, r + 40);
        this.bitmap.data[idx + 1] = Math.min(255, g + 40);
        this.bitmap.data[idx + 2] = Math.min(255, b + 40);
      }
    });

    await image.writeAsync(outputPath);
    console.log('Saved transparent image: ' + outputPath);
  } catch (error) {
    console.error('Error processing ' + inputPath, error);
  }
}

async function main() {
  await processImage('./src/assets/iso_floor_plan.png', './src/assets/iso_floor_plan_alpha.png');
}

main();
