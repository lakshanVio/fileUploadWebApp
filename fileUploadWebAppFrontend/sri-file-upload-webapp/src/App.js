import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import SignIn from "./components/SignIn";
import Upload from "./components/Upload";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <div className="jumbotron text-center back-image" style={{ marginBottom: 0}}>
            <h1 style={{color: "white"}}>Sri File Storage</h1>
            <p style={{color: "white"}}>Upload Your File Here!</p>
          </div>
          <div
            style={{ height: "27px", backgroundColor: "white", width: "100%" }}
          ></div>
          <Route path="/" exact component={SignIn} />
          <Route path="/upload" exact component={Upload} />
        </div>
      </Router>
    );
  }
}
export default App;
