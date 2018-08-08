import {h, define, update} from 'zxdom'
import css from './style.css'
import {SEQUENCER_LENGTH, NOTE_NAMES} from '../const'


export default function () {
    var notes = [...Array(SEQUENCER_LENGTH).keys()].map(_ => [...Array(8).keys()].map(_ => null))

    const Sequencer = define(_ => (
        <table class={css.sequencer}>
            {notes.map((vals, row) => (
                <tr>
                    <td class={css.time}>{row}</td>
                    {vals.map((note, col) => (
                        <td>{(note === null) ? '' : NOTE_NAMES[note]}</td>
                    ))}
                </tr>
            ))}
        </table>
    ))

    return {Sequencer}
}
