import Instrument, { Instrument, Instrument, Instrument, Instrument, Instrument, Instrument } from './instrument'

type Bank = {
    a: Instrument,
    b: Instrument,
    c: Instrument,
    d: Instrument,
    e: Instrument,
    f: Instrument,
}

export default class Soundbank {
    current: keyof Bank = 'a'
    bank: Bank
    constructor () {
        this.bank = {
            a: new Instrument(),
            b: new Instrument(),
            c: new Instrument(),
            d: new Instrument(),
            e: new Instrument(),
            f: new Instrument(),
        }
    }
    attack (note:number) {
        this.bank[this.current].attack(note)
    }
    release () {
        this.bank[this.current].release()
    }
    set:
}
