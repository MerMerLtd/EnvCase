let interval;

elements = {
    ...elements,
    timelineConfigPannelBtn: document.querySelector('.timeline .bar_container .pannel i'),
    timelineConfig: document.querySelector('.timeline .bar_container .pannel .config'),
    timelineSummary: document.querySelector('.timeline .bar_container .pannel .summary'),
    timelineSetDate: document.querySelector('.timeline .bar_container .tip_bar .pannel input[type=date]'),
    timelineLength: document.querySelector('.timeline .bar_container .pannel .time-length'),
    timelinePlayBtn: document.querySelector('.timeline .play-btn'),
    timelineDraggableCircle: document.querySelector('.timeline .bar_container .tip_bar .circle'),
    timelineDraggableText: document.querySelector('.timeline .bar_container .tip_bar .text'),
    timelineProgressBarContainer: document.querySelector('.timeline .progress_bar'),
    timelineProgressBar: document.querySelector('.timeline .progress_bar .progress'),
};

const playBtnIcon = elements.timelinePlayBtn.children[0];

const closeConfigPannel = () => {
    // console.log('arrow_drop_down is clicked');
    // console.log(elements.timelineSetDate.value);
    //show summary
    elements.timelineSummary.classList.contains('not-display') ? elements.timelineSummary.classList.remove('not-display') : null;
    elements.timelineConfig.classList.add('not-display')
    elements.timelineConfigPannelBtn.innerText = 'arrow_drop_up';
}

const openConfigPannel = () => {
    // console.log('arrow_drop_up is clicked');
    //show config
    elements.timelineConfig.classList.contains('not-display') ? elements.timelineConfig.classList.remove('not-display') : null;
    elements.timelineSummary.classList.add('not-display')
    elements.timelineConfigPannelBtn.innerText = 'arrow_drop_down';

}

const toggleTimelineConfigPannel = evt => {
    switch (evt.target.innerText) {
        case "arrow_drop_down":
            closeConfigPannel();
            break;
        case "arrow_drop_up":
            openConfigPannel();
            break;
        default:
    }
}

const setDate = evt => {
    console.log(elements.timelineSetDate.value);
    Array.from(elements.timelineSummary.children)[0].innerText = elements.timelineSetDate.value;
    // closeConfigPannel();
}

const setTimeInterval = evt => {
    // console.log(evt.target);
    Array.from(elements.timelineLength.children).forEach(el => el.dataset.type === evt.target.dataset.type ? el.classList.add('selected') : el.classList.remove('selected'));
    Array.from(elements.timelineSummary.children)[1].innerText = evt.target.innerText;
    // closeConfigPannel();
}

const renderProgress = progress => {
    elements.timelineProgressBar.style.width = `${progress*100}%`;
    elements.timelineDraggableCircle.style.left = `${progress*100}%`;
    elements.timelineDraggableText.style.left = `${progress*100}%`;
    // ++
    // if (animationData.length)
        // elements.timelineDraggableText.innerText = `${Object.keys(animationData)[Math.round(progress*animationData.length)]}`
}

const play = () => {
    closeConfigPannel();
    if (!animationData.length) {
        playBtnIcon.classList.add('fa-play');
        playBtnIcon.classList.remove('fa-pause');
        return;
    } // --

    let err;
    // [err, animationData] = to(makeRequest({
    //     method: 'GET',
    //     url: '',
    //     payload: {
    //         type: 'PM2.5',
    //         start: '',
    //         // length: '',
    //         interval: '',
    //     }
    // })); //++

    // animationData = {
    //     '1573643465143': [{
    //             count: 0.044,
    //             lat: 25.05248945869619,
    //             lng: 121.54460913158529,
    //             // timeStamp: 1573643465143,
    //             // type: "PM25"
    //         },
    //         {
    //             count: 0,
    //             lat: 25.048046920483152,
    //             lng: 121.54726532341296,
    //             // timeStamp: 1573643465143,
    //             // type: "PM25",
    //         },
    //     ],
    //     '1573643465163': [{
    //             count: 0.044,
    //             lat: 25.05248945869619,
    //             lng: 121.54460913158529,
    //             // timeStamp: 1573643465163,
    //             // type: "PM25"
    //         },
    //         {
    //             count: 0,
    //             lat: 25.048046920483152,
    //             lng: 121.54726532341296,
    //             // timeStamp: 1573643465163,
    //             // type: "PM25",
    //         },
    //     ],
    // };

    playBtnIcon.classList.remove('fa-play');
    playBtnIcon.classList.add('fa-pause');
    // console.log(interval);
    if (interval) clearInterval(interval);
    let progress = parseFloat(elements.timelineProgressBar.style.width.replace('%', ''));
    let i = Math.round(animationData.length * progress / 100);
    interval = setInterval(() => {
        if (i === animationData.length) { // Object.values(animationData).length
            clearInterval(interval);
            playBtnIcon.classList.add('fa-play');
            playBtnIcon.classList.remove('fa-pause');
        };
        renderProgress(i / animationData.length);
        console.log(animationData[i], i);
        heatmapLayer.setData({
            data: animationData[i]
        });
        i++;
    }, 300);
}

const stop = () => {
    clearInterval(interval);
    playBtnIcon.classList.add('fa-play');
    playBtnIcon.classList.remove('fa-pause');
}

const togglePlay = () => {
    if (playBtnIcon.classList.contains('fa-play')) {
        play();
    } else if (playBtnIcon.classList.contains('fa-pause')) {
        stop();
    }
}

const setProgress = evt => {
    const progress =
        evt.offsetX / elements.timelineProgressBarContainer.offsetWidth;
    renderProgress(progress);
    if (playBtnIcon.classList.contains('fa-pause')) {
        play();
    }
}


elements.timelineSetDate.addEventListener('change', setDate, false);
elements.timelineLength.addEventListener('click', setTimeInterval, false);
elements.timelineConfigPannelBtn.addEventListener('click', toggleTimelineConfigPannel, false);
elements.timelinePlayBtn.addEventListener('click', togglePlay, false);
elements.timelineProgressBarContainer.addEventListener('mousedown', setProgress, false);