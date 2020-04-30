import React, { PureComponent } from 'react';
import './style.scss';
import axios from 'axios';
import Upload from '../assets/images/upload.png';

interface UploadState {
    recentImage: any;
    caption: string;
    uploadedImageUrl: string;
    uploadedImage: any;
};

class UploadPage extends PureComponent<{}, UploadState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            recentImage: {},
            caption: '',
            uploadedImageUrl: '',
            uploadedImage: {},
        };
    }

    componentDidMount = () => {
        this.fetchRecent();
    }

    fetchRecent = () => {
        axios.get('http://localhost:9890/recent')
            .then((response) => {
                this.setState({ recentImage: response.data.image });
            })
            .catch(err => alert('Error: ' + err));
    }

    uploadImage = () => {
        if (!this.state.caption.trim() || !this.state.uploadedImage.name) {
            return alert('Caption or file is missing');
        }

        let formData = new FormData();
        formData.append('caption', this.state.caption);
        formData.append('file', this.state.uploadedImage);

        axios.post('http://localhost:9890/', formData)
            .then((response) => {
                response.data.success ? alert('File successfully uploaded') : alert('File already exists');
                this.fetchRecent();
            })
            .catch(err => alert('Error: ' + err));
    }

    render() {
        return (
            <div className="UploadPage">
                <div className="Recent">
                    <p className="Recent__Title">Recently uploaded file</p>
                    <div className="ImageBox">
                        <div className="CaptionBox">
                            <p className="ImageBox__Caption">Caption</p>
                            <span className="ImageBox__CaptionValue">{this.state.recentImage.caption}</span>
                        </div>

                        <img
                            src={'http://localhost:9890/image/' + this.state.recentImage.filename}
                            alt="recent-image"
                            className="Recent__Image"
                        />
                    </div>
                </div>

                <div className="Upload">
                    <p className="Upload__Title">Upload File</p>
                    <div className="Upload__InputSection">
                        <input
                            type="text"
                            className="Upload__Caption"
                            placeholder="Enter caption..."
                            onChange={event => this.setState({ caption: event.target.value })}
                            value={this.state.caption}
                        />
                        <input
                            type="file"
                            className="Upload__Input"
                            onChange={(event: any) => {
                                this.setState({
                                    uploadedImageUrl: URL.createObjectURL(event.target.files[0]),
                                    uploadedImage: event.target.files[0],
                                })
                            }}
                        />
                    </div>

                    <img
                        src={!this.state.uploadedImageUrl.trim() ? Upload : this.state.uploadedImageUrl}
                        alt="upload-image"
                        className="Upload__Image"
                    />

                    <button onClick={this.uploadImage} className="Upload__Button">Upload</button>
                </div>
            </div>
        );
    }
}

export default UploadPage;