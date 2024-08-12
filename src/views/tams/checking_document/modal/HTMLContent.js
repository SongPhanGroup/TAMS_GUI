import React, { useEffect } from 'react'
import mqtt from 'mqtt'
import { Content } from 'antd/es/layout/layout'

const HTMLContent = ({ htmlResult }) => {
    useEffect(() => {
        // Connect to MQTT broker
        const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt')

        client.on('connect', () => {
            console.log('Connected to MQTT broker')
        })

        // Handle click events on sentences
        const handleClick = (event) => {
            if (event.target && event.target.id) {
                const sentenceId = event.target.id
                // Publish the sentence ID to an MQTT topic
                client.publish('clickedSentence', sentenceId)
                console.log(`Published ID: ${sentenceId}`)
            }
        }

        // Attach click event listener to the document
        document.addEventListener('click', handleClick)

        // Cleanup on component unmount
        return () => {
            document.removeEventListener('click', handleClick)
            client.end()
        }
    }, [])

    return (
        <Content
            dangerouslySetInnerHTML={{ __html: htmlResult }}
        ></Content>
    )
}

export default HTMLContent