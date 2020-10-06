import React, { Component } from "react";
import axios from "axios";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.handleClickSignIn = this.handleClickSignIn.bind(this);
  }

  handleClickSignIn(event) {
    event.preventDefault();
    axios
      .get("http://localhost:7000/getauthorizationurl")
      .then(function (data) {
        window.location = data.data.authurl;
      })
      .catch(function (error) {
        alert(error);
      });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <div className="container">
          <form>
            <div className="row raw-margin">
              <h3 style={{ textAlign: "center" }}> Sign-In</h3>
            </div>
            <div className="row raw-margin">
              <p style={{ textAlign: "center" }}>
                To upload files first Sign-In with your google account.
              </p>
            </div>
            <div className="row raw-margin">
              <div className="col">
                <button className="google btn" onClick={this.handleClickSignIn}>
                  <i className="fa fa-google fa-fw"></i> Sign-In with Google
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
