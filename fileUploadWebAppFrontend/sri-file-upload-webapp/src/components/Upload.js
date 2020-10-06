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
      file: null,
    };
    this.requestAccessToken = this.requestAccessToken.bind(this);
    this.requestAccessDrive = this.requestAccessDrive.bind(this);
    this.handleClickUploadFiles = this.handleClickUploadFiles.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
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

  componentDidUpdate(){
    if(this.state.accessToken != null){
      this.requestAccessDrive();
    }
  }

  requestAccessToken() {
    const requestBody = { code: this.state.code };
    axios
      .post("http://localhost:7000/getaccesstoken", requestBody)
      .then((data) => {
        if (data != null) {
          this.setState(
            {
              accessToken: data.data,
            },
            () => this.requestAccessDrive()
          );
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

  onFileSelect(event) {
    this.setState(
      {
        file: event.target.files[0],
      },
      () => console.log("on file select", this.state.file)
    );
  }

  handleClickUploadFiles(event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("file", this.state.file, this.state.file.name);

    formData.append("token", JSON.stringify(this.state.accessToken));

    if (this.state.file != null && this.state.accessToken != null) {
      axios({
        method: "post",
        url: "http://localhost:7000/uploadfile",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function () {
          alert("File upload sucessfull");
        })
        .catch(function (error) {
          alert("File upload unsucessfull", error);
        });
    }
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
            <h5 style={{ margin: "60px 0 0 1rem" }}>Your Goole Drive Files</h5>
          </div>
          <div className="col-lg-4">
            <input
              className="google btn"
              style={{ width: "85%", margin: "20px 15px 10px 15px" }}
              type="file"
              onChange={this.onFileSelect}
            />
            <button
              className="google btn"
              style={{ width: "85%", margin: "0 15px 0 15px" }}
              onClick={this.handleClickUploadFiles}
            >
              <i className="fa fa-google fa-fw"></i> Upload Files To Google
              Drive
            </button>
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
