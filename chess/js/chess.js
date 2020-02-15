var arrFigure = [];
var cellWords = ['','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',''];
var thisTime;

function Chess (rowClass, cellClass, cellNumber, rowNumber, figure) {
    this.rowClass = rowClass;
    this.cellClass = cellClass;
    this.cellNumber = cellNumber;
    this.rowNumber = rowNumber;
    this.figure = figure;
}

//Render Chess

Chess.prototype.render = function() {
    for(i=0; i<this.rowNumber; i++) {
        chess.renderRow();       
    }
};

Chess.prototype.renderRow = function () {
    var row = $('<div />', {
        class: this.rowClass
    }).appendTo($('#chessBoard')).hide().fadeIn(1000);

    for(j=0; j<this.cellNumber; j++) {
        chess.renderCell(row);
    }
};

Chess.prototype.renderCell = function(row) {
    var $cell = $('<div />', {
        class: this.cellClass,
        id: Math.abs(i-8) + cellWords[j]
    }).appendTo(row);
    chess.renderMark($cell);
    chess.renderFigure($cell);
    $($cell).on('click', function(e){
        chess.move(e.target);
        $($cell).on('selectstart', function(){return false});
    });

    if((i%2!=0 && j%2==0) || (i%2==0 && j%2!=0)){
        $($cell).addClass('cell__even_color');        
    }
};

Chess.prototype.renderMark = function($cell) {
    if((j==0 || j==9) && i!=8) {
        $($cell).html('<h2 class="text">' + Math.abs(i-8) + '</h2>').addClass('cell__text cell__text_caption');
    }
    if(i==8) {
        $($cell).html('<h2 class="text">' + cellWords[j] + '</h2>').addClass('cell__text cell__text_caption');
    }
};

Chess.prototype.renderFigure = function($cell) {
    var figureLocation = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    if((i==1 || i==6) && j>0 && j<9) {
        var $pawn = $('<h2 />', {
            class: this.figure[0].class,
            html: this.figure[0].href
        }).appendTo($cell).slideUp(1).delay(999).slideDown(1000);
        if(i==6) {
            $($pawn).addClass('figure_white');
        }
        else {$($pawn).addClass('figure_black');}
    }
    if ((i==0 || i==7) && j>0 && j<9) {
        for (x = 0; x < this.figure.length; x++) {
            if (this.figure[x].id == figureLocation[j - 1]) {
                $('<h2 />', {
                    class: this.figure[x].class,
                    html: this.figure[x].href
                }).appendTo($cell).slideUp(1).delay(999).slideDown(1000);
            }
        }

        if (i == 7) {
            $($cell[0].firstChild).addClass('figure_white');
        }
        else {$($cell[0].firstChild).addClass('figure_black');}
    }
};

Chess.prototype.time = function() {
    var date = new  Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    hours = chess.timeCorrect(hours);
    minutes = chess.timeCorrect(minutes);

    thisTime = hours + ':' + minutes + ':' + seconds;
};

Chess.prototype.timeCorrect = function(i) {
    if(i<10) {
        i = '0' + i;
        return i;
    }
    else {
        return i;
    }
};

//Gameplay
Chess.prototype.newGame = function () {
    var $chessBoard =  $('#chessBoard, #broken, #step');
    $($chessBoard).children().fadeOut(1000);
    if($('#chessBoard').children().length > 0){        
        
        setTimeout (function() {
            $($chessBoard).children().remove();
            $('#broken').html('<h3>Битые фигуры</h3>');
            $('#step').html('<h3>Ходы</h3>');
            chess.render();
            $('#whiteOrBlack').text('Ход белых');
            chess.whiteOrBlack();
        }, 1000);
    }
    else{
        $('#broken').html('<h3>Битые фигуры</h3>');
        $('#step').html('<h3>Ходы</h3>');
        chess.render();
        $('#whiteOrBlack').text('Ход белых');
        chess.whiteOrBlack();
    }
};

