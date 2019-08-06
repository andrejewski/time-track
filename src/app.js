import React from 'react'
import moment from 'moment'
import { union } from 'tagmeme'

const Msg = union([
  'AddTrack',
  'RemoveTrack',
  'SetTrackName',
  'SetStartTrack',
  'SetEndTrack',
  'ToggleJSON'
])

const initDate = new Date().toISOString()
const init = [
  {
    tracks: [
      {
        date: initDate,
        name: 'Time track loaded – jew.ski/time-track'
      }
    ],
    startTrack: initDate,
    endTrack: initDate,
    isJSON: false
  }
]

const update = (msg, model) => {
  const newModel = Msg.match(msg, {
    AddTrack () {
      const date = new Date().toISOString()
      const newTrack = { date, name: date }
      return { ...model, tracks: [newTrack, ...model.tracks] }
    },
    RemoveTrack (date) {
      return {
        ...model,
        tracks: model.tracks.filter(track => track.date !== date)
      }
    },
    SetTrackName ({ date, name }) {
      return {
        ...model,
        tracks: model.tracks.map(track =>
          track.date === date ? { ...track, name } : track
        )
      }
    },
    SetStartTrack (date) {
      return { ...model, startTrack: date }
    },
    SetEndTrack (date) {
      return { ...model, endTrack: date }
    },
    ToggleJSON () {
      return { ...model, isJSON: !model.isJSON }
    }
  })

  return [newModel]
}

const view = (model, dispatch) => {
  let duration
  if (model.startTrack && model.endTrack) {
    const diff = Math.abs(
      new Date(model.startTrack).valueOf() - new Date(model.endTrack).valueOf()
    )

    duration = moment.duration(diff)
  }

  return (
    <React.Fragment>
      <div className='container'>
        <div className='toolbar'>
          <button onClick={() => dispatch(Msg.AddTrack())}>
            Record current time
          </button>
          <label className='check'>
            <input
              type='checkbox'
              value={model.isJSON}
              onClick={() => dispatch(Msg.ToggleJSON())}
            />
            Toggle JSON
          </label>
        </div>
        {duration && (
          <div className='duration'>
            <p>Duration between A and B</p>
            <table>
              <tbody>
                <tr>
                  <td>Hours</td>
                  <td>
                    <code>{duration.asHours().toFixed(5)}</code>
                  </td>
                </tr>
                <tr>
                  <td>Minutes</td>
                  <td>
                    <code>{duration.asMinutes().toFixed(5)}</code>
                  </td>
                </tr>
                <tr>
                  <td>Seconds</td>
                  <td>
                    <code>{duration.asSeconds().toFixed(5)}</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {model.isJSON ? (
          <pre>{JSON.stringify(model.tracks, null, 2)}</pre>
        ) : (
          <table>
            <thead>
              <tr>
                <th>A</th>
                <th>B</th>
                <th>Recorded Time</th>
              </tr>
            </thead>
            <tbody>
              {model.tracks.map(track => (
                <tr key={track.date}>
                  <td>
                    <button
                      title='Set as A time'
                      onClick={() => dispatch(Msg.SetStartTrack(track.date))}
                    >
                      {track.date === model.startTrack ? 'A' : '-'}
                    </button>
                  </td>
                  <td>
                    <button
                      title='Set as B time'
                      onClick={() => dispatch(Msg.SetEndTrack(track.date))}
                    >
                      {track.date === model.endTrack ? 'B' : '-'}
                    </button>
                  </td>
                  <td style={{ width: '100%' }}>
                    <div className='time-item'>
                      <div>
                        <input
                          type='text'
                          value={track.name}
                          onChange={e =>
                            dispatch(
                              Msg.SetTrackName({
                                date: track.date,
                                name: e.target.value
                              })
                            )
                          }
                        />
                      </div>
                      <div className='times'>
                        <p>
                          <code>
                            {moment(track.date).format('hh : mm : ss : SSSS')}
                          </code>
                        </p>
                        <p>{moment(track.date).fromNow()}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      title='Remove'
                      onClick={() => dispatch(Msg.RemoveTrack(track.date))}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer>
        <p>
          Made by <a href='https://jew.ski'>Chris Andrejewski</a>, view{' '}
          <a href='https://github.com/andrejewski/time-track'>source code</a>
        </p>
      </footer>
    </React.Fragment>
  )
}

export function makeProgram () {
  return {
    init,
    update,
    view
  }
}
