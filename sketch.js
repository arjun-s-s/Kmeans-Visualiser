// K-means parameters
const k =  7; // Number of clusters
let points = []; // Data points
let centroids = []; // Cluster centroids
const skipFrames = 1; // Number of frames to skip
let frameCounter = 0; // Counter for tracking frames;
let numPoints = 5000;

function setup() {
  createCanvas(3840, 2160);
  frameRate(30); // Adjust frame rate as needed
  randomSeed(10)

  points = generateDataPoints(true, k, 700)

  // Initialize centroids randomly
  for (let i = 0; i < k; i++) {
    centroids.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(0);

  // Only update centroids and points every skipFrames frames
  if (frameCounter % skipFrames === 0) {
    // Assign each point to the nearest centroid
    for (const point of points) {
      let minDist = Infinity;
      let closestCentroid;
      for (const centroid of centroids) {
        const d = dist(point.x, point.y, centroid.x, centroid.y);
        if (d < minDist) {
          minDist = d;
          closestCentroid = centroid;
        }
      }
      point.cluster = closestCentroid;
    }

    // Update centroids smoothly
    for (const centroid of centroids) {
      const clusterPoints = points.filter((p) => p.cluster === centroid);
      if (clusterPoints.length > 0) {
        const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
        const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
        centroid.x += (avgX - centroid.x) * 0.1; // Smoothing factor
        centroid.y += (avgY - centroid.y) * 0.1;
      }
    }
  }

  // Custom colors for clusters
  const clusterColors = [
  'red',
  'blue',
  'purple',
  'orange',
  'cyan',
  'magenta',
  'lime',
  'pink'
];


  // Draw data points with varying sizes and custom colors
  for (const point of points) {
    const pointSize = map(point.cluster.x, 0, width, 10, 20); // Vary size based on x-coordinate
    const clusterColor = clusterColors[centroids.indexOf(point.cluster) % clusterColors.length];
    fill(clusterColor);
    ellipse(point.x, point.y, pointSize);
  }

  // Draw centroids with a different color and larger size
  for (const centroid of centroids) {
    const centroidSize = 50; // Larger size for centroids
    fill(255, 255, 0); // Yellow color for centroids
    ellipse(centroid.x, centroid.y, centroidSize);
  }

  // Increment frame counter
  frameCounter++;
}

function generateDataPoints(clustered, numClusters, clusterWidth) {
  const points = []; // Initialize an array to store data points

  if (clustered) {
    // Define the number of clusters
    const clusterCenters = [];

    // Generate random cluster centers
    for (let i = 0; i < numClusters; i++) {
      clusterCenters.push(createVector(random(width), random(height)));
    }

    // Generate data points around the cluster centers
    for (let i = 0; i < numPoints; i++) {
      // Choose a random cluster center
      const center = random(clusterCenters);

      // Add some noise to the position
      const ranAngle = random(0,TWO_PI)
      const ranRadius = random(0,clusterWidth)
      const noiseX = ranRadius * cos(ranAngle);
      const noiseY = ranRadius * sin(ranAngle);
      // Create the data point
      const dataPoint = createVector(center.x + noiseX, center.y + noiseY);
      points.push(dataPoint);
    }
  } else {
    // Generate random data points
    for (let i = 0; i < numPoints; i++) {
      points.push(createVector(random(width), random(height)));
    }
  }

  return points; // Return the generated data points
}

