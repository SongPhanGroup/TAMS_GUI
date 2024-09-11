import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Row, Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Đăng ký các thành phần cho biểu đồ
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const DocumentByAspects = () => {
    const data = {
        labels: ['Triết học Mác Lênin', 'Xây dựng Đảng và chính quyên Nhà nước', "Chủ nghĩa xã hội khoa học", "Tâm lý học"],
        datasets: [
            {
                label: '# tài liệu',
                data: [100, 90, 60, 80],  // Dữ liệu của các phần trong biểu đồ
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgba(255, 255, 0, 1)',
                    'rgba(0, 128, 0, 1)'
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)'
                ],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom', // Vị trí của chú thích
            },
            tooltip: {
                enabled: true, // Hiển thị tooltip khi hover
            },
            datalabels: {
                color: 'white', // Màu của số liệu
                formatter: (value, ctx) => {
                    let sum = 0
                    const dataArr = ctx.chart.data.datasets[0].data
                    dataArr.forEach(data => {
                        sum += data
                    })
                    const percentage = `${(value * 100 / sum).toFixed(2)}%`
                    return percentage // Hiển thị phần trăm
                },
                font: {
                    weight: 'bold',
                    size: 14,
                },
            },
        },
    }

    return (
        <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Tổng số tài liệu mẫu: 190. Theo lĩnh vực:
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody style={{ width: '400px', height: '400px', margin: 'auto' }}>
                <Pie data={data} options={options} />
            </CardBody>
        </Card>
    )
}

export default DocumentByAspects
