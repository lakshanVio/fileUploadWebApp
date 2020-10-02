import React, { Component } from "react";

export default class SignIn extends Component {
  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <div className="container">
          <form action="/action_page.php">
            <div className="row raw-margin">
              <h3 style={{ textAlign: "center" }}> Sign-In</h3>
            </div>
            <div className="row raw-margin">
              <p style={{ textAlign: "center" }}>
                To upload files first Sign-In with your google account
              </p>
            </div>
            <div className="row raw-margin">
              <div className="col">
                <a href="#" className="google btn">
                  <i className="fa fa-google fa-fw"></i> Sign-In with Google
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
