(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var loop;
//スクリーンの大きさを定義
var SCREEN_WIDTH = 1200;
var SCREEN_HEIGHT = 1200;
//ドットのステータス
var dots;
var dots_length = 1000; //ドットの数
var damp = 0.83; //ドットの動きの大きさ

var mode = 0;
var wall = 'circle'; //画面端の処理
var targetX = 0;
var targetY = 0;
var scale = 1;
var circleScale = 200;
var dotDefaultR = 60;
var dotDefaultG = 60;
var dotDefaultB = 255;
var dotR = dotDefaultR;
var dotG = dotDefaultG;
var dotB = dotDefaultB;
var dotColor = "rgb(" + dotR + "," + dotG + "," + dotB + ")";
var bgColor = "rgba(255,255,255,0.15)";
var force = 40;
var FONT_HEIGHT = 10;
var FONT_alphabet = ['L', 'I', 'V', 'E'];
context.font = FONT_HEIGHT + 'px Arial';

movement_init();

function drawSquare() {
	context.fillStyle = bgColor;
	context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}
function drawCircle() {
	context.beginPath();
	context.arc(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, circleScale, 0, Math.PI * 2, false);
	context.fillStyle = bgColor;
	context.fill();
}

function movement_init() {
	//ドットを再生成する時間
	newDots();
	loop = setInterval(movement_loop, 1000 / 30);
}

function onMouseDown(e) {
	var rect = e.target.getBoundingClientRect();
	targetX = (e.clientX - rect.left) * 2;
	targetY = (e.clientY - rect.top) * 2;
	if (mode == 0) {
		mode = 1;
	} else if (mode == 1) {
		mode = 0;
	};
}

function onMouseMove(e) {
	if (mode == 1) {
		var rect = e.target.getBoundingClientRect();
		targetX = (e.clientX - rect.left) * 2;
		targetY = (e.clientY - rect.top) * 2;
	}
}

function newDots() {
	//配列用意
	dots = [];
	for (var i = 0; i < dots_length; i++) {
		var dot = {
			//中心を設定
			x: SCREEN_WIDTH / 2,
			y: SCREEN_HEIGHT / 2,
			//動く時の数値を設定
			vx: Math.random() - 0.5,
			vy: Math.random() - 0.5,
			point: Math.random(),
			ms: 1 + Math.random() * damp / 4,
			dotR: Math.floor(dotDefaultR - dotDefaultR / 1.5 * Math.random()),
			dotG: Math.floor(dotDefaultG - dotDefaultG / 1.5 * Math.random()),
			dotB: Math.floor(dotDefaultB - dotDefaultB / 1.5 * Math.random()),
			color: "rgb(" + dotR + "," + dotG + "," + dotB + ")",

			nomal: function nomal() {
				//0~1の数値を吐き出すので0.5引いて-値と+値を均衡させる。
				this.vx += Math.random() - 0.5;
				this.vy += Math.random() - 0.5;
				this.x += this.vx;
				this.y += this.vy;
				this.vx *= damp * this.ms;
				this.vy *= damp * this.ms;
				this.dotR = Math.floor(dotDefaultR - dotDefaultR / this.ms * Math.random());
				this.dotG = Math.floor(dotDefaultG - dotDefaultG / this.ms * Math.random());
				this.dotB = Math.floor(dotDefaultB - dotDefaultB / this.ms * Math.random());
			},
			vector: function vector() {
				this.vx += Math.random() - 0.5;
				this.vy += Math.random() - 0.5;
				this.x += this.vx;
				this.y += this.vy;
				if (this.x <= targetX) {
					this.vx += this.ms / 2;
				} else if (this.x >= targetX) {
					this.vx -= this.ms / 2;
				}
				if (this.y <= targetY) {
					this.vy += this.ms / 2;
				} else if (this.y >= targetY) {
					this.vy -= this.ms / 2;
				}
				this.vx *= damp * this.ms;
				this.vy *= damp * this.ms;
			},
			wall: function wall() {
				if (this.x <= 0) {
					this.x = 0;
				} else if (this.x >= SCREEN_WIDTH - scale) {
					this.x = SCREEN_WIDTH - scale;
				}
				if (this.y <= 0) {
					this.y = 0;
				} else if (this.y >= SCREEN_HEIGHT - scale) {
					this.y = SCREEN_HEIGHT - scale;
				}
			},
			wallCircle: function wallCircle() {
				if ((SCREEN_WIDTH / 2 - this.x) * (SCREEN_WIDTH / 2 - this.x) + (SCREEN_HEIGHT / 2 - this.y) * (SCREEN_HEIGHT / 2 - this.y) >= circleScale * circleScale) {
					this.x = SCREEN_WIDTH / 2;
					this.y = SCREEN_HEIGHT / 2;
				}
			},
			wallCircleCatch: function wallCircleCatch() {

				if ((SCREEN_WIDTH / 2 - this.x) * (SCREEN_WIDTH / 2 - this.x) + (SCREEN_HEIGHT / 2 - this.y) * (SCREEN_HEIGHT / 2 - this.y) >= circleScale * circleScale) {

					if (this.x <= SCREEN_WIDTH / 2) {
						this.x += Math.abs(Math.abs(SCREEN_WIDTH / 2 - this.x) / force);
					} else if (this.x >= SCREEN_WIDTH / 2) {
						this.x -= Math.abs(Math.abs(SCREEN_WIDTH / 2 - this.x)) / force;
					}

					if (this.y <= SCREEN_HEIGHT / 2) {
						this.y += Math.abs(Math.abs(SCREEN_HEIGHT / 2 - this.y) / force);
					} else if (this.y >= SCREEN_HEIGHT / 2) {
						this.y -= Math.abs(Math.abs(SCREEN_HEIGHT / 2 - this.y) / force);
					}
				}
			},
			wallCircleUnknown: function wallCircleUnknown() {

				if ((SCREEN_WIDTH / 2 - this.x) * (SCREEN_WIDTH / 2 - this.x) + (SCREEN_HEIGHT / 2 - this.y) * (SCREEN_HEIGHT / 2 - this.y) >= circleScale * circleScale) {
					if (this.x <= SCREEN_WIDTH / 2) {
						this.x += (Math.abs(SCREEN_WIDTH / 2 - this.x) - circleScale) / force;
					} else if (this.x >= SCREEN_WIDTH / 2) {
						this.x -= (Math.abs(SCREEN_WIDTH / 2 - this.x) - circleScale) / force;
					}

					if (this.y <= SCREEN_HEIGHT / 2) {
						this.y += (Math.abs(SCREEN_HEIGHT / 2 - this.y) - circleScale) / force;
					} else if (this.y >= SCREEN_HEIGHT / 2) {
						this.y -= (Math.abs(SCREEN_HEIGHT / 2 - this.y) - circleScale) / force;
					}
				}
			},
			noWall: function noWall() {
				if (this.x <= 0) {
					this.x = SCREEN_WIDTH;
				} else if (this.x >= SCREEN_WIDTH) {
					this.x = 0;
				}
				if (this.y <= 0) {
					this.y = SCREEN_HEIGHT;
				} else if (this.y >= SCREEN_HEIGHT) {
					this.y = 0;
				}
			},
			colorChange: function colorChange() {
				this.dotR = Math.floor(dotDefaultR - dotDefaultR / 1.5 * Math.random());
				this.dotG = Math.floor(dotDefaultG - dotDefaultG / 1.5 * Math.random());
				this.dotB = Math.floor(dotDefaultB - dotDefaultB / 1.5 * Math.random());
				// console.log(this.dotR);
			},
			draw: function draw() {
				//canvas 指定の矩形を塗りつぶす。
				dotColor = this.color;

				context.fillRect(this.x, this.y, scale, scale);
				// context.fillText(FONT_alphabet,this.x,this.y)
			}
		};

		dots.push(dot);
	}
}

function movement_loop() {

	drawSquare();
	context.fillStyle = dotColor;
	for (var i = 0; i < dots_length; i++) {
		// dots[i].colorChange();

		if (mode == 0) dots[i].nomal();
		if (mode == 1) dots[i].vector();
		if (wall == 'none') dots[i].noWall();
		if (wall == 'nomal') dots[i].wall();
		if (wall == 'circle') dots[i].wallCircleCatch();
		// dots[i].colorChange();

		dots[i].draw();
	}
}
canvas.addEventListener('mousedown', onMouseDown, false);
// canvas.addEventListener('mouseUp', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);

},{}]},{},[1])


//# sourceMappingURL=index.js.map
