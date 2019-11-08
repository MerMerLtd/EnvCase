// // creating a class to wrap the heatmap cycling logic
// function AnimationPlayer(options) {
//     this.heatmap = options.heatmap;
//     this.data = options.data;
//     this.interval = null;
//     this.animationSpeed = options.animationSpeed || 300;
//     this.wrapperEl = options.wrapperEl;
//     this.isPlaying = false;
//     this.init();
// };
// // define the prototype functions
// AnimationPlayer.prototype = {
//     init: function () {
//         var dataLen = this.data.length;
//         this.wrapperEl.innerHTML = '';
//         var playButton = this.playButton = document.createElement('button');
//         playButton.onclick = function () {
//             if (this.isPlaying) {
//                 this.stop();
//             } else {
//                 this.play();
//             }
//             this.isPlaying = !this.isPlaying;
//         }.bind(this);
//         playButton.innerText = 'play';

//         this.wrapperEl.appendChild(playButton);

//         var events = document.createElement('div');
//         events.className = 'heatmap-timeline';
//         events.innerHTML = '';

//         for (var i = 0; i < dataLen; i++) {

//             var xOffset = 100 / (dataLen - 1) * i;

//             var ev = document.createElement('div');
//             ev.className = 'time-point';
//             ev.style.left = xOffset + '%';

//             ev.onclick = (function (i) {
//                 return function () {
//                     this.isPlaying = false;
//                     this.stop();
//                     this.setFrame(i);
//                 }.bind(this);
//             }.bind(this))(i);

//             events.appendChild(ev);

//         }
//         this.wrapperEl.appendChild(events);
//         this.setFrame(0);
//     },
//     play: function () {
//         var dataLen = this.data.length;
//         this.playButton.innerText = 'pause';
//         this.interval = setInterval(function () {
//             this.setFrame(++this.currentFrame % dataLen);
//         }.bind(this), this.animationSpeed)
//     },
//     stop: function () {
//         clearInterval(this.interval);
//         this.playButton.innerText = 'play';
//     },
//     setFrame: function (frame) {
//         this.currentFrame = frame;
//         var snapshot = this.data[frame];
//         this.heatmap.setData(snapshot);
//         var timePoints = $('.heatmap-timeline .time-point');
//         for (var i = 0; i < timePoints.length; i++) {
//             timePoints[i].classList.remove('active');
//         }
//         timePoints[frame].classList.add('active');
//     },
//     setAnimationData: function (data) {
//         this.isPlaying = false;
//         this.stop();
//         this.data = data;
//         this.init();
//     },
//     setAnimationSpeed: function (speed) {
//         this.isPlaying = false;
//         this.stop();
//         this.animationSpeed = speed;
//     }
// };

// var heatmapInstance = h337.create({
//     container: document.querySelector('.heatmap')
// });

// // animationData contains an array of heatmap data objects
// var animationData = [];

// // generate some heatmap data objects
// for (var i = 0; i < 20; i++) {
//     animationData.push(generateRandomData(300));
// }

// var player = new AnimationPlayer({
//     heatmap: heatmapInstance,
//     wrapperEl: document.querySelector('.timeline-wrapper'),
//     data: animationData,
//     animationSpeed: 100
// });

elements = {
    ...elements,
    timelineConfigPannelBtn: document.querySelector('.timeline .bar_container .pannel i'),
    timelineConfig: document.querySelector('.timeline .bar_container .pannel .config'),
    timelineSummary: document.querySelector('.timeline .bar_container .pannel .summary'),
    timelineSetDate: document.querySelector('.timeline .bar_container .tip_bar .pannel input[type=date]'),
    timelineLength: document.querySelector('.timeline .bar_container .pannel .time-length'),
    timelinePlayBtn: document.querySelector('.timeline .play-btn'),
    timelineDraggableCircle: document.querySelector('.timeline .bar_container .tip_bar .circle'),
    timelineProgressBarContainer: document.querySelector('.timeline .progress_bar'),
    timelineProgressBar: document.querySelector('.timeline .progress_bar .progress'),
};

const toggleTimelineConfigPannel = evt => {
    switch (evt.target.innerText) {
        case "arrow_drop_down":
            console.log('arrow_drop_down is clicked');

            console.log(elements.timelineSetDate.value);
            //show summary
            elements.timelineSummary.classList.contains('not-display') ? elements.timelineSummary.classList.remove('not-display') : null;
            elements.timelineConfig.classList.add('not-display')
            elements.timelineConfigPannelBtn.innerText = 'arrow_drop_up';
            break;
        case "arrow_drop_up":
            console.log('arrow_drop_up is clicked');

            //show config
            elements.timelineConfig.classList.contains('not-display') ? elements.timelineConfig.classList.remove('not-display') : null;
            elements.timelineSummary.classList.add('not-display')
            elements.timelineConfigPannelBtn.innerText = 'arrow_drop_down';
            break;
        default:
    }
}

