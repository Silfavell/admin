import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'

import 'bootstrap/dist/css/bootstrap.min.css'

class ListWaitingComments extends Component {
    state = {
        comments: []
    }

    getWaitingComments = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/comments/waiting-list`).then(({ data }) => data)
    )

    verifyComment = (_id) => {
        axios.put(`${process.env.REACT_APP_API_URL}/comments/verify-comment/${_id}`).then(({ status }) => {
            VanillaToasts.create({
                title: 'Yorum Onaylandı',
                type: 'success',
                positionClass: 'topRight',
                timeout: 3 * 1000
            })
        })
    }

    deleteComment = (_id) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/comments/delete-comment/${_id}`).then(({ status }) => {
            VanillaToasts.create({
                title: 'Yorum Silindi',
                type: 'success',
                positionClass: 'topRight',
                timeout: 3 * 1000
            })
        })
    }

    UNSAFE_componentWillMount() {
        this.getWaitingComments().then((comments) => {
            this.setState({ comments })
        })
    }

    render() {
        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    {
                        this.state.comments.map(({ _id, title, comment }) => (
                            <div className='col-md-12 border-bottom p-2'>
                                <p><b>Başlık:</b>{` ${title}`}</p>
                                <p><b>Yorum:</b>{` ${comment}`}</p>
                                <div className='d-flex justify-content-end'>
                                    <span className='btn btn-success' onClick={() => this.verifyComment(_id)}>Onayla</span>
                                    <span className='btn btn-danger ml-2' onClick={() => this.deleteComment(_id)}>Sil</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default ListWaitingComments