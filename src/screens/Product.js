import React from 'react'

class Product extends React.Component {
    render() {
        const {
            product: {
                name,
                price,
                quantity,
                image
            }
        } = this.props

        const url = `${process.env.REACT_APP_API_URL}/assets/products/${image}-0.webp`


        return (
            <div className='col-md-12 row m-4 border-bottom bg-light'>
                <div className='col-md-10 d-flex flex-column justify-content-between align-items-center py-2'>
                    <div>{'Ürün: ' + name}</div>
                    <div>{'Fiyat: ' + price}</div>
                    <div>{'Adet: ' + quantity}</div>
                </div>

                <div className='col-md-2'>
                    <img
                        src={url}
                        alt=''
                        onError={(event) => {
                            event.target.src = process.env.PUBLIC_URL + '/empty-image.webp'
                        }}
                        className='w-100 py-1' />
                </div>
            </div>
        )
    }
}

export default Product