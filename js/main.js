//          Menu animaion:

let menuLinks = document.querySelectorAll('.menu__link');
let sections = document.querySelectorAll('section');

let scrollFunc = () => {
    if (window.innerWidth > 991){
        let scrollDistance = window.scrollY;    
        let sectionActiveArray = [];

        sections.forEach((section) => {
            if (section.offsetTop - 200 <= scrollDistance) {
                if (!sectionActiveArray.includes(section)){
                    sectionActiveArray.push(section);
                }
            }
        })

        let sectionActive = sectionActiveArray[sectionActiveArray.length - 1].id;
        menuLinks.forEach(link => {
            if (link.getAttribute('href').replace('#', '') == sectionActive) {
                link.classList.add('menu__link_active');
            }
            else {
                link.classList.remove('menu__link_active');
            }
        })
    }
    // ios problems
    else{
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    }
}

// throttle func
function throttle (callback, ms) {
    let isThrottled = false;
    let savedThis, savedArgs;
    return function wrapper(){
        if (isThrottled){
            savedThis = this;
            savedArgs = arguments;
            return;
        }

        callback.apply(this, arguments);
        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
            if (savedArgs){
                wrapper.apply(savedThis, savedArgs);
                savedThis = savedArgs = null;
            }
        }, ms)
    }
}

// debounce func
function debounce(callback, ms) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback.apply(this, arguments);
        }, ms);
    }
}


 // 33 = 30fps; 66 = 15fps;
const throttledScroll = throttle(scrollFunc, 66);
window.addEventListener('scroll', throttledScroll);

//      Resize stuff:
const onResize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const onResizeDebounced = debounce(onResize, 200);
window.addEventListener('resize', onResizeDebounced);
onResize();


//          Projects from items.js file:

let projects = document.querySelector('#projects > ul');
let projInner = ``;

for (item in items) {
    projInner += `<li class="projects__item" id="${item}">`;
    projInner += `<div><img src="${items[item].thumbnail}" alt="thumbnail" loading="lazy" width="600px" height="374px"></div>`;
    projInner += `<h4><a href="#${item}">${items[item].name}</a></h4>`;
    projInner += `<p>${items[item].descShort}</p>`;
    projInner += `<ul class="projects__skills">`;
    for (skill of items[item].skills){
        projInner += `<li>${skill}</li>`;
    }
    projInner += `</ul></li>`;
    projects.innerHTML = projInner;
}


//          Popup window logic:

let projImgs = Array.from(document.querySelectorAll('.projects__item > div > img'));
let projNames = Array.from(document.querySelectorAll('.projects__item > h4 > a'));
let projLinks = projImgs.concat(projNames);

let lastPressed = null;
let popup = document.querySelector('.popup');
let popupInside = document.querySelector('.popup__inside');

// scrollbar width func
let scrollbarWidth = () => {
    let documentWidth = parseInt(document.documentElement.clientWidth);
    let windowsWidth = parseInt(window.innerWidth);
    let scrollbarWidth = windowsWidth - documentWidth;
    return scrollbarWidth;
}

// ios bugfixes
let openedWithBugfix = false;
const iosBugfixOpen = () => {
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;
    document.documentElement.style.scrollBehavior = "auto";
    openedWithBugfix = true;
}
const iosBugfixClose = () => {
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.documentElement.style.scrollBehavior = "smooth";
}

// popup show
projLinks.forEach( projLink => {
    projLink.addEventListener('click', (e) => {
        e.preventDefault();

        let projLinkId = projLink.parentNode.parentNode.id;
        let popupItem = items[projLinkId];

        if (lastPressed != projLinkId){
            let popupInner = ``;
            popupInner += `<div class="popup__sticky"><div class="popup__cross"></div></div>`;
            popupInner += `<h3>${popupItem.name}</h3>`;
            popupInner += `<div class="popup__image"><img src="${popupItem.img}" alt="website image"></div>`;
            popupInner += `<div class="popup__text"><p>${popupItem.description}</p></div>`;
            popupInner += `<div><a href="${popupItem.link}" class="popup__link">${popupItem.name}</a></div>`;
            popupInside.innerHTML = popupInner;
        }

        document.querySelector('.popup__inside > h3').scrollIntoView();
        document.body.style.paddingRight = scrollbarWidth() + "px";
        document.body.style.overflowY = 'hidden';
        popupInside.style.marginLeft = 0 + "px";
        popup.classList.add('popup-opened');
        lastPressed = projLinkId;
        onResize();

        // ios problems
        if (window.innerWidth <= 991){
            iosBugfixOpen();
        }
    })
})

// popup hide
popup.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')  || e.target.classList.contains('popup__cross')){
        popup.classList.remove('popup-opened');
        document.body.style.paddingRight = 0 + "px";
        document.body.style.overflowY = 'scroll';
        popupInside.style.marginLeft = scrollbarWidth() + "px";

        // ios problems
        if (openedWithBugfix){
            iosBugfixClose();
            openedWithBugfix = false;
        }
    }
})


//          Project items highlight:

let projItems = document.querySelectorAll('.projects__item');

projItems.forEach( item  => {
    item.addEventListener('mouseenter', (e) => {
        projItems.forEach( item  => {
            if (item.id != e.currentTarget.id) {
                item.classList.add('projects__item-passive');
            }
            else {
                item.classList.add('projects__item-active');
                item.querySelector('div > img').style.opacity = "0.92";
            }
        })
    })

    item.addEventListener('mouseleave', () => {
        projItems.forEach( item  => {
            item.classList.remove('projects__item-active');
            item.classList.remove('projects__item-passive');
            item.querySelector('div > img').style.opacity = "0.85";
        })
    })
})

