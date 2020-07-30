import React, { Component } from 'react'
import Cookies from 'universal-cookie'

import SaveCategoryComponent from '../components/SaveCategoryComponent'
import UpdateCategoryComponent from '../components/UpdateCategoryComponent'
import DeleteCategoryComponent from '../components/DeleteCategoryComponent'

import SaveSubCategoryComponent from '../components/SaveSubCategoryComponent'
import UpdateSubCategoryComponent from '../components/UpdateSubCategoryComponent'
import DeleteSubCategoryComponent from '../components/DeleteSubCategoryComponent'

import SaveProductComponent from '../components/SaveProductComponent'
import UpdateProductComponent from '../components/UpdateProductComponent'
import DeleteProductComponent from '../components/DeleteProductComponent'

import SaveTypeComponent from '../components/SaveTypeComponent'
import UpdateTypeComponent from '../components/UpdateTypeComponent'

const cookies = new Cookies()

class Home extends Component {
    state = {
        status: 6
    }

    getForm = (status) => {
        switch (status) {
            case 0: return <SaveCategoryComponent />
            case 1: return <UpdateCategoryComponent />
            case 2: return <DeleteCategoryComponent />
            case 3: return <SaveSubCategoryComponent />
            case 4: return <UpdateSubCategoryComponent />
            case 5: return <DeleteSubCategoryComponent />
            case 6: return <SaveProductComponent />
            case 7: return <UpdateProductComponent />
            case 8: return <DeleteProductComponent />
            case 9: return <SaveTypeComponent />
            case 10: return <UpdateTypeComponent />
            default: return null
        }
    }

    onBtnClick = (event) => {
        switch (event.target.name) {
            case 'save-category': this.setState({ status: 0 }); break;
            case 'update-category': this.setState({ status: 1 }); break;
            case 'delete-category': this.setState({ status: 2 }); break;
            case 'save-sub-category': this.setState({ status: 3 }); break;
            case 'update-sub-category': this.setState({ status: 4 }); break;
            case 'delete-sub-category': this.setState({ status: 5 }); break;
            case 'save-product': this.setState({ status: 6 }); break;
            case 'update-product': this.setState({ status: 7 }); break;
            case 'delete-product': this.setState({ status: 8 }); break;
            case 'save-type': this.setState({ status: 9 }); break;
            case 'update-type': this.setState({ status: 10 }); break;
            default: break;
        }
    }

    UNSAFE_componentWillMount() {
        if (!cookies.get('admin-token')) {
            this.props.history.push('/login')
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
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'delete-product'} onClick={this.onBtnClick}>Ürün Sil</button>
                            </div>

                            <div className='form-group my-4'>
                                <h3>Ürün Tipi</h3>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'save-type'} onClick={this.onBtnClick}>Ürün Tipi Ekle</button>
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-primary btn-block' name={'update-type'} onClick={this.onBtnClick}>Ürün Tipi Güncelle</button>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-9'>
                        {
                            this.getForm(this.state.status)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
