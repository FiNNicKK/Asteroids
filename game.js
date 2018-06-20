var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var width,height;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = window.innerWidth;
    height = window.innerHeight;
    redraw();
}

resizeCanvas();
var i, ship, Timer;
var aster = [];
var super_aster = [];
var big_aster = [];
var fire = [];
var super_fire = [];
var ultra_fire = [];
var ultra_asteroid = [];
var expl = [];
var destr;

var count = 0;

//загрузка ресурсов
asterimg = new Image();
asterimg.src = 'astero.png';

asterimgSuper = new Image();
asterimgSuper.src = 'asteroids.png';

asterimgBig = new Image();
asterimgBig.src = 'asteroidBig.png';

shieldimg = new Image();
shieldimg.src = 'shield.png';

ultra = new Image();
ultra.src = 'ultra.png';

fireimg = new Image();
fireimg.src = 'fire.png';

super_fireimg = new Image();
super_fireimg.src = 'superFire2.png';

shipimg = new Image();
shipimg.src = 'rocket.png';

ultra_fireimg  = new Image();
ultra_fireimg.src = 'ultra_ball.png';

explimg = new Image();
explimg.src = 'expl222.png';


//старт игры
shipimg.onload = function () {
    init();
    game();
}


//совместимость с браузерами
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20);
        };
})();

function EnergyBall()
{
    if (count>5) {
        ultra_fire.push({x: ship.x - 50 , y: ship.y-50,  dx: 0.1, dy: -5, damage: count / 2, size:200, ds:2})
        count -= 2.5;
    }
}

//начальные установки
function init() {
    redraw();
    canvas.addEventListener("mousemove", function (event) {
        ship.x = event.offsetX - 50;
        ship.y = event.offsetY - 13;
    });
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('click', EnergyBall, false);
    Timer = 0;
    ship = {x: width / 2, y: height / 2, animx: 0, animy: 0};
    ship.lives = 3;
    destr = 0;
}

//основной игровой цикл
function game() {
    update();
    render();
    requestAnimFrame(game);
}

