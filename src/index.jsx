import React from "react";
import { render } from "react-dom";
import './style/index.scss';

function Popup() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>This is a very simple example</p>
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
