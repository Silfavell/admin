import React from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

import 'bootstrap/dist/css/bootstrap.min.css'

const cookies = new Cookies()

class Login extends React.Component {

    state = {
        phoneNumber: '905468133191',
        password: '1234'
    }

    onPhoneChange = (event) => {
        this.setState({ phoneNumber: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    onLoginClick = () => {
        axios.post('http://127.0.0.1:3000/login-manager', {
            phoneNumber: this.state.phoneNumber,
            password: this.state.password
        }).then((response) => {
            if (response.data.token) {
                cookies.set('token', response.data.token)
                this.props.history.push('/')
            } else {
                alert('Şifre veya telefon numarası yanlış!')
            }
        }).catch((err) => {
            console.log('err', err)
            alert('Beklenmedik bir hata oluştu!')
        })
    }

    onRegisterClick = () => {
        this.props.history.push('/register')
    }

    render() {
        return (
            <div style={{ height: '100vh' }}>
                <div className='col-md-12 h-100 d-flex align-items-center justify-content-center'>
                    <div className='m-4 p-4 w-25 border'>

                        <div className='form-group row'>
                            <div className='col-md-12'>
                                <input
                                    type='text'
                                    placeholder='Telefon Numarası'
                                    onChange={this.onPhoneChange}
                                    value={this.state.phoneNumber}
                                    className='form-control'
                                />
                            </div>
                        </div>

                        <div className='form-group row'>
                            <div className='col-md-12'>
                                <input
                                    type='password'
                                    placeholder='Şifre'
                                    onChange={this.onPasswordChange}
                                    value={this.state.password}
                                    className='form-control' />
                            </div>
                        </div>

                        <div className='form-group row'>

                            <div className='col-md-6'>
                                <button
                                    type='text'
                                    onClick={this.onLoginClick}
                                    className='btn btn-primary btn-block'>
                                    Giriş Yap
                                </button>
                            </div>

                            <div className='col-md-6'>
                                <button
                                    type='text'
                                    onClick={this.onRegisterClick}
                                    className='btn btn-primary btn-block'>
                                    Kayıt Ol
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login