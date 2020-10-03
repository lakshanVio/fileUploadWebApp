import React, { Component } from "react";
import queryString from "query-string";
import axios from "axios";
import FileView from "./FileView";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      scope: "",
      accessToken: "",
      driveFiles: [],
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
      .then((data) => {
        this.setState({
          driveFiles: data.data,
        });
      });
  }

  render() {
    const files = this.state.driveFiles;
    const fileList = files.map((data, index) => {
      return (
        <FileView
          fileId={data.id}
          fileName={data.name}
          fileType={data.mimeType}
        />
      );
    });
    return (
      <div>
        <div className="row">
          <div className="col-lg-8">
            <h5 style={{ marginLeft: "1rem" }}>Your Goole Drive Files</h5>
          </div>
          <div className="col-lg-4">
            <h5 style={{ marginLeft: "1rem" }}>Your Goole Drive Files</h5>
          </div>
        </div>

        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Type</th>
            </tr>
          </thead>
          <tbody>{fileList}</tbody>
        </table>
      </div>
    );
  }
}
