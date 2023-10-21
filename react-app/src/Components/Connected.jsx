import React from 'react'

const Connected = ({account}) => {
  return (
    <div className="connected-container">
      <h1 className="connected-header">You are connected to Metamask</h1>
                 <p className="conncted-account">Metamask account : {account}</p>
                 <button className="login-button">Login Metamask</button>
             </div>
  )
}

export default Connected;