import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import VanillaToasts from 'vanillatoasts'

import SaveCategoryComponent from '../pages/SaveCategoryComponent'
import UpdateCategoryComponent from '../pages/UpdateCategoryComponent'
import DeleteCategoryComponent from '../pages/DeleteCategoryComponent'

import SaveSubCategoryComponent from '../pages/SaveSubCategoryComponent'
import UpdateSubCategoryComponent from '../pages/UpdateSubCategoryComponent'
import DeleteSubCategoryComponent from '../pages/DeleteSubCategoryComponent'

import SaveProductComponent from '../pages/SaveProductComponent'
import UpdateProductComponent from '../pages/UpdateProductComponent'
// import DeleteProductComponent from '../pages/DeleteProductComponent'

import SaveTypeComponent from '../pages/SaveTypeComponent'
import UpdateTypeComponent from '../pages/UpdateTypeComponent'

import ListTickets from '../pages/ListTickets'
import ListWaitingComments from '../pages/ListWaitingComments'
import ListManagers from '../pages/ListMangers'

const cookies = new Cookies()

class Home extends Component {
    getForm = () => {
        switch (this.props.location.pathname) {
            case '/save-category': return <SaveCategoryComponent />
            case '/update-category': return <UpdateCategoryComponent />
            case '/delete-category': return <DeleteCategoryComponent />
            case '/save-sub-category': return <SaveSubCategoryComponent />
            case '/update-sub-category': return <UpdateSubCategoryComponent />
            case '/delete-sub-category': return <DeleteSubCategoryComponent />
            case '/save-product': return <SaveProductComponent />
            case '/update-product': return <UpdateProductComponent />
            // case '/delete-product': return <DeleteProductComponent />
            case '/save-type': return <SaveTypeComponent />
            case '/update-type': return <UpdateTypeComponent />

            case '/list-tickets': return <ListTickets />
            case '/list-waiting-messages': return <ListWaitingComments />
            case '/list-managers': return <ListManagers />

            default: return <SaveProductComponent />
        }
    }

    onBtnClick = (event) => {
        this.props.history.push(event.target.name)
    }

    UNSAFE_componentWillMount() {
        if (!cookies.get('admin-token')) {
            this.props.history.push('/login')
        } else {
            axios.get(`${process.env.REACT_APP_API_URL}/admin/test`, { headers: { Authorization: cookies.get('admin-token') } }).then(({ status, data }) => {
                if (status !== 200) {
                    this.props.history.push('/login')
                }
            }).catch(() => {
                VanillaToasts.create({
                    title: 'Hatalı Token',
                    type: 'error',
                    positionClass: 'topRight',
                    timeout: 3 * 1000
                })

                this.props.history.push('/login')
            })
        }
    }

    render() {
        return (
            <div className='col-md-12 py-4'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div className='col-md-12 border'>

                            <div className='form-group my-4'>
                                <h3>Kategori</h3>
                            </div>

                            <div className='form-group'>
                                <button className='btn btn-primary btn-block h-100' name={'save-category'} onClick={this.onBtnClick}>Kategori Ekle</button>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block h-100' name={'update-category'} onClick={this.onBtnClick}>Kategori Güncelle</button>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block h-100' name={'delete-category'} onClick={this.onBtnClick}>Kategori Sil</button>
                            </div>


                            <div className='form-group my-4'>
                                <h3>Alt Kategori</h3>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block h-100' name={'save-sub-category'} onClick={this.onBtnClick}>Alt Kategori Ekle</button>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block h-100' name={'update-sub-category'} onClick={this.onBtnClick}>Alt Kategori Güncelle</button>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block h-100' name={'delete-sub-category'} onClick={this.onBtnClick}>Alt Kategori Sil</button>
                            </div>


                            <div className='form-group my-4'>
                                <h3>Ürün</h3>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'save-product'} onClick={this.onBtnClick}>Ürün Ekle</button>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'update-product'} onClick={this.onBtnClick}>Ürün Güncelle</button>
                            </div>
                            {
                                //  <div className='form-group'>
                                //      <button className='btn btn-primary btn-block' name={'delete-product'} onClick={this.onBtnClick}>Ürün Sil</button>
                                //  </div>
                            }

                            <div className='form-group my-4'>
                                <h3>Ürün Tipi</h3>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'save-type'} onClick={this.onBtnClick}>Ürün Tipi Ekle</button>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'update-type'} onClick={this.onBtnClick}>Ürün Tipi Güncelle</button>
                            </div>

                            <div className='form-group my-4'>
                                <h3>Destek</h3>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'list-tickets'} onClick={this.onBtnClick}>Destek Mesajlarını Listele</button>
                                <button className='btn btn-primary btn-block' name={'list-waiting-messages'} onClick={this.onBtnClick}>Onay Bekleyen Yorumları Listele</button>
                                <button className='btn btn-primary btn-block' name={'list-managers'} onClick={this.onBtnClick}>Yöneticileri Listele</button>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-9'>
                        {
                            this.getForm()
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
