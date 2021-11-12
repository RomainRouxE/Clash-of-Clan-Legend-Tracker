var player = ["zerzr", "rzrzrz", "zrzre", "retttt", "uuuu", "eee"];

setInterval(() => {
  for (let i = 0; i < player.length; i = i + 2) {
    console.log(player[i]);
  }
}, 5000);