Chess.prototype.move = function(target) {
    var test = target.className.search(/figure/);
    var test2 = target.className.search(/text/);

    if(test!=-1 && arrFigure.length===0) {
        arrFigure.push(target, target.parentElement.id, target.className.split(/_/)[1]);
        $(arrFigure[0]).addClass('figure_anim');
    }

    else if(test==-1 && arrFigure[0] === undefined) {
        alert('Выберите фигуру');
    }

    else if(test != -1 && arrFigure[0] != undefined) {
        chess.toTake(target);
    }

    else if(test != -1 && arrFigure[0] == undefined && target.className.search(arrFigure[3])!=-1) {
        chess.switch(target);
    }
    else if(test != -1 && arrFigure[0] == undefined && target.className.search(arrFigure[3])==-1){
        alert('Не Ваш ход!');
    }

    else if(test == -1 && test2 == -1 && arrFigure[1] != target.parentElement.id) {
        $(arrFigure[0]).appendTo(target);
        $(arrFigure[0]).removeClass('figure_anim');

        chess.audio('move');
        chess.stepDisplay(target);

        arrFigure[0] = undefined;
        arrFigure[1] = target.id;
        arrFigure[2] = target.className.split(/_/)[1];
    }
};

Chess.prototype.switch = function(target) {
    $(arrFigure[0]).removeClass('figure_anim');
    arrFigure[0] = target;
    arrFigure[1] = target.parentElement.id;
    arrFigure[2] = target.className.split(/_/)[1];
    $(arrFigure[0]).addClass('figure_anim');
    chess.audio('switch');
};

Chess.prototype.toTake = function(target) {
    if(arrFigure[2] == target.className.match(/black/)) {
        console.log('Черные');
        chess.switch(target);
    }
    else if(arrFigure[2] == target.className.match(/white/)) {
        console.log('Белые');
        chess.switch(target);
    }
    else {
        var div = $(target).parent()[0];
        $(arrFigure[0]).removeClass('figure_anim');

        chess.audio('move');

        chess.stepDisplay(target);
        chess.brokenDisplay(target);

        $(arrFigure[0]).appendTo(div);
        arrFigure[0] = undefined;
        arrFigure[1] = div.id;

        console.log('take', arrFigure);
    }
};

Chess.prototype.audio = function (processor) {
    if(processor == 'move') {
        var aud = new Audio('audio/figureStep.mp3');
        aud.play();
    }
    if(processor == 'switch'){
        var aud = new Audio('audio/figureSwitch.mp3');
        aud.play();
    }
};

Chess.prototype.brokenDisplay = function (target) {
    chess.time();
    var $div = $('<div/>', {
        html: '<h4>' + thisTime + '</h4>',
        class: 'stepGame__border'
    }).appendTo($('#broken'));
    $(target).prependTo($div);
};

Chess.prototype.stepDisplay = function(target) {
    chess.time();
    var toStep = target.id;
    if(target.className.search(/figure/) != -1) {
        toStep = target.parentElement.id;
    }

    var $div = $('<div/>',{
        class: 'stepGame__border',
        html: '<h4>' + arrFigure[1] + ' >>> ' + toStep + '</h4>'

    }).clone().appendTo($('#step'));

    // $('<h4/>', {
    //     text: thisTime,
    // }).prependTo($div);

    $(arrFigure[0]).clone().prependTo($div);
    chess.whiteOrBlack();
};

Chess.prototype.whiteOrBlack = function() {
    var $step = $('#step')[0].lastChild;
    var $whiteOrBlack = $('#whiteOrBlack');
    arrFigure[3] = 'white';
    
    if($step.children.length == 2) {
        if($step.children[0].className.search(/white/)!=-1){
           $whiteOrBlack.text('ход черных');
           arrFigure[3] = 'black';          
        }
        else if($step.children[0].className.search(/black/)!=-1){
           $whiteOrBlack.text('ход белых'); 
           arrFigure[3] = 'white';
        }
    }
};

function Figure(href, figureClass, id) {
    this.href = href;
    this.class = figureClass;
    this.id = id;
}

Figure.prototype.render = function() {
    var figureRend = document.createElement('h2');
    figureRend.className = this.class;
    figureRend.innerHTML = this.href;
    figureRend.id = this.id;
    return figureRend;
};

var chess = new Chess('row justify-content-center', 'cell', 10, 9, [
    new Figure('&#9817;', 'figure pawn', 'pawn'),     //пешка
    new Figure('&#9813;', 'figure', 'queen'),    //ферзь
    new Figure('&#9814;', 'figure', 'rook'),    //ладья
    new Figure('&#9816;', 'figure', 'knight'),    //конь
    new Figure('&#9815;', 'figure', 'bishop'),    //слон
    new Figure('&#9812;', 'figure', 'king')    //король
]);

$(document).ready(function() {
    $( '#accordion' ).accordion({active: false, collapsible: true});
});