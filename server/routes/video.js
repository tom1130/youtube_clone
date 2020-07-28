const express = require('express')
const router = express.Router();
const { Video } = require('../models/Video')
const { auth } = require('../middleware/auth')
const multer = require('multer')
const { subscriber } = require('../models/Subscriber')

var ffmpeg = require('fluent-ffmpeg');
const { response } = require('express');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false)
        } else {
            cb(null, true)
        }
    }
})


const upload = multer({ storage: storage }).single('file');

router.post('/uploadfiles', (req, res) => {

    upload(req, res, err => {
        if (err) return res.json({ success: false, err })
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/thumbnail', (req, res) => {

    // 썸네일 생성 및 비디오 런이 타임 가져오기
    let filePath = '';
    let fileDuration = '';

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        fileDuration = metadata.format.duration
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            filePath = 'uploads/thumbnails/' + filenames[0]
        })
        .on('end', function () {
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
        })
        .on('error', function (err) {
            return res.json({ success: false, err })
        })
        .screenshot({
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            filename: 'thumbnail-%b.png'
        })
})

router.post('/uploadVideo', (req, res) => {
    //비디오 정보 저장
    const video = new Video(req.body)

    video.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

router.get('/getVideos', (req, res) => {
    //비디오를 가져와서 클라이언트에 보냄

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, videos })
        })

})

router.post('/getVideoDetail', (req, res) => {

    Video.findOne({ "_id": req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
        })
})

router.post('/getSubscriptionVideos', (req, res) => {

    //자신의 아이디를 가지고 구독하는 사람들을 찾기
    subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err)

            let subscribedUser = []
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo)
            })
            //찾은 사람들의 비디오를 가지고 오기
            Video.find({ writer: { $in: subscribedUser } })
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err)
                    res.status(200).json({ success: true, videos })
                })
        })

})

module.exports = router;