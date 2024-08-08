import React, { Fragment, useEffect, useState } from 'react'
import { Button, Card, Col, Row, Select } from 'antd'
import { Link, useLocation, useParams } from 'react-router-dom'
import '../../../assets/scss/style.scss'
import { getCheckingResultHTML } from '../../../api/checking_result'

const data = [
    {
        id: 1,
        order: 1,
        value: 'Tôi yêu Trang rất nhiều'
    },
    {
        id: 2,
        order: 2,
        value: 'Trang học giỏi tiếng Anh'
    },
    {
        id: 3,
        order: 3,
        value: 'Trang hay bị xị nhưng cute một cục'
    },
    {
        id: 4,
        order: 4,
        value: 'Trang hâm hâm làm nên thương hiệu'
    },
    {
        id: 5,
        order: 5,
        value: 'Đức xị cho biết mặt'
    }
]

const data2 = [
    {
        id: 1,
        order: 1,
        value: 'Có một con chó màu vàng!'
    },
    {
        id: 2,
        order: 2,
        value: 'Trang học giỏi tiếng Anh'
    },
    {
        id: 3,
        order: 3,
        value: 'Cái mông con corgi hehe :)))'
    },
    {
        id: 4,
        order: 4,
        value: 'Thiếu niên mã túy xuân phong <3'
    },
    {
        id: 5,
        order: 5,
        value: 'Ra ngoài đi choi đi :v'
    },
    {
        id: 6,
        order: 6,
        value: 'Tôi yêu Trang rất nhiều'
    },
    {
        id: 7,
        order: 7,
        value: 'alo hú hí hé hớ!!!'
    },
    {
        id: 8,
        order: 8,
        value: 'Hầy hầy e đói'
    },
    {
        id: 9,
        order: 9,
        value: 'Em đau bụng quá'
    },
    {
        id: 10,
        order: 10,
        value: 'Đức xị cho biết mặt'
    }
]

const highlightMatchingSentences = (text, matches, currentMatchIndex) => {
    matches.forEach((match, index) => {
        const regex = new RegExp(`(${match})`, 'g')
        const highlightClass = index === currentMatchIndex ? 'highlight-theme' : 'highlight-sentence'
        text = text.replace(regex, `<span class="${highlightClass}">$1</span>`)
    })
    return text
}

const highlightMatchingSentences2 = (text, matches, currentMatchIndex) => {
    matches.forEach((match, index) => {
        const regex = new RegExp(`(${match})`, 'g')
        const highlightClass = index === currentMatchIndex ? 'highlight-only-theme' : ''
        text = text.replace(regex, `<span class="${highlightClass}">$1</span>`)
    })
    return text
}

const DetailComparation = () => {
    const params = useParams()
    const location = useLocation()
    const [dataHTML, setDataHTML] = useState()
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)
    const dataValues = data.map(item => item.value)
    const data2Values = data2.map(item => item.value)
    const matchingValues = dataValues.filter(value => data2Values.includes(value))

    const joinedData = dataValues.join('. ')
    const joinedData2 = data2Values.join('. ')

    const highlightedData = highlightMatchingSentences(joinedData, matchingValues, -1)
    // const highlightedData2 = highlightMatchingSentences(joinedData2, matchingValues)
    const highlightedDataWithCurrent = currentMatchIndex >= 0 ? highlightMatchingSentences(highlightedData, matchingValues, currentMatchIndex) : highlightedData
    const highlightedDataWithCurrent2 = currentMatchIndex >= 0 ? highlightMatchingSentences2(joinedData2, matchingValues, currentMatchIndex) : joinedData2

    const goToPreviousMatch = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex === -1 ? matchingValues.length - 1 : prevIndex === 0 ? matchingValues.length - 1 : prevIndex - 1))
    }

    const goToNextMatch = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex === -1 || prevIndex === matchingValues.length - 1 ? 0 : prevIndex + 1))
    }

    const handleSelectChange = (selectedOption) => {
        setCurrentMatchIndex(selectedOption !== undefined ? selectedOption : -1)
    }

    const options = matchingValues.map((match, index) => ({ value: index, label: `Câu ${index + 1}` }))

    const getDataHTML = () => {
        getCheckingResultHTML({
            params: {
                id: Number(params?.id),
                type: location?.state?.document?.documentType?.id
            }
        }).then(result => {
            setDataHTML(result.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getDataHTML()
    }, [])

    const docUrl = dataHTML
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(docUrl)}&embedded=true`

    return (
        <Fragment>
            <Card title="So sánh tài liệu"
                extra={
                    <Link to="/tams/checking-result/:id">
                        <Button
                            // onClick={(e) => setIsAdd(true)}
                            color='primary'
                            className=""
                            outline
                        >
                            Quay lại
                        </Button>
                    </Link>
                }
            >
                <Row gutter={16}>
                    <Col span={12} className='p-1'>
                        <Card type="inner"
                        // title="Inner Card title" 
                        >
                            Inner Card content
                        </Card>
                    </Col>
                    <Col span={12} className='p-1'>
                        <Card
                            type="inner"
                        // title="Inner Card title"
                        >
                            Inner Card content
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12} className='p-1'>
                        <Card type="inner" title="Văn bản kiểm tra">
                            <div dangerouslySetInnerHTML={{ __html: highlightedDataWithCurrent }} />
                        </Card>
                    </Col>
                    <Col span={12} className='p-1'>
                        <Card
                            type="inner"
                            title="Văn bản chứa nội dung trùng"
                        >
                            <div dangerouslySetInnerHTML={{ __html: highlightedDataWithCurrent2 }} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6} className='p-1'>
                        <Select
                            allowClear
                            style={{ width: '100%' }}
                            options={options}
                            onChange={handleSelectChange}
                            placeholder="Chọn câu trùng"
                        />
                    </Col>
                    <Col span={6} className='p-1'>
                        <Button onClick={goToPreviousMatch}>Câu trước</Button>
                        <Button onClick={goToNextMatch}>Câu sau</Button>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24} className='p-1'>
                        <iframe
                            src={viewerUrl}
                            width="100%"
                            height="600px"
                            style={{ border: 'none' }}
                            title="Document"
                        ></iframe>
                    </Col>
                </Row>
            </Card>
        </Fragment>
    )
}
export default DetailComparation
