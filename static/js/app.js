'use strict';

const ALGO_NAMES = {
    bubble:    'Bubble Sort',
    selection: 'Selection Sort',
    insertion: 'Insertion Sort',
    merge:     'Merge Sort',
    quick:     'Quick Sort',
};

class SortingVisualizer {
    constructor() {
        this.steps       = [];
        this.currentStep = 0;
        this.isPlaying   = false;
        this.animId      = null;
        this.lastTick    = 0;
        this.startTime   = null;
        this.pausedAt    = 0;   
        this.array       = [];
        this.arraySize   = 50;
        this.speed       = 50;

        this._bindEls();
        this._bindEvents();
        this.generateArray();
    }

    // ── DOM binding 
    _bindEls() {
        this.elAlgoSelect    = document.getElementById('algorithm-select');
        this.elBtnPlay       = document.getElementById('btn-play');
        this.elPlayIcon      = document.getElementById('play-icon');
        this.elPlayText      = document.getElementById('play-text');
        this.elBtnReset      = document.getElementById('btn-reset');
        this.elBtnStep       = document.getElementById('btn-step');
        this.elBtnNew        = document.getElementById('btn-new');
        this.elSizeSlider    = document.getElementById('size-slider');
        this.elSizeDisplay   = document.getElementById('size-display');
        this.elSpeedSlider   = document.getElementById('speed-slider');
        this.elSpeedDisplay  = document.getElementById('speed-display');
        this.elBarsContainer = document.getElementById('bars-container');
        this.elLoading       = document.getElementById('loading-overlay');
        this.elAlgoName      = document.getElementById('algo-name');
        this.elStatusText    = document.getElementById('status-text');
        this.elStatAlgo      = document.getElementById('stat-algo');
        this.elStatSize      = document.getElementById('stat-size');
        this.elStatComp      = document.getElementById('stat-comparisons');
        this.elStatSwaps     = document.getElementById('stat-swaps');
        this.elStatStep      = document.getElementById('stat-step');
        this.elStatTime      = document.getElementById('stat-time');
    }

