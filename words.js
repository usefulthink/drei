var Words;
(function($, window) {

    Words = function(container, onload) {
        this.container = container;
        this.docHeight = $(document).height();
        this.docWidth = $(document).width();
        this.currentImage = null;

        this.loadImages(onload);
    };

    var __ = Words.prototype;
    __.loadImages = function(callback) {
        var rest=60;
        for(var i=0; i<60; i++) {
            var w=this.docWidth, h=this.docHeight, c=this.container, img=new Image();

            img.src="img/words_" + Number(i+100).toString(10).slice(1) + ".png";
            img.onload = function() {
                var $img = $(this).css({visibility:'hidden'}).appendTo(c);

                $img.css({
                    left:  (w-$img.width())/2,
                    top:  (h-$img.height())/2,
                    WebkitTransform: 'translate(-'+w+'px, 0px)',
                    visibility:'visible',
                    display: 'none',
                    WebkitTransition: 'none'
                });

                window.setTimeout(function() {
                    $img.css({display:'block', WebkitTransition:''});
                },20);

                if(--rest==0) { callback(); }
            };
        }
    };

    __.nextImage = function() {
        var curr = $('img.current'), next=curr.next('img'), w=this.docWidth;

        if(next.length == 0) { next = $('img:first-child'); }

        curr.css({WebkitTransform:'translate('+w+'px, 0px)'});
        next.css({WebkitTransform:'translate(0px, 0px)'});

        curr.removeClass('current');
        next.addClass('current');

        // position back after moving...
        curr.one('webkitTransitionEnd', function() {
            var el=$(this).css({
                display:'none',
                WebkitTransition:'none',
                WebkitTransform:'translate(-'+w+'px, 0px)'
            });

            window.setTimeout(function() {
                el.css({WebkitTransition: '', display: 'block'});
            }, 10);
        });
    }

    $(function() {
        var container = $('#wrap');
        var w=window.w=new Words(container, function() {
            $('img:first-child')
                .addClass('current')
                .css({WebkitTransform:'translate(0px, 0px)'});
        });

        function colorset(name) {
            var colorsets = {
                victoriasSecret: '382F32,FFEAF2,FCD9E5,FBC5D8,F1396D',
                antidesign: '413D3D,040004,C8FF00,FA023C,4B000F',
                drops: '2A665B,EDDD74,DBC221,FF5B42,F21146',
                cheerUpEmoKid: '556270,4ECDC4,C7F464,FF6B6B,C44D58',
                sugar: '490A3D,BD1550,E97F02,F8CA00,8A9B0F'
            };

            var curr = 0, colors = colorsets[name].split(',');
            return {
                next: function() {
                    curr = (curr+1)%colors.length;

                    return '#' + colors[curr];
                }
            }

        }

        var body=$('body'), colorset=colorset('sugar');
        window.setInterval(function() {
            w.nextImage();
            body.css({ backgroundColor: colorset.next() })
        }, 5000);
    });
} (this.jQuery, this));

