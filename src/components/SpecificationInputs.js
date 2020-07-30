import React from 'react'

class SpecificationInputs extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}

        if (this.props.specifications) {
            this.state = this.props.specifications.reduce((prevVal, curVal) => (
                { ...prevVal, [curVal.name]: curVal.value }
            ), {})
        }
    }

    onChange = (event) => {
        const { name, value } = event.target

        this.setState({ [name]: value })
    }

    render() {
        return (
            <>
                {
                    this.props.selectedType.specifications.map((specification) => (
                        <div className='form-group row'>
                            <div className='col-md-12'>
                                <label htmlFor={specification} className='text-black'>{`${specification} (Opsiyonel)`}</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id={specification}
                                    name={specification}
                                    onChange={this.onChange}
                                    value={this.state[specification]}
                                    placeholder={`${specification} giriniz`} />
                            </div>
                        </div>
                    ))
                }
            </>
        )
    }
}

export default SpecificationInputs