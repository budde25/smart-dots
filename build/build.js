var DNA = (function () {
    function DNA(size) {
        var _this = this;
        this.isDead = function () { return _this.dead; };
        this.getPosition = function () { return _this.position; };
        this.getFitness = function () { return _this.fitness; };
        this.getSteps = function () { return _this.steps; };
        this.isOnGoal = function () { return _this.onGoal; };
        this.setDead = function (dead) { return _this.dead = dead; };
        this.setSteps = function (steps) { return _this.steps = steps; };
        this.checkDead = function () {
            if (!_this.dead) {
                if (_this.genes.length < _this.steps) {
                }
                if (_this.position.x < 3 || _this.position.x > width - 3 || _this.position.y < 3 || _this.position.y > height - 3) {
                    _this.dead = true;
                }
                if (dist(_this.position.x, _this.position.y, _this.goal.getPosition().x, _this.goal.getPosition().y) < _this.goal.getRadius()) {
                    _this.onGoal = true;
                    _this.dead = true;
                }
            }
        };
        this.show = function () {
            fill(0);
            ellipse(_this.position.x, _this.position.y, _this.radius, _this.radius);
        };
        this.update = function () {
            _this.checkDead();
            if (!_this.dead) {
                if (_this.genes.length > _this.steps) {
                    _this.acceleration = _this.genes[_this.steps];
                }
                else {
                    _this.dead = true;
                }
                _this.velocity.add(_this.acceleration);
                _this.velocity.limit(5);
                _this.position.add(_this.velocity);
                _this.steps++;
            }
        };
        this.calculateFitness = function () {
            var distanceToGoal = dist(_this.position.x, _this.position.y, _this.goal.getPosition().x, _this.goal.getPosition().y);
            _this.fitness = 1 / (distanceToGoal * distanceToGoal);
            _this.fitness = _this.fitness / (_this.steps);
        };
        this.breed = function (parrentB) {
            var child = new DNA(_this.genes.length);
            for (var i = 0; i < _this.genes.length; i++) {
                if (i % 2 === 1) {
                    child.genes[i] = _this.genes[i];
                }
                else {
                    child.genes[i] = parrentB.genes[i];
                }
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
        this.goal = new Goal();
        this.size = size;
        this.radius = 4;
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
    function Obstacle(posx, posy, obsWidth, obsHeight) {
        var _this = this;
        this.show = function () {
            fill(127);
            rect(_this.position.x, _this.position.y, _this.obsWidth, _this.obsHeight);
        };
        this.isTouching = function (location) {
            return location.x > _this.position.x &&
                location.x < _this.position.x + _this.obsWidth &&
                location.y > _this.position.y &&
                location.y < _this.position.y + _this.obsHeight;
        };
        this.position = createVector(posx, posy);
        this.obsWidth = obsWidth;
        this.obsHeight = obsHeight;
    }
    return Obstacle;
}());
var Population = (function () {
    function Population(size, moves) {
        var _this = this;
        this.population = [];
        this.matingPool = [];
        this.mutationRate = 0.01;
        this.update = function () {
            for (var i = 0; i < _this.population.length; i++) {
                _this.population[i].update();
            }
        };
        this.show = function () {
            for (var i = 0; i < _this.population.length; i++) {
                _this.population[i].show();
            }
        };
        this.checkDead = function () {
            for (var i = 0; i < _this.population.length; i++) {
                if (!_this.population[i].isDead()) {
                    return false;
                }
            }
            return true;
        };
        this.findMaxSteps = function () {
            for (var i = 0; i < _this.population.length; i++) {
                if (_this.population[i].isOnGoal()) {
                    if (_this.population[i].getSteps() < _this.maxSteps) {
                        _this.maxSteps = _this.population[i].getSteps();
                    }
                }
            }
            for (var i = 0; i < _this.population.length; i++) {
                _this.population[i].setSteps(_this.maxSteps);
            }
        };
        this.getMaxFitness = function () {
            var maxFitness = 0;
            for (var i = 0; i < _this.population.length; i++) {
                if (_this.population[i].getFitness() > maxFitness) {
                    maxFitness = _this.population[i].getFitness();
                }
                return maxFitness;
            }
        };
        this.calculateFitness = function () {
            _this.population.forEach(function (item) {
                item.calculateFitness();
            });
        };
        this.generateMatingPool = function () {
            var maxFitness = _this.getMaxFitness();
            for (var i = 0; i < _this.population.length; i++) {
                var fitnessNormal = map(_this.population[i].getFitness(), 0, maxFitness, 0, 1);
                var max_1 = Math.floor(fitnessNormal * 10);
                for (var j = 0; j < max_1; j++) {
                    _this.matingPool.push(_this.population[i]);
                }
            }
        };
        this.generateChild = function () {
            for (var i = 0; i < _this.population.length; i++) {
                var parrentA = _this.matingPool[Math.floor(Math.random() * _this.matingPool.length)];
                var parrentB = _this.matingPool[Math.floor(Math.random() * _this.matingPool.length)];
                var child = parrentA.breed(parrentB);
                child.mutate(_this.mutationRate);
                _this.population[i] = child;
            }
        };
        this.maxSteps = moves;
        this.size = size;
        for (var i = 0; i < this.size; i++) {
            this.population.push(new DNA(this.size));
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
}
function draw() {
    background(222);
    if (population.checkDead()) {
        population.findMaxSteps();
        population.calculateFitness();
        population.generateMatingPool();
        population.generateChild();
        gen++;
    }
    else {
        population.update();
        population.show();
        goal.show();
    }
    for (var i = 0; i < population.population.length; i++) {
        var pos = population.population[i].getPosition();
        for (var j = 0; j < obstacles.length; j++) {
            if (obstacles[j].isTouching(pos)) {
                population.population[i].setDead(true);
            }
        }
    }
    fill(0);
    text('generation: ' + gen, 10, 20);
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].show();
    }
}
function mousePressed() {
    obstacles.push(new Obstacle(mouseX, mouseY, 300, 10));
}
//# sourceMappingURL=build.js.map