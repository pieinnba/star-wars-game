const gameCourt = document.querySelector('.game-space')
const difficultBlock = document.querySelector('.difficult-block')
const startScreen = document.querySelector('.start-screen')
const background = document.querySelector('.background')
const flipPhone = document.querySelector('.flip-phone')
const imgMass = ["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png", "img/6.png", "img/7.png", "img/8.png", "img/9.png", "img/10.png"]
const difficult = {
    easy: ['game-space-easy', 6, 1500],
    mid: ['game-space-mid', 12, 2500],
    hard: ['game-space-hard', 20, 4500]
}
const difficultButtons = document.querySelector('.difficult-buttons')
const victoryScreen = document.querySelector('.victory-screen')
const playAgain = document.querySelector('.play-again-button')

let gameImgMass = []

//ФУНКЦИЯ ПЕРЕХОДА НА СЛЕДУЮЩИЙ ЭКРАН
function aminationItem (hideItem, openItem) {
    openItem.style.opacity = 1
    hideItem.style.opacity = 0
    setTimeout(function () {
        openItem.style.top = 0
        // hideItem.style.top = 50 + 'vh'
        hideItem.style.top = 100 + '%'
    }, 500)
}

//МИГАЮЩАЯ НАДПИСЬ НА СТАРТОВОМ ЭКРАНЕ
setInterval(function(){
    document.querySelector('.start-screen-message').style.opacity = 1 - document.querySelector('.start-screen-message').style.opacity;
},750);

//ЗАПУСК ИГРЫ СО СТАРТОВОГО ЭКРАНА
startScreen.addEventListener('click', function () {    
    //СЛУШАТЕЛЬ НА КНОПКАХ СЛОЖНОСТИ
    difficultButtons.addEventListener('click', clickDiffcult)
    aminationItem (startScreen, difficultBlock)
}) 

//СОЗДАНИЕ СЕТКИ ИГРЫ И ЗАПОЛНЕНИЕ ЕЁ ЭЛЕМЕНТАМИ
let difficultValue = ''
function chooseMode (lvl) {
    //ЗНАЧЕНИЯ СЛОЖНОСТИ
    difficultValue = difficult[lvl];
    //ПОДРЕЗКА МАССИВА
    for (let i = 0; i < difficultValue[1]/2; i++){
        gameImgMass.push(imgMass[i])
    }
    gameImgMass = gameImgMass.concat(gameImgMass)
    shuffle(gameImgMass)
    //СОЗДАНИЕ ИГРОВОЙ СЕТКИ
    gameCourt.classList.add(difficultValue[0])
    //СОЗДАНИЕ ИГРОВЫХ ЯЧЕЕК
    for (let i = 1; i <= difficultValue[1]; i++) {
        let gameItem = document.createElement("div");
        gameItem.className = 'game-item';
        gameItem.id = i;
        gameItem.dataset.status = 'disabled'
        gameCourt.append(gameItem);
    }
    difficultButtons.removeEventListener('click', clickDiffcult)
    fullGameCourt();
}

//ПЕРЕМЕШИВАНИЕ МАССИВА КАРТИНОК
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//ЗАПОЛНЕНИЕ КАРТИНКАМИ ИГРОВОГО ПОЛЯ И НАЧАЛО ИГРЫ
function fullGameCourt () {
    let img = ''
    let imgCover = ''
    for (let i = 0; i < gameImgMass.length; i++) {
        //СОЗДНИЕ ИГРОВОЙ КАРТИНКИ
        img = document.createElement("IMG");
        img.src = gameImgMass[i];
        img.classList = 'back-img'
        img.style.transform = 'rotateY(360deg)'
        gameCourt.children[i].append(img)
        //СОЗДАНИЕ ВНЕШНЕЙ КАРТИНКИ
        setTimeout(function () {
            imgCover = document.createElement("IMG");
            imgCover.src = 'img/trumb.png';
            imgCover.classList = 'front-img'
            imgCover.style.transform = 'rotateY(180deg)'
            gameCourt.children[i].append(imgCover)
        }, 0)
    }
    //ПОВОРОТ КАРТИНОК НА ТЫЛЬНУЮ СТОРОНУ И ВКЛЮЧЕНИЕ СЛУШАТЕЛЯ НА ЭЛЕМЕНТАХ
    setTimeout(function () {
        for (let i = 0; i < gameImgMass.length; i++) {
            gameCourt.children[i].lastChild.style.transform = 'rotateY(0deg)'
            gameCourt.children[i].firstChild.style.transform = 'rotateY(180deg)'
        }
    }, difficultValue[2])
    aminationItem (difficultBlock, gameCourt)
    //СЛУШАТЕЛЬ НА ЭЛЕМЕНТАХ
    gameCourt.addEventListener('click', clickElem)
}

