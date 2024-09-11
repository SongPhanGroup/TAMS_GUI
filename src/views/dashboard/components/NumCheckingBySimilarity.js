// ** Third Party Components
import Chart from 'react-apexcharts'
import { ArrowDown } from 'react-feather'
import { DatePicker } from "antd"
import dayjs from "dayjs"
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const NumCheckingBySimilarity = () => {
    const direction = 'ltr'
    const warning = '#ff9f43'
    // ** Chart Options
    const options = {
        chart: {
            zoom: {
                enabled: false
            },
            parentHeightOffset: 0,
            toolbar: {
                show: false
            }
        },

        markers: {
            strokeWidth: 7,
            strokeOpacity: 1,
            strokeColors: ['#fff', "#fff", "#fff", "#fff"],
            colors: [warning, "#00FF00", "#0000FF", "#FF0000"]
        },
        dataLabels: {
            enabled: true, // Hiển thị số liệu
            formatter(val) {
                return val // Định dạng số liệu với ký hiệu phần trăm
            },
            offsetY: -5, // Vị trí của số liệu so với cột
            style: {
                fontSize: '12px',
                colors: ["#ccc"]
            }
        },
        stroke: {
            curve: 'straight'
        },
        colors: [warning, "#00FF00", "#0000FF", "#FF0000"],
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        tooltip: {
            custom(data) {
                return `<div class='px-1 py-50'>
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}</span>
            </div>`
            }
        },
        xaxis: {
            categories: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12'
            ]
        },
        yaxis: {
            opposite: direction === 'rtl'
        }
    }

    // ** Chart Series
    const series = [
        {
            name: '<15%',
            data: [28, 20, 22, 18, 27, 25, 7, 9, 20, 15, 16, 10]
        },
        {
            name: '15-30%',
            data: [5, 7, 15, 20, 28, 20, 7, 15, 22, 17, 10, 19]
        },
        {
            name: '30-50%',
            data: [8, 5, 22, 19, 32, 11, 6, 24, 14, 19, 11, 24]
        },
        {
            name: '>50%',
            data: [10, 9, 3, 10, 15, 14, 5, 17, 25, 17, 16, 22]
        }
    ]
    const currentYear = new Date().getFullYear()

    return (
        <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Số lượng tài liệu kiểm tra theo mức độ trùng lặp
                    </CardTitle>
                    {/* <CardSubtitle className='text-muted'>Commercial networks & enterprises</CardSubtitle> */}
                </div>
                {/* <div className='d-flex align-items-center flex-wrap mt-sm-0 mt-1'>
                    <h5 className='fw-bolder mb-0 me-1'>$ 100,000</h5>
                    <Badge color='light-secondary'>
                        <ArrowDown size={13} className='text-danger' />
                        <span className='align-middle ms-25'>20%</span>
                    </Badge>
                </div> */}
            </CardHeader>
            <CardBody>
                <div className="d-flex col col-4" style={{ justifyContent: "flex-start", marginRight: "1rem", alignItems: "center" }}>
                    <span style={{ marginRight: "1rem" }}>Thời gian</span>
                    <DatePicker.RangePicker
                        style={{
                            width: "70%",
                        }}
                        defaultValue={[dayjs(`${currentYear}-01-01`), dayjs(`${currentYear}-12-31`)]}
                        format={"DD/MM/YYYY"}
                        allowClear={false}
                    // onChange={handleChangeYear}
                    />
                </div>
                <Chart options={options} series={series} type='line' height={400} />
            </CardBody>
        </Card>
    )
}

export default NumCheckingBySimilarity
