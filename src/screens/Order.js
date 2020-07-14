import React from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

const cookies = new Cookies()

class Order extends React.Component {

    onDetailsClick = () => {
        window.history.pushState({}, null, `/details/${this.props.order._id}`)
        window.location.reload()
    }

    onConfirmClick = () => {
        const trackingNumber = prompt('Takip Numarası')

        if (trackingNumber) {
            if (trackingNumber.length === 12) {
                axios.put(`${process.env.REACT_APP_API_URL}/manager/orders/confirm/${this.props.order._id}`,
                    { trackingNumber },
                    { headers: { Authorization: cookies.get('token') } })
                    .then(({ status }) => {
                        if (status === 200) {
                            alert('Sipariş onaylanmıştır.')
                        }
                    }).catch((reason) => {
                        alert(reason.message)
                    })
            } else {
                alert('Kargo takip numarası hatalı')
            }
        }
    }

    onCancelClick = () => {
        const cancellationReason = prompt('Iptal Sebebi')

        if (cancellationReason) {
            if (cancellationReason.length > 10) {
                axios.put(`${process.env.REACT_APP_API_URL}/manager/orders/cancel/${this.props.order._id}`,
                    { cancellationReason },
                    { headers: { Authorization: cookies.get('token') } })
                    .then(({ status }) => {
                        if (status === 200) {
                            alert('Sipariş Iptal Edilmiştir.')
                        }
                    }).catch((reason) => {
                        alert(reason.message)
                    })
            } else {
                alert('Lütfen 10 karaterden uzun iptal sebebi giriniz.')
            }
        }
    }

    render() {
        const {
            order: {
                customer,
                date,
                address,
                paidPrice
            }
        } = this.props

        return (
            <div className='col-md-12 row m-4 border-bottom'>
                <div className='col-md-10 d-flex flex-column justify-content-between align-items-center py-2'>
                    <div>Alıcı: {customer}</div>
                    <div>Tarih: {new Date(date).toLocaleDateString('tr', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    <div>Adres: {address}</div>
                    <div>Toplam Ücret: {paidPrice.toFixed(2).replace('.', ',')}</div>
                </div>

                <div className='col-md-2'>

                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <button
                                type='text'
                                onClick={this.onDetailsClick}
                                className='btn btn-primary btn-block'>
                                Detaya git
                            </button>
                        </div>
                    </div>

                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <button
                                type='text'
                                onClick={this.onConfirmClick}
                                className='btn btn-primary btn-block'>
                                Onayla
                            </button>
                        </div>
                    </div>

                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <button
                                type='text'
                                onClick={this.onCancelClick}
                                className='btn btn-primary btn-block'>
                                Iptal Et
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Order