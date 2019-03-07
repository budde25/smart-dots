function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
var DNA = (function () {
    function DNA(size) {
        var _this = this;
        this.colors = [color('red'), color('green'), color('blue'), color('yellow')];
        this.isDead = function () { return _this.dead; };
        this.getPosition = function () { return _this.position; };
        this.getFitness = function () { return _this.fitness; };
        this.getSteps = function () { return _this.steps; };
        this.isOnGoal = function () { return _this.onGoal; };
        this.getColor = function () { return _this.color; };
        this.setDead = function (dead) { return _this.dead = dead; };
        this.setSteps = function (steps) { return _this.steps = steps; };
        this.setColor = function (color) { return _this.color = color; };
        this.checkDead = function () {
            if (!_this.dead) {
                if ((_this.position.x < 3 || _this.position.x > width - 3 || _this.position.y < 3 || _this.position.y > height - 3) ||
                    (_this.genes.length <= _this.steps)) {
                    _this.dead = true;
                }
                if (dist(_this.position.x, _this.position.y, goal.getPosition().x, goal.getPosition().y) < goal.getRadius()) {
                    _this.onGoal = true;
                    _this.dead = true;
                }
            }
        };
        this.show = function () {
            noStroke();
            fill(_this.color);
            ellipse(_this.position.x, _this.position.y, _this.radius, _this.radius);
        };
        this.move = function () {
            _this.checkDead();
            if (!_this.dead) {
                _this.acceleration = _this.genes[_this.steps];
                _this.velocity.add(_this.acceleration).limit(4.5);
                _this.position.add(_this.velocity);
                _this.steps++;
            }
        };
        this.calculateFitness = function () {
            var distanceToGoal = dist(_this.position.x, _this.position.y, goal.getPosition().x, goal.getPosition().y);
            _this.fitness = 1 / (distanceToGoal * distanceToGoal);
            if (_this.onGoal) {
                _this.fitness = _this.fitness + (_this.fitness / (_this.steps));
            }
        };
        this.breed = function (parrentB) {
            var child = new DNA(_this.size);
            for (var i = 0; i < _this.genes.length; i++) {
                if (i % 2 === 1) {
                    child.genes[i] = _this.genes[i];
                }
                else {
                    child.genes[i] = parrentB.genes[i];
                }
            }
            child.setColor(lerpColor(_this.color, parrentB.color, Math.random()));
            return child;
        };
        this.clone = function () {
            var child = new DNA(_this.size);
            for (var i = 0; i < _this.genes.length; i++) {
                child.genes[i] = _this.genes[i];
            }
            return child;
        };
        this.mutate = function (mutationRate) {
            for (var i = 0; i < _this.genes.length; i++) {
                if (random() < mutationRate) {
                    _this.genes[i] = p5.Vector.random2D();
                }
            }
        };
        this.size = size;
        this.radius = 8;
        this.color = this.colors[getRandomInt(0, this.colors.length)];
        this.position = createVector(width / 2, height - 20);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.dead = false;
        this.onGoal = false;
        this.fitness = 0;
        this.steps = 0;
        this.genes = [];
        for (var i = 0; i < this.size; i++) {
            this.genes[i] = p5.Vector.random2D();
        }
    }
    return DNA;
}());
var Goal = (function () {
    function Goal() {
        var _this = this;
        this.getPosition = function () { return _this.position; };
        this.getRadius = function () { return _this.radius; };
        this.show = function () {
            fill(127);
            ellipse(_this.position.x, _this.position.y, _this.radius, _this.radius);
        };
        this.position = createVector(width / 2, 5);
        this.radius = 10;
    }
    return Goal;
}());
var Obstacle = (function () {
    function Obstacle(posx, posy) {
        var _this = this;
        this.setWidth = function (X) { return _this.obsWidth = -_this.position.x + X; };
        this.setHeight = function (Y) { return _this.obsHeight = -_this.position.y + Y; };
        this.show = function () {
            if (_this.obsHeight == null && _this.obsWidth == null) {
                fill(169, 169, 169, 200);
                rect(_this.position.x, _this.position.y, -_this.position.x + mouseX, -_this.position.y + mouseY);
            }
            else {
                fill(169, 169, 169);
                rect(_this.position.x, _this.position.y, _this.obsWidth, _this.obsHeight);
            }
        };
        this.isTouching = function (location) {
            if (_this.obsWidth != null && _this.obsHeight != null) {
                return location.x > _this.position.x &&
                    location.x < _this.position.x + _this.obsWidth &&
                    location.y > _this.position.y &&
                    location.y < _this.position.y + _this.obsHeight;
            }
            else {
                return false;
            }
        };
        this.position = createVector(posx, posy);
        this.obsWidth = null;
        this.obsHeight = null;
    }
    return Obstacle;
}());
var Population = (function () {
    function Population(size, moves) {
        var _this = this;
        this.population = [];
        this.matingPool = [];
        this.mutationRate = 0.01;
        this.move = function () { for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
            var pop_1 = _a[_i];
            pop_1.move();
        } };
        this.show = function () { for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
            var pop_2 = _a[_i];
            pop_2.show();
        } };
        this.checkDead = function () {
            for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
                var pop_3 = _a[_i];
                if (!pop_3.isDead()) {
                    return false;
                }
            }
            return true;
        };
        this.setMaxSteps = function () {
            var maxSteps = _this.moves;
            for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
                var pop_4 = _a[_i];
                if (pop_4.isOnGoal() && pop_4.getSteps() < maxSteps) {
                    maxSteps = pop_4.getSteps();
                }
            }
            for (var _b = 0, _c = _this.population; _b < _c.length; _b++) {
                var pop_5 = _c[_b];
                pop_5.setSteps(maxSteps);
            }
        };
        this.getMaxFitness = function () {
            var maxFitness = 0;
            for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
                var pop_6 = _a[_i];
                if (pop_6.getFitness() > maxFitness) {
                    maxFitness = pop_6.getFitness();
                }
                return maxFitness;
            }
        };
        this.findChampion = function () {
            var champion = new DNA(_this.size);
            for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
                var pop_7 = _a[_i];
                if (pop_7.getFitness() > champion.getFitness()) {
                    champion = pop_7;
                }
            }
            champion = champion.clone();
            champion.setColor(color('black'));
            return champion;
        };
        this.calculateFitness = function () { for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
            var pop_8 = _a[_i];
            pop_8.calculateFitness();
        } };
        this.generateMatingPool = function () {
            var maxFitness = _this.getMaxFitness();
            for (var _i = 0, _a = _this.population; _i < _a.length; _i++) {
                var pop_9 = _a[_i];
                var fitnessNormal = map(pop_9.getFitness(), 0, maxFitness, 0, 1);
                var max_1 = Math.floor(fitnessNormal * 10);
                for (var j = 0; j < max_1; j++) {
                    _this.matingPool.push(pop_9);
                }
            }
        };
        this.generateChild = function () {
            _this.population[0] = _this.findChampion();
            for (var i = 1; i < _this.population.length; i++) {
                var parrentA = _this.matingPool[Math.floor(Math.random() * _this.matingPool.length)];
                var parrentB = _this.matingPool[Math.floor(Math.random() * _this.matingPool.length)];
                var child = parrentA.breed(parrentB);
                child.mutate(_this.mutationRate);
                _this.population[i] = child;
            }
        };
        this.moves = moves;
        this.size = size;
        for (var i = 0; i < this.size; i++) {
            this.population.push(new DNA(this.moves));
        }
    }
    return Population;
}());
var population;
var goal;
var gen;
var play;
var obstacles;
function setup() {
    createCanvas(800, 800);
    background('white');
    population = new Population(400, 400);
    goal = new Goal();
    gen = 1;
    play = false;
    obstacles = [];
    console.log(population);
    frameRate(800);
}
function draw() {
    background(222);
    if (population.checkDead()) {
        population.setMaxSteps();
        population.calculateFitness();
        population.generateMatingPool();
        population.generateChild();
        gen++;
    }
    else {
        population.move();
        population.show();
        goal.show();
    }
    for (var _i = 0, _a = population.population; _i < _a.length; _i++) {
        var dna = _a[_i];
        var pos = dna.getPosition();
        for (var _b = 0, obstacles_1 = obstacles; _b < obstacles_1.length; _b++) {
            var obs = obstacles_1[_b];
            if (obs.isTouching(pos)) {
                dna.setDead(true);
            }
        }
    }
    fill(0);
    text('generation: ' + gen, 10, 20);
    for (var _c = 0, obstacles_2 = obstacles; _c < obstacles_2.length; _c++) {
        var obs = obstacles_2[_c];
        obs.show();
    }
}
function mousePressed() {
    obstacles.push(new Obstacle(mouseX, mouseY));
}
function mouseReleased() {
    obstacles[obstacles.length - 1].setHeight(mouseY);
    obstacles[obstacles.length - 1].setWidth(mouseX);
}
//# sourceMappingURL=build.js.map