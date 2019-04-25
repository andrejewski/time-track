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

const init = [
  {
    tracks: [],
    startTrack: null,
    endTrack: null,
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
    <div>
      <fieldset>
        <button onClick={() => dispatch(Msg.AddTrack())}>
          Record current time
        </button>
        <button onClick={() => dispatch(Msg.ToggleJSON())}>Toggle JSON</button>
      </fieldset>
      {duration && (
        <fieldset>
          <p>Seconds: {duration.asSeconds()}</p>
          <p>Minutes: {duration.asMinutes()}</p>
          <p>Hours: {duration.asHours()}</p>
        </fieldset>
      )}
      {model.isJSON ? (
        <pre>{JSON.stringify(model.tracks, null, 2)}</pre>
      ) : (
        <fieldset>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>A</th>
                <th>B</th>
                <th>Name</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {model.tracks.map(track => (
                <tr key={track.date}>
                  <td style={{ width: '0%' }}>
                    <button
                      onClick={() => dispatch(Msg.SetStartTrack(track.date))}
                    >
                      {track.date === model.startTrack ? 'A' : '-'}
                    </button>
                  </td>
                  <td style={{ width: '0%' }}>
                    <button
                      onClick={() => dispatch(Msg.SetEndTrack(track.date))}
                    >
                      {track.date === model.endTrack ? 'B' : '-'}
                    </button>
                  </td>
                  <td style={{ width: '50%' }}>
                    <input
                      type='text'
                      value={track.name}
                      style={{ width: '100%' }}
                      onChange={e =>
                        dispatch(
                          Msg.SetTrackName({
                            date: track.date,
                            name: e.target.value
                          })
                        )
                      }
                    />
                  </td>
                  <td style={{ width: '50%', textAlign: 'center' }}>
                    <p>
                      {moment(track.date).format('hh:mm:ss:SSSS')}
                      {'—'}
                      {moment(track.date).fromNow()}
                    </p>
                  </td>
                  <td>
                    <button
                      onClick={() => dispatch(Msg.RemoveTrack(track.date))}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>
      )}
    </div>
  )
}

export function makeProgram () {
  return {
    init,
    update,
    view
  }
}
