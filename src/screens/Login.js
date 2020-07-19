import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

import 'bootstrap/dist/css/bootstrap.min.css'

const cookies = new Cookies()

class Login extends Component {

    state = {
        token: ''
    }

    onChange = (event) => {
        this.setState({ token: event.target.value })
    }

    onLoginClick = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/admin/test`, { headers: { Authorization: this.state.token } }).then(({ status, data }) => {
            if (status === 200) {
                cookies.set('admin-token', this.state.token)
                this.props.history.push('/')
            }
        }).catch(() => {
            alert('Hatalı token')
        })
    }

    render() {
        const {
            token
        } = this.state

        return (
            <div className='col-md-12 py-4'>
                <div className='p-3 border'>
                    <div className='form-group'>
                        <div className='col-md-12'>
                            <label htmlFor='token' className='text-black'>Token <span className='text-danger'>*</span></label>
                            <input
                                type='text'
                                className='form-control'
                                id='token'
                                name='token'
                                placeholder='Token'
                                onChange={this.onChange}
                                value={token} />
                        </div>
                    </div>

                    <div className='form-group'>
                        <div className='col-md-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onLoginClick}>Giriş Yap</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login