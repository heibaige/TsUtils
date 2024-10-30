export class Timer {
    private second: number = 0;
    private step: number;
    private onTimeChange?: (current: number) => void;
    private _isRunning = false;
    private timer: number = 0;
    private _innerSecond: number = 0;

    constructor(start: number, step: number = 1000, onTimeChange?: (current: number) => void) {
        this.step = step;
        this.second = start;
        this._innerSecond = this.second;
        this.onTimeChange = onTimeChange;
    }

    public start() {
        if (this._isRunning) {
            return;
        }
        this._isRunning = true;
        const startTime = new Date().getTime();
        let exp = startTime; // 下次期望执行时间
        const callback = () => {
            const currentTime = new Date().getTime();
            console.log('上次期望时间: ', exp);
            console.log('current: ', currentTime);
            console.log('gap: ', currentTime - exp);
            // 向上多取100,解决差值接近step的值
            const nStep = Math.floor((currentTime + 100 - exp) / this.step);
            console.log('nStep: ', nStep);
            this.second = this.second + this.step * nStep;
            this.onTimeChange && this.onTimeChange(this.second);
            exp = exp + this.step * nStep;
            const nextExp = exp + this.step;
            let nextInterval = nextExp - currentTime;
            console.log('下次期望时间: ', nextExp);
            if (nextInterval < 0) {
                nextInterval = 50;
            }
            console.log('下一次执行：' + nextInterval + 'ms后，当前时间：' + this.second + 'ms');
            if (this._isRunning) {
                this.timer = setTimeout(callback, nextInterval);
            }
        };
        this.timer = setTimeout(callback, this.step);
    }

    public stop() {
        this._isRunning = false;
        if (this.timer > 0) {
            clearTimeout(this.timer);
            this.timer = 0;
        }
    }

    public setTime(second: number) {
        this.second = second;
        this._innerSecond = this.second;
    }

    public reset() {
        this.second = this._innerSecond;
        this._isRunning = false;
    }
    public isRunning() {
        return this._isRunning;
    }
}