//ФУНКЦИЯ ОТСЛЕЖИВАНИЯ КАКУЮ СЛОЖНОСТЬ ВЫБРАНО
function clickDiffcult(event) {
    let target = event.target;
    if (target.tagName != 'BUTTON') return;
    chooseMode (target.dataset.lvlOfDifficult)
}

//ФУНКЦИЯ ДЛЯ ВЗАИМОДЕЙСТВИЯ С ЭЛЕМЕНТАМИ ИГРЫ
let count = 0;
function clickElem(event) {
    let target = event.target;
    if (target.tagName != 'IMG' || target.parentElement.dataset.status == 'done') return;
    //ПЕРЕВОРАЧИВАЕМ НЕАКТИВНЫЕ ЭЛЕМЕНТЫ
    if (target.parentElement.dataset.status !== 'active' && count < 2) {
        target.parentElement.lastChild.style.transform = "rotateY(180deg)"
        target.parentElement.firstChild.style.transform = "rotateY(360deg)"
        //АКТИВИРУЕМ ЭЛЕМЕНТЫ
        target.parentElement.dataset.status = 'active'
        //СЧИТАЕМ СКОЛЬКО ЭЛЕМЕНТОВ ПЕРЕВЕРНУТО
        count++    
    }
    //ЗАПУСТИТЬ ФУНКЦИЮ ПРОВЕРКИ НА СООТВЕТСТВИЕ КАРТИНОК ЕСЛИ ИХ ОТКРЫТО 2
    if (count == 2) {
        checkElem ();
    }
}

//СЧЕТЧИК ВЕРНО ОТКРЫТЫХ ЭЛЕМЕНТОВ
let winCount = 0
//ФУНКЦИЯ ПРОВЕРКИ НА СООТВЕТСТВИЕ КАРТИНОК
function checkElem () {
    let checkMass = []
    //УДАЛЯЕМ СЛУШАТЕЛЬ НА ВРЕМЯ ВЫПОЛНЕНИЯ ДАННОЙ ФУНКЦИИ
    gameCourt.removeEventListener('click', clickElem)
    //ДОБАВЛЕНИЕ В МАССИВ АКТИВНЫХ ЭЛЕМЕНТОВ
    for (let elem of document.querySelector('.game-space').children) {
        if (elem.dataset.status == 'active') {
            checkMass.push(elem.firstChild)
        } 
    }
    //ПРОВЕРКА ОДИНАКОВЫЕ ЛИ ЭЛЕМЕНТЫ
    if (checkMass[0].src == checkMass[1].src) {
        //ДА -- МЕНЯЕМ СТАТУС ЭЛЕМЕНТОВ НА "ВЫПОЛНЕН"
        checkMass[0].parentElement.dataset.status = 'done'
        checkMass[1].parentElement.dataset.status = 'done'
        //ДОБАВЛЯЕМ КОЛИЧЕСТВО ЭЛЕМЕНТОВ В СЧЕТЧИК
        winCount = winCount + 2
        //ОБНУЛЯЕМ СЧЕТЧИК И МАССИВ ПЕРЕВЕРНУТЫХ ЭЛЕМЕНТОВ, ВЕРТАЕМ СЛУШАТЕЛЯ ЭЛЕМЕНТАМ
        count = 0
        checkMass = []
        gameCourt.addEventListener('click', clickElem)
    } else {
        //НЕТ -- МЕНЯЕМ СТАТУС НА "НЕАКТИВНЫЙ" И ПЕРЕВОРАЧИВАЕМ ЭЛЕМЕНТЫ НАЗАД ПО ТАЙМЕРУ
        setTimeout(function () {
        checkMass[0].style.transform = "rotateY(180deg)"
        checkMass[0].nextSibling.style.transform = "rotateY(0deg)"
        checkMass[0].parentElement.dataset.status = 'disabled'
        checkMass[1].style.transform = "rotateY(180deg)"
        checkMass[1].nextSibling.style.transform = "rotateY(0deg)"
        checkMass[1].parentElement.dataset.status = 'disabled'
        //ОБНУЛЯЕМ СЧЕТЧИК И МАССИВ ПЕРЕВЕРНУТЫХ ЭЛЕМЕНТОВ, ВЕРТАЕМ СЛУШАТЕЛЯ ЭЛЕМЕНТАМ
        count = 0
        checkMass = []
        gameCourt.addEventListener('click', clickElem)
        }, 1100)
    }
    //ПРОВЕРЯЕМ ВСЕ ЛИ ЭЛЕМЕНТЫ ПЕРЕВЕРНУТЫ
    if (winCount == gameImgMass.length) {
        console.log('you win!')
        winCount = 0
        setTimeout(function () {
            congrats()
        }, 2000)
    }
}

