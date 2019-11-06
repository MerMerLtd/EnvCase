elements = {
    ...elements,
    timelineConfigPannelBtn: document.querySelector('.timeline .bar_container .pannel i'),
    timelineConfig: document.querySelector('.timeline .bar_container .pannel .config'),
    timelineSummary: document.querySelector('.timeline .bar_container .pannel .summary'),
    timelineTimeInput: document.querySelector('.timeline .bar_container .tip_bar .pannel input[type=date]'),
    timelineLength: document.querySelector('.timeline .bar_container .pannel .time-length'),
    timelinePlayBtn: document.querySelector('.timeline .play-btn'),
    timelineDraggableCircle: document.querySelector('.timeline .bar_container .tip_bar .circle'),
    timelineProgressBarContainer: document.querySelector('.timeline .progress_bar'),
    timelineProgressBar: document.querySelector('.timeline .progress_bar .progress'),
};

const togglePlay = evt => {
    if (evt.target.classList.contains('fa-play')) {
        evt.target.classList.remove('fa-play');
        evt.target.classList.add('fa-pause');
    } else if (evt.target.classList.contains('fa-pause')) {
        evt.target.classList.add('fa-play');
        evt.target.classList.remove('fa-pause');
    }
}

const dragProgress = evt => {

}

const toggleTimelineConfigPannel = evt => {
    switch (evt.target.innerText) {
        case "arrow_drop_down":
            console.log('arrow_drop_down is clicked');

            console.log(elements.timelineTimeInput.value);
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

elements.timelineLength.addEventListener('click', evt => {
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
}, false);

elements.timelineTimeInput.addEventListener('change', () => {
    console.log(elements.timelineTimeInput.value);
    Array.from(elements.timelineSummary.children)[0].innerText = elements.timelineTimeInput.value;
}, false);
elements.timelineConfigPannelBtn.addEventListener('click', toggleTimelineConfigPannel, false);
elements.timelinePlayBtn.addEventListener('click', togglePlay, false);
// elements.timelineDraggableCircle.addEventListener('drag');
elements.timelineProgressBarContainer.addEventListener('mousedown', evt => {
    const percent = evt.offsetX/elements.timelineProgressBarContainer.offsetWidth;
    console.log(percent *100);
    console.log(elements.timelineProgressBar.style.width);
    elements.timelineProgressBar.style.width = `${percent*100}%`;
    elements.timelineDraggableCircle.style.left = `${percent*100}%`;
}, false);

elements.timelineProgressBarContainer.addEventListener('mousemove', evt => {
    const percent = evt.offsetX/elements.timelineProgressBarContainer.offsetWidth;
    console.log(percent *100);
    console.log(elements.timelineProgressBar.style.width);
    elements.timelineProgressBar.style.width = `${percent*100}%`;
    elements.timelineDraggableCircle.style.left = `${percent*100}%`;
}, false);