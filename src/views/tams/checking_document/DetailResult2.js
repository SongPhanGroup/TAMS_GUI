import React, { useEffect, useState } from 'react'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    RightOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons'
import mqtt from 'mqtt'
import { Breadcrumb, Layout, Menu, theme, Row, Col, Card, Badge, Tag, Progress, Spin } from 'antd'
import { useLocation, useParams } from 'react-router-dom'
import { getCheckingResultHTML, getCheckingResultHTML2, getListTheSameSentence, getSimilarDocument } from '../../../api/checking_result'
import { getListDocFromSetenceId } from '../../../api/checking_sentence'
import { X } from 'react-feather'
// import HTMLContent from './modal/HTMLContent'
const { Header, Content, Footer, Sider } = Layout

const DetailResult2 = () => {
    const location = useLocation()
    const params = useParams()
    const [loadingData, setLoadingData] = useState(false)
    const [dataDoc, setDataDoc] = useState([])
    const [count, setCount] = useState(0)
    const [htmlResult, setHTMLResult] = useState()
    const [listDocument, setListDocument] = useState([])
    const [sentence, setSentence] = useState('')
    const [listSentence, setListSentence] = useState([])
    const [highlightIndexs, setHighlightIndex] = useState([])
    const [docFromId, setDocFromId] = useState()
    const [loadingHTML, setLoadingHTML] = useState(false)
    const [loadingDataDoc, setLoadingDataDoc] = useState(false)

    const getData = () => {
        setLoadingHTML(true)
        getCheckingResultHTML2({
            params: {
                id: location?.state?.id,
                type: 1
            }
        }).then(result => {
            setHTMLResult(result)
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingHTML(false)
        })
    }

    const getDetailData = () => {
        if (docFromId) {
            getListDocFromSetenceId(docFromId).then(result => {
                setListDocument(result?.data?.documents)
                setSentence(result.data[0]?.sentences?.content)
            })
        }
    }

    const getDocHasTheSameSentence = () => {
        setLoadingDataDoc(true)
        getSimilarDocument(Number(params?.id)).then(res => {
            setDataDoc(res?.data)
            setCount(res?.total)
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingDataDoc(false)
        })
    }

    console.log(dataDoc)

    // const getSentence = () => {
    //     getListTheSameSentence({
    //         params: {
    //             id: location?.state?.id,
    //             type: 1,
    //             // idCheckDoc: 1
    //         }
    //     }).then(result => {
    //         const sentences = result?.data?.map(item => item?.checkingDocumentSentence?.order)
    //         const indexs = result?.data?.map(item => item?.checkingDocumentSentence?.id)
    //         setListSentence(sentences)
    //         setHighlightIndex(indexs)
    //     })
    // }

    useEffect(() => {
        getData()
        getDocHasTheSameSentence()
    }, [])

    useEffect(() => {
        getDetailData()
    }, [docFromId])

    // useEffect(() => {
    //     const clientID = `clientID-${parseInt(Math.random() * 1000)}`
    //     const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', { clientId: clientID })

    //     client.on('connect', () => {
    //         console.log('Connected to MQTT broker')
    //         client.subscribe('tams')
    //     })

    //     client.on('message', (topic, message) => {
    //         console.log(`OnMessageArrived: ${message.toString()}`)
    //     })

    //     client.on('disconnect', () => {
    //         console.log('Disconnected from MQTT broker')
    //     })

    //     const publishMessage = (topic, message) => {
    //         client.publish(topic, message)
    //         console.log(`Message sent to topic ${topic}: ${message}`)
    //     }

    //     const handleClick = (event) => {
    //         const target = event.target
    //         if (target && target.dataset.sentenceId && target.dataset.indexId && target.dataset.idSentence) {
    //             const sentenceId = target.dataset.sentenceId
    //             const indexId = target.dataset.indexId
    //             const idSentence = target.dataset.idSentence
    //             setDocFromId(idSentence)
    //             publishMessage('clickedSentence', sentenceId)
    //             console.log(`Published ID: ${sentenceId}, Index: ${indexId}, Sentence: ${idSentence}`)
    //         }
    //     }

    //     document.addEventListener('click', handleClick)

    //     return () => {
    //         document.removeEventListener('click', handleClick)
    //         client.end()
    //     }
    // }, [])

    const processContent = (htmlContent, highlightIndexes) => {
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '8B00FF']
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        let sentenceCounter = 0

        const walk = (node) => {
            node.childNodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const sentences = child.textContent.split(/(?<=[.!?])\s+/)

                    const fragments = sentences.map((sentence) => {
                        if (sentence.length < 30) return document.createTextNode(sentence)

                        sentenceCounter += 1
                        const span = document.createElement('span')

                        const isHighlighted = highlightIndexes.includes(sentenceCounter)

                        if (isHighlighted) {
                            const colorIndex = listSentence.indexOf(sentenceCounter) % 7
                            span.style.backgroundColor = colors[colorIndex]
                            span.style.cursor = 'pointer'
                            span.style.color = '#fff'
                            span.dataset.sentenceId = sentenceCounter
                            span.dataset.indexId = listSentence.indexOf(sentenceCounter)
                            span.dataset.idSentence = highlightIndexs[listSentence.indexOf(sentenceCounter)]
                        }

                        span.textContent = sentence
                        return span
                    })

                    fragments.forEach((fragment) => {
                        child.parentNode.insertBefore(fragment, child)
                    })

                    child.remove()
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    walk(child)
                }
            })
        }

        walk(doc.body)
        return doc.body.innerHTML
    }

    return (
        <>
            <Row></Row>
            <Row gutter={16}>
                {
                    loadingHTML === true ? <Spin style={{
                        padding: '16px'
                    }} /> : (
                        <Col md={18}>
                            <Row gutter={16} style={{ padding: '16px', width: '100%', overflow: 'auto' }}>
                                <h4>
                                    {location?.state?.fileName}
                                </h4>
                                {/* <HTMLContent htmlResult={htmlResult} orders={listSentence} indexs={highlightIndexs} /> */}
                                <Content dangerouslySetInnerHTML={{ __html: processContent(htmlResult, listSentence) }} />
                            </Row>
                        </Col>
                    )
                }
                {
                    dataDoc && loadingDataDoc === true ? <Spin style={{
                        padding: '16px'
                    }} /> : (
                        <Col md={6}>
                            <Row className='p-1' style={{ justifyContent: 'center', backgroundColor: 'red', color: '#fff', fontWeight: '600' }}>
                                <Col md={22} style={{textAlign: 'center'}}>Match Overview</Col>
                                <Col md={2}><X color='#fff' /></Col>
                            </Row>
                            <Row style={{ justifyContent: 'center', fontSize: '24px', color: 'red', fontWeight: '600' }}>
                                {location?.state?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal}%
                            </Row>
                            <Row className='p-1' style={{ border: '1px solid #ccc' }} >
                                {
                                    dataDoc?.map((doc, index) => {
                                        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '8B00FF']
                                        const colorIndex = index % 7
                                        return (
                                            <>
                                                <Col className='p-0' md={1} style={{
                                                    color: `${colors[colorIndex]}`
                                                }}>
                                                    <h4>{index + 1}</h4>
                                                </Col>
                                                <Col className='p-0' md={18}>
                                                    <h4 style={{
                                                        color: `${colors[colorIndex]}`
                                                    }}>{doc?.document?.fileName}</h4>
                                                    <p>{doc?.document?.author}</p>
                                                </Col>
                                                <Col className='p-0' md={4}>
                                                    <h4>{doc?.similarity}%</h4>
                                                </Col>
                                                <Col className='p-0' md={1} style={{justifySelf: 'right'}}>
                                                    <RightOutlined />
                                                </Col>
                                            </>
                                        )
                                    })
                                }
                            </Row>
                        </Col>
                    )
                }
            </Row>
        </>
    )
}
export default DetailResult2