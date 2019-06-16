function draw(data) {

  var context = document.getElementById("canvas").getContext("2d");

  context.beginPath();
  for (var i = 0; i < data.height; ++i) {
    for (var j = 0; j < data.width; ++j) {
      context.strokeStyle = data[i][j].border;
      context.fillStyle = "";
      context.strokeRect(i * 42 + 10, j * 42 + 10, 32, 32);
    }
  }
  context.closePath();
}
