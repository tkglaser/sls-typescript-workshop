import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Api } from "./api";

class App extends Component {
  state = { greeting: "" };

  async componentDidMount() {
    const api = new Api();
    const response = await api.hello("Test");
    this.setState({ greeting: response.message });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{this.state.greeting}</p>
        </header>
      </div>
    );
  }
}

export default App;
