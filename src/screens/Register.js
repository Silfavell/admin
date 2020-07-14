import React from 'react'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'

class Register extends React.Component {

    state = {
        phoneNumber: '905468133192',
        nameSurname: 'Muhammet İpek',
        password: '1234',
        email: 'muhammetipek3457@hotmail.com'
    }

    onPhoneChange = (event) => {
        this.setState({ phoneNumber: event.target.value })
    }

    onNameSurnameChange = (event) => {
        this.setState({ nameSurname: event.target.value })
    }

    onEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    onBackToLoginClick = () => {
        this.props.history.push('/login')
    }

    onRegisterClick = () => {
        axios.post('http://127.0.0.1:3000/send-activation-code', {
            phoneNumber: this.state.phoneNumber,
            activationCodeType: 2 // REGISTER MANAGER
        }).then(({ status }) => {
            if (status === 202) {
                alert('ok')
                this.props.history.push({
                    pathname: '/activation',
                    state: this.state
                })
            }
        }).catch((err) => {
            console.log('err', err.response.data)
        })
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
                                    type='text'
                                    placeholder='Adı Soyadı'
                                    onChange={this.onNameSurnameChange}
                                    value={this.state.nameSurname}
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
                            <div className='col-md-12'>
                                <input
                                    type='text'
                                    placeholder='E-Mail'
                                    onChange={this.onEmailChange}
                                    value={this.state.email}
                                    className='form-control' />
                            </div>
                        </div>

                        <div className='form-group row'>

                            <div className='col-md-6'>
                                <button
                                    type='text'
                                    onClick={this.onBackToLoginClick}
                                    className='btn btn-primary btn-block'>
                                    Giriş'e Dön
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

export default Register