import React, {Component} from "react";
import {getToken} from "../../api/authenticationService";
import {Button} from "reactstrap";


export class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        };
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    render() {
        return <div>
            <input
                style={{display: 'none'}}
                type="file"
                ref={fileInput => this.fileInput = fileInput}
                onChange={this.fileSelectedHandler}/>
            <Button
                size="sm"
                style={{marginTop: '5px'}} onClick={() => this.fileInput.click()}>Выбрать фото</Button>
            {this.state.selectedFile === null ? ("") : (
                <Button
                    size="sm"
                    style={{marginTop: '5px'}} onClick={this.fileUploadHandler}>Загрузить</Button>)
            }

        </div>
    }

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('file', this.state.selectedFile, this.state.selectedFile.name);

        fetch('/player/image/' + this.props.playerUuid, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getToken()
            },
            body: fd
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                window.location.reload();
            });

    }
}