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
    const [charts, setCharts] = useState(['bar', 'pie']);

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

    // 获取保存的布局
    const fetchLayout = async () => {
        try {
            const response = await axios.get('/api/chart/layout');
            setCharts(response.data);
        } catch (error) {
            console.error('获取布局失败:', error);
        }
    };

    // 保存布局到服务器
    const saveLayout = async (newLayout) => {
        try {
            await axios.post('/api/chart/layout', {
                positions: newLayout
            });
        } catch (error) {
            console.error('保存布局失败:', error);
        }
    };

    useEffect(() => {
        fetchRanking();
        fetchLayout();
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

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        e.currentTarget.classList.add('dragging');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = e.dataTransfer.getData('text/plain');
        const newCharts = [...charts];
        const temp = newCharts[dragIndex];
        newCharts[dragIndex] = newCharts[dropIndex];
        newCharts[dropIndex] = temp;
        setCharts(newCharts);
        
        // 保存新的布局
        await saveLayout(newCharts);
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('dragging');
    };

    return (
        <div className="sales-ranking-container">
            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="charts-container">
                    {charts.map((chartType, index) => (
                        <div
                            key={chartType}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className="sales-chart"
                        >
                            <ReactECharts 
                                option={chartType === 'bar' ? getBarOption() : getPieOption()} 
                                style={{ height: '400px' }}
                                className={`${chartType}-chart`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
