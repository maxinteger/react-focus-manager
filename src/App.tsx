import React, { Component } from 'react'
import { Box } from './focus/Box'
import { FocusDirection, FocusGroup } from './focus/FocusGroup'
import { FocusableBox } from './focus/FocusableBox'
import './App.css'
import {range} from './focus/utils'

class App extends Component {
  render() {
    return (
      <div className="App">
        <FocusGroup dir={FocusDirection.Column}>
          <FocusableBox focusKey="f1" label="Focusable 1" onAction={() => console.log('f1')} />
          <hr/>
          <div>
            <h2>Episode row</h2>
            <FocusGroup dir={FocusDirection.Column}>
              <FocusGroup dir={FocusDirection.Row}>
                {range(1, 5).map( i =>
                  <FocusableBox
                    key={i}
                    focusKey={`${i}`}
                    label={`Season ${i}`}
                    className="inline"
                    height={25}
                  />
                )}
              </FocusGroup>
              <FocusGroup dir={FocusDirection.Row}>
                <FocusableBox
                  focusKey="episodes"
                  label="1 - 8"
                  className="inline"
                  height={30}
                />
                <FocusableBox
                  focusKey="sort"
                  label="sort"
                  className="inline"
                  height={30}
                />
              </FocusGroup>
              <FocusGroup dir={FocusDirection.Row}>
                {range(1, 8).map( i =>
                  <FocusableBox
                    key={i}
                    focusKey={`${i}`}
                    label={`Episode ${i}`}
                    className="inline"
                  />
                )}
              </FocusGroup>
            </FocusGroup>
          </div>
          <hr/>
          <div>
            <h2>Default key + reset after blur</h2>
            <FocusGroup dir={FocusDirection.Column} defaultKey="b" resetFocusState={true}>
              <FocusableBox
                focusKey="a"
                label="Focusable a"
                className="inline"
              />
              <FocusableBox
                focusKey="b"
                label="Focusable b"
                className="inline"
              />
              <FocusableBox
                focusKey="c"
                label="Focusable c"
                className="inline"
              />
            </FocusGroup>
          </div>
          <hr/>
          <FocusableBox focusKey="f2" label="Focusable 2" onAction={() => console.log('f2')} />
          <FocusableBox focusKey="f3" label="Focusable 3" onAction={() => console.log('f3')} />
          <FocusableBox focusKey="f4" label="Focusable 4" onAction={() => console.log('f4')} />
        </FocusGroup>
      </div>
    )
  }
}

export default App
