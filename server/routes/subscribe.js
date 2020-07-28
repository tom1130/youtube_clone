const express = require('express')
const router = express.Router()

const { subscriber } = require('../models/Subscriber');
const { response } = require('express');

router.post('/subscribeNumber', (req, res) => {

    subscriber.find({ 'userTo': req.body.userTo })
        .exec((err, subscribe) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
        })
});

router.post('/subscribed', (req, res) => {

    subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
        .exec((err, subscribe) => {
            if (err) return res.status(400).send(err)
            let result = false;
            if (subscribe.length != 0) {
                result = true
            }
            res.status(200).json({ success: true, subscribed: result })
        })
})

router.post('/unSubscribe', (req, res) => {

    subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, doc })
        })
})

router.post('/Subscribe', (req, res) => {

    const subscribe = new subscriber(req.body)

    subscribe.save((err, doc) => {
        if (err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true, doc })

    })
})

module.exports = router;