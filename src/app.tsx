import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`

const App = ({state}: any) => {
  return (
  <Wrapper>
      <p>Accounts Page</p>
      <ul>
          <li>
              <p>Account 1</p>
              <p>Account 2</p>
              <p>Account 3</p>
              <p>Account 4</p>
          </li>
      </ul>
  </Wrapper>);
}

export default App;