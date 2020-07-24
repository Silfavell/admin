import React, { Component } from 'react'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import './save-product.scss'

class DeleteProductComponent extends Component {

    state = {
        productsWithCategories: [],
        deleteId: ''
    }

    getProductsWithCategories = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/products-with-categories`).then(({ data, status }) => data)
    )

    UNSAFE_componentWillMount() {
        this.getProductsWithCategories().then((productsWithCategories) => {
            this.setState({ productsWithCategories })
        })
    }

    onChange = (event) => {
        const { value } = event.target

        this.setState({ deleteId: value })
    }

    onDeleteClick = () => {
        if (this.state.deleteId.length > 0) {
            if (window.confirm(`Seçili ürünü silmek istediğinize emin misiniz?`)) {

                axios.delete(`${process.env.REACT_APP_API_URL}/admin/product/${this.state.deleteId}`).then(({ status }) => {
                    if (status === 200) {
                        alert('Ürün silindi')

                        this.setState({ deleteId: '' })
                    }
                })

            }
        } else {
            alert('Lütfen silmek istediğiniz ürünü seçiniz')
        }
    }

    render() {
        const {
            deleteId,
            productsWithCategories
        } = this.state

        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    <div className='form-group row'>
                        <div className='col-md-12'>
                            <label htmlFor='deleteId' className='text-black'>Silmek istediğiniz ürünü seçiniz  <span className='text-danger'>*</span></label>

                            <div className='d-flex'>

                                <div style={{ flex: 1 }}>
                                    <select
                                        type='text'
                                        className='form-control'
                                        id='deleteId'
                                        name='deleteId'
                                        onChange={this.onChange}
                                        value={deleteId}>
                                        <option selected unselectable value={null}>Silmek istediğiniz ürünü seçiniz</option>
                                        {
                                            productsWithCategories.map((category) => {
                                                return category.subCategories.map((subCategory) => {
                                                    return subCategory.products.map((product) => (
                                                        <option value={product._id}>{product.name}</option>
                                                    ))
                                                })
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='form-group row mt-4'>
                        <div className='col-lg-12'>
                            <button className='btn btn-primary btn-block' onClick={this.onDeleteClick}>Ürünü Sil</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default DeleteProductComponent