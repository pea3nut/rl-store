"use strict";
const PerfHooks = require("perf_hooks");
class RLStrore {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.data = {};
        // Private props
        this.used = 0;
        this.weightMap = {};
    }
    dispatch(eventName, payload) {
        if (eventName === 'set')
            this.onSet(payload);
        if (eventName === 'get')
            this.onGet(payload);
    }
    delete(key) {
        this.used -= this.countOccupiedSize(key);
        delete this.data[key];
        delete this.weightMap[key];
    }
    onSet({ key }) {
        this.used += this.countOccupiedSize(key);
        this.weightMap[key] = PerfHooks.performance.now();
        this.runGarbageCollection();
    }
    onGet({ key }) {
        if (key in this.data) {
            this.weightMap[key] = PerfHooks.performance.now();
        }
    }
    runGarbageCollection() {
        while (this.used > this.maxSize) {
            let minWeightKey = '';
            for (let key in this.data) {
                if (!minWeightKey)
                    minWeightKey = key;
                if (this.weightMap[minWeightKey] > this.weightMap[key])
                    minWeightKey = key;
            }
            this.delete(minWeightKey);
        }
    }
    countOccupiedSize(key) {
        return key.length * 2 + this.data[key].length;
    }
}
module.exports = RLStrore;
//# sourceMappingURL=index.js.map