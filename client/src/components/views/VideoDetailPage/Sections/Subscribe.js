import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe({ userTo, userFrom }) {

    const [subscribeNumber, setsubscribeNumber] = useState(0)
    const [subscribed, setsubscribed] = useState(false)

    useEffect(() => {

        let variable = { userTo: userTo }


        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setsubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다')
                }
            })

        let subscribedVariable = { userTo: userTo, userFrom: userFrom }

        Axios.post('/api/subscribe/subscribed/', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setsubscribed(response.data.subscribed)
                } else {
                    alert('구독 정보를 받아오지 못했습니다')
                }
            })
    }, [])

    const onSubscribe = () => {

        let subscribedVariable = {
            userTo: userTo,
            userFrom: userFrom
        }
        //이미 구독중
        if (subscribed) {

            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if (response.data.success) {
                        setsubscribeNumber(subscribeNumber - 1)
                        setsubscribed(!subscribed)
                    } else {
                        alert('구독 취소 하는데 실패하였습니다')
                    }
                })
        } else {
            Axios.post('/api/subscribe/Subscribe', subscribedVariable)
                .then(response => {
                    if (response.data.success) {
                        setsubscribeNumber(subscribeNumber + 1)
                        setsubscribed(!subscribed)
                    } else {
                        alert('구독하는데 실패하였습니다')
                    }
                })
        }
    }
    return (
        <div>
            <button
                style={{
                    backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {subscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
