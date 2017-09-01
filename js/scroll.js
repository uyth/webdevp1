document.addEventListener('DOMContentLoaded', function () {
    var pages = [0,3];
    var page = Math.floor(window.pageYOffset/window.innerHeight);
    var lastPage = 0;
    var lastScrollTop = 0;
    var lastScrollTimeStamp = 0;

    document.getElementById('button-0').addEventListener("click", buttonScroll);
    document.getElementById('button-1').addEventListener("click", buttonScroll);
    document.getElementById('button-2').addEventListener("click", buttonScroll);

    window.addEventListener('wheel', function(e) {
      /* mousewheel scroll */
        var scrollDirection = e.deltaY;
        console.log(scrollDirection);
        e.preventDefault();
        if (lastScrollTimeStamp < Date.now() - 200) {
            if (scrollDirection > 100 && page + 1 != 4) {
                console.log('scroll down');
                page++;
                scrollToPage();
                lastScrollTimeStamp = Date.now();
            } else if (scrollDirection < -100 && page - 1 != -1) {
                console.log('scroll up');
                page--;
                scrollToPage();
                lastScrollTimeStamp = Date.now();
            }
        }
        
    });

    function buttonScroll(event) {
        event.preventDefault();
        var buttonIndex = parseInt(event.target.id.split('-')[1])
        page = buttonIndex + 1
        scrollToPage();
    }

    function scrollToPage() {
        var scrollTimer = setInterval(function e() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var viewportHeight = window.innerHeight;
            var targetTop = viewportHeight*page;
            //console.log('smooth scrolling, currently: ', scrollTop, 'target: ', targetTop, 'page: ', page);
            var scrollSpeed = 1; 
            if (Math.abs(scrollTop - targetTop) <= viewportHeight/16) {
                scrollSpeed = 1;
            } else if (Math.abs(scrollTop - targetTop) <= viewportHeight/8) {
                scrollSpeed = 8 ;
            } else if (Math.abs(scrollTop - targetTop) > viewportHeight/8) {
                scrollSpeed = 16;
            }
            
            if (scrollTop > targetTop) {
                window.scroll(0, scrollTop-scrollSpeed);
            } else if (scrollTop < targetTop) {
                window.scroll(0, scrollTop+scrollSpeed);
            } else if (scrollTop == targetTop) {
                console.log('remove scroll timer')
                clearInterval(scrollTimer);
            }} , 1)
        //window.scroll(0, viewportHeight*page);
        console.log("scroll to page " + page)
    }
});