const setDate = evt => {
    console.log(elements.timelineSetDate.value);
    Array.from(elements.timelineSummary.children)[0].innerText = elements.timelineSetDate.value;
}

const setTimeLength = evt => {
    console.log(evt.target);
    Array.from(elements.timelineLength.children).forEach(el => el.dataset.type === evt.target.dataset.type ? el.classList.add('selected') : el.classList.remove('selected'));
    Array.from(elements.timelineSummary.children)[1].innerText = evt.target.innerText;
    // if (evt.target.dataset.type === 'hr') {
    //     console.log(evt.target.innerText);
    //     Array.from(elements.timelineLength.children).forEach(el => el.dataset.type === evt.target.dataset.type ? el.classList.add('selected') : el.classList.remove('selected'));
    //     Array.from(elements.timelineSummary.children)[1].innerText = evt.target.innerText;
    // } else if (evt.target.dataset.type === 'week') {
    //     console.log(evt.target.innerText);
    //     Array.from(elements.timelineLength.children).forEach(el => el.dataset.type === 'week' ? el.classList.add('selected') : el.classList.remove('selected'));
    //     Array.from(elements.timelineSummary.children)[1].innerText = evt.target.innerText;
    // } else if (evt.target.dataset.type === 'month') {
    //     console.log(evt.target.innerText);
    //     Array.from(elements.timelineLength.children).forEach(el => el.dataset.type === 'month' ? el.classList.add('selected') : el.classList.remove('selected'));
    //     Array.from(elements.timelineSummary.children)[1].innerText = evt.target.innerText;

    // } else if (evt.target.dataset.type === 'season') {
    //     console.log(evt.target.innerText);
    //     Array.from(elements.timelineLength.children).forEach(el => el.dataset.type === 'season' ? el.classList.add('selected') : el.classList.remove('selected'));
    //     Array.from(elements.timelineSummary.children)[1].innerText = evt.target.innerText;
    // } else if (evt.target.dataset.type === 'year') {
    //     console.log(evt.target.innerText);
    //     Array.from(elements.timelineLength.children).forEach(el => el.dataset.type === 'year' ? el.classList.add('selected') : el.classList.remove('selected'));
    //     Array.from(elements.timelineSummary.children)[1].innerText = evt.target.innerText;
    // }
}


const renderProgress = progress => {
    console.log(progress * 100);
    elements.timelineProgressBar.style.width = `${progress*100}%`;
    console.log(elements.timelineProgressBar.style.width);
    elements.timelineDraggableCircle.style.left = `${progress*100}%`;
}

const setProgress = evt => {
    const progress = evt.offsetX / elements.timelineProgressBarContainer.offsetWidth;
    renderProgress(progress);
}

const togglePlay = evt => {
    // if (!animateData.length) return;
    const playBtnIcon = elements.timelinePlayBtn.children[0];
    // let testtest;
    if (playBtnIcon.classList.contains('fa-play')) {
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
        let progress = parseFloat(elements.timelineProgressBar.style.width.replace('%', ''));
        console.log(progress);
        renderProgress(progress / 100);
        if (!animateData.length) {
            playBtnIcon.classList.add('fa-play');
            playBtnIcon.classList.remove('fa-pause');
            return;
        }
        let i = Math.round(animateData.length * progress / 100);
        // while (i < animateData.length) {
        testtest = setInterval(() => {
            if (i === animateData.length ) clearInterval(testtest);
            renderProgress(i / animateData.length);
            console.log(animateData[i], i);
            heatmapLayer.setData({
                data: animateData[i]
            });
            i++;
        }, 1000);
        // }

        // testtest = setInterval(() => {
        //     if (progress < 100) {
        //         progress += 0.1;
        //         renderProgress(progress / 100);
        //         console.log(animateData);
        //         if (!animateData.length) return;
        //         heatmapLayer.setData({
        //             data: animateData[Math.round(animateData.length * progress / 100)]
        //         });
        //     } else {
        //         renderProgress(1);
        //         clearInterval(testtest);
        //         playBtnIcon.classList.add('fa-play');
        //         playBtnIcon.classList.remove('fa-pause');
        //     }
        // }, 100);
    } else if (playBtnIcon.classList.contains('fa-pause')) {
        clearInterval(testtest);
        playBtnIcon.classList.add('fa-play');
        playBtnIcon.classList.remove('fa-pause');
    }
}

elements.timelineSetDate.addEventListener('change', setDate, false);
elements.timelineLength.addEventListener('click', setTimeLength, false);
elements.timelineConfigPannelBtn.addEventListener('click', toggleTimelineConfigPannel, false);
elements.timelinePlayBtn.addEventListener('click', togglePlay, false);
elements.timelineProgressBarContainer.addEventListener('mousedown', setProgress, false);