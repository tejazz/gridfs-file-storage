import React, { PureComponent } from 'react';
import './style.scss';
import axios from 'axios';

interface ListState {
    imageList: any[];
};

class ListPage extends PureComponent<{}, ListState> {
    constructor(props: any) {
        super(props);

        this.state = {
            imageList: [],
        };
    }

    componentDidMount = () => {
        axios.get('http://localhost:9890/')
            .then(response => {
                this.setState({ imageList: response.data.images });
            })
            .catch(err => alert(err));
    }

    deleteFile = (id: any) => {
        axios.get('http://localhost:9890/delete/' + id) 
            .then((response) => {
                if (response.data.success) {
                    alert('File with ID: ' + id + ' has been deleted');
                    this.setState({ imageList: this.state.imageList.filter(el => el._id !== id)});
                }
            })
            .catch(err => alert(err));
    }

    render() {
        return (
            <div className="ListPage">
                <p className="ListPage__Title">List of Files/Images</p>

                <div className="ListImageContainer">
                    {this.state.imageList.map((file) => (
                        <div className="ListImage">
                            <p className="ListImage__Caption">{file.caption}</p>
                            <p className="ListImage__Date">{file.createdAt}</p>
                            <img
                                src={'http://localhost:9890/image/' + file.filename}
                                alt="list-image"
                                className="ListImage__Image"
                            />

                            <button className="ListImage__Delete" onClick={() => this.deleteFile(file._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ListPage;