import React, { Component } from 'react'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'

import 'bootstrap/dist/css/bootstrap.min.css'

class ListManagers extends Component {
    state = {
        managers: []
    }

    getManagers = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/admin/managers`).then(({ data }) => data)
    )

    verifyManager = (_id) => {
        axios.put(`${process.env.REACT_APP_API_URL}/admin/verify-manager/${_id}`).then(({ status }) => {
            if (status === 200) {
                VanillaToasts.create({
                    title: 'Yönetici aktif edildi',
                    type: 'success',
                    positionClass: 'topRight',
                    timeout: 3 * 1000
                })

                this.getManagers().then((managers) => {
                    this.setState({ managers })
                })
            }
        })
    }

    unverifyManager = (_id) => {
        axios.put(`${process.env.REACT_APP_API_URL}/admin/unverify-manager/${_id}`).then(({ status }) => {
            if (status === 200) {
                VanillaToasts.create({
                    title: 'Yönetici inaktif edildi',
                    type: 'success',
                    positionClass: 'topRight',
                    timeout: 3 * 1000
                })

                this.getManagers().then((managers) => {
                    this.setState({ managers })
                })
            }
        })
    }

    deleteManager = (_id) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/admin/delete-manager/${_id}`).then(({ status }) => {
            if (status === 200) {
                VanillaToasts.create({
                    title: 'Yönetici silindi',
                    type: 'success',
                    positionClass: 'topRight',
                    timeout: 3 * 1000
                })

                this.getManagers().then((managers) => {
                    this.setState({ managers })
                })
            }
        })
    }

    UNSAFE_componentWillMount() {
        this.getManagers().then((managers) => {
            this.setState({ managers })
        })
    }

    render() {
        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    {
                        this.state.managers.map(({ _id, email, nameSurname, phoneNumber, verified }) => (
                            <div className='col-md-12 border-bottom p-2'>
                                <p><b>E-Posta:</b>{` ${email}`}</p>
                                <p><b>Isim:</b>{` ${nameSurname}`}</p>
                                <p><b>Telefon:</b>{` ${phoneNumber}`}</p>
                                <p><b>Durum:</b>{` ${verified ? 'Aktif' : 'Inaktif'}`}</p>
                                <div className='d-flex justify-content-end'>
                                    {
                                        verified ? (
                                            <span className='btn btn-success' onClick={() => this.unverifyManager(_id)}>Inaktif Et</span>
                                        ) : (
                                                <span className='btn btn-success' onClick={() => this.verifyManager(_id)}>Aktif Et</span>
                                            )
                                    }
                                    <span className='btn btn-danger ml-2' onClick={() => this.deleteManager(_id)}>Sil</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default ListManagers