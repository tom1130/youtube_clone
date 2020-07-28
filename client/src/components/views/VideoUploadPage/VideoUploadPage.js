import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone'
import Axios from 'axios';
import { useSelector } from 'react-redux';


const { Title } = Typography;
const { TextArea } = Input;


const Private = [
	{ value: 0, label: 'Private' },
	{ value: 1, label: 'Public' }
]

const Catogory = [
	{ value: 0, label: "Film & Animation" },
	{ value: 0, label: "Autos & Vehicles" },
	{ value: 0, label: "Music" },
	{ value: 0, label: "Pets & Animals" },
	{ value: 0, label: "Sports" },
]

function VideoUploadPage(props) {

	const user = useSelector(state => state.user);
	const [title, setTitle] = useState("");
	const [Description, setDescription] = useState("");
	const [Privacy, setPrivacy] = useState(0)
	const [Categories, setCategories] = useState("Film & Animation")
	const [FilePath, setFilePath] = useState('')
	const [Duration, setDuration] = useState('')
	const [ThumbnailPath, setThumbnailPath] = useState('')

	const handleChangeTitle = (event) => {
		setTitle(event.currentTarget.value)
	}

	const handleChangeDecsription = (event) => {

		setDescription(event.currentTarget.value)
	}

	const handleChangeOne = (event) => {
		setPrivacy(event.currentTarget.value)
	}

	const handleChangeTwo = (event) => {
		setCategories(event.currentTarget.value)
	}

	const onDrop = (files) => {
		let formData = new FormData;
		const config = {
			header: { 'content-type': 'multipart/form-data' }
		}
		formData.append('file', files[0])

		Axios.post('/api/video/uploadfiles', formData, config)
			.then(response => {
				if (response.data.success) {
					let variable = {
						url: response.data.url,
						fileName: response.data.fileName
					}
					setFilePath(response.data.url)
					Axios.post('/api/video/thumbnail', variable)
						.then(response => {
							if (response.data.success) {
								setDuration(response.data.fileDuration)
								setThumbnailPath(response.data.url)
							} else {
								alert('섬네일 생성 실패 ')
							}
						})
				} else {
					alert('비디오 업로드 실패')
				}
			})
	}

	const onSubmit = (event) => {
		event.preventDefault();

		const variables = {
			writer: user.userData._id,
			title: title,
			description: Description,
			privacy: Privacy,
			filePath: FilePath,
			category: Categories,
			duration: Duration,
			thumbnail: ThumbnailPath,
		}

		Axios.post('/api/video/uploadVideo', variables)
			.then(response => {
				if (response.data.success) {
					message.success('업로드 성공!!')

					setTimeout(() => {
						props.history.push('/')
					}, 3000)

				} else {
					alert('비디오 업로드에 실패')
				}
			})
	}

	return (
		<div style={{ maxWidth: '700px', margin: '2rem auto' }}>
			<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
				<Title level={2} > Upload Video</Title>
			</div>

			<Form onSubmit={onSubmit}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Dropzone
						onDrop={onDrop}
						multiple={false}
						maxSize={1000000000}>
						{({ getRootProps, getInputProps }) => (
							<div style={{
								width: '300px', height: '240px', border: '1px solid lightgray',
								display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}
								{...getRootProps()}
							>
								<input {...getInputProps()} />
								<Icon type="plus" style={{ fontSize: '3rem' }} />

							</div>
						)}
					</Dropzone>
					{ThumbnailPath &&
						<div>
							<img src={`http://localhost:5000/${ThumbnailPath}`} alt='thumbnail' />
						</div>
					}
				</div>

				<br /><br />
				<label>Title</label>
				<Input
					onChange={handleChangeTitle}
					value={title}
				/>
				<br /><br />
				<label>Description</label>
				<TextArea
					onChange={handleChangeDecsription}
					value={Description}
				/>
				<br /><br />

				<select onChange={handleChangeOne}>
					{Private.map((item, index) => (
						<option key={index} value={item.value}>{item.label}</option>
					))}
				</select>
				<br /><br />

				<select onChange={handleChangeTwo}>
					{Catogory.map((item, index) => (
						<option key={index} value={item.label}>{item.label}</option>
					))}
				</select>
				<br /><br />

				<Button onClick={onSubmit}>
					Submit
            	</Button>

			</Form>
		</div>
	)
}

export default VideoUploadPage
