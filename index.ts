import PerfHooks = require('perf_hooks');

class RLStrore {
    constructor(public maxSize:number){}

    data :{[key :string] :string} = {};

    dispatch(eventName :'set', payload :{key :string}) :void;
    dispatch(eventName :'get', payload :{key :string}) :void;
    dispatch(eventName :string, payload :any) {
        if (eventName === 'set') this.onSet(payload);
        if (eventName === 'get') this.onGet(payload);
    }

    delete(key :string) :void {
        this.used -= this.countOccupiedSize(key);

        delete this.data[key];
        delete this.weightMap[key];
    }

    // Private props

    protected used :number = 0;
    protected weightMap :{[key :string] :number} = {};

    protected onSet({key} :{key :string}) {
        this.used += this.countOccupiedSize(key);
        this.weightMap[key] = PerfHooks.performance.now();

        this.runGarbageCollection();
    }
    protected onGet({key} :{key :string}) {
        if (key in this.data) {
            this.weightMap[key] = PerfHooks.performance.now();
        }
    }

    protected runGarbageCollection() {
        while (this.used > this.maxSize) {
            let minWeightKey :string = '';
            for (let key in this.data) {
                if (!minWeightKey) minWeightKey = key;

                if (this.weightMap[minWeightKey] > this.weightMap[key]) minWeightKey = key;
            }

            this.delete(minWeightKey);
        }
    }
    protected countOccupiedSize(key :string) :number {
        return key.length * 2 + this.data[key].length;
    }
}

export = RLStrore;
