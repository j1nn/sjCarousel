function sjCarousel(itemsScroll, itemsShow, w, h) {
    this.itemsScroll = itemsScroll;
    this.itemsShow = itemsShow;
    this.items = new Array();
    this.iw = w;
    this.ih = h;
    this.el = null;

    this.init = function(items, wrapperId){
        if(this.itemsScroll <= 0 || this.itemsShow <= 0 || $('#' + wrapperId).html() == null){
            return false;
        }
        this.curFirst = 1;
        this.items = items;
        this.wrapperId = wrapperId;//TODO used?
        if(this.items.length < this.itemsShow){
            return false;
        }
        $('#' + wrapperId).append('<div id="sjBack" class="sjInactive"><<</div>');
        var li;
        $('#' + wrapperId).append('<ul class="sjCarousel"></ul>');
        this.el = $('.sjCarousel');
        this.el.css('clip','rect(0px,' + (this.iw * this.itemsShow + 41) + 'px,' + this.ih + 'px,40px)');//TODO 41/40 - offset of li in ul
        
        for(var i in this.items){
            li = '<li id="li' + (parseInt(i) + 1) + '"><img src="' + this.items[i] +
                    '" alt="i' + (parseInt(i) + 1) + '" width="' + this.iw +
                    '" height="' + this.ih + '" id="i' + (parseInt(i) + 1) + '"/></li>';
            $('.sjCarousel').append(li);
        }
        $('#' + wrapperId).append('<div id="sjForward" class="sjInactive">>></div>');
        if(this.items.length > this.itemsShow){
            this.enableForward();
        }
        //this.show();
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

    //scroll the carousel s.t. given element will be the last shown
    this.scroll = function(i){
        if(this.items.length < (i + 1)){
            return;
        }
        this.curFirst = i - this.itemsShow;
        this.redraw(this.curFirst, true);
    }

    this.forward = function(){
        if(this.curFirst + this.itemsScroll >= this.items.length){
            return;
        }
        var self = this;
        var left = parseInt(this.el.offset().left);
        this.el.animate(
                { left: -1 * self.iw }, {
                 duration: 2500,
                 easing: 'easeOutElastic',
                 complete: function(){
                    self.el.css('left', left + 'px');
                    var item = $('#li' + (self.curFirst - 1)).remove();
                    self.el.append(item);
                }}
         );
        this.curFirst += this.itemsScroll;
        this.redraw(this.curFirst, true);
    }

    this.back = function(){
        if(this.curFirst <= 1){
            return;
        }
        var self = this;
        var left = parseInt(this.el.offset().left);
        self.el.css('left', (left - parseInt(this.iw)) + 'px');
        var item = $('#li' + (self.curFirst - 1)).remove();
        self.el.prepend(item);
        this.el.animate(
                { left: left }, {
                 duration: 2500,
                 easing: 'easeOutElastic'
                }
         );
        this.curFirst -= this.itemsScroll;
        this.redraw(this.curFirst, true);
    }

    this.redraw = function(start, effects){
        var end = start + this.itemsShow - 1;
        for(var i = start; i < end; ++i){
            this.items[i] = this.items[i+1];
        }
        //this.show();
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

    this.show = function(){
        /*$('.sjCarousel').animate(
                { left:50 }, {
                 duration: 'slow',
                 easing: 'easeOutElastic'}
         );*/

        /*for(var i = 1; i < this.curFirst; ++i){
            $('#i' + i).animate(
                { left:50 }, {
                 duration: 'slow',
                 easing: 'easeOutElastic'
                });
            //$('#i' + i).removeClass('visible');
        }
        var end = this.curFirst + this.itemsShow;
        for(i = this.curFirst; i < end; ++i){
            //$('#i' + i).addClass('visible');
            $('#i' + i).animate(
                { left:50 }, {
                 duration: 'slow',
                 easing: 'easeOutElastic'
                });
        }
        var len = this.items.length;
        for(i = end; i <= len; ++i){
            $('#i' + i).animate(
                { left:50 }, {
                 duration: 'slow',
                 easing: 'easeOutElastic'
                });
            //$('#i' + i).removeClass('visible');
        }*/
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
        $('#sjForward').removeClass('sjActive');
        $('#sjForward').addClass('sjInactive');
        $('#sjForward').click(function(){});
    }
    this.enableForward = function(){
        $('#sjForward').removeClass('sjInactive');
        $('#sjForward').addClass('sjActive');
        var self = this;
        $('#sjForward').click(function(){
            self.forward();
        });
    }
    this.disableBack = function(){
        $('#sjBack').removeClass('sjActive');
        $('#sjBack').addClass('sjInactive');
        $('#sjBack').click(function(){});
    }
    this.enableBack = function(){
        $('#sjBack').removeClass('sjInactive');
        $('#sjBack').addClass('sjActive');
        var self = this;
        $('#sjBack').click(function(){
            self.back();
        });
    }
}


