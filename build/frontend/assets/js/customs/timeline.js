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
    console.log(elements.timelineTimeInput.value);
    Array.from(elements.timelineSummary.children)[0].innerText = elements.timelineTimeInput.value;
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
    const playBtnIcon = elements.timelinePlayBtn.children[0];
    // let testtest;
    if (playBtnIcon.classList.contains('fa-play')) {
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
        let progress = parseFloat(elements.timelineProgressBar.style.width.replace('%', '')) / 100;
        // testtest = setInterval(() => {
        //     if (progress < 100) {
        //         progress += 0.1;
        //         renderProgress(progress / 100);
        //     } else {
        //         renderProgress(1);
        //         clearInterval(testtest);
        //         playBtnIcon.classList.add('fa-play');
        //         playBtnIcon.classList.remove('fa-pause');
        //     }
        // }, 100);
    } else if (playBtnIcon.classList.contains('fa-pause')) {
        // clearInterval(testtest);
        playBtnIcon.classList.add('fa-play');
        playBtnIcon.classList.remove('fa-pause');
    }
}

elements.timelineSetDate.addEventListener('change', setDate, false);
elements.timelineLength.addEventListener('click', setTimeLength, false);
elements.timelineConfigPannelBtn.addEventListener('click', toggleTimelineConfigPannel, false);
elements.timelinePlayBtn.addEventListener('click', togglePlay, false);
elements.timelineProgressBarContainer.addEventListener('mousedown', setProgress, false);