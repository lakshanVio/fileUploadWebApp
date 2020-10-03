import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"

import SignIn from "./components/SignIn";
import Upload from "./components/Upload";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
        <div className="jumbotron text-center" style={{marginBottom: 0}}>
          <h1>Sri File Storage</h1>
          <p>upload your file here!</p> 
        </div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">
                    Upload Your files
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">
                    View Your files
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <br />
          <Route path="/" exact component={SignIn} />
          <Route path="/upload" exact component={Upload} />
        </div>
      </Router>
    );
  }
}
export default App;
