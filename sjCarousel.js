function sjCarousel(itemsScroll, itemsShow, w, h) {
    this.itemsScroll = itemsScroll;
    this.itemsShow = itemsShow;
    this.items = new Array();
    this.iw = w + 1;
    this.ih = h + 1;
    this.el = null;

    this.duration = 300;
    this.easingType = 'easeOutCirc';

    this.forwardEnabled = false;
    this.backEnabled = false;

    this.init = function(items, wrapperId, cyclic, callback) {
        if(this.itemsScroll <= 0 || this.itemsShow <= 0 || $('#' + wrapperId).html() == null){
            return false;
        }
        this.curFirst = 1;
        this.items = items;
        if(this.items.length < this.itemsShow){
            return false;
        }

        if(callback == undefined){
            callback = function(){}
        }

        this.cyclic = cyclic;

        $('#' + wrapperId).append('<div class="sjCarouselMain"></div>');
        $('.sjCarouselMain').append('<div id="sjBack" class="sjInactive"><<</div>');
        $('.sjCarouselMain').append('<div class="sjcWrapper"></div>');        
        $('.sjcWrapper').css({'clip':'rect(0px,' + 
                    (this.iw * this.itemsShow + this.itemsShow * Math.ceil(this.iw / 25) * 2 + 1) + 'px,'
                    + (this.ih + 4) + 'px,0px)',
                    'margin-left' : ($('#sjBack').width() + parseInt($('#sjBack').css('margin-right')) +
                    parseInt($('#sjBack').css('margin-left'))) + 'px'});
        $('.sjcWrapper').append('<div class="sjCarousel"></div>');
        $('.sjCarousel').css({'width':(this.iw * this.items.length + 10) + 'px',
                                'height' : this.ih + 'px'
                            });
        this.el = $('.sjCarousel');
        var li;
        for(var i in this.items){
            li = '<div id="li' + (parseInt(i) + 1) + '" class="sjItem"><img src="' + this.items[i] +
                    '" alt="i' + (parseInt(i) + 1) + '" width="' + this.iw +
                    '" height="' + this.ih + '" id="i' + (parseInt(i) + 1) + '"/></div>';
            $('.sjCarousel').append(li);
        }

        $('.sjItem').css('margin', parseInt(this.iw / 25) + 'px');

        $('.sjCarouselMain').append('<div id="sjForward" class="sjInactive">>></div>');
        $('#sjForward').css('margin-left', 
            (parseInt($('.sjcWrapper').css('margin-left')) + this.iw * this.itemsShow - $('#sjBack').width()) + 'px');
        var self = this;
        $('#sjBack').click(function(){
            self.back();
        });
        $('#sjForward').click(function(){
            self.forward();
            });
        if(this.items.length > this.itemsShow || this.cyclic){
            this.enableForward();
        }
        if(this.cyclic){
            this.enableBack();
        }

        callback();
        return true;
    }

    //add given element. if index not specified, append to the end
    this.add = function(url, index, callback){
        if(index == undefined || index > this.items.length){
            index = this.items.length;
        }
        else if(callback == undefined && index != undefined && typeof(index) == 'function'){
            callback = index;
            index = this.items.length;            
        }
        else{
            --index;
            //update ids
            for(var i = this.items.length + 1; i >= index + 1; --i){
                $('#li' + i).attr('id', 'li' + (i + 1));
                $('#i' + i).attr({'id':'i' + (i + 1),'alt':'i' + (i + 1)});
            }
            if(index <= this.curFirst){
                ++this.curFirst;//as indexes moved one forward
            }
        }
        if(callback == undefined){
            callback = function(){};
        }

        this.items.splice(index, 0, url);
        if(index > 0){
            $('<div id="li' + (parseInt(index) + 1) + '" class="sjItem"><img src="' + url +
                    '" alt="i' + (parseInt(index) + 1) + '" width="' + this.iw +
                    '" height="' + this.ih + '" id="i' + (parseInt(index) + 1) + '"/></div>').
                    insertAfter('#li' + index);
        }
        else{//adding 1st element
            $('<div id="li' + (parseInt(index) + 1) + '" class="sjItem"><img src="' + url +
                    '" alt="i' + (parseInt(index) + 1) + '" width="' + this.iw +
                    '" height="' + this.ih + '" id="i' + (parseInt(index) + 1) + '"/></div>').
                    insertBefore('#li2');
            --this.curFirst;
        }
        this.checkSwitchers();
        callback();
    }

    //remove given element
    this.remove = function(index, callback){
        if(callback == undefined){
            callback = function(){}
        }

        //removing last item
        if(index == this.items.length){
            this.back();
        }
        $('#li' + index).remove();
        --index;
        this.items.splice(index, 1);
        //update ids
        for(var i = this.items.length + 1; i > index + 1; --i){
            $('#li' + i).attr('id', 'li' + (i - 1));
            $('#i' + i).attr({'id':'i' + (i - 1),'alt':'i' + (i - 1)});
        }
        if(index <= this.curFirst && index != 0){
            --this.curFirst;//as indexes moved one backward
        }
        
        this.checkSwitchers();
        callback();
    }

    //scroll the carousel s.t. given element will become visible
    this.scroll = function(i, callback){
        if((i >= this.curFirst && i<= (this.curFirst + this.itemsShow - 1)) || i > this.items.length) {
            return;
        }
        if(i < this.curFirst){
            this.back(this.curFirst - i, callback);
        }
        else {//i > this.curFirst
            this.forward(i - this.curFirst - 1, callback);
        }
    }

    this.forward = function(numToScroll, callback){
        if(!this.forwardEnabled){
            return;
        }
        if(this.curFirst + this.itemsScroll >= this.items.length){
            if(!this.cyclic){
                return;
            }
            else if(this.curFirst > this.items.length){
                this.curFirst = this.curFirst - this.items.length;
            }
        }
        if(callback == undefined){
            callback = function(){}
        }

        //lock
        this.disableForward();
        this.disableBack();

        if(numToScroll == undefined){
            numToScroll = this.itemsScroll;
        }
        this.curFirst += numToScroll;
        var self = this;
        var left = parseInt(this.el.css('left'));
        this.el.animate(
                { left: -1 * self.iw * numToScroll - numToScroll * Math.ceil(this.iw / 25)}, {
                 duration: this.duration,
                 easing: this.easingType,
                 complete: function(){
                    self.el.css('left', left + 'px');
                    for (var i = numToScroll; i > 0; --i){
                        var item = $('#li' + (self.curFirst - i)).remove();
                        self.el.append(item);
                    }
                    self.checkSwitchers();
                    callback();
                }}
         );      
    }

    this.back = function(numToScroll, callback){
        if(!this.backEnabled){
            return;
        }

        if(this.curFirst <= 1){
            if(!this.cyclic){
                return;
            }
            else if(this.curFirst == 1){
                this.curFirst = this.items.length + 1;
            }
        }
        if(callback == undefined){
            callback = function(){}
        }

        //lock
        this.disableForward();
        this.disableBack();

        if(numToScroll == undefined){
            numToScroll = this.itemsScroll;
        }

        for (var i = 0; i <= numToScroll; ++i){
            var item = $('#li' + (this.curFirst - i)).remove();
            this.el.css('left', (parseInt(this.el.css('left')) - this.iw) + 'px');
            this.el.prepend(item);
        }
        this.curFirst -= numToScroll;
        var self = this;
        this.el.animate(
                { left: 0 }, {//it should always be zero, as we want this item to be first
                 duration: this.duration,
                 easing: this.easingType,
                 complete: function(){
                     self.checkSwitchers();
                     callback();
                 }
                }
         );
    }

    this.checkSwitchers = function(){
        if(this.cyclic){
            this.enableForward();
            this.enableBack();
            return;
        }

        if(this.curFirst + this.itemsShow > (this.items.length - this.itemsScroll + 1)){
            this.disableForward();
        }
        else{
            this.enableForward();
        }
        if(this.curFirst <= 1){
            this.disableBack();
        }
        else{
            this.enableBack();
        }
    }
    
    this.itemAt = function(i){
        if(i <= 0 || i > this.items.length){
            return null;
        }
        return this.items[i - 1];
    }
    this.getIndex = function(url){
        for(var i in this.items){
            if(this.items[i] == url){
                return parseInt(i) + 1;
            }
        }
        return -1;
    }

    this.disableForward = function(){
        this.forwardEnabled = false;
        $('#sjForward').removeClass('sjActive');
        $('#sjForward').addClass('sjInactive');
    }
    this.enableForward = function(){
        this.forwardEnabled = true;
        $('#sjForward').removeClass('sjInactive');
        $('#sjForward').addClass('sjActive');
    }
    this.disableBack = function(){
        this.backEnabled = false;
        $('#sjBack').removeClass('sjActive');
        $('#sjBack').addClass('sjInactive');
    }
    this.enableBack = function(){
        this.backEnabled = true;
        $('#sjBack').removeClass('sjInactive');
        $('#sjBack').addClass('sjActive');        
    }
}