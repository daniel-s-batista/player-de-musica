const audio = document.querySelector("#musica");
const botaoMusica = document.querySelector("#botaoMusica");
const progressoAtual = document.querySelector("#progressoAtual");
const barraProgresso = document.querySelector("#barraProgresso");
const timer = document.querySelector("#timer");
const barraVolume = document.querySelector("#barraVolume");
const iconVolume = document.querySelector("#iconVolume");
const iconRecomecar = document.querySelector("#iconRecomecar");
const iconVoltar = document.querySelector("#iconVoltar");
const iconAvancar = document.querySelector("#iconAvancar");
const playlist = document.querySelector("#playlist");
let tempoSegs = 0;
let tempoAtual;
let tempoMax;
let volumeAtual = 1;
let audioCarregado = false;
let selecaoAtual = 0;

const musicas = [
    {
        nome: "(Nenhuma música selecionada)",
        autor: "",
        url_foto: "",
        url_audio: ""
    },
    {
        nome: "Groovy Ambient Funk",
        autor: "moodmode",
        url_foto: "imagens/GroovyAmbientFunk.jpg",
        url_audio: "musicas/GroovyAmbientFunk.mp3"
    },
    {
        nome: "Can't Stop Coming",
        autor: "azazel",
        url_foto: "imagens/CantStopComing.jpg",
        url_audio: "musicas/CantStopComing.mp3"
    },
    {
        nome: "Nightfall / Future Bass Music",
        autor: "SoulProdMusic",
        url_foto: "imagens/NightfallFutureBassMusic.jpg",
        url_audio: "musicas/NightfallFutureBassMusic.mp3"
    },
    {
        nome: "Movement",
        autor: "SoulProdMusic",
        url_foto: "imagens/Movement.jpg",
        url_audio: "musicas/Movement.mp3"
    },
    {
        nome: "Happy Rock",
        autor: "Top-Flow",
        url_foto: "imagens/HappyRock.jpg",
        url_audio: "musicas/HappyRock.mp3"
    },
    {
        nome: "Separation",
        autor: "William_King",
        url_foto: "imagens/Separation.jpg",
        url_audio: "musicas/Separation.mp3"
    }
];

function converterTempo(total) {
    vMin = Math.floor(total / 60);
    vSeg = total % 60;
    min = (vMin > 10) ? parseInt(vMin) : `0${parseInt(vMin)}`;
    seg = (vSeg > 10) ? parseInt(vSeg) : `0${parseInt(vSeg)}`
    return {
        minutos: min,
        segundos: seg
    }
}

function tocarMusica() {
    if (botaoMusica.value === "play") {
        audio.play();
        botaoMusica.value = "pause";
        botaoMusica.innerHTML = '<i class="bi bi-pause-fill fs-2"></i>';
        return;
    }
    else if (botaoMusica.value === "pause") {
        audio.pause();
        botaoMusica.value = "play";
        botaoMusica.innerHTML = '<i class="bi bi-play-fill fs-2"></i>';
        return;
    }
}

function mudarProgresso() {
    progressoAtual.style.width = parseInt(tempoSegs / audio.duration * Number(barraProgresso.clientWidth)) + "px";
}

function mudarTempo() {
    tempoSegs = audio.currentTime;
    tempoAtual = converterTempo(tempoSegs);
    mudarProgresso();
    if (tempoSegs === audio.duration) {
        botaoMusica.value = "play";
        botaoMusica.innerHTML = '<i class="bi bi-play-fill fs-2"></i>';
    }
    if (tempoSegs > 0 && !audioCarregado) {
        audioCarregado = true;
        audio.volume = volumeAtual;
        tempoMax = converterTempo(audio.duration);
    }
    if (audioCarregado)
        timer.innerText = `${tempoAtual.minutos}:${tempoAtual.segundos} / ${tempoMax.minutos}:${tempoMax.segundos}`;
}

