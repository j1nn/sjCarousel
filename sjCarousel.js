function sjCarousel(itemsScroll, itemsShow, w, h) {
    this.itemsScroll = itemsScroll;
    this.itemsShow = itemsShow;
    this.items = new Array();
    this.iw = w;
    this.ih = h;
    this.el = null;

    this.duration = 1600;
    this.easingType = 'easeOutElastic';

    this.forwardEnabled = false;
    this.backEnabled = false;

    this.init = function(items, wrapperId) {
        if(this.itemsScroll <= 0 || this.itemsShow <= 0 || $('#' + wrapperId).html() == null){
            return false;
        }
        this.curFirst = 1;
        this.items = items;
        if(this.items.length < this.itemsShow){
            return false;
        }
        $('#' + wrapperId).append('<div class="sjCarouselMain"></div>');
        $('.sjCarouselMain').append('<div id="sjBack" class="sjInactive"><<</div>');
        $('.sjCarouselMain').append('<div class="sjcWrapper"></div>');
        $('.sjcWrapper').css({'clip':'rect(0px,' + (this.iw * this.itemsShow + 1) + 'px,' + (this.ih + 1) + 'px,0px)',
                            'margin-left' : $('#sjBack').width() + 'px'});
        
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
        if(this.items.length > this.itemsShow){
            this.enableForward();
        }

        return true;
    }

    //add given element. if index not specified, append to the end
    this.add = function(url, index){
        if(index == undefind){
            index = this.items.length;
        }
        this.items[index + 1] = url;
    }

    //remove given element
    this.remove = function(i){
        ++i;
        this.items.splice(i, 1);
        //if this element is visible, redraw
        if(i >= this.curFirst && i <= (this.curFirst + this.itemsShow)){
            this.redraw(i, false);
        }
    }

    //scroll the carousel s.t. given element will become visible
    this.scroll = function(i){
        if(i >= this.curFirst && i<= (this.curFirst + this.itemsShow - 1)) {
            return;
        }
        if(i < this.curFirst){
            for(var j = this.curFirst; j > i; --j){
                this.back();
            }
        }
        else {
            var scrollTill = i - this.itemsShow;
            for(j = this.curFirst; j <= scrollTill; ++j){
                this.forward();
            }
        }
    }

    this.forward = function(){
        if(!this.forwardEnabled || this.curFirst + this.itemsScroll >= this.items.length){
            return;
        }
        //lock
        this.disableForward();
        this.disableBack();
        
        this.curFirst += this.itemsScroll;
        var self = this;
        var left = parseInt(this.el.css('left'));
        this.el.animate(
                { left: -1 * self.iw }, {
                 duration: this.duration,
                 easing: this.easingType,
                 complete: function(){
                    self.el.css('left', left + 'px');
                    var item = $('#li' + (self.curFirst - self.itemsScroll)).remove();
                    self.el.append(item);
                    self.redraw(self.curFirst, true);
                }}
         );      
    }

    this.back = function(){
        if(!this.backEnabled || this.curFirst <= 1){
            return;
        }
        //lock
        this.disableForward();
        this.disableBack();

        var item = $('#li' + (this.curFirst - 1)).remove();//TODO itemsScroll instd 1
        this.el.css('left', (parseInt(this.el.css('left')) - this.iw) + 'px');
        this.el.prepend(item);
        this.curFirst -= this.itemsScroll;
        var self = this;
        this.el.animate(
                { left: 0 }, {//it should always be zero, as we want this item to be first
                 duration: this.duration,
                 easing: this.easingType,
                 complete: function(){
                     self.redraw(self.curFirst, true);
                 }
                }
         );
    }

    this.redraw = function(start, effects){
        var end = start + this.itemsShow - 1;
        for(var i = start; i < end; ++i){
            this.items[i] = this.items[i+1];
        }
        
        //enable/disable switchers, when needed
        if(this.curFirst + this.itemsShow > this.items.length){
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
        return this.items[i + 1];
    }
    this.getIndex = function(url){
        for(var i in this.items){
            if(this.items[i] == url){
                return i + 1;
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


