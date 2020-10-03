import React, { Component } from "react";
import queryString from "query-string";
import axios from "axios";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      scope: "",
      accessToken: "",
    };
    this.requestAccessToken = this.requestAccessToken.bind(this);
    this.requestAccessDrive = this.requestAccessDrive.bind(this);
  }

  componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    this.setState(
      {
        code: params.code,
        scope: params.scope,
      },
      () => this.requestAccessToken()
    );
  }

  requestAccessToken() {
    const requestBody = { code: this.state.code };
    axios
      .post("http://localhost:7000/getaccesstoken", requestBody)
      .then((data) => {
        if (data != null) {
          console.log("data:", data);
          this.setState(
            {
              accessToken: data.data,
            },
            () => this.requestAccessDrive()
          );
          console.log("outside", data);
        } else {
          alert("access token not found");
        }
      })
      .catch(function (error) {
        alert(error);
      });
  }

  requestAccessDrive() {
    const requestBody = { token: this.state.accessToken };
    axios
      .post("http://localhost:7000/accessdrive", requestBody)
      .then(function (data) {
        console.log(data);
      });
  }

  render() {
    return (
      <div>
        <p>Upload Files</p>
      </div>
    );
  }
}
