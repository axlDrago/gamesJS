function Game() {
	this.j = 0;
    this.summPl1 = 0;
    this.summPl2 = 0;
    this.test = false;
}

Game.prototype.startGame = function() {
	//Инициализация Materialize Select
	var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    game.render();
};

Game.prototype.newGame = function(){
    $('.cell').unbind('click');
    game.controlField();
    $(this.player).text('Ходят "O"');
	$('.cell').children().remove();
    this.j = 0;
    this.test = false;
};

Game.prototype.controlField = function() {
    $('.cell').on('click', function(){
        $(this).on('selectstart', function(){return false});
        game.gameplay(this);
    });
};

Game.prototype.endGame = function(winner){
    game.audio('win');
    $('.cell').unbind('click');
    if(winner != 'Ничья'){
        $(this.player).text('Победили "' + winner + '"!');
    }
    else {
       $(this.player).text('"' + winner + '"!');
    }
    $('.cell').on('click', function(){
        var toastHTML = '<span>Начните новую игру</span>';
        M.toast({html: toastHTML});    
    });
    game.scoreTable(winner);
};

Game.prototype.render = function () {
	 var $player = $('<h2/>', {
	     text: 'Ходят "O"',
         style: 'color: red',
         id: 'playerStep'
	}).appendTo($('#game'));
    this.player = $player;
	var $field = $('<div/>', {
		class: 'field'
	}).appendTo($('#game'));
    for (i = 0; i < 9; i++) {
        $('<div/>', {
            class: 'cell',
            id: i
        }).appendTo($field);
    }

	$('.cell').on('click', function(){
        $(this).on('selectstart', function(){return false});
		game.gameplay(this);
	});
    $('#newGame').on('click', function(){
    	game.newGame();
	});
    $('.btn, input[type=radio]').on('click', function () {
       game.audio('button');
    });
};

Game.prototype.gameplay = function(div) {
    this.player2Select = $('#player2Select input[type=radio]:checked').val();

	if (this.j%2 != 0 && div.children.length == 0 && this.player2 != 'AI'){
		$(div).html('<p class="cell__text">X</p>');
        $(this.player).text('Ходят "O"');
        this.j++;
        game.audio('step');
        game.strokeControl();
	} 
	else if(this.j%2 == 0 && div.children.length == 0) {
        $(div).html('<p class="cell__text">O</p>');
        $(this.player).text('Ходят "X"');
        this.j++;
        game.audio('step');
        game.strokeControl();
        if(this.player2Select == "AI" && $('.cell__text').length < 9 && !this.test) {
        	game.AI();
    	}
        else if(this.player2Select == "AI2" && $('.cell__text').length < 9 && !this.test) {
            game.AI2();
        }
	}
	else {
        var toastHTML = '<span>Там занято</span>';
        M.toast({html: toastHTML});
	}
};

Game.prototype.audio = function (processor) {
    this.audioButton = $("#sound input[type=checkbox]").prop('checked');

    if(this.audioButton == true) {
        if (processor == 'win') {
            var aud = new Audio('audio/win.mp3');
            aud.play();
        }
        if (processor == 'step') {
            var aud = new Audio('audio/step.mp3');
            aud.play();
        }
    }
    if (processor == 'button') {
        var aud = new Audio('audio/btn.mp3');
        aud.play();
    }
};

Game.prototype.strokeControl = function () {
    var arr = [];
    this.arr = arr;
    for(i=0; i < 9; i++) {
    	if($('div#' + i).children()[0] != undefined) {
    		arr.push($($('div#' + i).children()[0]).text())
        }
        else{
            arr.push(i);
    	}
	}
	for(x = 2, z = 0, j = 0; j < 3; j++, z+=3, x+=2) {
        //вертикаль
        if((arr[j] == arr[j+3]) && (arr[j] == arr[j+6]) && !this.test) {
            $('#'+(j + 3) + ',#'+ (j + 6) + ',#' + j).children().css({color:'red'}).effect('pulsate', {times: 2}, 1500);
            this.test = true;
            game.endGame(arr[j]);
        }
        //горизонталь
        else if ((arr[z] == arr[z+1]) && (arr[z] == arr[z+2]) && !this.test) {            
            $('#'+(z + 1) + ',#'+ (z + 2) + ',#' + z).children().css({color:'red'}).effect('pulsate', {times: 2}, 1500);
            this.test = true;
            game.endGame(arr[z]);
        }
        //диагональ
        else if((arr[4] == arr[4-x]) && (arr[4] == arr[4+x]) && !this.test){
           
           $('#4' + ',#'+ (4 - x) + ',#' + (4+x)).children().css({color:'red'}).effect('pulsate', {times: 2}, 1500);
           this.test = true;
           game.endGame(arr[4]);
        }
	}

    if($('.cell__text').length == 9 && !this.test) {
        game.endGame('Ничья');
    }
};

Game.prototype.scoreTable = function(winner) {
    var player1, player2;
    if(winner=='O') {
        player1 = 1;
        player2 = 0;     
    }
    else if(winner == 'Ничья'){
        player1 = 0;
        player2 = 0;
    }
    else {
        player1 = 0;
        player2 = 1;
    }

    this.summPl1 += player1;
    this.summPl2 += player2;

    var $tr = $('<tr/>').appendTo($('#score'));
    $('<td/>', {
    	text: $('tbody').children().length
    }).appendTo($tr);
    $('<td/>', {
    	text: player1
    }).appendTo($tr);
    $('<td/>', {
    	text: player2
    }).appendTo($tr);

    $('#summ1').html(this.summPl1);
    $('#summ2').html(this.summPl2);
};

Game.prototype.AI = function() {
   	var stepAI =  Math.floor(Math.random() * (9 - 0) + 0);

   	if($($('#' + stepAI)[0]).children()[0] == undefined){
        $('.cell').unbind('click');
   	    setTimeout(function() {
            $('#' + stepAI).html('<p class="cell__text">X</p>');
            $('#playerStep').text('Ходят "O"');
            game.controlField();
            game.strokeControl();
        }, 800);
        this.j++;

   	}
   	else if($('.cell__text').length < 9 && $($('#' + stepAI)[0]).children()[0] != undefined){
   		game.AI();
   	}
};

Game.prototype.AI2 = function () {
    // game.attackAI2();
    // game.targetWin();
    var toastHTML = '<span>AI lvl 2  в разработке</span>';
    M.toast({html: toastHTML});
};

Game.prototype.targetWin = function() {
    var diagonal = [
        // ['O',1,2,3,'O',5,6,7,'O' ],
        // [0,1,'O',3,'O',5,'O',7,8]

        [0,4,8],
        [2,4,6]
    ];
    var vertical = [
        // ['O','O','O',3,4,5,6,7,8],
        // [0,1,2,'O','O','O',6,7,8],
        // [0,1,2,3,4,5,'O','O','O'],

        [0,1,2],
        [3,4,5],
        [6,7,8]
    ];
    var horizontal = [
        // ['O',1,2,'O',4,5,'O',7,8],
        // [0,'O',2,3,'O',5,6,'O',8],
        // [0,1,'O',3,4,'O',6,7,'O']

        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];
    // console.log(diagonal, vertical, horizontal);
};

Game.prototype.defendAI2 = function () {

    console.log(this.arr);
};

Game.prototype.attackAI2 = function () {
    var arrAttack = [];
    for(i = 0; i < this.arr.length; i++) {
        if(this.arr[i] == 'O'){
            arrAttack.push(i);
        }
    }
    console.log(arrAttack);
};

var game = new Game();
game.startGame();