//ФУНКЦИЯ ЗАПУСКАЮЩАЯ ЭКРАН ПОБЕДЫ И ОТОБРАЖЕНИЕ КНОПКУ "СЫГРАТЬ ЕЩЕ"
function congrats () {
    aminationItem (gameCourt, victoryScreen)
    //ОТОБРАЖЕНИЕ КНОПКИ "СЫГРАТЬ ЕЩЕ"
    victoryScreen.children[2].style.display = 'flex'
    setTimeout(function () {
        victoryScreen.children[2].style.opacity = 1
        playAgain.addEventListener('click', toStart)
    }, 2000)
}

//ФУНКЦИЯ ЗАПУСКА НОВОЙ ИГРЫ
function toStart() {
    //ОЧИСТКА ИГРОВОГО ПОЛЯ
    gameCourt.innerHTML = ''
    gameCourt.classList = 'game-space'
    gameImgMass = []
    playAgain.removeEventListener('click', toStart)
    //ВКЛЮЧЕНИЕ ЭКРАНА ВЫБОРА СЛОЖНОСТИ
    difficultButtons.addEventListener('click', clickDiffcult)
    setTimeout(function () {
        victoryScreen.children[2].style.display = 'none'
        victoryScreen.children[2].style.opacity = 0
    }, 500)
    aminationItem (victoryScreen, difficultBlock)
}

//ФУНКЦИЯ ВЫБОРА РЕЖИМА ОТОБРАЖЕНИЯ ИГРЫ
function chooseVersionOfGame () {
    if(document.documentElement.clientWidth <= 1200){
        //ПОРТАТИВНАЯ ВЕРСИЯ
        background.firstElementChild.hidden = true
        background.lastElementChild.hidden = false
        difficultButtons.lastElementChild.disabled = true
        //ВКЛЮЧЕНИЕ ПРОВЕРКИ НА ОРИЕНТАЦИЮ ЭКРАНА
        flipDevice();
    } else {
        //ДЕСКТОП ВЕРСИЯ
        background.firstElementChild.hidden = false
        background.lastElementChild.hidden = true
        difficultButtons.lastElementChild.disabled = false
    }
}
chooseVersionOfGame ()
//СЛУШАТЕЛЬ ИЗМЕНЕНИЯ РАЗМЕРА ОКНА БРАУЗЕРА
window.addEventListener('resize', chooseVersionOfGame);

//ФУНКЦИЯ ПРОВЕРКИ ОРИЕНТАЦИИ ЭКРАНА
function flipDevice() {
    window.screen.orientation.type == 'portrait-primary' ?
    flipPhone.style.display = 'flex' :
    flipPhone.style.display = 'none'
}