function redraw() {
    context.strokeStyle = 'blue';
    context.lineWidth = '5';
    context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

//функция обновления состояния игры
function update() {
    Timer++;

//спавн астероидов
    if (Timer % 10 == 0) {
        aster.push({
            size:50,
            angle: 0,
            dxangle: Math.random() * 0.1 - 0.1,
            del: 0,
            x: Math.random() * (width - 50),
            y: -50,
            dx: Math.random() * 3 - 1,
            dy: Math.random() * 2 + 1,
            lifes: 1
        });
    }
    if (Timer % 50 == 0) {
        if (count >= 100) {
            super_aster.push({
                size:50,
                angle: 0,
                dxangle: Math.random() * 0.1 - 0.1,
                del: 0,
                x: Math.random() * (width - 50),
                y: -50,
                dx: Math.random() * 3 - 1,
                dy: Math.random() * 2 + 1,
                lifes: 3
            });
        }
    }
    if (Timer % 200 == 0) {
        if (count >= 150) {
            big_aster.push({
                size:100,
                angle: 0,
                dxangle: Math.random() * 0.1 - 0.1,
                del: 0,
                x: Math.random() * (width - 50),
                y: -50,
                dx: Math.random() * 3 - 1,
                dy: Math.random() * 2 + 1,
                lifes: 15,
                big: 1
            });
        }
    }
    if (Timer % 1000 == 0) {
        if (count >= 150) {
            ultra_asteroid.push({
                size:150,
                angle: 0,
                dxangle: Math.random() * 0.1,
                del: 0,
                x: Math.random() * (width - 50),
                y: -50,
                dx: Math.random() * 3 - 1,
                dy: Math.random() * 0.5 + 1,
                lifes: 50,
                special: 1
            });
        }
    }
//выстрел
    if (Timer % 30 == 0) {
        fire.push({x: ship.x + 35, y: ship.y, dx: 0, dy: -5.2, damage: 1});
        if (count >= 50) {
            fire.push({x: ship.x + 35, y: ship.y, dx: 0.5, dy: -5, damage: 1});
            fire.push({x: ship.x + 35, y: ship.y, dx: -0.5, dy: -5, damage: 1});
        }
        if (count >= 150) {
            fire.push({x: ship.x + 35, y: ship.y, dx: 1, dy: -4.8, damage: 1});
            fire.push({x: ship.x + 35, y: ship.y, dx: -1, dy: -4.8, damage: 1});
        }
        if (count >= 10 && count % 10 == 0) {
            super_fire.push({x: ship.x + 35, y: ship.y, dx: 1.5, dy: -4.5, damage: 2});
            super_fire.push({x: ship.x + 35, y: ship.y, dx: -1.5, dy: -4.5, damage: 2});
        }
        if (Timer % 200 == 0) {
            var j=0;
            while(j<10)
            {
                super_fire.push({x: ship.x + 35, y: ship.y, dx: 0-Math.random()*3, dy: -5+Math.random()*3, damage: 2});
                super_fire.push({x: ship.x + 35, y: ship.y, dx: 0+Math.random()*3, dy: -5+Math.random()*3, damage: 2});
                j++;
            }
            destr=0;
        }

    }



    function fireDestroy(fire_collection, aster_collection) {
        try {
            for (j in fire_collection) {
                temp = aster_collection[i].lifes;

                if (Math.abs(aster_collection[i].x - fire_collection[j].x) < aster_collection[i].size && Math.abs(aster_collection[i].y - fire_collection[j].y) < aster_collection[i].size) {
                    if(aster_collection[i].special==1 && aster_collection[i].lifes<=1)
                    {
                        var h=0;
                        while (h < count/50)
                        {

                            super_fire.push({x: ship.x + 35, y: ship.y, dx: 0-Math.random()*h, dy: -5+Math.random()*h, damage: 5});
                            super_fire.push({x: ship.x + 35, y: ship.y, dx: 0+Math.random()*h, dy: -5+Math.random()*h, damage: 5});
                            h++;
                        }
                    }
                    aster_collection[i].lifes -= fire_collection[j].damage;
                    fire_collection[j].damage -= temp;
                    if (aster_collection[i].lifes <= 0) {
                        expl.push({
                            x: aster_collection[i].x - 25,
                            y: aster_collection[i].y - 25,
                            animx: 0,
                            animy: 0
                        });
                        count += temp;
                        aster_collection[i].del = 1;
                    }
                    if (fire_collection[j].damage <= 0) {
                        fire_collection.splice(j, 1);
                        break;
                    }
                }
            }
        }
        catch (TypeError) {
            console.log("error1")
        }
    }

    function countDrop(asteroid_collection) {
        for (j in asteroid_collection) {
            if (asteroid_collection[j].y > height*0.99) {
                count -= asteroid_collection[j].lifes/4;
                asteroid_collection[j].del = 1;
            }
        }
    }


//движение астероидов
    function asteroidsMovement(aster_collection, fire_collection) {
        try {

            for (i in aster_collection) {
                aster_collection[i].x += aster_collection[i].dx;
                aster_collection[i].y  += aster_collection[i].dy;
                if(aster_collection[i].hasOwnProperty('angle'))
                    aster_collection[i].angle += aster_collection[i].dxangle;
                if(aster_collection[i].hasOwnProperty('size'))
                    aster_collection[i].sizee += aster_collection[i].ds;

                //граничные условия (коллайдер со стенками)
                if (aster_collection[i].x <= 0 || aster_collection[i].x >= width - 50) aster_collection[i].dx = -aster_collection[i].dx;
                if (aster_collection[i].y >= height) aster_collection.splice(i, 1);

                if (Math.abs(aster_collection[i].x - ship.x) < aster_collection[i].size &&
                    Math.abs(aster_collection[i].y - ship.y) < aster_collection[i].size) {
                    ship.lives--;
                    expl.push({
                        x: aster_collection[i].x - 25,
                        y: aster_collection[i].y - 25,
                        animx: 0,
                        animy: 0
                    });
                    aster_collection[i].del = 1;
                }


                //проверим каждый астероид на столкновение с каждой пулей
                fireDestroy(fire_collection, aster_collection);

                    //удаляем астероиды
                if (aster_collection[i].del == 1) aster_collection.splice(i, 1);
            }
        }
        catch (TypeError)
        {
            console.log("error2")
        }
    }

    asteroidsMovement(aster, fire);
    asteroidsMovement(aster, super_fire);
    asteroidsMovement(aster, ultra_fire);
    countDrop(aster);
    if (count >= 100) {
        asteroidsMovement(super_aster, fire);
        asteroidsMovement(super_aster, super_fire);
        asteroidsMovement(super_aster, ultra_fire);
        countDrop(super_aster);
        if (count >= 100) {
            asteroidsMovement(big_aster, fire);
            asteroidsMovement(big_aster, super_fire);
            asteroidsMovement(big_aster, ultra_fire);
            countDrop(big_aster);
            if (count>=100) {
                asteroidsMovement(ultra_asteroid, fire);
                asteroidsMovement(ultra_asteroid, super_fire);
                asteroidsMovement(ultra_asteroid, ultra_fire);
                countDrop(ultra_asteroid);
            }
        }
    }


//двигаем пули
    for (i in fire) {
        fire[i].x = fire[i].x + fire[i].dx;
        fire[i].y = fire[i].y + fire[i].dy;
        if (fire[i].y < -30) fire.splice(i, 1);
    }
    for (i in super_fire) {
        super_fire[i].x = super_fire[i].x + super_fire[i].dx;
        super_fire[i].y = super_fire[i].y + super_fire[i].dy;
        if (super_fire[i].y < -30) super_fire.splice(i, 1);
    }
    for (i in ultra_fire) {
        ultra_fire[i].x = ultra_fire[i].x + ultra_fire[i].dx;
        ultra_fire[i].y = ultra_fire[i].y + ultra_fire[i].dy;
        ultra_fire[i].angle+=ultra_fire[i].dxangle;

        if (ultra_fire[i].y < -200) {
            if (ultra_fire.length > 1) {
                delete(ultra_fire[i])
            }
            else delete(ultra_fire[i])
        }


    }

//Анимация взрывов
    for (i in expl) {
        expl[i].animx = expl[i].animx + 0.5;
        if (expl[i].animx > 7) {
            expl[i].animy++;
            expl[i].animx = 0
        }
        if (expl[i].animy > 7)
            expl.splice(i, 1);
    }

//анимация щита
    ship.animx = ship.animx + 1;
    if (ship.animx > 4) {
        ship.animy++;
        ship.animx = 0
    }
    if (ship.animy > 3) {
        ship.animx = 0;
        ship.animy = 0;
    }
}

function draw_asteroids(asteroid_collection, image_name) {
    for (i in asteroid_collection) {
        context.save();
        context.translate(asteroid_collection[i].x + 25, asteroid_collection[i].y + 25);
        context.rotate(asteroid_collection[i].angle);
        context.drawImage(image_name, -25, -25, 50, 50);
        context.restore();
    }
}


function draw_asteroids_sizes(asteroid_collection, image_name, size_x, size_y) {
    for (i in asteroid_collection) {
        context.save();
        context.translate(asteroid_collection[i].x + 25, asteroid_collection[i].y + 25);
        context.rotate(asteroid_collection[i].angle);
        context.drawImage(image_name, -25, -25, size_x, size_y);
        context.restore();
    }
}


function render() {
    //очистка холста (не обязательно)
    context.clearRect(0, 0, width, height);
    //рисуем пули
    for (i in fire) {
        context.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30);
    }
    for (i in super_fire) {
        context.drawImage(super_fireimg, super_fire[i].x, super_fire[i].y, 50, 50);
    }
    for (i in ultra_fire) {

        context.drawImage(ultra_fireimg, ultra_fire[i].x, ultra_fire[i].y, 200, 200);

    }
    //рисуем корабль
    context.drawImage(shipimg, ship.x, ship.y);
    //рисуем щит
    context.drawImage(shieldimg, 192 * Math.floor(ship.animx), 192 * Math.floor(ship.animy), 192, 192, ship.x - 0, ship.y - 0, 100, 100);
    //рисуем астероиды
    context.font = "italic 30pt Arial";
    context.textAlign = "center";
    context.fillText(count, width/2, 50)
    context.fillText(Timer, width-500, 50);
    context.fillText(ship.lives, width-100, 50);
    draw_asteroids(aster,asterimg);
    draw_asteroids(super_aster,asterimgSuper);
    draw_asteroids_sizes(big_aster,asterimgBig,100,100);
    draw_asteroids_sizes(ultra_asteroid,ultra,150,150);
    //рисуем взрывы
    for (i in expl)
        context.drawImage(explimg, 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100);
    if (ship.lives <=0) {
        if(!alert('GAME OVER')){window.location.reload();}

    }

}

