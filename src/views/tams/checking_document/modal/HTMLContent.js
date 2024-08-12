import React, { useEffect, useState } from 'react'
import mqtt from 'mqtt'
import { Content } from 'antd/es/layout/layout'

const HTMLContent = ({ htmlResult, sentences }) => {
    const [clickedId, setClickedId] = useState('') // State to store the clicked ID

    useEffect(() => {
        // Initialize the MQTT client
        const clientID = `clientID - ${parseInt(Math.random() * 1000)}`
        const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', { clientId: clientID })

        client.on('connect', () => {
            console.log('Connected to MQTT broker')
            client.subscribe('tams') // Subscribe to the 'tams' topic
        })

        client.on('message', (topic, message) => {
            console.log(`OnMessageArrived: ${message.toString()}`)
        })

        client.on('disconnect', () => {
            console.log('Disconnected from MQTT broker')
        })

        const handleClick = (event) => {
            if (event.target && event.target.id) {
                const sentenceId = event.target.id
                setClickedId(sentenceId) // Update the state with the clicked ID
                client.publish('clickedSentence', sentenceId) // Publish the ID to 'clickedSentence' topic
                console.log(`Published ID: ${sentenceId}`)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
            client.end() // Disconnect the MQTT client on component unmount
        }
    }, [])

    const processContent = (htmlContent, highlightIndexes) => {
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
                            span.style.backgroundColor = 'yellow'
                        }

                        span.setAttribute('data-sentence-id', sentenceCounter)
                        span.textContent = sentence
                        return span
                    })

                    fragments.forEach(fragment => {
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
            <Content
                dangerouslySetInnerHTML={{ __html: processContent(htmlResult, sentences) }}
            ></Content>
            {clickedId && (
                <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    Last clicked ID: {clickedId}
                </div>
            )}
        </>

    )
}

export default HTMLContent
