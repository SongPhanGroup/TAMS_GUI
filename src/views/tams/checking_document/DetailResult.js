import React, { useEffect, useState } from 'react'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme, Row, Col, Card, Badge, Tag, Progress } from 'antd'
import { useLocation } from 'react-router-dom'
import { getCheckingResultHTML, getListTheSameSentence } from '../../../api/checking_result'
import { getListDocFromSetenceId } from '../../../api/checking_sentence'
import HTMLContent from './modal/HTMLContent'
const { Header, Content, Footer, Sider } = Layout

const DetailResult = () => {
    const location = useLocation()

    const [htmlResult, setHTMLResult] = useState()
    const [listDocument, setListDocument] = useState([])
    const [sentence, setSentence] = useState('')
    const [listSentence, setListSentence] = useState([])

    const getData = () => {
        getCheckingResultHTML({
            params: {
                id: location?.state?.id,
                type: 1
            }
        }).then(result => {
            setHTMLResult(result)
        })

        getListDocFromSetenceId(380).then(result => {
            setListDocument(result?.data?.documents)
            setSentence(result.data[0]?.sentences?.content)
        })

        getListTheSameSentence({
            params: {
                id: location?.state?.id,
                type: 1
            }
        }).then(result => {
            const sentences = result?.data?.map(item => item?.checkingDocumentSentence?.order)
            setListSentence(sentences)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Row gutter={16}>
            <Col md={12}>
                <Row gutter={16} style={{ padding: '16px', backgroundColor: '#00A5E9' }}>
                    <Col md={8} style={{ color: '#fff' }}>
                        Tổng số câu
                    </Col>
                    <Col md={8} style={{ color: '#fff' }}>
                        Tổng số từ
                    </Col>
                    <Col md={8} style={{ color: '#fff' }}>
                        Tổng số ký tự
                    </Col>
                </Row>
                <Row gutter={16} style={{ padding: '16px', width: '100%', overflow: 'auto' }}>
                    <h4>
                        {location?.state?.fileName}
                    </h4>
                    <HTMLContent htmlResult={htmlResult} sentences={listSentence}/>
                </Row>
            </Col>
            <Col md={12}>
                <Row className='p-1 gap-1' style={{ justifyContent: 'center' }}>
                    <Progress type="circle" strokeColor='yellow' strokeWidth={15} percent={75} format={(percent) => <div style={{ display: 'flex', justifyContent: 'center' }} ><span style={{ fontSize: '20px', whiteSpace: 'break-spaces', fontWeight: '600', flex: '0 0 60%' }}>{`${percent}% trùng lặp`}</span></div>} size={150} />
                    <Progress type="circle" strokeColor='green' strokeWidth={15} percent={70} format={(percent) => <div style={{ display: 'flex', justifyContent: 'center' }} ><span style={{ fontSize: '20px', whiteSpace: 'break-spaces', fontWeight: '600', flex: '0 0 40%' }}>{`${percent}% mới`}</span></div>} size={150} />
                </Row>
                <Row className='gap-1 p-1' style={{ border: '1px solid #ccc', borderRadius: '4px' }} >
                    {
                        listDocument?.map(item => {
                            return (
                                <Card className='card-doc' style={{ width: '100%' }}>
                                    <Row className='p-1 flex-column'>
                                        <h4>{item?.fileName}</h4>
                                        <div>
                                            <Tag color='#9999FF'>Tác giả: {item?.author}</Tag>
                                            <Tag color='#9999FF'>Loại: {item?.typeId}</Tag>
                                            <Tag color='#9999FF'>Chuyên ngành: {item?.majorId}</Tag>
                                            <Tag color='#9999FF'>Năm xuất bản: {item?.publish_date}</Tag>
                                        </div>
                                    </Row>
                                    <Row className='p-1' style={{ backgroundColor: '#FBF6EC', marginBottom: '8px' }}>
                                        <p>{sentence}</p>
                                    </Row>
                                </Card>
                            )
                        })
                    }
                </Row>
            </Col>
        </Row>
    )
}
export default DetailResult