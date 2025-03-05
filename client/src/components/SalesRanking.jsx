import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import io from 'socket.io-client';
import '../styles/SalesRanking.css';

// Register the required components
echarts.use([
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer
]);

export default function SalesRanking() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBarOption = () => ({
        title: {
            text: '实时销量排行',
            textStyle: {
                color: '#333',
                fontSize: '18px',
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ranking.map(book => book.title),
            axisLabel: {
                interval: 0,
                rotate: 0,
                width: 100,
                overflow: 'truncate'
            }
        },
        series: [
            {
                name: '销量',
                type: 'bar',
                data: ranking.map(book => ({
                    value: book.saleCount,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#6ac1c5' },
                            { offset: 1, color: '#2980b9' }
                        ])
                    }
                })),
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}'
                },
                animationDuration: 1000,
                animationEasing: 'elasticOut'
            }
        ]
    });

    const getPieOption = () => ({
        title: {
            text: '销量占比分布',
            textStyle: {
                color: '#333',
                fontSize: '18px',
                fontWeight: 'normal'
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: 'bottom'
        },
        series: [
            {
                name: '销量占比',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: ranking.map(book => ({
                    value: book.saleCount,
                    name: book.title
                }))
            }
        ]
    });

    const fetchRanking = () => {
        axios.get('/api/books/rank')
            .then(res => {
                setRanking(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchRanking();
        // FIX ME:建立 WebSocket 连接, move server address into configuration
        const socket = io('http://127.0.0.1:3100', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000
        });

        // 监听更新事件
        socket.on('orderPlaced', (update) => {
            console.log('Received update:', update);
            fetchRanking(); // 重新获取最新数据
        });

        return () => {
            socket.disconnect(); // 清理连接
        };
    }, []);

    return (
        <div className="sales-ranking-container">
            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="charts-container">
                    <ReactECharts 
                        option={getBarOption()} 
                        style={{ height: '400px' }}
                        className="sales-chart bar-chart"
                    />
                    <ReactECharts 
                        option={getPieOption()} 
                        style={{ height: '400px' }}
                        className="sales-chart pie-chart"
                    />
                </div>
            )}
        </div>
    );
}
