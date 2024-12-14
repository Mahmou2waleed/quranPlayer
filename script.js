let progress = document.getElementsByClassName("progress")[0];
let audio = document.getElementsByClassName("audio")[0];
let playBtn = document.getElementsByClassName("playBtn")[0];
let playImg = document.querySelector(".playImg");
let more = document.getElementsByClassName("more")[0];
let surahsContainer = document.getElementById("surahsContainer");
let textName = document.getElementsByClassName("textName")[0];
let currentSurahNumber = null;

let load = "https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca.gif";
let play = "https://www.svgrepo.com/show/522226/play.svg";
let pause = "https://www.svgrepo.com/show/514191/pause.svg";

function updateBackButton() {
  let back = document.getElementById("back");
  let after = document.getElementById("after");

  if (back && after) {
    back.style.display = currentSurahNumber > 1 ? "block" : "none";
    after.style.display = currentSurahNumber < 114 ? "block" : "none";
  }
}

audio.onloadedmetadata = function () {
  progress.max = audio.duration;
};

playBtn.onclick = function playPause() {
  if (audio.paused) {
    audio.play().then(() => {
      playImg.src = pause;
    }).catch((error) => {
      console.error('Error playing audio:', error);
      playImg.src = play;
    });
  } else {
    audio.pause();
    playImg.src = play;
  }
};

audio.ontimeupdate = function () {
  progress.value = audio.currentTime;
};

progress.oninput = function () {
  audio.currentTime = progress.value;
  if (audio.paused) {
    audio.play().then(() => {
      playImg.src = pause;
    }).catch((error) => {
      console.error('Error playing audio:', error);
      playImg.src = play;
    });
  }
};

audio.onended = function () {
  playImg.src = play;
};

more.onclick = function () {
  surahsContainer.style.display = (surahsContainer.style.display === "flex") ? "none" : "flex";
};

fetch('https://api.alquran.cloud/v1/surah')
  .then(response => response.json())
  .then(data => {
    const surahs = data.data;

    surahs.forEach(surah => {
      let surahNumber = surah.number.toString().padStart(3, '0');
      let surahEnglishName = surah.englishName;

      const surahElement = document.createElement('div');
      surahElement.className = 'surahDetails';
      surahElement.textContent = `${surahNumber}: ${surahEnglishName}`;

      surahElement.onclick = function () {
        surahsContainer.style.display = "none";
        textName.innerHTML = surahEnglishName;
        currentSurahNumber = surah.number;
        audio.src = `https://ia800402.us.archive.org/35/items/Quranicaudio.com-torrent--direct--mp3--quran----128-kb---by-----Abdulbaset/${surahNumber}.mp3`;

        audio.play().then(() => {
          playImg.src = pause;
        }).catch((error) => {
          console.error('Error playing surah audio:', error);
          playImg.src = play;
        });

        updateBackButton();
      };

      surahsContainer.appendChild(surahElement);
    });

    let back = document.getElementById("back");
    let after = document.getElementById("after");

    if (back) {
      back.onclick = function () {
        if (currentSurahNumber > 1) {
          let previousSurah = surahs.find(surah => surah.number === currentSurahNumber - 1);
          if (previousSurah) {
            currentSurahNumber = previousSurah.number;
            let surahNumber = previousSurah.number.toString().padStart(3, '0');
            textName.innerHTML = previousSurah.englishName;
            audio.src = `https://ia800402.us.archive.org/35/items/Quranicaudio.com-torrent--direct--mp3--quran----128-kb---by-----Abdulbaset/${surahNumber}.mp3`;

            audio.play().then(() => {
              playImg.src = pause;
            }).catch((error) => {
              console.error('Error playing previous surah audio:', error);
              playImg.src = play;
            });

            updateBackButton();
          }
        }
      };
    }

    if (after) {
      after.onclick = function () {
        if (currentSurahNumber < 114) {
          let nextSurah = surahs.find(surah => surah.number === currentSurahNumber + 1);
          if (nextSurah) {
            currentSurahNumber = nextSurah.number;
            let surahNumber = nextSurah.number.toString().padStart(3, '0');
            textName.innerHTML = nextSurah.englishName;
            audio.src = `https://ia800402.us.archive.org/35/items/Quranicaudio.com-torrent--direct--mp3--quran----128-kb---by-----Abdulbaset/${surahNumber}.mp3`;

            audio.play().then(() => {
              playImg.src = pause;
            }).catch((error) => {
              console.error('Error playing next surah audio:', error);
              playImg.src = play;
            });

            updateBackButton();
          }
        }
      };
    }

    updateBackButton();
  })
  .catch(error => {
    console.error('Error fetching surahs:', error);
  });

audio.onwaiting = function () {
  playImg.src = load;
};

audio.onplaying = function () {
  playImg.src = pause;
};