    _bindEvents() {
        this.elBtnPlay.addEventListener('click',  () => this._togglePlay());
        this.elBtnReset.addEventListener('click', () => this.reset());
        this.elBtnStep.addEventListener('click',  () => this._stepForward());
        this.elBtnNew.addEventListener('click',   () => this.generateArray());

        this.elSizeSlider.addEventListener('input', (e) => {
            this.arraySize = parseInt(e.target.value);
            this.elSizeDisplay.textContent = this.arraySize;
            this.generateArray();
        });

        this.elSpeedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.elSpeedDisplay.textContent = this.speed + 'x';
        });

        this.elAlgoSelect.addEventListener('change', () => {
            this._stopAnimation();
            this.isPlaying = false;
            this.steps = [];
            this.currentStep = 0;
            this.pausedAt = 0;
            this.startTime = null;
            const name = ALGO_NAMES[this.elAlgoSelect.value];
            this.elAlgoName.textContent = name;
            this.elStatAlgo.textContent = name;
            this._renderBars(this.array, [], [], -1, []);
            this._updateStats(0, 0);
            this._updatePlayButton();
            this.elStatStep.textContent = '0 / 0';
            this.elStatusText.textContent = '';
            this.elStatTime.textContent = '0.00s';
        });
    }

    // ── Array generation 
    generateArray() {
        this._stopAnimation();
        this.isPlaying   = false;
        this.steps       = [];
        this.currentStep = 0;
        this.pausedAt    = 0;
        this.startTime   = null;

        this.array = Array.from({ length: this.arraySize }, () =>
            Math.floor(Math.random() * 90) + 10
        );

        this._renderBars(this.array, [], [], -1, []);
        this._updateStats(0, 0);
        this._updatePlayButton();
        this.elStatSize.textContent    = this.arraySize;
        this.elStatStep.textContent    = '0 / 0';
        this.elStatTime.textContent    = '0.00s';
        this.elStatusText.textContent  = '';
    }

    // ── Bar rendering 
    _renderBars(array, comparing, swapping, pivot, sorted) {
        const container = this.elBarsContainer;
        const n         = array.length;
        const maxVal    = Math.max(...array);

        if (container.children.length !== n) {
            container.innerHTML = '';
            for (let i = 0; i < n; i++) {
                const bar = document.createElement('div');
                bar.className = 'bar';
                container.appendChild(bar);
            }
        }

        const sortedSet   = new Set(sorted);
        const swappingSet = new Set(swapping);
        const compSet     = new Set(comparing);
        const bars        = container.children;

        for (let i = 0; i < n; i++) {
            const bar     = bars[i];
            const val     = array[i];
            bar.style.height = ((val / maxVal) * 100) + '%';

            // Reset
            bar.className    = 'bar';
            bar.style.background = '';

            if (sortedSet.has(i)) {
                bar.classList.add('sorted');
            } else if (swappingSet.has(i)) {
                bar.classList.add('swapping');
            } else if (compSet.has(i)) {
                bar.classList.add('comparing');
            } else if (i === pivot) {
                bar.classList.add('pivot');
            } else {
                const hue = 180 + (1 - val / maxVal) * 90;
                bar.style.background = `hsl(${hue}, 85%, 58%)`;
            }
        }
    }

    // ── Step rendering 
    _renderStep(idx) {
        const s = this.steps[idx];
        this._renderBars(s.array, s.comparing, s.swapping, s.pivot, s.sorted);
        this._updateStats(s.comparisons, s.swaps);
        this.elStatStep.textContent = `${idx + 1} / ${this.steps.length}`;

        if (this.startTime !== null) {
            const ms = performance.now() - this.startTime + this.pausedAt;
            this.elStatTime.textContent = (ms / 1000).toFixed(2) + 's';
        }
    }

    // ── Stats update ─
    _updateStats(comp, swaps) {
        this.elStatComp.textContent  = comp.toLocaleString();
        this.elStatSwaps.textContent = swaps.toLocaleString();
    }

    // ── Play / Pause toggle 
    async _togglePlay() {
        if (this.isPlaying) {
            this._pause();
        } else {
            await this._play();
        }
    }

    async _play() {
        if (this.steps.length === 0) {
            const ok = await this._fetchSteps();
            if (!ok) return;
        }

        if (this.currentStep >= this.steps.length) {
            this.currentStep = 0;
            this.pausedAt    = 0;
        }

        this.isPlaying = true;
        this._updatePlayButton();
        this.elStatusText.textContent = 'Sorting...';
        this.startTime = performance.now();
        this._startAnimation();
    }

    _pause() {
        this.pausedAt += performance.now() - (this.startTime ?? performance.now());
        this.startTime = null;
        this.isPlaying = false;
        this._stopAnimation();
        this._updatePlayButton();
        this.elStatusText.textContent = 'Paused';
    }

    reset() {
        this._stopAnimation();
        this.isPlaying   = false;
        this.currentStep = 0;
        this.pausedAt    = 0;
        this.startTime   = null;
        this._updatePlayButton();
        this.elStatusText.textContent = '';
        this.elStatTime.textContent   = '0.00s';

        if (this.steps.length > 0) {
            const s = this.steps[0];
            this._renderBars(s.array, [], [], -1, []);
            this._updateStats(0, 0);
            this.elStatStep.textContent = `0 / ${this.steps.length}`;
        } else {
            this._renderBars(this.array, [], [], -1, []);
            this._updateStats(0, 0);
            this.elStatStep.textContent = '0 / 0';
        }
    }

    async _stepForward() {
        if (this.isPlaying) this._pause();

        if (this.steps.length === 0) {
            const ok = await this._fetchSteps();
            if (!ok) return;
        }

        if (this.currentStep < this.steps.length) {
            this._renderStep(this.currentStep);
            this.currentStep++;
        }

        if (this.currentStep >= this.steps.length) {
            this.elStatusText.textContent = 'Done!';
        }
    }

    // ── Animation loop 
    _startAnimation() {
        this.lastTick = performance.now();

        const tick = (now) => {
            if (!this.isPlaying) return;

            const delay = this._getDelay();
            if (now - this.lastTick >= delay) {
                this.lastTick = now;

                if (this.currentStep >= this.steps.length) {
                    this.isPlaying = false;
                    this._updatePlayButton();
                    this.elStatusText.textContent = 'Done!';
                    return;
                }

                this._renderStep(this.currentStep);
                this.currentStep++;
            }

            this.animId = requestAnimationFrame(tick);
        };

        this.animId = requestAnimationFrame(tick);
    }

    _stopAnimation() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
    }

    _getDelay() {
        return Math.max(5, 1000 * Math.pow(0.955, this.speed));
    }

    // ── Fetch steps from backend 
    async _fetchSteps() {
        this.elLoading.classList.remove('hidden');
        this.elBtnPlay.disabled  = true;
        this.elBtnStep.disabled  = true;
        this.elStatusText.textContent = 'Computing steps...';

        try {
            const res = await fetch('/sort', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    algorithm: this.elAlgoSelect.value,
                    array:     [...this.array],
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Server error');
            }

            const data   = await res.json();
            this.steps   = data.steps;
            this.currentStep = 0;
            this.pausedAt    = 0;
            this.elStatStep.textContent = `0 / ${this.steps.length}`;
            return true;
        } catch (err) {
            console.error(err);
            this.elStatusText.textContent = 'Error: ' + err.message;
            return false;
        } finally {
            this.elLoading.classList.add('hidden');
            this.elBtnPlay.disabled  = false;
            this.elBtnStep.disabled  = false;
            this._updatePlayButton();
        }
    }

    // ── Play button state 
    _updatePlayButton() {
        if (this.isPlaying) {
            this.elPlayIcon.textContent = '⏸';
            this.elPlayText.textContent = 'Pause';
            this.elBtnPlay.classList.add('is-playing');
        } else {
            this.elPlayIcon.textContent = '▶';
            this.elPlayText.textContent = 'Play';
            this.elBtnPlay.classList.remove('is-playing');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});
