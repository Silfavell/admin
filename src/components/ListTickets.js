import React, { Component } from 'react'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'

class ListTickets extends Component {
    state = {
        tickets: []
    }

    getTickets = () => (
        axios.get(`${process.env.REACT_APP_API_URL}/admin/tickets`).then(({ data }) => data)
    )

    UNSAFE_componentWillMount() {
        this.getTickets().then((tickets) => {
            this.setState({ tickets })
        })
    }

    render() {
        return (
            <div className='p-3 border'>
                <div className='col-md-12'>
                    {
                        this.state.tickets.map((ticket) => (
                            <div className='col-md-12 border-bottom'>
                                <p>{`E-Mail: ${ticket.email}`}</p>
                                <p>{`İsim: ${ticket.name}`}</p>
                                <p>{`Soyisim: ${ticket.surname}`}</p>
                                <p>{`Mesaj: ${ticket.message}`}</p>
                                <p><a href={`mailto:${ticket.email}`}>Yanıtla</a></p>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default ListTickets