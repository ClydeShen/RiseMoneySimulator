var can1 = document.getElementById('canvas1');
var ct1 = can1.getContext('2d');
var users = [];
var joinedUser = [];
var appliedUser = [];
var money = 0;
var isInit = false;
var giveFirst = false;
var threshold = 0;

(function () {
    $('#runBtn').hide();
    giveFirst = $('#giveFirst').prop('checked')
}())

function Person(id) {
    var prob = (Math.random() * 100)
    var isWantGiveMoeny = (prob <= parseInt($('#want1').val()));
    var isPostTeam = false;
    var risedMoney = 0;
    var feelGood = 0;
    var hasChages = false;
    var budget = 100;
    var chance = 0;
    var isSuccess = false;
    var donateList = [];

    this.isPostTeam = function () {
        if (isPostTeam) {
            return false;
        } else {
            isPostTeam = (Math.random() * 100) <= 10;
            return isPostTeam;
        }

    }
    this.gotMoeny = function (userId, money) {
        risedMoney += money;
        donateList.push({userId: userId, money:money})

        feelGood += 10;

        if(risedMoney>=(budget*threshold/100))
        {
            isSuccess = true;
        }

        hasChages = true;

    }
    this.giveMoneyTo = function (appliedUserSize) {
        feelGood = -10;
        var selectedId;
        var next = true;
        while (next) {
            selectedId = Math.floor(Math.random() * appliedUserSize)
            if (selectedId != id) {
                next = false;
            }
        }
        hasChages = true;
        var donate = {userId: selectedId, money:5}

        return donate;
    }
    this.returnMoney = function (money) {
        feelGood+=10;
    }
    this.isSuccess = function()
    {
       return isSuccess
    }

    this.isJoin = function () {
        return isWantGiveMoeny
    }

    this.getID = function () {
        return id;
    }
    this.isHappy = function () {
        return feelGood >= 0;
    }
    this.getDonateList = function () {
        return donateList;
    }
    this.draw = function (ctx) {
        var x = id % 10 * 50 + id % 10 * 5 + 5;
        var y = Math.floor(id / 10) * 50 + Math.floor(id / 10) * 5 + 5;

        if (isInit || (hasChages && !isInit)) {
            ctx.beginPath()
            if (feelGood > 0) {
                ctx.fillStyle = 'rgba(65, 150, 65, ' + (feelGood / 100).toFixed(2) + ')';
            } else if (feelGood < 0) {
                ctx.fillStyle = 'rgba(215, 65, 60, ' + (-feelGood / 100).toFixed(2) + ')';
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            }

            ctx.fillRect(x, y, 50, 50);

            ctx.rect(x, y, 50, 50);
            ctx.stroke();
            ctx.closePath()
            this.drawString(ctx, x, y);

            hasChages = false;
        }
    }
    this.drawString = function (ctx, x, y) {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.font = "15px Arial";
        ctx.fillText(id, x + 5, y + 15)
        if (risedMoney > 0) {
            ctx.fillText('$' + risedMoney, x + 15, y + 35)
        }
        ctx.closePath()
    }
}


function init() {
    var max = parseInt($('#max1').val());
    var prob = parseInt($('#want1').val());

    for (var i = 0; i < max; i++) {
        var p = new Person(i);
        users.push(p);
        if (p.isJoin()) {
            joinedUser.push(p);
        }
    }


    $('#runBtn').show();
    isInit = true;
}
function clearCanvas() {
    users = [];
    joinedUser = [];
    appliedUser = [];
    isInit = true;
    ct1.clearRect(0, 0, can1.width, can1.height);
    $('#runBtn').hide();
    $('#appliedUser').empty();
}
function run() {

    var finalResult = "";
    var teamInfo = "";
    for (var i = 0; i < users.length; i++) {
        if (users[i].isPostTeam()) {
            appliedUser.push(users[i])
            teamInfo = "user: " + users[i].getID() + " post a team <br/>" + teamInfo;
        }
    }

    var transMoenyInfo = ""
    for (var i = 0; i < joinedUser.length; i++) {
        var result = joinedUser[i].giveMoneyTo(appliedUser.length);
        appliedUser[result.userId].gotMoeny(i, result.money)

        transMoenyInfo = "[" + joinedUser[i].getID() + "] give $5 to [" + appliedUser[result.userId].getID() + "] <br/>" + transMoenyInfo;

    }

    var riseResultInfo ="";
    for(var i=0;i<appliedUser.length;i++)
    {
        if(!appliedUser[i].isSuccess())
        {
            for(var j=0; j<appliedUser[i].getDonateList().length;j++){
                joinedUser[appliedUser[i].getDonateList()[j].userId].returnMoney(appliedUser[i].getDonateList()[j].money)
            }
        }else{
            riseResultInfo = "user: "+appliedUser[i].getID() +" rise money successfully! <br/>" +riseResultInfo;
        }
    }



    USER:
        for (var i = 0; i < users.length;) {
            if (users[i].isHappy()) {
                i++;
            } else {
                for (var j = 0; j < joinedUser.length; j++) {
                    if (joinedUser[j] == users[i]) {
                        joinedUser.splice(j, 1);
                        users.splice(i, 1);
                        continue USER;
                    } else {
                        j++;
                    }
                }
                i++;
            }
        }

    finalResult = teamInfo + transMoenyInfo+riseResultInfo;

    for (var i = 0; i < users.length; i++) {
        users[i].draw(ct1);
    }
    isInit = false;
    $('#appliedUser').append(finalResult)
}
