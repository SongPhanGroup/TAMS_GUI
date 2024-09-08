import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap'

// Đăng ký các thành phần cho biểu đồ
ChartJS.register(ArcElement, Tooltip, Legend)

const DocumentByCategories = () => {
    const data = {
        labels: ['Luận văn', 'Luận án'],
        datasets: [
            {
                label: '# tài liệu',
                data: [100, 90],  // Dữ liệu của các phần trong biểu đồ
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
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
        },
    }

    return (
        <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Tổng số tài liệu mẫu theo loại tài liệu
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody style={{ width: '400px', height: '400px', margin: 'auto' }}>
                <Pie data={data} options={options} />
            </CardBody>
        </Card>
    )
}

export default DocumentByCategories