function definirMusica(indice) {
    if (botaoMusica.value === "pause") {
        audio.pause();
        botaoMusica.value = "play";
        botaoMusica.innerHTML = '<i class="bi bi-play-fill fs-2"></i>';
    }
    audioCarregado = false;
    tempoSegs = 0;
    timer.innerText = "--:-- / --:--";
    progressoAtual.style.width = "0px";
    audio.src = musicas[indice].url_audio;
    document.querySelector("#capaMusica").setAttribute('src', musicas[indice].url_foto);
    document.querySelector("#nomeMusica").innerText = musicas[indice].nome;
    document.querySelector("#nomeAutor").innerText = musicas[indice].autor;
}

function mudarVolume() {
    volumeAtual = barraVolume.value;
    if (audioCarregado)
        audio.volume = volumeAtual;
    if (barraVolume.value <= 0) {
        iconVolume.classList.add("bi-volume-mute-fill");
        if (iconVolume.classList.contains("bi-volume-down-fill"))
            iconVolume.classList.remove("bi-volume-down-fill");
        if (iconVolume.classList.contains("bi-volume-up-fill"))
            iconVolume.classList.remove("bi-volume-up-fill");
    }
    else if (barraVolume.value > 0 && barraVolume.value <= 0.7) {
        iconVolume.classList.add("bi-volume-down-fill");
        if (iconVolume.classList.contains("bi-volume-mute-fill"))
            iconVolume.classList.remove("bi-volume-mute-fill");
        if (iconVolume.classList.contains("bi-volume-up-fill"))
            iconVolume.classList.remove("bi-volume-up-fill");
    }
    else {
        iconVolume.classList.add("bi-volume-up-fill");
        if (iconVolume.classList.contains("bi-volume-down-fill"))
            iconVolume.classList.remove("bi-volume-down-fill");
        if (iconVolume.classList.contains("bi-volume-mute-fill"))
            iconVolume.classList.remove("bi-volume-mute-fill");
    }
}

function zerarVolume() {
    barraVolume.value = 0;
    mudarVolume();
    return;
}

function recomecarMusica() {
    audio.currentTime = 0;
}

function voltarTempo() {
    audio.currentTime -= 5;
}

function avancarTempo() {
    audio.currentTime += 5;
}

function cliqueBarra(clique) {
    let mouseX = clique.clientX - barraProgresso.getBoundingClientRect().left;
    if (selecaoAtual !== 0) {
        audio.currentTime = audio.duration * (mouseX / barraProgresso.getBoundingClientRect().width);
        console.log((mouseX / barraProgresso.getBoundingClientRect().width));
        console.log(converterTempo(mouseX / barraProgresso.getBoundingClientRect().width * audio.duration));
    }
}

function criarItens() {
    for (let musica = 1; musica < musicas.length; musica++) {
        const item = document.createElement("li");
        item.className = "item-playlist list-group-item my-3 d-flex flex-row align-items-center rounded-1";
        item.value = musica;
        item.innerHTML = `<img src="${musicas[musica].url_foto}" alt="" class="rounded-2">
                        <div class="info-musica mx-2 d-flex flex-column justify-content-center">
                            <h2 class="my-0">${musicas[musica].nome}</h2>
                            <p class="my-0">${musicas[musica].autor}</p>
                        </div>`;
        item.addEventListener('click', () => {
            selecaoAtual = item.value;
            definirMusica(selecaoAtual);
        });
        playlist.appendChild(item);
    }
}

audio.addEventListener('timeupdate', mudarTempo);
botaoMusica.addEventListener('click', tocarMusica);
barraVolume.addEventListener('input', mudarVolume);
iconVolume.addEventListener('click', zerarVolume);
iconRecomecar.addEventListener('click', recomecarMusica);
iconVoltar.addEventListener('click', voltarTempo);
iconAvancar.addEventListener('click', avancarTempo);
barraProgresso.addEventListener('click', cliqueBarra);

criarItens();
definirMusica(selecaoAtual);
