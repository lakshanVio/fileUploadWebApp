import React, { Component } from "react";

export default class FileView extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.fileName}</td>
        <td>{this.props.fileType}</td>
      </tr>
    );
  }
}
