import React, {Component} from 'react'
import {FocusDirection, FocusEdgeAction, FocusGroup, FocusSkip} from './focus/FocusGroup'
import {FocusableBox} from './focus/FocusableBox'
import './App.css'
import {range} from './focus/utils'

class App extends Component {
  render() {
    return (
      <div className="App">
        <FocusGroup dir={FocusDirection.Column}>
          <FocusableBox focusKey="f1" label="Focusable 1" onAction={() => console.log('f1')} />
          <hr />
          <div>
            <h2>Episode row</h2>
            <FocusGroup dir={FocusDirection.Column}>
              <FocusGroup dir={FocusDirection.Row} edgeAction={FocusEdgeAction.Loop}>
                {range(1, 5).map(i => (
                  <FocusableBox
                    key={i}
                    focusKey={`${i}`}
                    label={`Season ${i}`}
                    className="inline"
                    height={25}
                  />
                ))}
              </FocusGroup>
              <FocusGroup dir={FocusDirection.Row}>
                <FocusableBox focusKey="episodes" label="1 - 8" className="inline" height={30} />
                <FocusableBox focusKey="sort" label="sort" className="inline" height={30} />
              </FocusGroup>
              <FocusGroup dir={FocusDirection.Row}>
                {range(1, 8).map(i => (
                  <FocusableBox
                    key={i}
                    focusKey={`${i}`}
                    label={`Episode ${i}`}
                    className="inline"
                  />
                ))}
              </FocusGroup>
            </FocusGroup>
          </div>
          <hr />
          <div>
            <h2>Default key + reset after blur</h2>
            <FocusGroup dir={FocusDirection.Row} defaultKey="b" resetFocusState={true}>
              <FocusableBox focusKey="a" label="item 1" className="inline" />
              <FocusableBox focusKey="b" label="default item" className="inline" />
              <FocusableBox focusKey="c" label="item 3" className="inline" />
            </FocusGroup>
          </div>
          <hr />
          <FocusableBox
            focusKey="f2"
            label="only upward"
            skip={FocusSkip.Forward}
            onAction={() => console.log('f2')}
          />
          <FocusableBox
            focusKey="f3"
            label="only downward"
            skip={FocusSkip.Backward}
            onAction={() => console.log('f3')}
          />
          <FocusableBox focusKey="f4" label="Focusable" onAction={() => console.log('f4')} />
        </FocusGroup>
      </div>
    )
  }
}

export default App
